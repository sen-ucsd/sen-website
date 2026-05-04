import crypto from "node:crypto";

// Google OAuth 2.0 helpers, scoped to the Calendar integration.
//
// We use the Authorization Code flow with PKCE — overkill for a confidential
// client (we have a server secret), but it gives us defense in depth against
// authorization-code interception and is what Google recommends in 2024+.

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const REVOKE_URL = "https://oauth2.googleapis.com/revoke";
const FREEBUSY_URL = "https://www.googleapis.com/calendar/v3/freeBusy";
const USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export const SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  // Two calendar scopes because Google splits the surfaces we need:
  //   calendar.readonly  → required for freeBusy.query (and reading events)
  //   calendar.events    → required for events.insert (creating with attendees)
  // The narrower calendar.events.freebusy exists but is newer and not all
  // accounts have it enabled, so we use the well-supported pair.
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];

export interface OAuthEnv {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function getOAuthEnv(origin: string): OAuthEnv {
  const clientId = (process.env.GOOGLE_CLIENT_ID ?? "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET ?? "").trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set. Add them in .env.local (and Vercel env)."
    );
  }
  // Redirect URI must match one of the URIs configured in Google Cloud Console.
  // We derive from the request origin so localhost and prod both work.
  const redirectUri = `${origin}/api/calendar/callback`;
  return { clientId, clientSecret, redirectUri };
}

export function generatePkcePair(): { verifier: string; challenge: string } {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(
    crypto.createHash("sha256").update(verifier).digest()
  );
  return { verifier, challenge };
}

export function generateState(): string {
  return base64url(crypto.randomBytes(16));
}

function base64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function buildAuthorizationUrl(opts: {
  env: OAuthEnv;
  state: string;
  codeChallenge: string;
  loginHint?: string;
}): string {
  const params = new URLSearchParams({
    client_id: opts.env.clientId,
    redirect_uri: opts.env.redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state: opts.state,
    code_challenge: opts.codeChallenge,
    code_challenge_method: "S256",
  });
  if (opts.loginHint) params.set("login_hint", opts.loginHint);
  return `${AUTH_URL}?${params.toString()}`;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token?: string;
}

export async function exchangeCodeForTokens(opts: {
  env: OAuthEnv;
  code: string;
  codeVerifier: string;
}): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: opts.env.clientId,
    client_secret: opts.env.clientSecret,
    code: opts.code,
    code_verifier: opts.codeVerifier,
    grant_type: "authorization_code",
    redirect_uri: opts.env.redirectUri,
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token exchange failed: ${res.status} ${text}`);
  }
  return (await res.json()) as TokenResponse;
}

export async function refreshAccessToken(opts: {
  env: OAuthEnv;
  refreshToken: string;
}): Promise<Omit<TokenResponse, "refresh_token">> {
  const body = new URLSearchParams({
    client_id: opts.env.clientId,
    client_secret: opts.env.clientSecret,
    refresh_token: opts.refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token refresh failed: ${res.status} ${text}`);
  }
  return (await res.json()) as Omit<TokenResponse, "refresh_token">;
}

export async function revokeToken(token: string): Promise<void> {
  // Best-effort. Google revokes the entire grant when given a refresh token.
  await fetch(`${REVOKE_URL}?token=${encodeURIComponent(token)}`, {
    method: "POST",
  }).catch(() => {});
}

export interface UserInfo {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export async function fetchUserInfo(accessToken: string): Promise<UserInfo> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Google userinfo failed: ${res.status}`);
  }
  return (await res.json()) as UserInfo;
}

export interface FreeBusySlot {
  start: string;
  end: string;
}

export interface FreeBusyResponse {
  calendars: Record<string, { busy: FreeBusySlot[]; errors?: unknown[] }>;
}

const EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export interface CreatedEvent {
  id: string;
  htmlLink: string;
  hangoutLink?: string;
  summary?: string;
  description?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: { email: string; displayName?: string; responseStatus?: string }[];
}

export async function createCalendarEvent(opts: {
  accessToken: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: string[];
  /** When true, ask Google to mint a Meet link. */
  withMeet?: boolean;
  /** Optional opaque tag we can grep for later when listing chapter events. */
  extendedPrivate?: Record<string, string>;
}): Promise<CreatedEvent> {
  const params = new URLSearchParams({ sendUpdates: "all" });
  if (opts.withMeet) params.set("conferenceDataVersion", "1");

  const body: Record<string, unknown> = {
    summary: opts.summary,
    description: opts.description,
    start: opts.start,
    end: opts.end,
    attendees: opts.attendees.map((email) => ({ email })),
  };
  if (opts.extendedPrivate) {
    body.extendedProperties = { private: opts.extendedPrivate };
  }
  if (opts.withMeet) {
    body.conferenceData = {
      createRequest: {
        requestId: cryptoRandomId(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    };
  }

  const res = await fetch(`${EVENTS_URL}?${params.toString()}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google events.insert failed: ${res.status} ${text}`);
  }
  return (await res.json()) as CreatedEvent;
}

function cryptoRandomId() {
  return crypto.randomBytes(16).toString("hex");
}

export async function queryFreeBusy(opts: {
  accessToken: string;
  timeMin: string;
  timeMax: string;
  calendarIds?: string[];
}): Promise<FreeBusyResponse> {
  const ids = opts.calendarIds ?? ["primary"];
  const res = await fetch(FREEBUSY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: opts.timeMin,
      timeMax: opts.timeMax,
      items: ids.map((id) => ({ id })),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google freeBusy failed: ${res.status} ${text}`);
  }
  return (await res.json()) as FreeBusyResponse;
}
