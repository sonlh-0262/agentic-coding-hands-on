# Phase 03 — Integration & scroll-spy behavior (Track A + B)

**Owner:** orchestrator. **Status:** ✅ COMPLETE.

## Completed work
- Composer wired into `app/he-thong-giai/page.tsx` with real `user` from page-level session.
- Scroll-spy verified: IntersectionObserver updates active nav item on scroll; left nav click smooth-scrolls to anchor.
- All 6 award sections render with correct quantities/values; anchor IDs = fixed slugs (top-talent, top-project, top-project-leader, best-manager, signature-2025-creator, mvp).
- Kudos "Chi tiết" → `/kudos` verified.
- Edge cases tested (unknown hash, unavailable link): no JS errors.
- `npm run build` ✓, `npm run lint` ✓ clean; all type/lint errors fixed.

## Goal
Assemble Track-A UI into the real route, replace mock user with the real session, verify behavior.

## Steps
1. Review the background agent's output (files, component tree, props, data interfaces).
2. Confirm composer wired into `app/he-thong-giai/page.tsx` with real `user` (from phase 02).
3. Verify scroll-spy: IntersectionObserver updates active nav item on scroll; click smooth-scrolls
   and sets active (test ID-9/10/11). Confirm anchor IDs match the 6 fixed slugs.
4. Verify Kudos "Chi tiết" → `/kudos` (ID-12).
5. Edge cases (ID-13/14): unknown hash / unavailable link cause no JS error; graceful behavior.
6. `npm run build` + `npm run lint` clean; fix type/lint errors.

## Acceptance
- Full page renders with all 6 awards, correct values, no console errors.
- All FUNCTION test cases (ID-9..14) behave as specified.
