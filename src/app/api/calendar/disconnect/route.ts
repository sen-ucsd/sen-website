import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { decryptToken } from "@/lib/encryption";
import { revokeToken } from "@/lib/google-oauth";

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const connectionId: string | undefined = body.id;
  if (!connectionId) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  // RLS scopes select to the requesting user, so this only finds their row.
  const { data: row } = await supabase
    .from("calendar_connections")
    .select("refresh_token_encrypted")
    .eq("id", connectionId)
    .single();

  if (row?.refresh_token_encrypted) {
    try {
      await revokeToken(decryptToken(row.refresh_token_encrypted));
    } catch (e) {
      // Best-effort; continue with delete even if revoke fails.
      console.warn("revokeToken failed", e);
    }
  }

  const { error } = await supabase
    .from("calendar_connections")
    .delete()
    .eq("id", connectionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
