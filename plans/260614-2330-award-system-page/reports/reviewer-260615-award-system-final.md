# Final Code Review — Award System Page

**Date:** 2026-06-15
**Branch:** feat/award-system-page
**Commit:** 6a43e61
**Reviewer:** Reviewer Agent (Staff Engineer)

---

## Scope

| File | LOC | Status |
|---|---|---|
| app/_components/home/site-header.tsx | 122 | Reviewed |
| app/_components/home/site-footer.tsx | 86 | Reviewed |
| app/_components/home/home-data.ts | 115 | Reviewed |
| app/_components/awards/awards-hero.tsx | 93 | Reviewed |
| app/_components/awards/award-system-client.tsx | 56 | Reviewed |
| app/_components/awards/awards-body.tsx | 113 | Reviewed |
| app/_components/awards/awards-nav.tsx | 82 | Reviewed |
| app/_components/awards/award-detail-section.tsx | 171 | Reviewed |
| app/_components/awards/award-quantity-row.tsx | 62 | Reviewed |
| app/_components/awards/award-value-block.tsx | 103 | Reviewed |
| app/_components/awards/awards-data.ts | 161 | Reviewed |
| app/he-thong-giai/page.tsx | 44 | Reviewed |
| proxy.ts | 60 | Reviewed |

**Build:** `npm run build` — PASS (clean, zero errors, zero TypeScript errors)
**Lint:** `npm run lint` — PASS (no output, clean)

---

## Overall Assessment

Feature is in production-ready shape. The two unreviewed change sets are both sound. Auth protection is defense-in-depth (proxy + page-level check). Code conventions are consistent with the existing codebase. No security issues, no regressions found.

---

## Post-Review Change Set Assessment

### Change Set 1 — Route-aware active nav (`site-header.tsx`, `site-footer.tsx`, `home-data.ts`)

**Sound.** The fix is correct and avoids the prior hardcoded-`active` bug:

- Both header and footer are already marked `"use client"` and live inside `"use client"` parent components (`home-client.tsx`, `award-system-client.tsx`), so adding `usePathname()` introduces no SSR/hydration concern. The hook call is purely client-side and the parent boundary is already established.
- Exact-match comparison (`pathname === link.href`) is correct for this URL topology: `/` vs `/he-thong-giai` are non-overlapping strings. No path prefix ambiguity.
- The stale `active?: boolean` field was retained on the `NavLink` interface but is no longer populated. This is a minor dead-field smell, not a bug — the field is optional and will typecheck fine.
- Removing the hardcoded `active: true` from `FOOTER_NAV_LINKS` (which previously had "Awards Information" always highlighted) was the right correction — the old behavior would have shown "Awards Information" as active even on the homepage.

### Change Set 2 — Hero rebuild (`awards-hero.tsx`)

**Sound.** Full audit:

- Asset references: `/home/keyvisual-bg.png` and `/home/root-further-logo.png` both verified to exist in `public/home/`. No reference to the deleted `/awards/keyvisual-bg.png` anywhere in the codebase.
- Background div is `aria-hidden="true"` — correct for decorative art.
- Wordmark `<Image>` carries `alt="Root Further"` — sufficient for a brand mark.
- `<h1 id="awards-hero-title">` is referenced by `<section aria-labelledby="awards-hero-title">` — region labeling correct.
- `priority` on the wordmark Image is appropriate for LCP.
- The `style={{ width: "300px", height: "auto" }}` override on the Image coexists with the `width={300} height={133}` props — Next.js Image requires intrinsic dimensions for layout reservation even when `height: auto` is set in style, so this is valid.

---

## Critical Issues

None.

---

## Important Issues

None.

---

## Minor Issues

### M1 — Stale `active?: boolean` field on `NavLink` interface (`home-data.ts:9`)

The field is no longer populated anywhere now that active state is route-derived. It remains as dead optional interface surface. Risk: a future developer may reintroduce hardcoded `active` values not realizing the field is no longer read.

**Recommended fix:** Remove the `active?: boolean` from the `NavLink` interface and add a comment on the array noting active state is computed at render time.

### M2 — `aria-current={isActive ? true : undefined}` in `awards-nav.tsx:49`

ARIA spec for `aria-current` accepts the token `"true"` (string) or boolean `true` for the generic "current" meaning, but the more semantically precise value for a navigation item pointing to the current section anchor would be `aria-current="location"`. The boolean `true` maps to `"true"` in the DOM and is not wrong — assistive technology handles it — but `"location"` is the intended token for within-page scroll-spy navigation.

This is low priority: no screen reader will break on `aria-current={true}`. Worth noting for semantic hygiene.

### M3 — Hardcoded 700 ms scroll-lock timeout in `awards-body.tsx:79`

`scrollTimeoutRef.current = setTimeout(() => { isScrollingRef.current = false; }, 700)` — the timeout is a heuristic. On very slow devices or with many anchors far apart, 700 ms may expire before the smooth-scroll completes, re-enabling the observer while still in motion and causing a flicker. The existing behavior is acceptable for most devices, but a `scrollend` event listener (now widely supported) would be more reliable. Out of scope for this review cycle; flag for future hardening.

---

## Edge Cases Found

**Scroll-spy first section edge case** — `AwardsBody` initializes `activeSlug` to `AWARDS_LIST[0].slug` ("top-talent"). If the user arrives at `/he-thong-giai#mvp` directly (deep link), the page scrolls to the `mvp` anchor, but the IntersectionObserver may not fire immediately in the same tick, leaving the nav showing "Top Talent" active briefly until the observer catches up. This is a cosmetic flicker, not a functional bug — the observer will correct it within one animation frame.

**`/kudos` and `/criteria` nav items** — Both routes are listed as nav links but return 404 (not yet built). The proxy explicitly allowlists them to avoid bouncing logged-out visitors. The 404 behavior is intentional and documented in comments. No action required — just flagging for completeness.

---

## Positive Observations

- Defense-in-depth auth pattern is solid: proxy does optimistic redirect, page-level `getCurrentUser()` is the authoritative check with explicit redirect, and `dynamic = "force-dynamic"` prevents any stale cached response from ever serving a protected page to a logged-out visitor.
- `scrollMarginTop: "96px"` on each award section accounts correctly for the 80 px fixed header plus a 16 px visual gap — hash-scroll anchors will not be hidden behind the nav.
- `isScrollingRef` suppression pattern in the IntersectionObserver callback correctly prevents active-indicator flicker during programmatic smooth scrolls.
- Asset hygiene: the hero rebuild reuses `/home/` assets rather than duplicating them, keeping the `public/` tree clean.
- All files are under the 200-line convention limit.

---

## Recommended Actions

1. (Minor) Remove `active?: boolean` from `NavLink` in `home-data.ts` and leave a comment noting active state is runtime-derived.
2. (Minor) Consider `aria-current="location"` instead of `aria-current={true}` in `awards-nav.tsx` for semantic precision.
3. (Future) Replace the 700 ms scroll-lock timeout with a `scrollend` event listener for robust scroll-spy suppression.

---

## Metrics

- TypeScript errors: 0
- Lint issues: 0
- Files over 200 lines: 0
- Build: PASS

---

## Verdict

**9/10** — The two post-review change sets are both correct and well-implemented. No critical or important issues remain. Three minor findings (dead interface field, `aria-current` token semantics, heuristic scroll timeout) are all low-stakes and none blocks deploy. Feature is production-ready.

**Status:** DONE
