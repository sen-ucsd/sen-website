-- Workshop signups submitted from /workshops/<slug>
-- A pre-existing copy of this table (from the Founders Network site) was
-- replaced here. No real signups had been collected against it.
drop table if exists public.workshop_signups cascade;

create table public.workshop_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workshop_slug text not null,
  name text not null,
  email text not null,
  phone text not null,
  notes text
);

create index workshop_signups_created_at_idx
  on public.workshop_signups (created_at desc);

create index workshop_signups_workshop_slug_idx
  on public.workshop_signups (workshop_slug);

-- RLS: anonymous users may insert their signup; nobody may read.
-- Reads happen server-side with the service role key for admin tooling.
alter table public.workshop_signups enable row level security;

drop policy if exists "anon insert workshop_signups" on public.workshop_signups;

create policy "anon insert workshop_signups"
  on public.workshop_signups
  for insert
  to anon, authenticated
  with check (true);
