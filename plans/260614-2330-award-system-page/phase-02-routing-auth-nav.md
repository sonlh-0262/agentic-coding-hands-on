# Phase 02 — Routing, auth gating & nav wiring (Track B)

**Owner:** orchestrator. **Status:** ✅ COMPLETE.

## Completed work
- Created `app/he-thong-giai/page.tsx`: server component, force-dynamic, page-level `getCurrentUser()` + redirect('/login') guard.
- Modified `proxy.ts`: removed `/awards` from PUBLIC_PATHS, `/he-thong-giai` stays protected (not in PUBLIC_PATHS).
- Modified `app/_components/home/home-data.ts`: NAV_LINKS + FOOTER_NAV_LINKS "Awards Information" → `/he-thong-giai`.
- Modified `app/_components/home/award-card.tsx`: href → `/he-thong-giai#${slug}`.

## Goal
Stand up the protected `/he-thong-giai` route and repoint existing navigation to it.

## Files to create
- `app/he-thong-giai/page.tsx` — server component. `export const dynamic = "force-dynamic"`.
  Resolve session via `getCurrentUser()` → map to `HomeUser | null` (same mapping as `app/page.tsx`,
  incl. admin from `app_metadata.role`). Render the Track-A composer with `user`.

## Files to modify
- `proxy.ts` — keep `/he-thong-giai` OUT of `PUBLIC_PATHS` (protected by default → redirect to `/login`).
  Remove now-orphaned `/awards` from `PUBLIC_PATHS`. Update the doc comment.
- `app/_components/home/home-data.ts` — `NAV_LINKS` "Awards Information" href `/awards` → `/he-thong-giai`;
  `FOOTER_NAV_LINKS` same. (Active-state handling stays as-is for homepage.)
- `app/_components/home/award-card.tsx` — `href={`/awards#${slug}`}` → `href={`/he-thong-giai#${slug}`}`.

## Acceptance
- Logged-out visit to `/he-thong-giai` → 302 `/login` (test ID-1).
- Logged-in visit → page renders (ID-0). Homepage cards + nav resolve to `/he-thong-giai#<slug>`.
- `app/page.tsx` still builds (no change needed there).

## Notes
- Page-level `getCurrentUser()` is the authoritative auth check; proxy is optimistic (matches existing pattern).
