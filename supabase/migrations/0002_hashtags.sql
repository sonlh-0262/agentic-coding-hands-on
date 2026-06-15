-- 0002_hashtags.sql
-- Predefined hashtag dictionary for Kudos. Seeded in supabase/seed.sql.
-- Authenticated users read the list (the "+ Hashtag" dropdown); only the
-- service role manages the catalogue. Idempotent + re-runnable.

create table if not exists public.hashtags (
  id         uuid primary key default gen_random_uuid(),
  label      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.hashtags enable row level security;

drop policy if exists "hashtags_select_authenticated" on public.hashtags;
create policy "hashtags_select_authenticated"
  on public.hashtags for select
  to authenticated
  using (true);

-- No insert/update/delete policy for normal users => service role only.
