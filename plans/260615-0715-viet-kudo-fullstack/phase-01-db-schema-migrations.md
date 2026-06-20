# Phase 01 — DB Schema & Migrations

## Context Links
- Clarifications: `plans/260615-0715-viet-kudo-fullstack/clarifications.md`
- Existing auth: `lib/supabase/{server.ts,auth.ts,env.ts}` (Google OAuth via @supabase/ssr; `auth.users` exists, no public schema tables yet)
- Next.js proxy auth: `lib/supabase/proxy-session.ts`

## Overview
- **Priority:** P1 (blocks everything)
- **Status:** pending
- **Track:** B
- Create the relational schema, signup trigger, seed data, and Storage bucket + RLS as versioned SQL.

## Key Insights
- NO `profiles` table, NO `supabase/migrations/` dir, NO service-role key exist yet.
- profiles must be BOTH trigger-synced from `auth.users` AND seeded with sample Sunners → seeded rows
  must use stable UUIDs that do NOT collide with real auth users (use fixed UUIDs, mark `is_seed = true`).
- Auth identity is `auth.uid()`; RLS policies key off it. `sender_id` defaults to `auth.uid()`.

## Requirements
**Functional**
- `profiles(id uuid pk → auth.users.id, email, full_name, avatar_url, is_seed bool default false, created_at)`.
- Trigger `handle_new_user()` on `auth.users` insert → upsert into `profiles` (full_name/avatar from `raw_user_meta_data`).
- `hashtags(id uuid pk default gen_random_uuid(), label text unique, created_at)` — seeded predefined list.
- `kudos(id, sender_id → profiles, recipient_id → profiles, message_html text, mentions jsonb default '[]',
  is_anonymous bool default false, anonymous_name text, image_urls text[] default '{}', created_at)`.
- `kudo_hashtags(kudo_id → kudos on delete cascade, hashtag_id → hashtags, pk(kudo_id,hashtag_id))`.
- Storage bucket `kudos-images` (public read).

**Non-functional**
- RLS ON for all tables. Idempotent migrations (`create table if not exists`, `on conflict do nothing` seeds).
- Each migration file focused; SQL files exempt from the 200-line code rule but keep readable.

## Architecture / Data Flow
```
auth.users (insert) ──trigger──> profiles
profiles <──FK── kudos ──join──> kudo_hashtags ──FK──> hashtags
kudos.image_urls[] ──refs──> Storage bucket kudos-images
```
**RLS policy matrix**
| Table | select | insert | update/delete |
|-------|--------|--------|---------------|
| profiles | authenticated: all | trigger/service only | own row only |
| hashtags | authenticated: all | service only | service only |
| kudos | authenticated: all | authenticated WHERE `sender_id = auth.uid()` | none (out of scope) |
| kudo_hashtags | authenticated: all | authenticated WHERE parent kudo owned by `auth.uid()` | cascade only |
| storage `kudos-images` | public read | authenticated insert | owner delete |

## Related Code Files
**Create**
- `supabase/migrations/0001_profiles_and_trigger.sql`
- `supabase/migrations/0002_hashtags.sql`
- `supabase/migrations/0003_kudos_and_relations.sql`
- `supabase/migrations/0004_storage_kudos_images.sql`
- `supabase/seed.sql` (sample Sunner profiles + predefined hashtags)
- `supabase/README.md` (how to apply: `psql "$DATABASE_URL" -f <file>` in order, or Supabase SQL editor)

## Implementation Steps
1. Read `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` only if touching auth; otherwise pure SQL.
2. `0001`: create `profiles`, enable RLS, add read-all + own-row policies, create `handle_new_user()`
   (`security definer`) + trigger `on auth.users`. Use `insert ... on conflict (id) do update`.
3. `0002`: create `hashtags`, RLS read-all.
4. `0003`: create `kudos` + `kudo_hashtags`, RLS per matrix above; FKs `on delete cascade` for join.
5. `0004`: create bucket `kudos-images` (`storage.buckets`), policies on `storage.objects`
   (public select; authenticated insert scoped to bucket; owner delete).
6. `seed.sql`: ~8 sample Sunner profiles with FIXED UUIDs + `is_seed=true`; ~10 predefined hashtags
   (`#Teamwork`, `#Innovation`, etc. — pull labels from MoMorph design if listed). `on conflict do nothing`.
7. `README.md`: apply order, env note (`DATABASE_URL` or service-role), how to re-seed.

## Todo List
- [x] 0001 profiles + trigger + RLS
- [x] 0002 hashtags + RLS
- [x] 0003 kudos + kudo_hashtags + RLS
- [x] 0004 storage bucket + policies
- [x] seed.sql (profiles + hashtags)
- [x] supabase/README.md apply instructions
- [x] Apply against user-provided DB (2026-06-16, via Tokyo session pooler `aws-1-ap-northeast-1`, `gssencmode=disable`). Verified: profiles=8, hashtags=10 seeded; RLS on all 4 tables; `kudos-images` bucket + 3 storage policies; `on_auth_user_created` trigger present. (Trigger fires-on-signup to confirm on next real Google login.)

## Success Criteria
- All migrations apply cleanly in order on a fresh DB and are re-runnable (idempotent).
- New Google signup auto-creates a `profiles` row (trigger verified).
- Seeded Sunners + hashtags queryable as an authenticated user; anon gets nothing (RLS verified).
- `kudos-images` bucket exists; authenticated upload + public read confirmed.

## Risk Assessment
| Risk | L×I | Mitigation |
|------|-----|-----------|
| Seeded profile UUID collides with real auth user | Low×High | Fixed reserved UUIDs + `is_seed` flag; document reserved range |
| Trigger missing `security definer` → insert blocked by RLS | Med×High | `security definer` + explicit `set search_path = public` |
| RLS too open (any user inserts kudo as someone else) | Med×High | insert policy `with check (sender_id = auth.uid())` |
| Storage policy lets any user delete others' images | Low×Med | owner-scoped delete policy |

## Backwards Compatibility
- Additive only (new tables/bucket). No existing tables touched. No app code depends on these yet.
- Rollback: `0099_rollback.sql` (optional) dropping objects in reverse FK order; or drop schema objects manually. Document in README.

## Security Considerations
- Trigger `security definer` with pinned `search_path`. RLS enforced on every table (no table left with RLS off).
- Service-role key used ONLY server-side (Phase 2) for seeding/admin; never shipped to client.

## Next Steps
- Unblocks Phase 2 (typed queries need final column names). Confirm final hashtag seed list with design before seeding.
