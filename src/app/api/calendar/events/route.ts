import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10");

  const { data, error } = await supabase
    .from("chapter_events")
    .select(
      "id, title, description, start_at, end_at, organizer_user_id, organizer_google_email, attendee_emails, google_event_link, meet_link"
    )
    .gte("end_at", new Date().toISOString())
    .order("start_at", { ascending: true })
    .limit(Math.min(Math.max(limit, 1), 50));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ events: data ?? [] });
}

export async function DELETE(req: NextRequest) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  // RLS already restricts delete to the organizer; this surfaces the right
  // error if someone else tries.
  const { error } = await supabase
    .from("chapter_events")
    .delete()
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
