# Phase 06 — Translate: awards / he-thong-giai

**Owner:** implementer · **Status:** ✅ complete · **Depends:** 01 · **Parallel with:** 03–05,07

## Scope (namespace `awards`, ~61 strings — HEAVIEST)
Files: `app/_components/awards/awards-data.ts` (~50: 6 award definitions — navLabel, title,
long description, quantity/unit, values/notes), `awards-hero.tsx`, `awards-nav.tsx`,
`award-quantity-row.tsx` ("Số lượng giải thưởng:"), `award-value-block.tsx`
("Giá trị giải thưởng:", "Hoặc"). `he-thong-giai/page.tsx` + `award-system-client.tsx` have no copy.

## Pattern
Follow shared pattern in phase-03. The award descriptions are long prose — translate carefully,
keep keys stable (e.g. `awards.items.<slug>.description`). Keep `slug` and route values in the
data file (structural); move display copy (navLabel/title/description/notes) to catalogs.
Components read via `getTranslations('awards')` (mostly server/presentational).

## Success criteria
- ✅ All 6 awards render translated copy in both locales.
- ✅ Both catalogs matching keys; no skew.

## Delivered artifacts
- `messages/{vi,en}/awards.json` catalogs populated (~61 keys: award navLabels, titles, descriptions, unit/value labels, quantity rows).
- `awards-data.ts` structural keys (slugs, routes) preserved; display copy moved to catalogs.
- Awards components converted to use `getTranslations('awards')` (server-first approach).
- he-thong-giai page wired to awards catalog.
