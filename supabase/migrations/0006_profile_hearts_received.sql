-- 0006_profile_hearts_received.sql
-- Count of hearts on kudos a user RECEIVED, computed in the database so the
-- app no longer has to fetch every received-kudo id to a `.in(...)` filter
-- (review finding I2). security invoker → runs under the caller's RLS; both
-- kudo_hearts and kudos are readable by authenticated users, so the count is
-- correct without elevated rights. Idempotent + re-runnable.

create or replace function public.profile_hearts_received(uid uuid)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)::bigint
  from public.kudo_hearts h
  join public.kudos k on k.id = h.kudo_id
  where k.recipient_id = uid;
$$;

-- Expose to the PostgREST API roles.
grant execute on function public.profile_hearts_received(uuid) to authenticated;
grant execute on function public.profile_hearts_received(uuid) to anon;
