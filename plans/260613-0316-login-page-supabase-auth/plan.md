# Plan — Login Page (/login) + Supabase Google OAuth

**Screen:** Login — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
**Decisions:** see [clarifications.md](./clarifications.md)
**Stack:** Next.js 16.2.9 (App Router) · React 19 · Tailwind v4 · TS · `@supabase/ssr` (hosted cloud project)

## Key constraints (Next.js 16 breaking changes — verified in bundled docs)
- Route protection lives in **`proxy.ts`** (root), NOT `middleware.ts`. Node.js runtime. `config.matcher` unchanged.
- `cookies()` from `next/headers` is **async** → `await cookies()`.
- Supabase Google provider + OAuth credentials are configured in the **hosted Supabase dashboard** (not config.toml); app only needs URL + anon key. Creds = user-supplied placeholders.

## Track A — UI (DONE, background `implementer`)
Presentational components in `app/login/_components/` + assets in `public/login/`. ✅ built.
⚠️ Gap: no `app/login/page.tsx` assembled yet; layout is fixed-1440px (not fluid). Finished in Phase 3.

## Track B — Auth backend + integration (orchestrator)

| Phase | Title | Status |
|-------|-------|--------|
| 01 | [Supabase foundation](./phase-01-supabase-foundation.md) — deps, env, clients, proxy | ✅ DONE |
| 02 | [Auth flow](./phase-02-auth-flow.md) — OAuth callback, sign-out, login client wiring | ✅ DONE |
| 03 | [Integration & home protection](./phase-03-integration.md) — assemble /login, protect & build `/` | ✅ DONE |
| 04 | [Temper & inspect](./phase-04-temper-inspect.md) — tester + reviewer | ✅ DONE |

## Out of scope (per clarifications)
- Functional language dropdown / VN-EN i18n (static button only)
- Email/password auth (design is Google-OAuth only)
- Fully fluid responsive redesign (keep Figma fixed layout; add basic scaling only)

## Acceptance (from test cases)
- Unauthenticated → sees /login. Authenticated → /login redirects to `/`.
- `/` protected: unauthenticated → redirect to /login.
- Login button → Google OAuth; disabled + spinner while authenticating; on success → session + redirect to `/`.
- Logout → redirect to /login.
- Header logo left, VN switcher right (static), footer copyright, ROOT FURTHER hero, background artwork.
