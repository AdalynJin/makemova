-- Demo data from our Week 4–8 content: the Kiln studio and café projects,
-- and our personas Lena (career switcher) and Theo (design student).
--
-- Local fixture accounts use reserved .test addresses and have no password.
-- The signup trigger also creates their profiles on a fresh database.
insert into auth.users (
  id, aud, role, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token, email_change, email_change_token_new
)
select gen_random_uuid(), 'authenticated', 'authenticated', fixture.email, now(),
  '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(), '', '', '', ''
from (values ('lena.demo@makemova.test'), ('theo.demo@makemova.test')) as fixture(email)
where not exists (select 1 from auth.users where auth.users.email = fixture.email);

do $$
declare
  lena uuid := (select id from auth.users where email = 'lena.demo@makemova.test');
  theo uuid := (select id from auth.users where email = 'theo.demo@makemova.test');
  kiln uuid := 'f49b9b95-3ba3-49f3-841b-62ca41fef301';
  cafe uuid := 'f49b9b95-3ba3-49f3-841b-62ca41fef302';
  kiln_v1 uuid := gen_random_uuid();
  kiln_v2 uuid := gen_random_uuid();
  cafe_v1 uuid := gen_random_uuid();
  kiln_crit uuid := gen_random_uuid();
  cafe_crit uuid := gen_random_uuid();
begin
  if lena is null or theo is null then
    raise exception 'The seed could not resolve its fixture accounts.';
  end if;
  -- A repeated seed should leave existing demo projects and user changes alone.
  if exists (select 1 from public.projects where id in (kiln, cafe)) then
    return;
  end if;

  insert into public.profiles (id) values (lena), (theo) on conflict (id) do nothing;

  update public.profiles set display_name = 'Lena Park', segment = 'career_switcher',
    consent_status = 'granted', consented_at = now() - interval '9 days' where id = lena;
  update public.profiles set display_name = 'Theo Alvarez', segment = 'practicing_designer',
    consent_status = 'granted', consented_at = now() - interval '6 days' where id = theo;

  insert into public.projects (id, owner_id, title, status, skill_focus, created_at) values
    (kiln, lena, 'Kiln studio website', 'active', 'Visual hierarchy', now() - interval '8 days'),
    (cafe, theo, 'Café ordering screen', 'active', 'Action hierarchy', now() - interval '5 days');

  insert into public.project_contexts values
    (kiln, 'Help a first-time visitor find and book a beginner session.',
     'Adults in Los Angeles who have never touched clay.',
     'Keep constant: visitors, classes, dates, photo and viewport.',
     'Your first pottery class', 'Design the landing page for a community clay studio.', 'guided'),
    (cafe, 'Make pickup easier to find for a student in a hurry.',
     'Students ordering between classes.',
     'One screen, mobile, existing menu data.',
     null, null, 'own_work');

  insert into public.artifact_versions (id, project_id, file_ref, version_number, label, created_at) values
    (kiln_v1, kiln, lena || '/' || kiln || '/kiln-v1.png', 1, 'First attempt', now() - interval '7 days'),
    (kiln_v2, kiln, lena || '/' || kiln || '/kiln-v2.png', 2, 'Booking leads', now() - interval '5 days'),
    (cafe_v1, cafe, theo || '/' || cafe || '/cafe-revision.png', 1, 'Current direction', now() - interval '4 days');

  insert into public.critique_sessions (id, project_id, version_id, intent, questions, feedback, model, created_at) values
    (kiln_crit, kiln, kiln_v1, 'Main action', 'Which action would you notice first?',
     'Explore classes is filled; booking has an outline. Try giving booking more emphasis. Keep the class information and photo.',
     'claude-sonnet-5-5', now() - interval '6 days'),
    (cafe_crit, cafe, cafe_v1, 'Visual hierarchy', 'Does pickup read first?',
     'Pickup reads first. Keep it as the primary action, and move the loyalty banner below the order.',
     'claude-sonnet-5-5', now() - interval '3 days');

  insert into public.decision_reflections (session_id, options, tradeoffs, choice, rationale, revision_notes, next_step) values
    (kiln_crit, 'v1: explore classes leads · v2: booking leads',
     'Booking first helps people who already decided; exploring first helps people still curious.',
     'v2', 'A first-time visitor came to book a beginner session, so booking should be the first thing they see.',
     'Swapped button weights; kept the photo and class cards unchanged.', 'Check readability of the class cards.');

  insert into public.ai_usage_events (session_id, model, input_tokens, output_tokens, estimated_cost_usd) values
    (kiln_crit, 'claude-sonnet-5-5', 2140, 410, 0.0126),
    (cafe_crit, 'claude-sonnet-5-5', 1980, 352, 0.0112);
end $$;
