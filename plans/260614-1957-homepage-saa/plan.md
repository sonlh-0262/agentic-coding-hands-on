# Homepage SAA (/) — Implementation Plan

**Screen:** Homepage SAA — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
**Discipline:** interactive · **Pattern:** MoMorph two-track (A=UI background, B=backend main)
**Clarifications:** [clarifications.md](clarifications.md)

## Goal
Build the public, auth-aware SAA homepage at `/`: hero with ROOT FURTHER + live countdown,
awards grid (6 cards), Sun* Kudos block, header/footer nav, floating widget button.
Pixel-faithful to Figma; mock content from the design; real auth state + countdown wiring.

## Decisions (from clarifications)
- Access: **public + auth-aware** — anyone views `/`; bell + account menu only when logged in.
- Nav targets (Awards Information, Sun* Kudos, Admin, Profile): **placeholder hrefs**, pages not built.
- Interactivity: **menus open/close + keyboard a11y**; NO real i18n; notifications mocked empty.
- Countdown: `NEXT_PUBLIC_EVENT_DATETIME` (ISO-8601) + fixed future fallback.

## Integration contract
`app/page.tsx` (Track B, server) renders `<HomeClient>` (Track A, client) with props:
```ts
type HomeUser = { name: string; email: string; avatarUrl?: string; isAdmin: boolean };
interface HomeClientProps { user: HomeUser | null; eventDatetime: string }
```

## Phases
| # | Track | Phase | Status |
|---|-------|-------|--------|
| 01 | A (UI) | [Presentational + interactive UI components](phase-01-ui-track.md) | ✅ complete (14 components + home-data) |
| 02 | B (logic) | [Public access, page wiring, countdown, nav config](phase-02-backend-track.md) | ✅ complete (page.tsx, proxy.ts, countdown.ts, env) |
| 03 | — | [Integration: real auth + countdown into UI](phase-03-integration.md) | ✅ complete (tests 33/33, build green) |
| 04 | — | [Temper + inspect + deliver](phase-04-temper-inspect.md) | ✅ complete (H2 fixed, reviewed, committed) |

## Key files
- Create: `app/_components/home/*` (Track A), `lib/event/countdown.ts`, `lib/navigation/home-links.ts` (Track B)
- Modify: `app/page.tsx`, `proxy.ts`, `.env.example`, `next.config.ts` (only if remote images needed — assets are local, so likely none)
- Assets: `public/home/*` (already downloaded, 22 files)

## Deferred / Follow-ups
1. **AccountMenu arrow-key ARIA nav** (M3): Tab navigation works; arrow-key traversal deferred (WCAG 2.5.3 pattern, not 2.1 hard requirement).
2. **Countdown "Digital Numbers" segmented font** (cosmetic): Font not loaded in Figma design; countdown renders with system font fallback.
3. **Avatar uses `<img>` instead of remote image service** (security allowlist unknown): OAuth provider domain allowlist to be determined before production.
