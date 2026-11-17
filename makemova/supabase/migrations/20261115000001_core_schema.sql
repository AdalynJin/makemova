-- Makemova core schema, from the Team 6 Week 4 data model.
-- Supabase owns auth. There is no users or password table here:
-- profiles points at auth.users, and no password is ever stored.

create type public.designer_segment as enum ('career_switcher', 'practicing_designer', 'working_designer');
create type public.consent_status as enum ('pending', 'granted', 'withdrawn');
create type public.project_status as enum ('draft', 'active', 'completed', 'archived');
create type public.brief_source as enum ('guided', 'own_work');

-- User → profile (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  segment public.designer_segment,
  consent_status public.consent_status not null default 'pending',
  consented_at timestamptz,
  created_at timestamptz not null default now()
);

-- Project: 1 user : many projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  status public.project_status not null default 'draft',
  skill_focus text,
  created_at timestamptz not null default now()
);
create index projects_owner_idx on public.projects (owner_id);

-- ProjectContext: 1 project : 1 context
create table public.project_contexts (
  project_id uuid primary key references public.projects (id) on delete cascade,
  goal text,
  audience text,
  constraints text,
  brief_title text,
  brief_prompt text,
  brief_source public.brief_source not null default 'own_work'
);

-- ArtifactVersion: 1 project : many versions. Stores a file reference, not the file.
create table public.artifact_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  file_ref text not null,
  version_number integer not null check (version_number > 0),
  label text,
  created_at timestamptz not null default now(),
  unique (project_id, version_number),
  unique (id, project_id)
);

-- CritiqueSession: 1 project : many sessions; must reference a version of the same project.
create table public.critique_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  version_id uuid not null,
  intent text,
  questions text,
  feedback text,
  model text,
  created_at timestamptz not null default now(),
  foreign key (version_id, project_id) references public.artifact_versions (id, project_id) on delete cascade
);
create index critique_sessions_project_idx on public.critique_sessions (project_id);

-- DecisionReflection: 1 session : 0–1 reflection
create table public.decision_reflections (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.critique_sessions (id) on delete cascade,
  options text,
  tradeoffs text,
  choice text,
  rationale text,
  revision_notes text,
  next_step text,
  created_at timestamptz not null default now()
);

-- AIUsageEvent: 1 session : many events. Pilot cost evidence.
create table public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.critique_sessions (id) on delete cascade,
  model text not null,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  estimated_cost_usd numeric(10, 4) not null default 0,
  created_at timestamptz not null default now()
);

-- New sign-up → profile row.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
