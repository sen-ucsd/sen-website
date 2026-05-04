-- Scheduled chapter events. We create the source of truth on Google Calendar
-- (so attendees get real invitations and reminders) but mirror it here so the
-- admin board, and eventually the public chapter page, can render an
-- "Upcoming" list without each visitor needing a Google session.
create table if not exists public.chapter_events (
  id uuid primary key default gen_random_uuid(),
  chapter_id text not null default 'san-diego',
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  organizer_user_id uuid references auth.users(id) on delete set null,
  organizer_google_email text,
  attendee_emails text[] not null default '{}',
  google_event_id text,
  google_event_link text,
  meet_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chapter_events_start_idx
  on public.chapter_events(chapter_id, start_at);

alter table public.chapter_events enable row level security;

-- Read: any authenticated chapter member. (Public read can be added later
-- with a separate `for select to anon` policy if we want the public chapter
-- page to surface upcoming events.)
drop policy if exists chapter_events_read on public.chapter_events;
create policy chapter_events_read on public.chapter_events
  for select to authenticated
  using (true);

-- Insert: any authenticated user, attributed to themselves.
drop policy if exists chapter_events_insert on public.chapter_events;
create policy chapter_events_insert on public.chapter_events
  for insert to authenticated
  with check (auth.uid() = organizer_user_id);

-- Update / delete: only the organizer.
drop policy if exists chapter_events_modify on public.chapter_events;
create policy chapter_events_modify on public.chapter_events
  for update to authenticated
  using (auth.uid() = organizer_user_id)
  with check (auth.uid() = organizer_user_id);

drop policy if exists chapter_events_delete on public.chapter_events;
create policy chapter_events_delete on public.chapter_events
  for delete to authenticated
  using (auth.uid() = organizer_user_id);

create or replace function public.chapter_events_touch_updated()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists chapter_events_touch on public.chapter_events;
create trigger chapter_events_touch
  before update on public.chapter_events
  for each row execute function public.chapter_events_touch_updated();
