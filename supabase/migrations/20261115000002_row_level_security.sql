-- Row-level security: a designer can only see and change their own work.
-- No query may return another designer's projects, critiques or reflections.

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_contexts enable row level security;
alter table public.artifact_versions enable row level security;
alter table public.critique_sessions enable row level security;
alter table public.decision_reflections enable row level security;
alter table public.ai_usage_events enable row level security;

create function public.owns_project(p_project_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.projects
    where id = p_project_id and owner_id = (select auth.uid())
  );
$$;

create function public.owns_session(p_session_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.critique_sessions s
    join public.projects p on p.id = s.project_id
    where s.id = p_session_id and p.owner_id = (select auth.uid())
  );
$$;

-- profiles
create policy "Read own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "Update own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- projects
create policy "Read own projects" on public.projects
  for select to authenticated using (owner_id = (select auth.uid()));
create policy "Create own projects" on public.projects
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "Update own projects" on public.projects
  for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "Delete own projects" on public.projects
  for delete to authenticated using (owner_id = (select auth.uid()));

-- project children: access follows project ownership
create policy "Own project contexts" on public.project_contexts
  for all to authenticated using (public.owns_project(project_id)) with check (public.owns_project(project_id));
create policy "Own artifact versions" on public.artifact_versions
  for all to authenticated using (public.owns_project(project_id)) with check (public.owns_project(project_id));
create policy "Own critique sessions" on public.critique_sessions
  for all to authenticated using (public.owns_project(project_id)) with check (public.owns_project(project_id));
create policy "Own decision reflections" on public.decision_reflections
  for all to authenticated using (public.owns_session(session_id)) with check (public.owns_session(session_id));

-- AI usage: designers can read their own; only the server (secret key) writes.
create policy "Read own AI usage" on public.ai_usage_events
  for select to authenticated using (public.owns_session(session_id));
