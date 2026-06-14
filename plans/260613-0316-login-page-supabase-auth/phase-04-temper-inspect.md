# Phase 04 — Temper & Inspect

**Priority:** High · **Status:** ✅ DONE · **Depends on:** Phase 01–03

## Tempering (delegate → `tester`, `debugger` if failures)
- `tsc --noEmit` clean
- `next build` succeeds (or `next dev` boots without runtime errors)
- ESLint (`npm run lint`) — no errors
- Behavior checks (manual/automated where feasible): proxy redirects, login button loading state, callback route shape, sign-out route.
- Note: full live OAuth requires real Supabase URL/key + Google creds (user-supplied); tests validate wiring + build, not a live Google round-trip.

## Inspection (delegate → `reviewer`)
- Correctness vs acceptance criteria & test cases
- Security: cookie handling, no secrets committed, `.env.local` gitignored, no service-role key in client, redirect URL validation in callback
- Next.js 16 idioms (proxy not middleware, async cookies, server vs client boundaries)
- Style/architecture: files < 200 lines, kebab-case, DRY

## Success criteria
- 100% of runnable checks pass; reviewer score ≥ threshold, 0 critical.

## Todo
- [x] tester: build + typecheck + lint
- [x] reviewer: review report
- [x] fixes applied & re-verified
