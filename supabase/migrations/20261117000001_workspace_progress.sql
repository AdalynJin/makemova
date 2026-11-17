-- Manual comparisons and reflections can be saved without starting a critique.
create table public.workspace_progress (
  project_id uuid primary key references public.projects (id) on delete cascade,
  stage text not null default 'brief' check (stage in ('brief', 'make', 'revise', 'reflect')),
  decision_version integer,
  goal_fit text,
  evidence text,
  trade_off text,
  revision_note text,
  lesson text,
  foreign key (project_id, decision_version)
    references public.artifact_versions (project_id, version_number) on delete set null (decision_version)
);

alter table public.workspace_progress enable row level security;
grant select, insert, update, delete on public.workspace_progress to authenticated;

create policy "Own workspace progress" on public.workspace_progress
  for all to authenticated
  using (public.owns_project(project_id))
  with check (public.owns_project(project_id));

-- Allocate the next version while holding this project's row lock. Independent
-- projects can upload concurrently, and simultaneous uploads cannot share a number.
create function public.append_artifact_version(target_project uuid, object_path text, version_label text)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_version integer;
begin
  perform id from public.projects where id = target_project and owner_id = auth.uid() for update;
  if not found or split_part(object_path, '/', 1) <> auth.uid()::text
      or split_part(object_path, '/', 2) <> target_project::text then
    raise exception 'Project or screenshot unavailable';
  end if;

  select coalesce(max(version_number), 0) + 1 into new_version
    from public.artifact_versions where project_id = target_project;
  insert into public.artifact_versions (project_id, file_ref, version_number, label)
    values (target_project, object_path, new_version, version_label);
  return new_version;
end;
$$;

revoke execute on function public.append_artifact_version(uuid, text, text) from public, anon;
grant execute on function public.append_artifact_version(uuid, text, text) to authenticated;
