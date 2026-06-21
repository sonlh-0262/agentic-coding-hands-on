# Phase 04 — Translate: login

**Owner:** implementer · **Status:** ✅ complete · **Depends:** 01 · **Parallel with:** 03,05–07

## Scope (namespace `login`, ~11 strings)
Files: `app/login/page.tsx` (metadata → may defer to `metadata` ns / Phase 08),
`app/login/_components/login-client.tsx` ("Đăng nhập thất bại..."), `hero-content.tsx`
(welcome text), `login-header.tsx` (aria-labels, flag/logo alt, "Switch language"),
`google-login-button.tsx` ("LOGIN With Google" + aria), `login-footer.tsx` (copyright → `common`).

## Pattern
Follow the shared pattern in phase-03. Client components use `useTranslations('login')`;
server components use `getTranslations('login')`. Copyright/flag alt → `common` namespace.
Page `metadata` strings: coordinate with Phase 08 (use `metadata` namespace + `generateMetadata`).

## Success criteria
- ✅ Login page fully translated; both catalogs matching keys.
- ✅ No hardcoded copy left.

## Delivered artifacts
- `messages/{vi,en}/login.json` catalogs populated (~11 keys: login errors, button labels, aria-labels, welcome text).
- Login components converted to use `useTranslations('login')` / `getTranslations('login')`.
- Shared words (flag alt, copyright) moved to `common` namespace.
- Page metadata deferred to Phase 08 / `metadata` namespace.
