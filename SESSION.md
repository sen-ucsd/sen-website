# Session context — May 2026

Snapshot of what the secondary terminal landed in this session, plus things you (or future me) need to come back to. This is a working note, not durable docs — once the items here are addressed, prune freely.

---

## ⚠️ Rotate these credentials

The following secrets were shared in the transcript and need to be rotated before this thread is shared, archived, or used as training context:

| Credential | Where | What to do |
|---|---|---|
| Supabase Personal Access Token (`sbp_cc1bdf80…`) | Supabase Dashboard → Account → **Access Tokens** | Revoke and generate a new one. |
| Resend API key (`re_aBo4AyUr_…`) | resend.com → **API Keys** | Revoke and create a new one. Update `smtp_pass` in Supabase Auth SMTP settings with the new key. |
| Google OAuth Client Secret (`GOCSPX-Hwr-…`) | Cloud Console → APIs & Services → **Credentials** → your OAuth client → **Reset Secret** | Update `GOOGLE_CLIENT_SECRET` in Vercel env *and* `.env.local`. |
| Encryption key (`CALENDAR_TOKEN_ENCRYPTION_KEY`) | `.env.local` and Vercel | Only rotate if you want — note: rotating it makes existing `calendar_connections.refresh_token_encrypted` rows undecryptable, so all admins need to disconnect + reconnect their calendars. Skip unless you have reason. |

Also: `apershad@ucsd.edu` is currently the only real exec account. The session generated a couple of disposable test users (`aryan.pershad+otp-flow-…@gmail.com`, `aryan.pershad+smtp-verify-…@gmail.com`); they were all deleted via the Supabase admin API at session end.

---

## What landed

### Auth model — Supabase Auth (replaced cookie auth)

- Migration `0003_profiles.sql`: `public.profiles` mirror of `auth.users` with unique `display_name`, chapter scoping, and an on-insert trigger that auto-creates a profile from `signUp()` metadata. Tasks RLS tightened from anyone-with-anon-key to "must be authenticated".
- `@supabase/ssr` for SSR-aware browser/server clients (`src/lib/supabase-server.ts`, `src/lib/supabase-browser.ts`).
- New `/admin/login`, `/admin/signup`, `/admin/forgot` pages. Six-box OTP input (`src/components/admin/OtpInput.tsx`).
- Middleware refreshes the session via `@supabase/ssr` and bounces unauthed admin requests to `/login`.
- `actions.ts::getCurrentAdmin` returns `{ id, email, displayName }` from joined session+profile. `logoutAction` calls `supabase.auth.signOut()`.
- TaskBoard reads through `getSupabaseBrowser()` so the cookie-bound session reaches RLS.

### Email — Resend through Supabase custom SMTP

- Auth config patched via Management API: SMTP creds, OTP length 6, OTP expiry 1h, branded confirmation + recovery templates with logo + 9450 Gilman Drive footer for deliverability.
- `rate_limit_email_sent: 100/hour` (was 2). `smtp_max_frequency: 60s`.
- Sender: `noreply@senatucsd.org` (verified domain in Resend).

### Signups — currently locked

- `auth.config.disable_signup = true` (server-side).
- `/admin/signup` is a "By invite only" notice — no form rendered.
- "Create an account" link removed from `/admin/login`.
- **To onboard a new exec**: PATCH `disable_signup: false` via Management API → have them sign up at `/admin/signup` (will need to revert UI to show the form, easiest is to git revert the lockdown commit) → flip back to `true`. Or build a proper admin-only invite flow when this becomes friction.

### Strategy canvas (replaces the old Vision card)

- `src/components/admin/BusinessModelCanvas.tsx`: 3×3 Lean-Canvas grid with the SEN whiteboard transcribed in. Channels render as wrapping pills.
- The vision row in DB is still the WBS root; we just don't surface it as a card anymore. `VisionCard.tsx` is unused but kept in place.

### Branding / metadata

- Multi-size `favicon.ico`, `icon.png` (512), `apple-icon.png` (180) generated from `SEN_Logo_cropped.png`.
- `opengraph-image.tsx` + `twitter-image.tsx`. **Fonts are bundled** under `assets/fonts/` (Newsreader-Medium, Manrope-Medium, Manrope-Regular). Vercel build worker times out hitting Google Fonts — do NOT switch back to runtime font fetching.
- `metadataBase` resolves from `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → `localhost`.
- `BRAND.md` at repo root: developer-facing brand reference (fonts, tokens, voice rules, motion principles, file map).

### Hero map polish

- America-centered camera landing, continuous eastward pan via 3-tile horizontal repetition, antimeridian-aware Delaunay (Pacific connections work).
- `60s` per revolution, `0.2s` start delay after camera lands.

### Google Calendar integration

- Migration `0004_calendar_connections.sql`: per-(user, google_email) row with AES-256-GCM encrypted refresh token, plain access token + expiry, granted scopes. RLS scoped by `auth.uid()`.
- Migration `0005_chapter_events.sql`: mirror of created events for fast display + organizer-scoped writes.
- `src/lib/encryption.ts` (AES-256-GCM, base64 `iv||tag||ciphertext`).
- `src/lib/google-oauth.ts`: PKCE auth URL, code exchange, refresh, userinfo, revoke, freeBusy.query, events.insert.
- API routes: `/api/calendar/{connect,callback,disconnect,freebusy,schedule,events}`.
- Scopes requested: `openid`, `userinfo.email`, `userinfo.profile`, `calendar.readonly` (free-busy), `calendar.events` (write). Both calendar scopes are required — don't drop readonly.
- UI: `CalendarConnectButton` (header pill), `FindATime` (slot finder with **draggable duration picker** inside each free window — clicking a slot opens a modal where you drag a duration-sized gold block within the mutual-free range), `UpcomingEvents`, `SchedulingPanel` (client wrapper coordinating the two).
- 9450 Gilman Drive + UCSD tag added to email templates for deliverability.

---

## Outstanding / not done

1. **Tokens to rotate** — see top of this file. Highest priority.
2. **Vercel env vars** must include all of `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CALENDAR_TOKEN_ENCRYPTION_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, plus the existing Supabase ones. Confirm they're set in **Production** (and **Preview** if you want OAuth on PR previews — Preview also needs each preview URL added to Console redirect URIs, which Google doesn't wildcard).
3. **Apex vs www domain** — both `senatucsd.org` and `www.senatucsd.org` are configured. Vercel had an apex→www redirect somewhere that fought our www→apex Next redirect (caused a loop), so the redirect rule was reverted. Both host variants are registered in Google OAuth Console as a workaround. To clean this up: find Vercel's redirect (Settings → Domains, look at each domain's individual redirect config — may need Pro), set apex as primary, then re-add the Next redirect rule and drop the www entries from Console.
4. **Google OAuth verification** — currently in Testing mode (`calendar.readonly` + `calendar.events` are sensitive scopes). The "This app is unverified" warning shows on first connect. For production-grade UX you'd submit for verification (4-6 week process; needs privacy policy, ToS, demo video, domain verification). Skip for now — six exec users is well under the 100-test-user cap.
5. **Supabase Site URL** is set to `https://senatucsd.org`. Doesn't actually matter for the OTP flow (users enter codes, no link clicks), but if you ever switch to magic links it'd matter.
6. **VisionCard.tsx is dead code** — kept in case we want to revive the vision card later. Safe to delete.
7. **CSS lint** — pre-existing `react-hooks/set-state-in-effect` warnings in TaskNode and HeroMap (the `setStage` and `setArmed/setArmedDelete` calls inside effects). They're not from this session's work; haven't been fixed.

---

## Operational cheat sheet

### Re-open signups for one new exec

```bash
# Open
curl -X PATCH "https://api.supabase.com/v1/projects/myiolsrwmfktlwiucuvo/config/auth" \
  -H "Authorization: Bearer <PAT>" \
  -H "Content-Type: application/json" \
  -H "User-Agent: supabase-cli (sen-website)" \
  -d '{"disable_signup": false}'

# (also temporarily revert /admin/signup UI to render <SignupForm /> — git revert
# the "lock signups" commit, push, signup, revert the revert, push again)

# Lock
curl -X PATCH "https://api.supabase.com/v1/projects/myiolsrwmfktlwiucuvo/config/auth" \
  -H "Authorization: Bearer <PAT>" \
  -H "Content-Type: application/json" \
  -H "User-Agent: supabase-cli (sen-website)" \
  -d '{"disable_signup": true}'
```

(Better: build an admin-only invite flow next time this comes up.)

### Apply a new migration

Migrations live in `supabase/migrations/`. To apply:

```bash
SQL=$(python3 -c "import json; print(json.dumps({'query': open('supabase/migrations/000X_name.sql').read()}))")
curl -X POST "https://api.supabase.com/v1/projects/myiolsrwmfktlwiucuvo/database/query" \
  -H "Authorization: Bearer <PAT>" \
  -H "Content-Type: application/json" \
  -H "User-Agent: supabase-cli (sen-website)" \
  -d "$SQL"
```

### Regenerate the favicon set

```bash
magick public/SEN_Logo_cropped.png -resize 256x256 \
  -define icon:auto-resize=16,32,48,64,128,256 src/app/favicon.ico
magick public/SEN_Logo_cropped.png -resize 512x512 src/app/icon.png
magick public/SEN_Logo_cropped.png -resize 180x180 src/app/apple-icon.png
```

### Project IDs / refs

- Supabase project ref: `myiolsrwmfktlwiucuvo`
- GCP project: `lexical-theory-486000-v3` (number `503746859582`)
- Vercel domain: `senatucsd.org` (apex) + `www.senatucsd.org` (currently bounces apex→www at Vercel level)
- GitHub: `sen-ucsd/sen-website`
