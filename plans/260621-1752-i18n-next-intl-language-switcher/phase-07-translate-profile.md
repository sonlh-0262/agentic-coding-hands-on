# Phase 07 — Translate: profile

**Owner:** implementer · **Status:** ✅ complete · **Depends:** 01 · **Parallel with:** 03–06

## Scope (namespace `profile`, ~29 strings)
Files: `app/_components/profile/*` — `profile-page-client.tsx`, `profile-hero-section.tsx`,
`profile-stats-section.tsx`, `profile-awards-header.tsx`, `profile-kudo-card.tsx`, and display
strings in `profile-mock-data.ts` (department, title, statusLabel enums like "Spam",
"IDOL GIỚI TRẺ"). `profile/page.tsx` is logic-only.

## Pattern
Follow shared pattern in phase-03 (`useTranslations('profile')` / `getTranslations('profile')`).
For enum-like status labels in mock data: translate via keyed lookup (`profile.status.<key>`),
keep the enum key itself in the data. Stats/section headings → `profile` ns.

## Success criteria
- ✅ Profile page fully translated in both locales.
- ✅ Both catalogs matching keys.

## Delivered artifacts
- `messages/{vi,en}/profile.json` catalogs populated (~29 keys: stats labels, section headings, status enums, kudos card copy).
- Profile components converted to use `useTranslations('profile')` / `getTranslations('profile')`.
- Enum status labels in `profile-mock-data.ts` wired to keyed catalog lookup (e.g., `profile.status.<key>`).
- "Ẩn danh" (Anonymous) data-layer fallback included in profile translation.
