-- 0003_kudos_and_relations.sql
-- Kudos messages + hashtag relations.
--
-- A kudo records a thank-you from sender_id to recipient_id. The message is
-- sanitized HTML (rich text). mentions stores the profile ids referenced via
-- "@" in the body. is_anonymous hides the sender in the feed; anonymous_name
-- is the display name shown instead. image_urls are public Storage URLs.
-- Idempotent + re-runnable.

create table if not exists public.kudos (
  id            uuid primary key default gen_random_uuid(),
  -- Explicit FK names so the feed query's embedded-resource hints
  -- (profiles!kudos_sender_id_fkey / !kudos_recipient_id_fkey) are stable.
  sender_id     uuid not null
                  constraint kudos_sender_id_fkey references public.profiles(id),
  recipient_id  uuid not null
                  constraint kudos_recipient_id_fkey references public.profiles(id),
  title         text not null default '',
  message_html  text not null,
  mentions      jsonb not null default '[]'::jsonb,
  is_anonymous  boolean not null default false,
  anonymous_name text,
  image_urls    text[] not null default '{}',
  created_at    timestamptz not null default now()
);

create index if not exists kudos_created_at_idx on public.kudos (created_at desc);
create index if not exists kudos_recipient_idx on public.kudos (recipient_id);

create table if not exists public.kudo_hashtags (
  kudo_id    uuid not null references public.kudos(id) on delete cascade,
  hashtag_id uuid not null references public.hashtags(id),
  primary key (kudo_id, hashtag_id)
);

alter table public.kudos enable row level security;
alter table public.kudo_hashtags enable row level security;

-- Anyone authenticated can read the feed.
drop policy if exists "kudos_select_authenticated" on public.kudos;
create policy "kudos_select_authenticated"
  on public.kudos for select
  to authenticated
  using (true);

-- A user can only create a kudo where they are the sender.
drop policy if exists "kudos_insert_own" on public.kudos;
create policy "kudos_insert_own"
  on public.kudos for insert
  to authenticated
  with check (sender_id = auth.uid());

-- Join rows: readable by authenticated; insertable only for kudos the user owns.
drop policy if exists "kudo_hashtags_select_authenticated" on public.kudo_hashtags;
create policy "kudo_hashtags_select_authenticated"
  on public.kudo_hashtags for select
  to authenticated
  using (true);

drop policy if exists "kudo_hashtags_insert_own" on public.kudo_hashtags;
create policy "kudo_hashtags_insert_own"
  on public.kudo_hashtags for insert
  to authenticated
  with check (
    exists (
      select 1 from public.kudos k
      where k.id = kudo_id and k.sender_id = auth.uid()
    )
  );
