# Phase 02 — Track B: Backend / behavior

**Owner:** main thread · **Status:** ✓ complete

## Goal
Provide the route, server entry, live ticking, and access config for `/countdown` —
reusing existing countdown infrastructure (no new timer math).

## Related code files
- Create: `app/countdown/page.tsx` — server component; resolves `NEXT_PUBLIC_EVENT_DATETIME`
  via `resolveEventDatetime`, renders the client. `export const dynamic = "force-dynamic"`.
- Create: `app/_components/prelaunch/prelaunch-client.tsx` — `"use client"`; holds `remaining`
  state, ticks every 60s via `setInterval` + `getRemaining` (mirrors home-client pattern),
  renders the Track A presentational component.
- Modify: `proxy.ts` — add `/countdown` to `PUBLIC_PATHS`.
- Modify: `.env.example` — note that `/countdown` also consumes `NEXT_PUBLIC_EVENT_DATETIME`.

## Implementation steps
1. Add `/countdown` to `PUBLIC_PATHS`.
2. Build `prelaunch-client.tsx` ticking exactly like `home-client.tsx` (SSR-seeded initial
   value, 60s interval, cleanup). Completion: `getRemaining` already clamps to `00` + `ended`.
3. Build `page.tsx` server entry; no auth gate (public).

## Success criteria
- `/countdown` reachable logged-out; SSR seeds the first frame; values tick down each minute;
  freezes at `00 / 00 / 00` after the target time.

## Deliverables
- [x] `/countdown` added to `PUBLIC_PATHS` in `proxy.ts`
- [x] `app/_components/prelaunch/prelaunch-client.tsx` — client-side ticking (60s interval, reuses `getRemaining`)
- [x] `app/countdown/page.tsx` — server entry point (`force-dynamic`)

## Deferred (non-blocking)
- `.env.example` update for documentation — captured in code comments already
