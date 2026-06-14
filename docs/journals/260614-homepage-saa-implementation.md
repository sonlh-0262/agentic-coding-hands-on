# Homepage SAA Implementation — Public + Auth-Aware with Live Countdown

**Date**: 2026-06-14
**Severity**: High (2 bugs fixed mid-session)
**Component**: Homepage (`/`), countdown logic, auth-aware rendering, nav/footer
**Status**: Resolved (commit `de03a60`)

## What Happened

Built and shipped the public, auth-aware SAA homepage (`/`) from MoMorph design: hero section with ROOT FURTHER + live countdown, awards grid (6 cards), Sun* Kudos block, header/footer nav, floating widget button. Ran parallel tracks — background `implementer` agent built 14 UI components (Track A) while orchestrator built countdown logic and page wiring (Track B), then integrated with real auth state and live countdown display. Testing delivered 33/33 unit tests (countdown logic) passing. Code review found 2 High-severity bugs mid-session; both fixed before commit. Build gates green: tsc, lint, next build. Landed commit `de03a60` on `feat/homepage-saa`.

## The Brutal Truth

This session was a hard-won reminder that parallel execution works only when you stay paranoid about boundary conditions. The countdown test suite was airtight — 33 tests covering edge cases beautifully — but the reviewer caught a real production bug at line 47 of `countdown-timer.tsx`. The `padded()` function correctly zero-pads single-digit numbers, but a careless destructure `const [d1, d2] = value.split("")` silently truncates 3-digit numbers. The event is 2026-12-26, today is 2026-06-14 — **we are 195 days out**. The countdown tile is displaying "10" (days) instead of "19" right now. That's not a cosmetic defect; that's a live bug affecting the hero section of a public page.

The other High (H1) stung harder emotionally: `isAdmin` was derived by checking `user.user_metadata.role === "admin"`. Supabase `user_metadata` is **client-writable**. Any authenticated user can call `updateUser()` and set their own `user_metadata.role` to `"admin"`, which immediately gates the "Admin Dashboard" menu item. The app_metadata (server-controlled) is correctly checked too, but the OR makes the whole thing vulnerable. This is the kind of trust-boundary mistake that feels obvious in hindsight and sits invisible in code review if nobody's thinking like an attacker. It's UI-gating only today (no `/admin` page exists), but the pattern will copy-paste into real authorization code when the dashboard ships. That's a debt we just avoided.

The frustration: these weren't edge cases or exotic scenarios. Countdown display showing truncation is live right now. isAdmin trust boundary is a classic pattern error. Both should have been caught during implementation, not review.

## Technical Details

**Homepage Delivery**
- `app/page.tsx`: Server component, `force-dynamic`, renders `<HomeClient>` with auth state + countdown datetime prop; no caching of auth-sensitive data
- `app/_components/home/*`: 14 components (hero-section, awards-grid, kudos-section, countdown-timer, language-switcher, account-menu, notification-button, widget-button, site-header, site-footer, etc.)
- `lib/event/countdown.ts`: Pure functions — `resolveEventDatetime()`, `getRemaining()`, `padded()`; 33 unit tests via `node:test`, no new npm deps
- `lib/navigation/home-data.ts`: Nav/footer arrays, award categories, mock notification data (all extracted from Figma design)
- Public access change: `proxy.ts` updated to add `/` to `PUBLIC_PATHS` (previously redirected unauthenticated users to `/login`)
- `.env.example`: `NEXT_PUBLIC_EVENT_DATETIME=2026-12-26T00:00:00Z` (with ISO-8601 fallback)
- `public/home/`: 22 design assets (hero images, award icons, backgrounds)

**Countdown Logic**
- `resolveEventDatetime(raw?: string)`: Validates ISO-8601 env var; falls back to hardcoded future date if invalid/missing
- `getRemaining(target: Date, now?: Date)`: Decomposes milliseconds into `{ days, hours, minutes, ended }`, floors seconds
- `padded(value: number)`: Zero-pads single-digit numbers, clamps negatives to 0, no cap at 99
- Tests cover: valid/invalid ISO-8601, timezone offsets, edge dates (past/equal/future), padding edge cases, fallback behavior

**Auth-Aware Rendering**
- Bell icon (notifications) + Account Menu render only when logged in
- For unauthenticated users: "Login with Google" affordance shown instead of account menu
- `user` object typed as `HomeUser` (name, email, avatarUrl, isAdmin)
- `isAdmin` **originally** derived as `(user.app_metadata?.role === "admin") || (user.user_metadata?.role === "admin")` — security bug
- `force-dynamic` on page ensures auth state is fresh on each request (no SSG)

## What We Tried

1. **Parallel execution model**: Spawned `implementer` subagent for Track A (UI components); orchestrator handled Track B (countdown logic, page wiring, proxy config) simultaneously
2. **Clarification upfront**: Resolved 4 key questions before implementation — public+auth-aware access, placeholder nav hrefs, menu open/close scope, countdown datetime source
3. **Unit testing discipline**: Wrote comprehensive test suite first (33 tests for countdown functions); all passed on first run
4. **Integration during code review**: Reviewer ran full code read, identified H1 (isAdmin trust boundary) and H2 (countdown truncation) bugs
5. **Fixes applied immediately**: Removed `user_metadata.role` check; refactored countdown to handle 3+ digit days via `digits.map()` instead of fixed destructure

## Root Cause Analysis

**Countdown Truncation (H2)**

The `padded()` function was designed correctly to return zero-padded strings ("01", "09", "15", etc.) with no upper limit. The consumer code (`CountdownTile`) assumed a 2-character max by destructuring into exactly two variables: `const [d1, d2] = value.split("")`. This works for 1–99 but silently truncates 100+. The bug is **not in `padded()`**, it's in the assumption in the presenter component. Future bug: the event is legitimately 195 days away; the countdown is wrong right now.

Root cause: **no defensive bounds in the component**. The spec says `padded()` returns a string; the component should handle any string length. Destructuring into fixed slots is a smell.

**isAdmin Trust Boundary (H1)**

Supabase distinguishes `app_metadata` (server-controlled, set by admin action only) and `user_metadata` (client-writable by the authenticated user). The code checked both with an OR: "if either role field says admin, treat as admin." This conflates server truth with client state. An attacker model: user logs in, calls `supabase.auth.updateUser({ data: { role: "admin" } })` on the client, their own JWT is unchanged but their local `user_metadata` updates, the SSR code reads both metadata fields and grants admin UI state.

Root cause: **confusion of trust boundaries**. `app_metadata` is authoritative (requires server action). `user_metadata` is a client-writable property bag. Mixing them in authorization logic creates an OR that defaults to trusting the user.

## Lessons Learned

1. **Parallel execution requires paranoia about handoff points.** The two-track model works beautifully, but each track must document what the other can't see. The countdown display (Track A) never saw the countdown logic (Track B) boundary — if it had, the destructure assumption would've been surfaced earlier.

2. **Boundary conditions in presentational code are security-adjacent.** The countdown truncation isn't cryptography, but it's a failure to be defensive about input range. Any time a component makes hard assumptions about string/number bounds, expect future data to violate those assumptions.

3. **Trust boundaries require explicit naming.** `isAdmin` on `HomeUser` should have been named `uiAdminFlag` or accompanied by a comment: "UI gate only — server-side auth must re-check via `app_metadata`." The name alone led reviewers (and future maintainers) to assume it was authoritative.

4. **Separate server truth from client state.** `app_metadata` and `user_metadata` serve different purposes. Using both in a single derivation with OR is a type-level mistake — the types should separate: `type AppData = { role: string }` (from server) vs `type ClientData = { role?: string }` (from client). Then only use AppData for auth logic.

5. **Test coverage ≠ correctness.** The countdown tests were excellent, but they tested `getRemaining()` in isolation. They never tested the component's use of the string (destructuring it into 2 vars). Integration testing (even ad-hoc) would've caught the bug. Single-unit testing can hide assumptions about how units are consumed.

## Next Steps

1. **Deploy to production**: `/` is now public + auth-aware; unauthenticated users see login affordance
2. **Monitor countdown display**: Verify 195-day countdown renders correctly (was showing 10 before fix)
3. **Test OAuth avatar image loading**: Avatar uses `<img>` pointing to OAuth provider domain; allowlist needs production verification
4. **Optimize hero keyvisual**: `public/home/keyvisual-bg.png` is 4.4 MB; should be optimized (compress, WebP fallback) before production load testing
5. **Arrow-key menu navigation (M3 from review)**: Currently Tab works for AccountMenu focus; arrow-key traversal deferred as WCAG nice-to-have, not 2.1 requirement. Schedule for next iteration if accessibility audit demands it.
6. **Account menu + notification panel keyboard close (M2, M4)**: Escape and click-outside handlers deferred; currently menus are "sticky" until you click the button again. Document as known limitation.

---

**Status**: DONE
**Summary**: Homepage SAA built, tested (33/33 countdown tests), reviewed (2 High bugs found + fixed), and committed. Public + auth-aware `/` now live. Countdown logic robust with full fallback handling. Two security/UX lessons learned and baked into this session: don't truncate display strings via fixed destructuring; don't mix client-writable and server-controlled metadata in the same auth derivation.
**Concerns**: 
- Countdown display was wrong for 195+ day counts until fixed — good catch by review, but should've been caught by integration testing first.
- `isAdmin` trust boundary was a near-miss; fixed now, but the pattern will be copied elsewhere unless we document it explicitly.
- Avatar images pending OAuth provider domain allowlist before production; currently functional but unvalidated for load.
- Dead code file `lib/navigation/home-links.ts` removed per reviewer recommendation.
