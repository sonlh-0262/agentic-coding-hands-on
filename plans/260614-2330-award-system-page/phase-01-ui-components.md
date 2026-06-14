# Phase 01 — Award System UI components (Track A)

**Owner:** background `implementer` agent. **Status:** ✅ COMPLETE.

## Completed work
- All 7 components created under `app/_components/awards/`: awards-data.ts, awards-hero.tsx, awards-nav.tsx, awards-body.tsx, award-detail-section.tsx, award-value-block.tsx, award-quantity-row.tsx, award-system-client.tsx.
- All components <200 lines; kebab-case naming; mock data extracted from Figma design.
- Scroll-spy + flicker guard implemented in awards-body.tsx.
- Composer wired to accept `user: HomeUser | null` and pass to SiteHeader.

## MoMorph refs
- Hệ thống giải thưởng: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
- Clarifications: ./clarifications.md

## Goal
Presentational components under `app/_components/awards/`, pixel-perfect from Figma, mock data from design.

## Scope
- `awards-data.ts` — extracted award content (title, full description, quantity+unit, value(s)), nav labels.
- Hero/keyvisual, sticky left nav (6 items), 6 award detail sections (alternating image side), composer client.
- Reuse `home/kudos-section.tsx`, `SiteHeader`, `SiteFooter`, `WidgetButton`.

## Out of scope (Track B / phase 02–03)
- `page.tsx` route, `proxy.ts`, auth, real session user, homepage link updates.

## Integration contract
- Composer accepts `user: HomeUser | null`, passes to SiteHeader.
- Section anchor IDs = fixed slugs. Scroll-spy active-state held in composer client.
