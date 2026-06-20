# Supabase schema — Kudos feature

SQL for the **Viết Kudo** feature: a user directory (`profiles`), a hashtag
dictionary (`hashtags`), the `kudos` table + `kudo_hashtags` join, and a
`kudos-images` Storage bucket.

## Files (apply in order)

| Order | File | What it creates |
|-------|------|-----------------|
| 1 | `migrations/0001_profiles_and_trigger.sql` | `profiles` + RLS + `handle_new_user()` signup trigger |
| 2 | `migrations/0002_hashtags.sql` | `hashtags` + RLS |
| 3 | `migrations/0003_kudos_and_relations.sql` | `kudos`, `kudo_hashtags` + RLS |
| 4 | `migrations/0004_storage_kudos_images.sql` | `kudos-images` bucket + Storage policies |
| 5 | `migrations/0005_kudo_hearts.sql` | `kudo_hearts` (likes) + RLS — powers the Profile page hearts |
| 6 | `seed.sql` | 8 sample Sunners + 10 predefined hashtags |

All scripts are **idempotent** — safe to re-run.

## How to apply

### Option A — Supabase SQL Editor (no local tooling)
Open each file, paste into the SQL editor (Dashboard → SQL), run in the order above.

### Option B — psql with a connection string
Add a Postgres connection string to `.env.local` as `SUPABASE_DB_URL`
(Dashboard → Project Settings → Database → Connection string → URI), then:

```bash
for f in supabase/migrations/0001_profiles_and_trigger.sql \
         supabase/migrations/0002_hashtags.sql \
         supabase/migrations/0003_kudos_and_relations.sql \
         supabase/migrations/0004_storage_kudos_images.sql \
         supabase/migrations/0005_kudo_hearts.sql \
         supabase/seed.sql; do
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$f"
done
```

> Storage policies in `0004` operate on `storage.objects` / `storage.buckets`.
> These exist in every Supabase project; if running on a non-Supabase Postgres,
> skip `0004`.

## App env vars

The app reads the directory/feed with the **anon** key under RLS
(`NEXT_PUBLIC_SUPABASE_*`, already set). The write path (`createKudo`,
`uploadKudoImage`) runs as the authenticated user. A **service-role** key is
required only for server-side admin tasks:

```
SUPABASE_SERVICE_ROLE_KEY=...   # server-only, NEVER prefixed NEXT_PUBLIC_
```

## Verify

```sql
-- as an authenticated user (via the app), these should return rows:
select count(*) from public.profiles;   -- >= 8
select count(*) from public.hashtags;   -- >= 10
-- bucket exists:
select id, public from storage.buckets where id = 'kudos-images';
```

A new Google signup should automatically create a `profiles` row (trigger).

## Rollback

Drop in reverse FK order: `kudo_hashtags`, `kudos`, `hashtags`, `profiles`,
the `on_auth_user_created` trigger + `handle_new_user()` function, and the
`kudos-images` bucket/policies.
