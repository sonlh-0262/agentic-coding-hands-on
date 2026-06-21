# Clarifications — Countdown Prelaunch Page

Screen: Countdown - Prelaunch page (screenId `8PJQswPZmU`, fileKey `9ypp4enmFmdK3YAFJLIu6C`)
MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU

## Session 2026-06-21

- Q: Should the prelaunch countdown page be public or auth-protected? → A: Public (no login) — add `/countdown` to `PUBLIC_PATHS` in proxy.ts
- Q: What URL path should the page live at? → A: `/countdown` (app/countdown/page.tsx)
- Q: What happens when the countdown reaches zero? → A: Stay at `00 / 00 / 00` — no redirect, no extra UI (matches spec + test cases)
- Q: Event target time + digit visuals? → A: Reuse existing `NEXT_PUBLIC_EVENT_DATETIME` env var; build new LED/7-segment digits faithful to this design (not the home glassmorphism style)
