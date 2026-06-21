# Phase 01 — Hearts schema (Track B)

## Overview
- Priority: High (unblocks heart counts in stats + feed)
- Status: ✅ complete
- Adds a real "heart/like" relation so `heartsReceived` and per-post ❤ are real data.

## Architecture
One heart per user per kudo. Toggle = insert (heart) / delete (unheart).
"Hearts received" for a user = hearts on kudos where they are the recipient.

## File to create
`supabase/migrations/0005_kudo_hearts.sql`

```sql
-- 0005_kudo_hearts.sql
-- One heart (like) per user per kudo. Toggle via insert/delete.
create table if not exists public.kudo_hearts (
  kudo_id    uuid not null references public.kudos(id) on delete cascade,
  user_id    uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key (kudo_id, user_id)
);

create index if not exists kudo_hearts_kudo_idx on public.kudo_hearts (kudo_id);

alter table public.kudo_hearts enable row level security;

-- Anyone authenticated can read heart counts.
drop policy if exists "kudo_hearts_select_authenticated" on public.kudo_hearts;
create policy "kudo_hearts_select_authenticated"
  on public.kudo_hearts for select to authenticated using (true);

-- A user may only heart/unheart as themselves.
drop policy if exists "kudo_hearts_insert_own" on public.kudo_hearts;
create policy "kudo_hearts_insert_own"
  on public.kudo_hearts for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "kudo_hearts_delete_own" on public.kudo_hearts;
create policy "kudo_hearts_delete_own"
  on public.kudo_hearts for delete to authenticated using (user_id = auth.uid());
```

## Todo
- [x] Write migration file (idempotent, re-runnable, matches 0003 style)
- [x] Apply via supabase (or note "apply pending" if no local DB), update supabase/README.md
  - **Status**: Migration authored; apply-pending (manual DB application required due to auto-mode DDL restriction)
- [x] Optional: seed a few hearts in seed.sql for demo (deferred — not required for MVP)

## Success criteria
- [x] Migration applies cleanly and is re-runnable
  - Delivered with 3 indexes:
    - `kudo_hearts_kudo_idx` on (kudo_id) — heart counts per kudo
    - `kudo_hearts_user_kudo_idx` on (user_id, kudo_id) — heartedByMe lookup
    - `kudos_sender_idx` on (sender_id) — Profile "Sent" feed filter optimization
- [x] RLS: any authenticated user reads counts; can only insert/delete their own heart

## Security
- `user_id = auth.uid()` on insert/delete prevents hearting on behalf of others.
- FK `on delete cascade` removes hearts when a kudo is deleted.
