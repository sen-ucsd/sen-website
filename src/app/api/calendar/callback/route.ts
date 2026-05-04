import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import {
  exchangeCodeForTokens,
  fetchUserInfo,
  getOAuthEnv,
} from "@/lib/google-oauth";
import { encryptToken } from "@/lib/encryption";

const STATE_COOKIE = "sen_calendar_oauth_state";
const VERIFIER_COOKIE = "sen_calendar_oauth_verifier";
const ADMIN_BASE = "/chapters/san-diego/admin";

function fail(req: NextRequest, reason: string) {
  const url = new URL(ADMIN_BASE, req.url);
  url.searchParams.set("calendar_error", reason);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL(`${ADMIN_BASE}/login`, req.url));
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  if (error) return fail(req, error);
  if (!code || !state) return fail(req, "missing_code_or_state");

  const cookieState = req.cookies.get(STATE_COOKIE)?.value;
  const verifier = req.cookies.get(VERIFIER_COOKIE)?.value;
  if (!cookieState || !verifier || cookieState !== state) {
    return fail(req, "state_mismatch");
  }

  let tokens;
  let userInfo;
  try {
    const env = getOAuthEnv(req.nextUrl.origin);
    tokens = await exchangeCodeForTokens({
      env,
      code,
      codeVerifier: verifier,
    });
    userInfo = await fetchUserInfo(tokens.access_token);
  } catch (e) {
    console.error("calendar callback exchange failed", e);
    return fail(req, "token_exchange_failed");
  }

  if (!tokens.refresh_token) {
    // Google only returns a refresh_token on the first consent OR when prompt=consent
    // re-prompts. Our /connect always sends prompt=consent so this should not
    // happen; if it does, surface it instead of silently storing a connection
    // we can't refresh.
    return fail(req, "no_refresh_token");
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  const encrypted = encryptToken(tokens.refresh_token);

  const { error: dbErr } = await supabase
    .from("calendar_connections")
    .upsert(
      {
        user_id: user.id,
        google_email: userInfo.email,
        google_user_id: userInfo.sub,
        refresh_token_encrypted: encrypted,
        access_token: tokens.access_token,
        expires_at: expiresAt,
        granted_scopes: tokens.scope.split(" "),
      },
      { onConflict: "user_id,google_email" }
    );

  const target = new URL(ADMIN_BASE, req.url);
  if (dbErr) {
    console.error("calendar callback upsert failed", dbErr);
    target.searchParams.set("calendar_error", "db_error");
  } else {
    target.searchParams.set("calendar_connected", userInfo.email);
  }
  const res = NextResponse.redirect(target);
  // Clean up OAuth cookies
  res.cookies.delete(STATE_COOKIE);
  res.cookies.delete(VERIFIER_COOKIE);
  return res;
}
