-- 0004_storage_kudos_images.sql
-- Storage bucket for kudo image attachments (max 5 per kudo, app-enforced).
-- Public read so feed thumbnails resolve without signed URLs. Authenticated
-- users may upload; an uploader may delete their own objects. Idempotent.

insert into storage.buckets (id, name, public)
values ('kudos-images', 'kudos-images', true)
on conflict (id) do update set public = true;

-- Public read of objects in this bucket.
drop policy if exists "kudos_images_public_read" on storage.objects;
create policy "kudos_images_public_read"
  on storage.objects for select
  using (bucket_id = 'kudos-images');

-- Authenticated users may upload, but ONLY into their own "<uid>/..." folder
-- (the action uploads to `${user.id}/<uuid>.<ext>`). This stops a user from
-- writing into another user's path even if they bypass the UI.
drop policy if exists "kudos_images_authenticated_insert" on storage.objects;
create policy "kudos_images_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'kudos-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Uploaders may delete their own objects (owner = auth.uid()).
drop policy if exists "kudos_images_owner_delete" on storage.objects;
create policy "kudos_images_owner_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'kudos-images' and owner = auth.uid());
