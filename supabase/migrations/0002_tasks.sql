-- Work Breakdown Structure tasks for chapter exec boards.
-- Hierarchical (parent_id self-reference), with status, assignee, due date.
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  chapter_id text not null default 'san-diego',
  parent_id uuid references public.tasks(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo',     -- todo | in_progress | done | blocked
  priority text not null default 'normal', -- low | normal | high | urgent
  assignee text,                            -- one of the board names
  due_date date,
  position integer not null default 0,
  created_by text,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_chapter_idx on public.tasks(chapter_id);
create index if not exists tasks_parent_idx on public.tasks(parent_id);
create index if not exists tasks_status_idx on public.tasks(status);
create index if not exists tasks_due_idx on public.tasks(due_date);

-- RLS: app-level auth gates the admin pages, so the table is permissive for now.
-- Lock down later when we move to real auth (Supabase Auth or third-party).
alter table public.tasks enable row level security;

drop policy if exists tasks_all on public.tasks;
create policy tasks_all on public.tasks
  for all to anon, authenticated
  using (true)
  with check (true);

-- Updated-at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();
