# Phase 03 — Integration + Verify

**Owner:** main thread · **Status:** ✓ complete

## Goal
Wire Track A presentational UI to Track B live `remaining`; verify against specs + test cases.

## Steps
1. When Track A reports, replace its static mock values with the live `remaining` from
   `prelaunch-client.tsx` (per Track A's documented props/interface).
2. Resolve the background asset (reuse `public/home/keyvisual-bg.png` if it matches THIS
   design, else add a dedicated asset per Track A's report).
3. Compile check (`npx tsc --noEmit` / `next build`), lint.
4. Temper: spawn `tester` — run `lib/event/countdown.test.ts` + any new tests.
5. Inspect: spawn `reviewer`.
6. Deliver: `project-manager` → `doc-writer` → `git-manager`; then `/tkm:write-journal`.

## Verification results
- [x] Wire Track A UI to live `remaining` from `prelaunch-client.tsx`
- [x] Background asset resolved (`public/prelaunch/bg.png`)
- [x] Compile check: `tsc --noEmit` clean
- [x] Lint: `eslint` clean
- [x] Test suite: 37/37 passing
- [x] `next build` succeeds; `/countdown` registered as dynamic route
- [x] Code review completed (reviewer DONE_WITH_CONCERNS)
- [x] Day clamp fixed (corrected to 99 max)
- [x] Aria-label localized to Vietnamese

## Success criteria (from test cases)
- [x] LED display + uppercase white labels for all 3 units
- [x] 2-digit zero-pad: 0→`00`, 9→`09`, 10→`10`; Hours clamp 00–23, Minutes 00–59, invalid→`00`
- [x] Real-time auto-update; freeze at `00` on completion
- [x] Public access (logged-out reachable)
