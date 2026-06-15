-- 0001_profiles_and_trigger.sql
-- Profiles directory for the Kudos feature.
--
-- profiles holds a user directory used for recipient search and @mentions.
-- Rows arrive two ways (per clarifications.md):
--   1. Auto-synced from auth.users on signup via handle_new_user() trigger.
--   2. Seeded sample Sunners (supabase/seed.sql) with fixed UUIDs, is_seed = true.
--
-- NOTE: profiles.id is intentionally NOT a hard FK to auth.users so that seeded
-- rows (which have no matching auth.users row) are valid. For real users the id
-- equals auth.users.id, set by the trigger. Idempotent + re-runnable.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  email       text,
  full_name   text not null default '',
  avatar_url  text,
  is_seed     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists profiles_full_name_idx on public.profiles using gin (to_tsvector('simple', full_name));
create index if not exists profiles_email_idx on public.profiles (email);

alter table public.profiles enable row level security;

-- Authenticated users may read the whole directory (recipient search / mentions).
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- A user may update only their own profile row.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Insert is reserved for the security-definer trigger and the service role.
-- (No authenticated insert policy => normal users cannot insert arbitrary rows.)

-- ---------------------------------------------------------------------------
-- Signup trigger: mirror new auth.users into public.profiles.
-- security definer so it runs with table-owner rights and bypasses RLS.
-- search_path pinned to public to avoid hijacking (security best practice).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.email
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do update
    set email      = excluded.email,
        full_name  = excluded.full_name,
        avatar_url = excluded.avatar_url;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
