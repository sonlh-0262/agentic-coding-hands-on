# Phase 03 — Integration

**Status:** ✅ COMPLETE

**Goal:** Connect Track A UI with Track B logic; replace any mock auth/countdown with real wiring.

**Outcome:** HomeClient wired to accept real `user` + `eventDatetime` props from `app/page.tsx`. Countdown timer subscribes to `setInterval()` (ticks every 60s). Nav links (awards, kudos, footer routes) configured via `home-data.ts`. Account menu shows Admin Dashboard only when `isAdmin=true` (gated via app_metadata, not user_metadata). Sign-out form posts to `/auth/signout`. All build gates green: `tsc --noEmit` clean, `npm run lint` clean, `npm run build` success.

## Steps
1. As the UI track lands, review `HomeClient` prop usage vs the contract.
2. Confirm `app/page.tsx` passes real `user` + `eventDatetime`; adjust prop shape mismatches.
3. Countdown timer consumes `lib/event/countdown.ts` helpers (or mirrors logic client-side).
4. Nav links resolve from `lib/navigation/home-links.ts` (award slugs → `/awards#<slug>`).
5. Sign-out form posts to existing `/auth/signout`; account menu shows Admin only when `isAdmin`.
6. `npm run lint` + `npx tsc --noEmit` clean; `npm run build` succeeds.

## Success
- Logged out: homepage renders, header shows login affordance, no bell/account menu.
- Logged in: bell + account menu present; admin sees Admin Dashboard.
- Countdown ticks; invalid/missing env falls back without crashing.
