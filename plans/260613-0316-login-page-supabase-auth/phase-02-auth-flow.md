# Phase 02 — Auth Flow (OAuth callback, sign-out, login wiring)

**Priority:** Blocking · **Status:** ✅ DONE · **Depends on:** Phase 01

## Files to create
- `app/auth/callback/route.ts` — GET handler: read `code` from query, `supabase.auth.exchangeCodeForSession(code)` via server client, redirect to `next` param or `/`. On error → redirect `/login?error=auth`.
- `app/auth/signout/route.ts` — POST handler: `supabase.auth.signOut()`, redirect `/login`. (Route handler so logout works from any page via a form post.)
- `app/login/_components/login-client.tsx` — `"use client"` wrapper:
  - local `loading` state
  - `onLoginClick` → browser client `signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback` } })`; set `loading=true`; on error set error + `loading=false`
  - composes `<LoginBackground/> <LoginHeader/> <HeroContent .../> <LoginFooter/>`
  - passes `loginLoading`/`loginDisabled` to HeroContent's button
  - language switcher: static (`onLanguageClick` no-op or omitted)

## Implementation notes
- OAuth redirect callback must match a redirect URL allowed in the Supabase dashboard (document for user).
- `signInWithOAuth` returns `{ data: { url }, error }`; supabase-js performs the browser redirect automatically when called client-side. Keep `loading` true through the redirect.
- Test case "new tab or popup": default Supabase web OAuth is a full-page redirect, which satisfies "authentication flow starts"; do not force popup.

## Steps
1. callback route handler (read Next 16 route-handlers doc for signature: `export async function GET(request: Request)` / `NextRequest`).
2. signout route handler.
3. login-client.tsx wiring.
4. typecheck.

## Success criteria
- Clicking login triggers `signInWithOAuth` (network call to Supabase) and button shows spinner/disabled.
- Callback exchanges code and redirects to `/`.
- Sign-out clears session and returns to /login.

## Todo
- [x] auth/callback/route.ts
- [x] auth/signout/route.ts
- [x] login-client.tsx
- [x] typecheck passes
