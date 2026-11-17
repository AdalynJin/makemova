-- Storage: one private bucket for design attempts (screens a learner uploads).
-- PNG or JPG, up to 5 MB, matching the Week 8 upload component.
-- Path convention: <user id>/<project id>/<file name>. Only the owner can read or write.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('artifacts', 'artifacts', false, 5242880, array['image/png', 'image/jpeg']);

create policy "Owner reads own artifacts" on storage.objects
  for select to authenticated
  using (bucket_id = 'artifacts' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Owner uploads own artifacts" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'artifacts' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Owner deletes own artifacts" on storage.objects
  for delete to authenticated
  using (bucket_id = 'artifacts' and (storage.foldername(name))[1] = (select auth.uid())::text);
