# Phase 08 — Metadata + integration + verify

**Owner:** main · **Status:** ✅ complete · **Depends:** 02–07

## Steps
1. **Metadata** (namespace `metadata`): convert static `metadata` exports in `app/layout.tsx`,
   `app/login/page.tsx` (and any other page.tsx with metadata) to `generateMetadata()` using
   `getTranslations('metadata')`. Translate title/description pairs.
2. **Catalog audit:** verify `messages/vi/*` and `messages/en/*` have identical key sets per
   namespace (no missing/extra keys, no skew). Script a quick key-diff check.
3. **Compile/lint:** `tsc --noEmit`, `eslint`.
4. **Build:** `next build` succeeds with all locales.
5. **Behavior check:** default renders `vi`; switching to `en` via the dropdown flips all copy
   and `<html lang>`; choice persists across reload + navigation (cookie). Switch back to `vi`.
6. **Temper:** spawn `tester` — run existing suite (`lib/event/countdown.test.ts`); add a key-parity
   test (vi vs en namespace keys match) if cheap.
7. **Inspect:** spawn `reviewer` — focus on missed strings, key-skew, dynamic-rendering/caching of
   the cookie, server-action security, proxy coexistence.
8. **Deliver:** `project-manager` → `doc-writer` → `git-manager`; then `/tkm:write-journal`.

## Success criteria
- ✅ Zero hardcoded user-facing strings remain (spot-checked per area).
- ✅ vi/en key parity verified (217 keys across 7 namespaces).
- ✅ Build green (`next build` passes; all routes dynamic).
- ✅ Locale switch works end-to-end and persists via cookie.
- ✅ tsc clean, eslint clean, 141 tests pass.

## Delivered artifacts
- **Metadata translation:** `generateMetadata` added to `layout.tsx`, `login/page.tsx`, `he-thong-giai/page.tsx`, `kudos/page.tsx`, `profile/page.tsx`.
- **Integration:** vi/en key-parity audit completed; no missing/extra keys.
- **Compile/lint:** tsc + eslint pass.
- **Behavior verification:** locale defaults to `vi`, can switch to `en` via dropdown, persists across reloads/navigation via NEXT_LOCALE cookie.
- **Review pass:** reviewer marked DONE_WITH_CONCERNS (7.5/10); all issues fixed (I-1, I-3, M-1..6, N-5; intentional decisions noted for N-6 nav labels + N-4 client provider scope).

## Deferred / follow-ups
- **N-4 (Message scoping):** NextIntlClientProvider ships all namespaces to client (acceptable at current scale; future improvement: per-page message filtering for performance).
- **N-6 (Nav labels):** Vietnamese nav labels intentionally kept in English + brand label `IDOL GIỚI TRẺ` preserved per source design faithfulness.
