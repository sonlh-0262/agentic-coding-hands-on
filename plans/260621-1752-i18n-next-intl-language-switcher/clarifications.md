# Clarifications — Language Dropdown + App-wide i18n

Screen: Dropdown-ngôn ngữ (screenId `hUyaaugye2`, fileKey `9ypp4enmFmdK3YAFJLIu6C`)
MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2

## Session 2026-06-21

- Q: Which component does the VN/EN dropdown design apply to? → A: Update the existing `app/_components/home/language-switcher.tsx` (leave login-header switcher as-is)
- Q: How deep should the behavior go (presentational vs real i18n)? → A: Wire REAL i18n — selecting actually switches the whole app language
- Q: Which i18n library/approach? → A: next-intl
- Q: How much to translate now? → A: Entire app now (every user-facing string, vi + en)
- Q: How is locale represented/persisted? → A: Cookie (`NEXT_LOCALE`), no URL prefix (no /vi /en routing)

## Derived constraints
- Default locale: `vi`. Supported: `vi`, `en`.
- next-intl "App Router without i18n routing" + cookie locale read in `getRequestConfig`.
- `@/*` maps to repo root → config at `i18n/`, catalogs at `messages/`.
- proxy.ts (Supabase session) needs NO next-intl middleware (no-routing mode).
