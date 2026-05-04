import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase-server";
import { decryptToken, encryptToken } from "@/lib/encryption";
import {
  createCalendarEvent,
  getOAuthEnv,
  refreshAccessToken,
} from "@/lib/google-oauth";

interface RequestBody {
  /** Display names of board members to invite (excluding the organizer; the
   *  organizer is added automatically by Google as the calendar owner). */
  attendeeDisplayNames: string[];
  title: string;
  description?: string;
  startIso: string;
  endIso: string;
  timeZone: string;
  withMeet?: boolean;
}

interface ResponseBody {
  ok: boolean;
  eventId: string;
  eventLink: string;
  meetLink?: string;
  rowId: string;
  invitedEmails: string[];
  notConnected: string[];
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  if (
    !body.title ||
    !body.startIso ||
    !body.endIso ||
    !body.timeZone ||
    !Array.isArray(body.attendeeDisplayNames)
  ) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // The organizer needs at least one connection to be the source of the event.
  const { data: organizerConn } = await supabase
    .from("calendar_connections")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!organizerConn) {
    return NextResponse.json(
      { error: "organizer_not_connected" },
      { status: 400 }
    );
  }

  // Resolve attendee display names → google_emails via service role (so we
  // can read other users' calendar_connections rows past their RLS).
  const adminUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  const admin = createClient(adminUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: profiles } = await admin
    .from("profiles")
    .select("id,display_name")
    .in("display_name", body.attendeeDisplayNames);
  const idsByName = new Map(
    (profiles ?? []).map((p: { id: string; display_name: string }) => [
      p.display_name,
      p.id,
    ])
  );

  const invitedEmails: string[] = [];
  const notConnected: string[] = [];
  for (const name of body.attendeeDisplayNames) {
    const uid = idsByName.get(name);
    if (!uid) {
      notConnected.push(name);
      continue;
    }
    const { data: rows } = await admin
      .from("calendar_connections")
      .select("google_email")
      .eq("user_id", uid)
      .order("created_at", { ascending: true })
      .limit(1);
    const email = rows?.[0]?.google_email as string | undefined;
    if (!email) {
      notConnected.push(name);
      continue;
    }
    if (!invitedEmails.includes(email)) invitedEmails.push(email);
  }

  // Refresh organizer's access token if needed.
  const oauthEnv = getOAuthEnv(req.nextUrl.origin);
  let accessToken = organizerConn.access_token as string | null;
  const expiresAt = organizerConn.expires_at
    ? new Date(organizerConn.expires_at).getTime()
    : 0;
  if (!accessToken || expiresAt - Date.now() < 30_000) {
    try {
      const refreshed = await refreshAccessToken({
        env: oauthEnv,
        refreshToken: decryptToken(organizerConn.refresh_token_encrypted),
      });
      accessToken = refreshed.access_token;
      const updates: Record<string, unknown> = {
        access_token: refreshed.access_token,
        expires_at: new Date(
          Date.now() + refreshed.expires_in * 1000
        ).toISOString(),
      };
      if (
        "refresh_token" in refreshed &&
        typeof (refreshed as { refresh_token?: string }).refresh_token === "string"
      ) {
        updates.refresh_token_encrypted = encryptToken(
          (refreshed as { refresh_token: string }).refresh_token
        );
      }
      await admin
        .from("calendar_connections")
        .update(updates)
        .eq("id", organizerConn.id);
    } catch (e) {
      return NextResponse.json(
        {
          error: "token_refresh_failed",
          detail: e instanceof Error ? e.message : String(e),
        },
        { status: 500 }
      );
    }
  }

  // Create the event on the organizer's calendar.
  let event;
  try {
    event = await createCalendarEvent({
      accessToken: accessToken!,
      summary: body.title,
      description: body.description,
      start: { dateTime: body.startIso, timeZone: body.timeZone },
      end: { dateTime: body.endIso, timeZone: body.timeZone },
      attendees: invitedEmails,
      withMeet: body.withMeet,
      extendedPrivate: { sen_event: "true", sen_chapter: "san-diego" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // calendar.events scope wasn't granted yet — usual cause if the user
    // connected before we widened the scope.
    const insufficientScope =
      msg.includes("insufficient") || msg.includes("403");
    return NextResponse.json(
      {
        error: insufficientScope ? "scope_missing" : "google_insert_failed",
        detail: msg,
      },
      { status: 500 }
    );
  }

  // Mirror into chapter_events. Use the user-scoped client so RLS attribution
  // matches auth.uid().
  const { data: row, error: insertErr } = await supabase
    .from("chapter_events")
    .insert({
      title: body.title,
      description: body.description ?? null,
      start_at: body.startIso,
      end_at: body.endIso,
      organizer_user_id: user.id,
      organizer_google_email: organizerConn.google_email,
      attendee_emails: invitedEmails,
      google_event_id: event.id,
      google_event_link: event.htmlLink,
      meet_link: event.hangoutLink ?? null,
    })
    .select("id")
    .single();
  if (insertErr) {
    return NextResponse.json(
      {
        error: "row_insert_failed",
        detail: insertErr.message,
        gcalEventId: event.id,
      },
      { status: 500 }
    );
  }

  const response: ResponseBody = {
    ok: true,
    eventId: event.id,
    eventLink: event.htmlLink,
    meetLink: event.hangoutLink,
    rowId: row.id,
    invitedEmails,
    notConnected,
  };
  return NextResponse.json(response);
}
