# Phase 01 — Track A: UI (presentational)

**Owner:** background `implementer` agent · **Status:** ✓ complete

## Goal
Code the prelaunch screen UI pixel-faithfully from MoMorph design `8PJQswPZmU`:
full-screen decorative background + dark overlay, centered title
"Sự kiện sẽ bắt đầu sau", and three LED/7-segment digit units (DAYS / HOURS / MINUTES).

## Out of scope
- Timer logic, data fetching, auth, routing (Track B owns these).
- Reimplementing `padded` — import from `@/lib/event/countdown`.

## Integration contract
- Presentational component accepts pre-formatted 2-char digit strings (or a `Remaining`).
- Lives under `app/_components/prelaunch/`. Renders statically with design mock values.

## Deliverables
- [x] `app/_components/prelaunch/prelaunch-countdown.tsx` — presentational countdown display (LED digits + labels)
- [x] `app/_components/prelaunch/prelaunch-page.tsx` — layout wrapper
- [x] `app/globals.css` — added `@font-face` for digital-numbers font
- [x] `public/prelaunch/bg.png` — full-screen decorative background
- [x] `public/fonts/digital-numbers.woff` — LED digit font asset

## Deferred (non-blocking)
- Font fallback optimization (woff2 variant) — deferred for post-launch iteration
- Make `remaining` prop required instead of optional — usability debt, safe to defer
- Inline padding refinement — cosmetic, resolved via visual validation

## MoMorph refs:
- Countdown - Prelaunch page: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU
- Clarifications: plans/260621-1647-countdown-prelaunch-page/clarifications.md
