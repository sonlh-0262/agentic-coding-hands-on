-- 0005_kudo_hearts.sql
-- Hearts (likes) for kudos. One heart per user per kudo; toggling = insert/delete.
--
-- Powers the Profile page (app/profile): per-kudo heart count and the
-- "Số tim bạn nhận được" stat (hearts on kudos where the user is the recipient).
-- Idempotent + re-runnable. Mirrors the RLS style of 0003_kudos_and_relations.sql.

create table if not exists public.kudo_hearts (
  kudo_id    uuid not null references public.kudos(id) on delete cascade,
  user_id    uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key (kudo_id, user_id)
);

create index if not exists kudo_hearts_kudo_idx on public.kudo_hearts (kudo_id);
-- Covers the heartedByMe lookup (where user_id = me and kudo_id in (...)).
create index if not exists kudo_hearts_user_kudo_idx on public.kudo_hearts (user_id, kudo_id);

-- The Profile "Đã gửi" (sent) feed filters kudos by sender_id; 0003 only
-- indexed recipient_id. Add the sender index here (idempotent, additive).
create index if not exists kudos_sender_idx on public.kudos (sender_id);

alter table public.kudo_hearts enable row level security;

-- Anyone authenticated can read hearts (counts + who hearted).
drop policy if exists "kudo_hearts_select_authenticated" on public.kudo_hearts;
create policy "kudo_hearts_select_authenticated"
  on public.kudo_hearts for select
  to authenticated
  using (true);

-- A user may only add a heart as themselves.
drop policy if exists "kudo_hearts_insert_own" on public.kudo_hearts;
create policy "kudo_hearts_insert_own"
  on public.kudo_hearts for insert
  to authenticated
  with check (user_id = auth.uid());

-- A user may only remove their own heart.
drop policy if exists "kudo_hearts_delete_own" on public.kudo_hearts;
create policy "kudo_hearts_delete_own"
  on public.kudo_hearts for delete
  to authenticated
  using (user_id = auth.uid());
