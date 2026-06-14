# Phase 03 — Integration & Home Protection

**Priority:** High · **Status:** ✅ DONE · **Depends on:** Phase 01, 02, Track A UI

## Files to create / modify
- CREATE `app/login/page.tsx` — server component:
  - server client → `supabase.auth.getUser()`; if authenticated → `redirect('/')`
  - else render `<LoginClient/>`
  - `export const metadata = { title: 'Đăng nhập | SAA 2025' }`
- MODIFY `app/page.tsx` — protected home (post-login landing):
  - server client → `getUser()`; if not authenticated → `redirect('/login')` (defense-in-depth alongside proxy)
  - render minimal authenticated home: greeting with user email/name + a sign-out button (form POST to `/auth/signout`)
- VERIFY assembled login layout: confirm components compose correctly; add minimal responsive guards (e.g. wrap fixed canvas in a centered, overflow-safe container) without redesigning. Confirm asset paths resolve.

## Implementation notes
- Defense in depth: proxy does optimistic redirect; page-level `getUser()` is the secure check (per Next 16 auth guide — don't rely on proxy alone).
- Keep `app/page.tsx` minimal — it's a placeholder landing, not the real homepage.
- Preserve existing `app/layout.tsx`; ensure fonts (Montserrat) used by components are available or fall back gracefully.

## Success criteria
- `/login` renders full design (header, hero, ROOT FURTHER, button, footer, background).
- Authenticated visit to `/login` → `/`. Unauthenticated visit to `/` → `/login`.
- Home shows user identity + working sign-out.

## Todo
- [x] app/login/page.tsx (server, redirect-if-authed)
- [x] app/page.tsx protected + sign-out
- [x] layout assembled & assets resolve
- [x] typecheck + dev boot visual check
