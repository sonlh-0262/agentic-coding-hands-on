# Phase 01 — Supabase Foundation

**Priority:** Blocking (all auth depends on it) · **Status:** ✅ DONE

## Overview
Install Supabase SSR deps, set env placeholders, create browser/server clients, and the `proxy.ts` session+route-protection layer.

## Files to create
- `.env.local` (gitignored) and `.env.example`:
  - `NEXT_PUBLIC_SUPABASE_URL=` (placeholder)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=` (placeholder)
- `lib/supabase/client.ts` — `createBrowserClient` (browser, "use client" consumers)
- `lib/supabase/server.ts` — `createServerClient` using `await cookies()` (get/set/remove)
- `lib/supabase/proxy-session.ts` — helper: build response, `createServerClient` bound to req/res cookies, call `supabase.auth.getUser()` to refresh, return `{ response, user }`
- `proxy.ts` (root) — calls helper; enforces:
  - unauthenticated + path `/` (protected) → redirect `/login`
  - authenticated + path `/login` → redirect `/`
  - else `NextResponse.next()` (with refreshed cookies)
  - `export const config = { matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'] }`

## Implementation notes
- Use `@supabase/ssr` `createServerClient` with the `getAll`/`setAll` cookie methods (current API), NOT deprecated `get/set/remove`.
- Verify `@/*` path alias in tsconfig; use it for imports.
- Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` matcher section before finalizing matcher.

## Steps
1. `npm install @supabase/supabase-js @supabase/ssr`
2. Write env files; confirm `.env.local` is gitignored.
3. Browser + server clients.
4. proxy-session helper + `proxy.ts`.
5. `tsc --noEmit` + `next build` smoke (or dev boot) to confirm proxy compiles.

## Success criteria
- App boots; proxy compiles; with empty env, app fails gracefully (clear error) — document that real URL/key are needed to exercise auth.

## Todo
- [x] deps installed
- [x] env files + gitignore check
- [x] client.ts / server.ts
- [x] proxy-session.ts + proxy.ts
- [x] typecheck passes
