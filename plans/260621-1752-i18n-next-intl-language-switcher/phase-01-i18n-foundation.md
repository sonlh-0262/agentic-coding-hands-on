# Phase 01 — i18n foundation (next-intl)

**Owner:** main · **Status:** ✅ complete · **Blocks:** all other phases

## Goal
Stand up next-intl in "without i18n routing" mode with cookie-based locale, plus the
namespace catalog structure every translate phase will fill.

## Steps
1. `npm install next-intl` (v4.x; peer-compatible with Next 16 / React 19).
2. `next.config.ts` — wrap with `createNextIntlPlugin('./i18n/request.ts')`.
3. `i18n/locales.ts` — `export const LOCALES = ['vi','en'] as const; DEFAULT_LOCALE='vi'`; `isValidLocale`.
4. `i18n/request.ts` — `getRequestConfig`: read `NEXT_LOCALE` cookie (`await cookies()`),
   validate, deep-merge all namespace files for that locale, return `{ locale, messages }`.
5. `i18n/actions.ts` — `"use server"` `setLocale(locale)`: validate → `cookieStore.set('NEXT_LOCALE', ...)`
   (1y maxAge, path '/', sameSite lax) → `revalidatePath('/', 'layout')`.
6. `app/layout.tsx` — `const locale = await getLocale()`; `<html lang={locale}>`; wrap body in
   `<NextIntlClientProvider>` (messages auto-provided). Keep existing font vars/metadata.
7. Create namespace catalogs (empty `{}` placeholders to start) for both locales:
   `messages/{vi,en}/{common,metadata,home,login,kudos,awards,profile}.json`.

## Namespace contract (so phases don't collide)
| Namespace | Owner phase | Covers |
|-----------|-------------|--------|
| common | 01 (seed) + any | shared words (Chi tiết, Hủy, Gửi, copyright, flag alts) |
| metadata | 08 | page titles/descriptions |
| home | 03 | home-data.ts + home components |
| login | 04 | login page + components |
| kudos | 05 | kudos components + lib/kudos/validation.ts |
| awards | 06 | awards-data.ts + awards components + he-thong-giai |
| profile | 07 | profile components + profile-mock-data display strings |

Each phase edits ONLY its namespace files (`messages/vi/<ns>.json`, `messages/en/<ns>.json`)
and its own component files → no cross-phase write conflicts.

## Success criteria
- ✅ `next build` compiles with the provider in place.
- ✅ Server & client `getTranslations('common')` / `useTranslations('common')` both resolve.
- ✅ Switching the cookie value flips `<html lang>`.

## Gotchas (from research)
- `cookies()` is async — must await. Reading it forces dynamic rendering (acceptable; many
  pages already `force-dynamic`).
- Locale switch needs BOTH `revalidatePath` (server action) AND `router.refresh()` (client).
- Message import paths use `@/messages/...` (root-mapped).

## Delivered artifacts
- `i18n/{locales,request,actions}.ts` established.
- `next.config.ts` wrapped with createNextIntlPlugin.
- `app/layout.tsx` wired with NextIntlClientProvider, locale via getLocale, dynamic lang attribute, generateMetadata via locale.
- 7 namespace catalogs scaffolded for both locales (vi + en).
