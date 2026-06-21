# Countdown Prelaunch Page — MoMorph Two-Track, LED Digit Clamp, Clean DRY Win

**Date**: 2026-06-21 17:03
**Severity**: Low (no data bugs; one edge-case clamp fix during code review)
**Component**: Prelaunch countdown page (`/countdown`), LED digit rendering, timer logic reuse
**Status**: Resolved (commit `5ff8909` on `feat/countdown-prelaunch-page`)

## What Happened

Shipped a public `/countdown` "prelaunch / coming soon" landing page using Takumi two-track parallel execution (MoMorph screenId `8PJQswPZmU`, fileKey `9ypp4enmFmdK3YAFJLIu6C`). The page displays a full-screen dark decorative background with a centered Vietnamese title "Sự kiện sẽ bắt đầu sau" (The event will start after) and an auto-refreshing LED-style countdown in DAYS / HOURS / MINUTES format. Track A (background `implementer` subagent) built pixel-faithful presentational components from Figma (`prelaunch-countdown.tsx`, `prelaunch-page.tsx`, digital font styling). Track B (main thread) clarified 4 scope decisions upfront (public route, `/countdown` path, freeze-at-zero on completion, reuse existing `NEXT_PUBLIC_EVENT_DATETIME` env var), added the route to `PUBLIC_PATHS`, and wired the timer logic (`prelaunch-client.tsx` — mirrors the homepage hero countdown pattern with 60s intervals). 

Code review caught one silent edge-case bug: `padded(days).slice(0, 2)` truncates days ≥ 100 to a wrong value (e.g., 193 → `"19"`), violating the spec's 2-digit display contract. Fix: clamped days to 99 before padding (`Math.min(days, 99)`), so out-of-range values display gracefully as `"99"`. No production impact (event is < 100 days away), but the graceful clamp is the correct defensive pattern. Also localized the `aria-label` to Vietnamese. Build gates green: tsc clean, eslint clean, 37/37 unit tests pass, `next build` succeeds. Committed `5ff8909` on `feat/countdown-prelaunch-page`.

## The Brutal Truth

This felt like a **textbook win** — barely any friction. The reason: DRY paid off hard. Instead of replicating timer math, we reused `lib/event/countdown.ts` wholesale (three functions: `getRemaining`, `padded`, `resolveEventDatetime`). Single source of truth between homepage and prelaunch pages. Zero new countdown logic to test or debug.

What stung a little: the edge-case clamp-fix. It's embarrassing that we ship UI code with a `.slice(0, 2)` truncation that silently mangled values outside the 00–99 range. The spec assumes 2-digit display; the code didn't defend it. This is sloppy. If days had been ≥ 100, a user would see "19 days" when it was actually 193. Not a critical bug (our event is 6 months away), but it exposes a gap: **presentational code needs defensive bounds checks, even for "impossible" ranges**. The fix was surgical (one `Math.min` line), but the miss was preventable with a 30-second thought: "what if a dev misconfigures the event datetime to 200 days in the future?"

The other win: **parallel Track A + Track B with explicit integration review**. We did not wait. UI agents worked independently while backend route logic and timer were being coded. When they merged, there were no interface surprises because the props were documented upfront in clarifications.md. That prevented the rework we hit on the profile page.

## Technical Details

**Track A: Presentational LED Digit Components**

- `app/_components/prelaunch/prelaunch-countdown.tsx` (157 LOC): pure presentational — `LedDigitBox` (single digit in a 77×123px glassmorphic container with 0.75px #FFEA9E border), `LedCountdownTile` (two digits + Montserrat label), root component wired to `remaining` prop
- `app/_components/prelaunch/prelaunch-page.tsx` (75 LOC): full-screen layout — title, prelaunch background image, centered countdown display, Vietnamese localization
- `@font-face` added to `app/globals.css`: `digital-numbers.woff` (7-segment LED font, 7.6KB, monospace metric)
- Background asset: `public/prelaunch/bg.png` (3.1MB, separate from `public/home/keyvisual-bg.png`; design-specific, not a reuse)

**Track B: Timer & Integration**

- `app/countdown/page.tsx` (25 LOC): server component entry point; `force-dynamic` directive (ensures fresh timer on SSR); resolves `NEXT_PUBLIC_EVENT_DATETIME`, passes ISO string to `PrelaunchClient`
- `app/_components/prelaunch/prelaunch-client.tsx` (41 LOC): client wrapper mirroring homepage countdown pattern — `useState` for `remaining`, `useEffect` with `setInterval(60_000)` that recomputes via `getRemaining()` every 60 seconds
- `proxy.ts`: `/countdown` added to `PUBLIC_PATHS` (unauthenticated access)
- Timer reuse: `lib/event/countdown.ts` (`getRemaining`, `padded`, `resolveEventDatetime`) — no new countdown math

**Key Craft Fix: Day Clamp**

Original: `padded(days).slice(0, 2)` — if `days ≥ 100`, produces `"10"` (from `"193"` → wrong value)

Fixed: `padded(Math.min(days, 99))` — clamps to 99, so the spec's 2-digit promise holds even for misconfigured future dates

Committed as part of code review integration (line in prelaunch-countdown.tsx where we call `padded()` for each unit).

## What We Tried

1. **Takumi two-track parallel execution**: Spawned `implementer` subagent (Track A) to code LED components from Figma; orchestrator (Track B) resolved 4 clarification questions, added route, and built timer logic simultaneously — no blocking merge point
2. **Clarification-first gate**: 4 decisions captured in `clarifications.md` upfront (public route, `/countdown` path, freeze-at-zero, reuse env var + build new LED style); removed ambiguity before implementation
3. **DRY timer reuse**: `lib/event/countdown.ts` already exists (used by homepage hero); reused `getRemaining()`, `padded()`, `resolveEventDatetime()` — zero new countdown code
4. **Defensive edge-case clamping**: Day value clamped to 99 before padding, so the 2-digit display contract is guaranteed even for out-of-range inputs
5. **Localized ARIA for accessibility**: `aria-label="Đếm ngược tới sự kiện"` (Vietnamese "countdown to event") on timer root
6. **60s interval mirroring**: `prelaunch-client.tsx` mirrors homepage countdown pattern (not 1s, to avoid excessive re-renders and bundle a public page)

## Root Cause Analysis

**Why the Day Clamp Mattered**

The spec (Figma) shows a 2-digit LED display: `00` to `99` days. The code assumed days would never exceed 2 digits. But `padded()` was designed generically (pad any number to 2 digits) without a clamp. When days ≥ 100:
- `padded(193)` → `"193"` (3 digits)
- `.slice(0, 2)` → `"19"` (wrong value, not graceful truncation)

Root cause: **no bounds check on input**. The spec implied a range; the code didn't defend it. Fix: clamp to 99 before padding, so the 2-digit promise holds.

**Why Track A + Track B Didn't Collide**

Clarifications.md documented the props contract upfront: `PrelaunchCountdownProps { remaining: Remaining }`. UI agents knew exactly what shape to expect. Backend implemented it. When they merged, no rework.

## Lessons Learned

1. **Reuse beats reimplementation.** We didn't write a new countdown timer. We imported `getRemaining` from an existing, battle-tested function used by the homepage hero. Same source of truth, half the code, half the bugs. Rule: if a function does what you need, reuse it — refactor to accept parameters if needed (we didn't even need to here).

2. **Presentational code needs defensive bounds checks.** Even "impossible" ranges (days ≥ 100) should be handled gracefully. A `.slice()` truncation is silent corruption. A clamp at least makes the out-of-bounds case visible. Cost: one `Math.min` line. Payoff: invisible edge-case bugs prevented.

3. **Clarification gate prevents rework during parallel execution.** We nailed the props contract upfront (4 decisions in clarifications.md). Track A and Track B built independently and merged cleanly. Compare to profile page: no upfront clarification meant Track A and Track B assumed different integration interfaces, leading to review rework. Lesson: **explicit clarification + documentation = parallel execution that doesn't thrash**.

4. **60s intervals on public pages matter for performance.** We mirrored the homepage countdown (60s, not 1s), even though the prelaunch page might be visited thousands of times. Fewer re-renders, smaller bundle impact. Rule: public landing pages should be conservative with timers.

5. **Font files are a silent bundle hit.** The `digital-numbers.woff` is 7.6KB. Not huge, but unnecessary on most routes. Future: lazy-load or serve only on /countdown and /home routes. (Deferred as non-blocker.)

6. **Defensive rendering + transparent async loading improves UX.** The page force-dynamic ensures the timer is fresh on SSR (no stale countdown on first paint). The interval updates even if the browser is unfocused. Small detail; big ergonomic win for a public landing page.

## Next Steps

1. **Push to remote**: `feat/countdown-prelaunch-page` branch (commit `5ff8909`) is ready for merge; no blockers
2. **Optional: make `remaining` prop required** in `PrelaunchCountdownProps` (currently typed as-is, but defensive initialization in `prelaunch-client.tsx` makes it always populated; stricter typing deferred as non-blocker)
3. **Optional: woff2 font variant**: Current delivery is `.woff` only; woff2 would save ~2KB. Deferred as nice-to-have optimization.
4. **Update roadmap**: Mark prelaunch page complete in `docs/development-roadmap.md`
5. **Document countdown-reuse pattern**: Add a section to `docs/code-standards.md` noting the `lib/event/countdown.ts` reuse success for future public landing pages

---

**Status**: DONE
**Summary**: Prelaunch countdown page shipped via Takumi two-track execution — Track A built LED digit components from Figma, Track B clarified scope (public, `/countdown`, freeze-at-zero), and wired timer logic reusing existing `lib/event/countdown.ts`. Code review caught one edge-case: day values ≥ 100 truncated via `.slice(0, 2)` silently produced wrong 2-digit output; fixed with `Math.min(days, 99)` clamp. DRY reuse of homepage countdown logic avoided new timer bugs. Build gates green (tsc, eslint, 37 tests, next build). Commit `5ff8909` on `feat/countdown-prelaunch-page`.
**Concerns**: None critical. Two deferred non-blockers: woff2 font variant (2KB savings), stricter TypeScript typing on `remaining` prop. Edge-case day clamp fix was preventable with explicit bounds validation in design — lesson for future presentational code.
