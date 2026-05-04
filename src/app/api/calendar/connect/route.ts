import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import {
  buildAuthorizationUrl,
  generatePkcePair,
  generateState,
  getOAuthEnv,
} from "@/lib/google-oauth";

const STATE_COOKIE = "sen_calendar_oauth_state";
const VERIFIER_COOKIE = "sen_calendar_oauth_verifier";

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(
      new URL("/chapters/san-diego/admin/login", req.url)
    );
  }

  const env = getOAuthEnv(req.nextUrl.origin);
  const state = generateState();
  const { verifier, challenge } = generatePkcePair();
  const url = buildAuthorizationUrl({
    env,
    state,
    codeChallenge: challenge,
    loginHint: user.email,
  });

  const res = NextResponse.redirect(url);
  // Short-lived signed-ish cookies. They round-trip back via /callback so we
  // can verify the state and exchange the code with the right verifier.
  const cookieOpts = {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/api/calendar",
    maxAge: 600, // 10 minutes
  };
  res.cookies.set(STATE_COOKIE, state, cookieOpts);
  res.cookies.set(VERIFIER_COOKIE, verifier, cookieOpts);
  return res;
}
