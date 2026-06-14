# Phase 01 — Track A: UI Components (background `implementer`)

**Status:** ✅ COMPLETE

**Screen:** Homepage SAA — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
**Clarifications:** plans/260614-1957-homepage-saa/clarifications.md
**Goal:** Code the Homepage SAA UI pixel-faithfully via `momorph-implement-design`, mock data from the design.

**Outcome:** 14 components implemented (site-header, account-menu, notification-button, hero-section, countdown-timer, root-further-section, awards-section, award-card, kudos-section, site-footer, widget-button, language-switcher, home-client, home-data). All reviewable files under 200 lines. Responsive grid (3/2/1 cols). Menus interactive (open/close + keyboard support).

## Owns (create only)
`app/_components/home/` — `home-client.tsx` (composer, "use client"), `site-header.tsx`,
`language-switcher.tsx`, `account-menu.tsx`, `notification-button.tsx`, `hero-section.tsx`,
`countdown-timer.tsx`, `root-further-section.tsx`, `awards-section.tsx`, `award-card.tsx`,
`kudos-section.tsx`, `site-footer.tsx`, `widget-button.tsx`, `home-data.ts`.

## Integration contract (implement to this)
`HomeClient` props: `{ user: { name; email; avatarUrl?; isAdmin } | null; eventDatetime: string }`.
- Header: logged in → bell + account menu; logged out → user icon links to `/login`.
- Account menu items: Profile, Sign out (`<form method="post" action="/auth/signout">`), Admin Dashboard (only if `isAdmin`).
- Countdown: tick each minute from `eventDatetime`; 0-pad; at zero hide "Coming soon", show 00.

## Out of scope (do NOT touch)
`app/page.tsx`, `app/layout.tsx`, `lib/**`, `proxy.ts`, `next.config.ts`, `.env*`.
Real i18n translation, real notification data, building /awards or /kudos pages.

## Assets
Use local files already in `public/home/` (logo, icons, award images, backgrounds). Do not re-download.
