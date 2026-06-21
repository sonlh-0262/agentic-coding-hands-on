# Plan — Language Dropdown + App-wide i18n (next-intl)

**Screen:** Dropdown-ngôn ngữ · screenId `hUyaaugye2` · fileKey `9ypp4enmFmdK3YAFJLIu6C`
**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2
**Discipline:** interactive · large change (~60 files, +1 dependency)
**Research:** [reports/researcher-next-intl-setup.md](reports/researcher-next-intl-setup.md)

## Goal
Make the VN/EN language dropdown (this design) actually switch the entire app's
language via **next-intl**, locale persisted in a **cookie** (no URL prefix). Translate
every user-facing string into `vi` (default) + `en`. Restyle the existing home
language-switcher dropdown to match the design (flag + code rows, selected highlight).

## Key decisions (see clarifications.md)
- next-intl, "without i18n routing", locale from `NEXT_LOCALE` cookie in `getRequestConfig`
- Default `vi`, plus `en`. `@/*` → root, so config in `i18n/`, catalogs in `messages/`
- Per-namespace catalog files (`messages/<locale>/<ns>.json`) merged in request config →
  lets translation phases run in parallel without fighting over one JSON file
- proxy.ts unchanged (no-routing mode needs no next-intl middleware)
- Locale switch = Server Action sets cookie → `revalidatePath('/', 'layout')` + `router.refresh()`

## Phases
| # | Phase | Owner | Parallel? | Status |
|---|-------|-------|-----------|--------|
| 01 | [i18n foundation](phase-01-i18n-foundation.md) (install, config, provider, namespaces) | main | — (blocks rest) | ✅ complete |
| 02 | [Language-switcher UI + locale switch](phase-02-language-switcher.md) | implementer | after 01 | ✅ complete |
| 03 | [Translate: home](phase-03-translate-home.md) | implementer | ∥ group | ✅ complete |
| 04 | [Translate: login](phase-04-translate-login.md) | implementer | ∥ group | ✅ complete |
| 05 | [Translate: kudos + validation](phase-05-translate-kudos.md) | implementer | ∥ group | ✅ complete |
| 06 | [Translate: awards / he-thong-giai](phase-06-translate-awards.md) | implementer | ∥ group | ✅ complete |
| 07 | [Translate: profile](phase-07-translate-profile.md) | implementer | ∥ group | ✅ complete |
| 08 | [Metadata + integration + verify](phase-08-integrate-verify.md) | main | after groups | ✅ complete |

## Dependencies
- Phase 01 establishes the namespace contract; all translate phases depend on it.
- Phases 03–07 are independent (distinct files + distinct namespace catalogs) → parallel forge.
- Phase 02 + 08 wire and verify the locale switch end-to-end.

## Inventory (scope)
217 keys across 7 namespaces (vi/en parity verified). Heaviest: `awards-data.ts` (~50), `home-data.ts` (~30),
kudos form (~35). Namespaces: `common, metadata, home, login, kudos, awards, profile`.

## Deferred / follow-ups
- **I-2 (Login LanguageSwitcher stub):** login-page LanguageSwitcher remains non-functional per user scope decision ("update home switcher only / leave login as-is"). Candidate for future follow-up.
- **N-4 (Message scoping):** NextIntlClientProvider ships all namespaces to client (acceptable at current scale; future improvement: per-page message scoping for performance).
