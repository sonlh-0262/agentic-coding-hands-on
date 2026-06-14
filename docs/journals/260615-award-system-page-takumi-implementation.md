# Award System Page Implementation via Takumi — Protected Route, Scroll-Spy Navigation, Parallel Execution

**Date**: 2026-06-15
**Severity**: Medium (1 architectural decision departure, 8 minor code issues fixed in review)
**Component**: Award System page (`/he-thong-giai`), awards/hero-section, scroll-spy nav, auth routing
**Status**: Resolved (commit `5d98bcf`)

## What Happened

Shipped the "Hệ thống giải thưởng SAA 2025" Award System page from MoMorph design (screenId `zFYDgyj_pD`) using the Takumi two-track parallel execution model. Track A (background `implementer` subagent) built presentational UI from Figma (8 components, 600+ lines), while Track B (orchestrator) resolved clarifications, designed auth routing, and handled migration of homepage nav/CTA from orphaned `/awards` path to `/he-thong-giai`. Code review found 8 issues (array keys, link migration, scroll-spy flicker, file size, accessibility); all fixed before commit. Build gates green: tsc, lint, next build, 37/37 tests. Landed commit `5d98bcf` on `feat/award-system-page`.

## The Brutal Truth

This session felt like a "clean" ship — no security bugs, no data corruption, no catastrophic oversights. But it exposed a pattern weakness: a single route migration decision (`/awards` → `/he-thong-giai`) had **four touch points** across the codebase, and the plan enumerated three. The fourth — a CTA link in `hero-section.tsx` — was missed until code review. That's not a major defect (the page still routes correctly), but it's a gap in the planning discipline that would fail hard on a larger migration.

The other frustration is architectural context-switching. The homepage shipped as **public + auth-aware** (unauthenticated users see a login affordance). The Award System page is **purely protected** (logged-out users get a 307 redirect to `/login`). That's the right call per spec, but it means the codebase now has two auth patterns, and the decision was made during clarification without explicitly flagging the departure for future maintainers. Someone will copy the homepage pattern and accidentally leak the awards page to the public.

## Technical Details

**Award System Page Delivery**

- `app/he-thong-giai/page.tsx`: Server component, `force-dynamic`, `getCurrentUser()` → redirect to `/login` if unauthenticated; `<AwardSystemClient>` renders full page
- `app/_components/awards/`: 8 components
  - `award-hero-section.tsx`: Hero image + title + subtitle
  - `award-scroll-spy-nav.tsx`: Scroll-spy nav with IntersectionObserver; tracks active section, prevents flicker via `isScrolling` state
  - `award-details-section-1.tsx` through `award-details-section-6.tsx`: 6 detail sections (value, quantity, presentation timing, etc.) extracted from Figma
  - `award-value-block.tsx`: Renders quantity tile with icon (extracted from 303-line file after review split)
  - `award-quantity-row.tsx`: Renders quantity row (extracted from 303-line file)
- `lib/navigation/home-data.ts`: Added `AWARDS_NAV_ITEMS` array for section navigation
- `public/awards/`: 8 design assets (hero image, section icons, quantity backgrounds)
- Route migration: `/awards` → `/he-thong-giai` updated in:
  1. `home-data.ts` nav array (planned)
  2. `award-card.tsx` CTA href (planned)
  3. `proxy.ts` PUBLIC_PATHS removal (planned)
  4. `hero-section.tsx` CTA link (MISSED IN PLAN, caught in review)

**Auth Routing**

- `app/he-thong-giai/page.tsx` guards with `getCurrentUser()` server call
- If `!user`, return `redirect('/login')` with status 307 (Temporary Redirect)
- Defense-in-depth: auth guard added at page level after review recommendation (previously relied on middleware assumption)
- Departing from homepage public+auth-aware pattern — this page is **private only**

**Scroll-Spy Navigation**

- `award-scroll-spy-nav.tsx` uses IntersectionObserver to track which section is in viewport
- Listens to visibility changes on sentinel divs at top of each section
- On intersection, updates `activeSection` state and scrolls nav to highlight active item
- Bug fix: added `isScrolling` flag to prevent multiple rapid updates during scroll momentum; UI now smooth without flicker

## What We Tried

1. **Takumi two-track parallel execution**: Spawned `implementer` subagent (Track A) to build 8 UI components from Figma; orchestrator (Track B) clarified routing spec, designed auth gate, managed migration in parallel
2. **Clarification-first discipline**: Resolved 3 key gaps upfront — route choice (`/he-thong-giai` per test spec vs `/awards` convention), auth pattern (protected vs public+auth-aware), scroll-spy behavior (click + scroll)
3. **File splitting post-review**: 303-line component split into `award-value-block.tsx` (107 lines) + `award-quantity-row.tsx` (98 lines) + parent (98 lines) to meet size standards
4. **Accessibility hardening**: Fixed aria-current value (was string `"true"`, must be boolean or page-specific); added meaningful list keys (section IDs); alt text review
5. **Scroll-spy flicker fix**: Added `isScrolling` guard to batch intersection changes and prevent rapid state oscillation during momentum scroll
6. **Defense-in-depth routing**: Added explicit `getCurrentUser()` + `redirect()` at page level, not relying on middleware assumptions alone

## Root Cause Analysis

**Route Migration Planning Gap**

The plan identified 3 touch points for `/awards` → `/he-thong-giai` migration: home nav, award card CTA, proxy PUBLIC_PATHS removal. A fourth emerged in review: `hero-section.tsx` has a CTA button linking to awards. The root cause is **plan enumeration bias** — we listed what we knew, not what we could discover via grep. Lesson: after a route migration is planned, grep the entire codebase for the old route before implementation, don't rely on enumeration.

**Architectural Pattern Divergence**

Homepage: public + auth-aware (login affordance for unauthenticated).
Award System: protected (redirect to login).

This is correct per spec and provides choice (some pages are public, some private), but the codebase now has two auth models with no explicit naming or documentation of the difference. When the next page ships, someone will copy one pattern without understanding the trade-off.

Root cause: **architectural decisions made during implementation clarification, not design time**. The clarification questions asked "who can see this?" and answered "authenticated users only," which led to the protected pattern. But the decision wasn't labeled as "departing from homepage convention" and wasn't documented in a visible place. Future maintainers won't know this is a choice, not a default.

## Lessons Learned

1. **Route migrations need grep-based enumeration, not plan-based.** A plan lists known touch points; reality has more. After identifying a migration, search the codebase for all occurrences of the old route before implementation. This applies to any string constant with coupling: environment variable names, CSS class names, API endpoints, etc.

2. **Architectural decisions deserve explicit naming.** We shipped two auth patterns (public+aware, protected) without a document explaining when to use each. Future features will blindly copy one. Create a decision record: "Auth Pattern for Page X: Protected (redirect to /login). See docs/auth-patterns.md for guidance on public+aware vs protected."

3. **Code review found issues that parallel execution missed.** The implementer agent built beautiful UI from Figma, the orchestrator built auth logic, but neither tested their integration. The href link, aria-current string, and file size bloat were invisible until code read. Parallel execution requires explicit integration gates post-completion.

4. **Scroll-spy momentum flicker is a state management smell.** Debouncing intersection changes via `isScrolling` flag is a band-aid. The real issue: IntersectionObserver fires too frequently during scroll. Better fix (for next iteration): batch intersection updates into a single RAF callback, or use `useTransition` to mark intersection changes as non-urgent updates.

5. **Defense-in-depth for auth requires both middleware and page-level guards.** The original design assumed middleware would block unauthenticated users; after review, we added explicit `getCurrentUser()` + `redirect()` at page level. This is correct and necessary. Document this expectation: "All protected pages MUST guard with `getCurrentUser()` + `redirect()` even if middleware provides a fallback."

## Next Steps

1. **Update auth pattern documentation**: Create `docs/auth-patterns.md` explaining public+aware (homepage) vs protected (awards) with decision criteria and examples
2. **Add page-level auth guard to all protected routes**: Audit existing pages to ensure explicit `getCurrentUser()` guard exists, not just middleware assumption
3. **Fix footer nav active state**: `FOOTER_NAV_LINKS` hardcodes `active:true` on "Awards Information" — implement route-aware active state so footer highlights correctly on each page
4. **Refactor scroll-spy via useTransition**: Replace `isScrolling` flag with React 18 `useTransition()` to mark intersection updates as non-urgent; removes flicker without explicit state juggling
5. **Comprehensive route grep audit**: Before next route migration, establish a grep + refactoring checklist to catch all touch points (tests, docs, mocks, old specs, commented-out code, etc.)
6. **Push to remote**: Currently on local `feat/award-system-page` branch (commit `5d98bcf`); ready for remote push and PR creation

---

**Status**: DONE
**Summary**: Award System page (`/he-thong-giai`) shipped via Takumi parallel tracks — Track A built 8 UI components from Figma, Track B clarified auth spec, designed routing, and executed route migration from `/awards`. Code review found 8 issues (file size, link migration, aria accessibility, scroll-spy flicker, redirect guard); all fixed before commit. Build gates green (tsc, lint, next build, 37/37 tests). Key architectural lesson: two auth patterns now exist (public+aware, protected) without explicit documentation — future features will copy blindly. Route migrations need grep-based enumeration, not plan-based.
**Concerns**:
- Route migration plan enumerated 3 touch points; 4th discovered in review (hero CTA link). Grep-based enumeration deferred to next migration.
- Architectural pattern divergence (public+aware vs protected) not documented. Will cause copy-paste bugs on future pages. `docs/auth-patterns.md` needed.
- Scroll-spy flicker fix via `isScrolling` flag is a band-aid; `useTransition` refactor deferred to next iteration.
- Footer nav active state still hardcoded (separate bug, not in scope); noted for follow-up.
