# Phase 02 — Track B: Access, Wiring, Countdown, Nav (orchestrator/main)

**Status:** ✅ COMPLETE

**Goal:** Make `/` public + auth-aware, feed real auth + event datetime into the UI, provide nav config.

**Outcome:** `app/page.tsx` uses `getCurrentUser()` (JWT-based), renders public + auth-aware page, passes `user` (with `isAdmin` from `app_metadata` only) + `eventDatetime` to HomeClient. `proxy.ts` defines `PUBLIC_PATHS=["/","/login","/awards","/kudos","/criteria"]` to allow unauthenticated access. `lib/event/countdown.ts` implements `resolveEventDatetime()`, `getRemaining()`, `padded()` with full error handling. `.env.example` documents `NEXT_PUBLIC_EVENT_DATETIME`. `lib/navigation/home-links.ts` created but later identified as dead code (components use home-data.ts instead).

## Owns (create/modify)
- **Modify `proxy.ts`** — stop force-redirecting unauthenticated users away from `/`. Keep:
  - `/auth/*` passthrough; authenticated on `/login` → `/`.
  - Define `PROTECTED_PATHS` (currently empty / future) so `/` is public. Session refresh stays.
- **Modify `app/page.tsx`** — Server Component, `dynamic = "force-dynamic"`:
  - `getCurrentUser()`; build `HomeUser | null` (name, email, avatarUrl from user_metadata; `isAdmin` from `app_metadata.role === "admin"` or `user_metadata.role`).
  - Read `NEXT_PUBLIC_EVENT_DATETIME`; render `<HomeClient user={...} eventDatetime={...} />`. No redirect.
- **Create `lib/event/countdown.ts`** — `resolveEventDatetime(raw?: string): string` (validate ISO-8601, fallback to fixed future date e.g. `2026-12-31T18:30:00+07:00`); `getRemaining(target: Date, now: Date)` → `{ days, hours, minutes, ended }`. Pure, unit-testable.
- **Create `lib/navigation/home-links.ts`** — nav routes (`/`, `/awards`, `/kudos`), award category slugs, footer links. Single source of truth shared with UI via props or import.
- **Modify `.env.example`** — document `NEXT_PUBLIC_EVENT_DATETIME`.

## Notes
- Assets are local (`public/home/*`) → no `next.config.ts` remotePatterns change expected.
- Test cases: ID-0/1 (public vs auth), ID-56/57/60 (countdown env/invalid), ID-37/38 (admin menu).
