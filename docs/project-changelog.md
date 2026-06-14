# Project Changelog

## [Unreleased]

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
- `/awards` and `/kudos` linked in nav but not yet built

---

## [Previous]

### 2026-06-13 — Login + Supabase OAuth

- Login page with Supabase Google OAuth
- Auth redirect flow; unauthenticated users sent to `/login`
- See `docs/journals/260613-login-supabase-oauth-integration.md` for full session notes
