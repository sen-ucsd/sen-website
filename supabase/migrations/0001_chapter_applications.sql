-- Chapter applications submitted from /apply
create table if not exists public.chapter_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  university text not null,
  country text,
  year_in_school text,
  portfolio_url text,
  why_you text not null,
  what_built text not null,
  notes text,
  status text not null default 'submitted',
  reviewed_at timestamptz,
  reviewer_notes text
);

create index if not exists chapter_applications_created_at_idx
  on public.chapter_applications (created_at desc);

create index if not exists chapter_applications_status_idx
  on public.chapter_applications (status);

-- RLS: anonymous users may insert their own application; nobody may read.
-- Reads happen server-side with the service role key for admin tooling.
alter table public.chapter_applications enable row level security;

-- Reset existing policies (idempotent).
drop policy if exists "anon insert chapter_applications" on public.chapter_applications;
drop policy if exists "noone selects chapter_applications" on public.chapter_applications;

create policy "anon insert chapter_applications"
  on public.chapter_applications
  for insert
  to anon, authenticated
  with check (true);

-- Newsletter list (footer subscribe form). Same pattern.
create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  source text default 'footer'
);

alter table public.newsletter_signups enable row level security;

drop policy if exists "anon insert newsletter_signups" on public.newsletter_signups;

create policy "anon insert newsletter_signups"
  on public.newsletter_signups
  for insert
  to anon, authenticated
  with check (true);
