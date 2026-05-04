-- Per-admin Google Calendar connections.
-- One row per (admin user, connected Google account). A board member can
-- connect more than one Google account if they want their personal + work
-- calendars both factored into "find a time" — uniqueness is on the pair.
--
-- The refresh token is encrypted at rest (AES-256-GCM) by the server before
-- insert, using CALENDAR_TOKEN_ENCRYPTION_KEY. The access token is short-lived
-- and refreshed often, so we store it plain alongside its expiry; if the row
-- leaks, the access token will be useless within an hour.
create table if not exists public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  google_email text not null,
  google_user_id text not null,
  refresh_token_encrypted text not null,
  access_token text,
  expires_at timestamptz,
  granted_scopes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, google_email)
);

create index if not exists calendar_connections_user_idx
  on public.calendar_connections(user_id);

alter table public.calendar_connections enable row level security;

-- A user can only see / mutate their own calendar connections. The freebusy
-- API route runs server-side and authenticates as the requesting user, so
-- this policy is also what gates which connections it can touch.
drop policy if exists calendar_connections_owner_select
  on public.calendar_connections;
create policy calendar_connections_owner_select
  on public.calendar_connections
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists calendar_connections_owner_modify
  on public.calendar_connections;
create policy calendar_connections_owner_modify
  on public.calendar_connections
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Touch updated_at on writes
create or replace function public.calendar_connections_touch_updated()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists calendar_connections_touch
  on public.calendar_connections;
create trigger calendar_connections_touch
  before update on public.calendar_connections
  for each row execute function public.calendar_connections_touch_updated();
