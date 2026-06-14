# Project Changelog

## [Unreleased]

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
