# Plan — Award System Page (Hệ thống giải thưởng SAA 2025)

MoMorph screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
Decisions: see [clarifications.md](./clarifications.md)

## Goal
Build the protected `/he-thong-giai` page: hero/keyvisual, sticky left nav (6 award
categories, scroll-spy + click), 6 detailed award sections, and reused Sun* Kudos banner.
Wire routing + auth and update homepage links to the new path.

## Two-track structure (per MoMorph protocol)
- **Track A — UI (background `implementer`, IN PROGRESS):** presentational components under
  `app/_components/awards/` built pixel-perfect from Figma with mock data extracted from design.
- **Track B — Routing/behavior (this orchestrator):** route + auth gating, nav-link updates,
  data module, scroll-spy wiring, then incremental integration as Track A lands.

## Phases
| # | Phase | Track | Status | Depends |
|---|-------|-------|--------|---------|
| 01 | [Award System UI components](./phase-01-ui-components.md) | A | ✅ COMPLETE | — |
| 02 | [Routing, auth gating & nav wiring](./phase-02-routing-auth-nav.md) | B | ✅ COMPLETE | — |
| 03 | [Integration & scroll-spy behavior](./phase-03-integration.md) | A+B | ✅ COMPLETE | 01, 02 |
| 04 | [Tempering & Inspection](./phase-04-test-review.md) | — | ✅ COMPLETE | 03 |

Tracks A and B run in parallel; phase 03 is the (soft) integration point.

## Key constraints
- Next.js 16.2.9 — read `node_modules/next/dist/docs/` before route code (breaking changes).
- Tailwind v4 + inline styles for exact Figma px; Montserrat font; gold `rgba(255,234,158,1)`; bg `#00101A`.
- Reuse `SiteHeader`, `SiteFooter`, `WidgetButton`, `KudosSection` — do not duplicate.
- Anchor slugs fixed: top-talent, top-project, top-project-leader, best-manager, signature-2025-creator, mvp.
- Files < 200 lines; kebab-case; no invented data.

## Success criteria
- `/he-thong-giai` renders all 6 awards with correct quantities/values from Figma.
- Unauthenticated → redirect to `/login` (test ID-1); authenticated → page renders (ID-0).
- Left nav click smooth-scrolls + sets active; active follows scroll (ID-9/10/11).
- Kudos "Chi tiết" → `/kudos` (ID-12). No JS errors on edge cases (ID-13/14).
- Homepage "Awards Information" + award cards now deep-link to `/he-thong-giai#<slug>`.
- `npm run build` + lint clean; tests green.
