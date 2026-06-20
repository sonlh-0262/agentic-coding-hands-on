# Project Changelog

## [Unreleased]

### 2026-06-20 — Profile page (`/profile`, auth-protected)

**Branch:** feat/profile-page (unmerged as of 2026-06-20)

**What shipped:**
- Protected route `/profile` — self-only profile page, auth-gated (redirect to `/login` when unauthenticated); uses `force-dynamic` rendering
- **Supabase schema** (`supabase/migrations/0005_kudo_hearts.sql` — apply-pending; see `supabase/README.md`):
  - `kudo_hearts` table: one heart per user per kudo, toggle via insert/delete; primary key `(kudo_id, user_id)`
  - RLS: authenticated read (all), insert/delete restricted to own rows
  - Indexes: `kudo_hearts_kudo_idx`, `kudo_hearts_user_kudo_idx`, plus `kudos_sender_idx` on existing `kudos` table (covers "Đã gửi" feed)
- **Data layer** (`lib/profile/`): `types.ts`, `queries.ts` (stats + paginated feed), `actions.ts` (heart toggle Server Action)
- **UI** (`app/_components/profile/`):
  - Hero section: avatar, display name, placeholder department/title badges (`Sun* / Sunner`)
  - Stats section: kudos received, kudos sent, hearts received — all from live DB queries
  - Kudo feed: Sent / Received tab filter, per-kudo heart count, heart toggle button (optimistic UI)
  - Awards header: icon/badge collection slots (mock — no backend yet)
- **Mock scope**: Secret Box stats + button, icon/badge collection, role/department pills — rendered from `profile-mock-data.ts`, no backend

**Pending (requires DB access):**
- Migration `0005_kudo_hearts.sql` has not been applied to the live database. Apply via `supabase db push` or `psql`. See `supabase/README.md`.

---

### 2026-06-15 — Kudos feature (`/kudos`, full-stack, auth-protected)

**Branch:** feat/viet-kudo

**What shipped:**
- Protected route `/kudos` — Kudos feed page with "Viết Kudo" modal; auth-gated via proxy + page-level redirect
- **Supabase schema** (new `supabase/` directory — migrations must be applied manually; see `supabase/README.md`):
  - `profiles` table with `handle_new_user` signup trigger and seed data
  - `hashtags` table (seeded with category tags)
  - `kudos` table and `kudo_hashtags` join table
  - `kudos-images` Storage bucket
  - Full Row Level Security (RLS) policies on all tables; anonymous sender identity is never stored or leaked
- **Data layer** (`lib/kudos/`): `types.ts`, `validation.ts`, `queries.ts`, `actions.ts`, `sanitize-html.ts`
- **Supabase admin client** (`lib/supabase/admin.ts`): service-role client, server-only, used for the Kudos write path
- **UI**: recipient search (@mention autocomplete), seeded hashtag dropdown (1–5 tags), image upload (up to 5 images, MIME allowlist), custom contentEditable rich-text editor, anonymous sender toggle, real `createKudo` Server Action
- **Security posture**: RLS enforced at DB layer; all input validated + HTML-sanitized server-side before write; anonymous sender identity is never persisted or exposed to recipients
- 138 unit tests pass; `tsc`, `eslint`, and `next build` all green

**Environment variables (new):**
- `SUPABASE_SERVICE_ROLE_KEY` — server-only (no `NEXT_PUBLIC_` prefix); bypasses RLS for the Kudos write path. See `.env.example`.

**Pending (requires DB access):**
- Supabase migrations in `supabase/migrations/` have not been applied to the live database. Apply via `supabase db push` or `psql`. See `supabase/README.md` for instructions.

**Resolves:** "Known nav placeholder" from 2026-06-14 entry — `/kudos` is now fully implemented.

---

### 2026-06-15 — Award System page (`/he-thong-giai`, auth-protected)

**What shipped:**
- Protected route `/he-thong-giai` — "Hệ thống giải thưởng SAA 2025" page, auth-gated (proxy + page-level redirect to `/login`)
- Hero/keyvisual section, sticky scroll-spy nav with 6 award-category links, 6 award detail sections, Sun* Kudos banner (reused from homepage)
- 8 new files under `app/_components/awards/` including `awards-data.ts` (award category data)
- `proxy.ts` updated: `/awards` removed from `PUBLIC_PATHS`; `/he-thong-giai` added as protected route

**Navigation changes:**
- All internal links that previously pointed to `/awards` (in `home-data.ts`, `award-card.tsx`, `hero-section.tsx`) updated to `/he-thong-giai`

**Resolves:** "Known nav placeholders" from 2026-06-14 entry — `/awards` link is now live (redirects via nav repoint to `/he-thong-giai`)

---

### 2026-06-14 — Homepage SAA (public, auth-aware)

**Branch:** feat/login-supabase-oauth

**What shipped:**
- Public homepage at `/` with hero (ROOT FURTHER tagline), live countdown to event date, 6-card awards grid, Sun* Kudos block, header/footer nav, and floating widget button
- 14 UI components under `app/_components/home/`
- `lib/event/countdown.ts` — countdown logic, unit-tested
- `app/page.tsx` — server component, reads `NEXT_PUBLIC_EVENT_DATETIME` env var, passes auth state to client components

**Behavior change (breaking vs. prior state):**
- Previously `/` redirected unauthenticated users to `/login`
- Now `/` is **public**: no authentication required to view the homepage
- Auth-aware: bell icon + account menu render only when a valid session exists (`getUser()` check, not `getSession()`)
- `proxy.ts` updated: `/` explicitly made public; all account routes remain protected by default

**Environment variables:**
- `NEXT_PUBLIC_EVENT_DATETIME` — ISO datetime string for countdown target (required for countdown tile)

**Known nav placeholders:**
- `/kudos` linked in nav but not yet built
- `/awards` — resolved in 2026-06-15 entry (repointed to `/he-thong-giai`)

---

## [Previous]

### 2026-06-13 — Login + Supabase OAuth

- Login page with Supabase Google OAuth
- Auth redirect flow; unauthenticated users sent to `/login`
- See `docs/journals/260613-login-supabase-oauth-integration.md` for full session notes
