-- Real AI critique (demo): the critique Edge Function saves Claude's answer for one version here.
-- `result` holds the structured feedback the workspace draws as feedback pins:
--   { "summary": text, "pins": [ { "title": text, "body": text, "x": 0–1, "y": 0–1 } ] }
-- x and y are where on the screen each note points, as a share of the screen's width and height.
-- RLS is unchanged: a designer reads and writes only their own project's sessions.

alter table public.critique_sessions
  add column focus text,
  add column result jsonb,
  add column status text not null default 'done' check (status in ('running', 'done', 'failed')),
  add column error text;

create index critique_sessions_project_created on public.critique_sessions (project_id, created_at desc);
