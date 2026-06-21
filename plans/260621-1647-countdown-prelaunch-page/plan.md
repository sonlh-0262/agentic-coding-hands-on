# Plan — Countdown Prelaunch Page

**Screen:** Countdown - Prelaunch page · screenId `8PJQswPZmU` · fileKey `9ypp4enmFmdK3YAFJLIu6C`
**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU
**Discipline:** interactive (default) · MoMorph two-track

## Goal
A standalone, public `/countdown` "prelaunch / coming soon" page: full-screen dark
decorative background, centered title "Sự kiện sẽ bắt đầu sau", and an auto-updating
LED-style DAYS / HOURS / MINUTES countdown that freezes at `00` when the event starts.

## Key decisions (see clarifications.md)
- Public route `/countdown` → add to `PUBLIC_PATHS` in `proxy.ts`
- On complete: freeze at `00 / 00 / 00`, no redirect
- Reuse `lib/event/countdown.ts` (`getRemaining`, `padded`, `resolveEventDatetime`) and
  the `NEXT_PUBLIC_EVENT_DATETIME` env var — single source of truth with the home countdown
- LED/7-segment digits faithful to this design (NOT the home glassmorphism style)

## Tracks (run concurrently — no blocking merge point)
| Track | File | Owner | Status |
|-------|------|-------|--------|
| A — UI | [phase-01-ui-track.md](phase-01-ui-track.md) | background `implementer` | ✓ complete |
| B — backend/behavior | [phase-02-backend-track.md](phase-02-backend-track.md) | main thread | ✓ complete |
| Integration + verify | [phase-03-integrate-verify.md](phase-03-integrate-verify.md) | main thread | ✓ complete |

## Dependencies
- Both tracks reuse `lib/event/countdown.ts` — no new timer logic.
- Integration wires the live `remaining` value from Track B into Track A's presentational components.
