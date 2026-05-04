-- Profiles for Supabase-Auth-backed admin users.
-- Each row mirrors auth.users(id) with a chapter-scoped display_name and email
-- so the rest of the app (assignee pickers, tasks.assignee text matching) can
-- stay readable. Profile is created automatically by trigger on auth signup.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null unique,
  chapter_id text not null default 'san-diego',
  created_at timestamptz not null default now()
);

create index if not exists profiles_chapter_idx on public.profiles(chapter_id);

alter table public.profiles enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile when a new auth.user is inserted. Display name comes
-- from the user_metadata (set during signUp); falls back to the email local
-- part. Display names must be unique, so on collision we suffix the first 4
-- chars of the user's UUID and let them rename later.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_display_name text;
begin
  v_display_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
    split_part(new.email, '@', 1)
  );

  begin
    insert into public.profiles (id, email, display_name)
    values (new.id, new.email, v_display_name);
  exception when unique_violation then
    insert into public.profiles (id, email, display_name)
    values (new.id, new.email, v_display_name || '-' || substring(new.id::text, 1, 4));
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Tighten tasks RLS now that we have authenticated sessions to gate on.
-- The previous app-level cookie auth let the anon key write freely; this
-- replaces that with a real "must be signed in" check.
drop policy if exists tasks_all on public.tasks;
create policy tasks_authenticated_all on public.tasks
  for all to authenticated
  using (true)
  with check (true);
