import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase-server";
import { decryptToken, encryptToken } from "@/lib/encryption";
import {
  getOAuthEnv,
  queryFreeBusy,
  refreshAccessToken,
  type FreeBusySlot,
} from "@/lib/google-oauth";

interface RequestBody {
  /** Display names (matches profiles.display_name) of the people we want to schedule across. */
  participantDisplayNames: string[];
  /** ISO datetimes — the search window. */
  timeMin: string;
  timeMax: string;
  /** Required mutual-free duration, in minutes. */
  durationMinutes: number;
  /** Working hours in 24h, default 9-17 in the requester's timezone. */
  workingHours?: { startHour: number; endHour: number };
  /** IANA timezone of the requester, e.g. "America/Los_Angeles". */
  timeZone: string;
}

interface ParticipantResult {
  displayName: string;
  status: "ok" | "not_connected" | "error";
  googleEmail?: string;
  error?: string;
}

interface ResponseBody {
  participants: ParticipantResult[];
  /** Mutual free windows of at least durationMinutes inside working hours. */
  slots: FreeBusySlot[];
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  if (
    !Array.isArray(body.participantDisplayNames) ||
    body.participantDisplayNames.length === 0 ||
    !body.timeMin ||
    !body.timeMax ||
    !body.durationMinutes ||
    !body.timeZone
  ) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // To pull other users' calendar connections we need to bypass RLS — they
  // each own their own row. Use the service role here (server-only).
  const adminUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const adminKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (!adminKey) {
    return NextResponse.json(
      { error: "service_role_not_configured" },
      { status: 500 }
    );
  }
  const admin = createClient(adminUrl, adminKey, {
    auth: { persistSession: false },
  });

  // Resolve display_names → user_ids → connections.
  const { data: profiles } = await admin
    .from("profiles")
    .select("id,display_name")
    .in("display_name", body.participantDisplayNames);
  const idsByName = new Map(
    (profiles ?? []).map((p: { id: string; display_name: string }) => [
      p.display_name,
      p.id,
    ])
  );

  const oauthEnv = getOAuthEnv(req.nextUrl.origin);

  const participantResults: ParticipantResult[] = [];
  const allBusy: FreeBusySlot[] = [];

  for (const name of body.participantDisplayNames) {
    const uid = idsByName.get(name);
    if (!uid) {
      participantResults.push({ displayName: name, status: "not_connected" });
      continue;
    }
    const { data: connections } = await admin
      .from("calendar_connections")
      .select("*")
      .eq("user_id", uid);
    if (!connections || connections.length === 0) {
      participantResults.push({ displayName: name, status: "not_connected" });
      continue;
    }
    for (const conn of connections) {
      try {
        let access = conn.access_token as string | null;
        const expiresAt = conn.expires_at
          ? new Date(conn.expires_at).getTime()
          : 0;
        // Refresh ~30s before expiry to avoid races.
        if (!access || expiresAt - Date.now() < 30_000) {
          const refreshed = await refreshAccessToken({
            env: oauthEnv,
            refreshToken: decryptToken(conn.refresh_token_encrypted),
          });
          access = refreshed.access_token;
          await admin
            .from("calendar_connections")
            .update({
              access_token: refreshed.access_token,
              expires_at: new Date(
                Date.now() + refreshed.expires_in * 1000
              ).toISOString(),
            })
            .eq("id", conn.id);
          // Some token responses bring a fresh refresh_token too — store it.
          if (
            "refresh_token" in refreshed &&
            typeof (refreshed as { refresh_token?: string }).refresh_token ===
              "string"
          ) {
            await admin
              .from("calendar_connections")
              .update({
                refresh_token_encrypted: encryptToken(
                  (refreshed as { refresh_token: string }).refresh_token
                ),
              })
              .eq("id", conn.id);
          }
        }
        const fb = await queryFreeBusy({
          accessToken: access!,
          timeMin: body.timeMin,
          timeMax: body.timeMax,
        });
        const busy = fb.calendars.primary?.busy ?? [];
        allBusy.push(...busy);
        participantResults.push({
          displayName: name,
          status: "ok",
          googleEmail: conn.google_email,
        });
      } catch (e) {
        participantResults.push({
          displayName: name,
          status: "error",
          googleEmail: conn.google_email,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }
  }

  const slots = computeMutualFreeSlots({
    timeMin: body.timeMin,
    timeMax: body.timeMax,
    durationMinutes: body.durationMinutes,
    busy: allBusy,
    workingHours: body.workingHours ?? { startHour: 9, endHour: 17 },
    timeZone: body.timeZone,
  });

  const response: ResponseBody = { participants: participantResults, slots };
  return NextResponse.json(response);
}

/**
 * Subtract busy intervals from the working-hours windows inside [timeMin, timeMax],
 * then keep only sub-windows of at least durationMinutes.
 */
function computeMutualFreeSlots(opts: {
  timeMin: string;
  timeMax: string;
  durationMinutes: number;
  busy: FreeBusySlot[];
  workingHours: { startHour: number; endHour: number };
  timeZone: string;
}): FreeBusySlot[] {
  const min = new Date(opts.timeMin).getTime();
  const max = new Date(opts.timeMax).getTime();
  if (max <= min) return [];

  // 1. Build the working-hour windows for each day in the search range, in the
  // requester's timezone.
  const windows: Array<{ start: number; end: number }> = [];
  for (let cursor = startOfDayInTz(min, opts.timeZone); cursor < max; cursor = addDays(cursor, 1)) {
    const winStart = setHourInTz(cursor, opts.workingHours.startHour, opts.timeZone);
    const winEnd = setHourInTz(cursor, opts.workingHours.endHour, opts.timeZone);
    const clampedStart = Math.max(winStart, min);
    const clampedEnd = Math.min(winEnd, max);
    if (clampedEnd > clampedStart) {
      windows.push({ start: clampedStart, end: clampedEnd });
    }
  }

  // 2. Merge busy intervals.
  const busy = [...opts.busy]
    .map((b) => ({ start: new Date(b.start).getTime(), end: new Date(b.end).getTime() }))
    .filter((b) => b.end > b.start)
    .sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];
  for (const b of busy) {
    const last = merged[merged.length - 1];
    if (last && b.start <= last.end) {
      last.end = Math.max(last.end, b.end);
    } else {
      merged.push({ ...b });
    }
  }

  // 3. Subtract busy from each window, keep only sub-windows ≥ duration.
  const minMs = opts.durationMinutes * 60_000;
  const slots: FreeBusySlot[] = [];
  for (const w of windows) {
    let cursor = w.start;
    for (const b of merged) {
      if (b.end <= cursor) continue;
      if (b.start >= w.end) break;
      if (b.start > cursor) {
        const end = Math.min(b.start, w.end);
        if (end - cursor >= minMs) {
          slots.push({ start: new Date(cursor).toISOString(), end: new Date(end).toISOString() });
        }
      }
      cursor = Math.max(cursor, b.end);
      if (cursor >= w.end) break;
    }
    if (cursor < w.end && w.end - cursor >= minMs) {
      slots.push({ start: new Date(cursor).toISOString(), end: new Date(w.end).toISOString() });
    }
  }
  return slots;
}

// Date helpers that respect a target IANA timezone. We use Intl.DateTimeFormat
// to pull wall-clock parts, then construct a UTC Date that points at the same
// instant. This avoids pulling in a tz library for a simple "what hour is it
// in LA right now" computation.
function partsInTz(epochMs: number, tz: string) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(epochMs).map((p) => [p.type, p.value])
  ) as Record<string, string>;
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === "24" ? "0" : parts.hour),
  };
}

function startOfDayInTz(epochMs: number, tz: string): number {
  return setHourInTz(epochMs, 0, tz);
}

function setHourInTz(epochMs: number, hour: number, tz: string): number {
  const p = partsInTz(epochMs, tz);
  // Construct an ISO string that *would* be that wall-clock time in the target
  // tz, then walk it back through the actual offset for that date.
  const wall = Date.UTC(p.year, p.month - 1, p.day, hour, 0, 0);
  const offsetMs = wall - epochUtcForWallTime(p.year, p.month, p.day, hour, tz);
  return wall - offsetMs;
}

function epochUtcForWallTime(
  y: number,
  m: number,
  d: number,
  h: number,
  tz: string
): number {
  // Reverse-engineer the offset by formatting the candidate epoch and seeing
  // what wall time it lands at, then iterating once.
  let candidate = Date.UTC(y, m - 1, d, h, 0, 0);
  for (let i = 0; i < 2; i++) {
    const back = partsInTz(candidate, tz);
    const diffH =
      (y - back.year) * 8760 +
      (m - back.month) * 730 +
      (d - back.day) * 24 +
      (h - back.hour);
    if (diffH === 0) break;
    candidate += diffH * 3_600_000;
  }
  return candidate;
}

function addDays(epochMs: number, n: number): number {
  return epochMs + n * 86_400_000;
}
