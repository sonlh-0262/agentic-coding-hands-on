# Phase 03 — Translate: home

**Owner:** implementer · **Status:** ✅ complete · **Depends:** 01 · **Parallel with:** 04–07

## Scope (namespace `home`, ~60 strings)
Files: `app/_components/home/home-data.ts` (~30: NAV_LINKS, AWARD_CARDS titles+descriptions,
ROOT_FURTHER_PARAGRAPHS, ENGLISH_PROVERB, EVENT_INFO, KUDOS_CONTENT), `site-header.tsx`,
`site-footer.tsx`, `hero-section.tsx`, `countdown-timer.tsx` (DAYS/HOURS/MINUTES),
`awards-section.tsx`, `award-card.tsx`, `kudos-section.tsx`, `root-further-section.tsx`,
`account-menu.tsx`, `widget-button.tsx`, `notification-button.tsx`.

## Pattern (all translate phases follow this)
1. Extract each Vietnamese string into `messages/vi/home.json` (key by component/role).
2. Provide the English equivalent in `messages/en/home.json` (same keys).
3. Replace literals: client components → `const t = useTranslations('home'); t('key')`;
   server components → `const t = await getTranslations('home')`. Data files holding copy →
   convert to keys consumed via `t()` at the component (don't translate inside the data module;
   move display copy to catalogs, keep structural data — slugs/routes/counts — in the data file).
4. Shared words (Chi tiết, copyright, flag alt) go in `common` namespace, not `home`.
5. Keep routes/slugs in English; translate only labels. Don't touch the countdown LOGIC.

## Success criteria
- ✅ No hardcoded user-facing Vietnamese left in home files.
- ✅ Both catalogs have matching keys (vi/en parity verified).
- ✅ Home renders identically in `vi`; `en` shows English copy.

## Delivered artifacts
- `messages/{vi,en}/home.json` catalogs populated with ~60 keys (NAV_LINKS, AWARD_CARDS, PROVERB, KUDOS_CONTENT, etc.).
- Home components converted to use `useTranslations('home')` (client) / `getTranslations('home')` (server).
- Structural data (slugs/routes) kept in `home-data.ts`; display copy moved to message catalogs.
