# Phase 05 — Translate: kudos + validation

**Owner:** implementer · **Status:** ✅ complete · **Depends:** 01 · **Parallel with:** 03,04,06,07

## Scope (namespace `kudos`, ~35 strings)
Files: `app/_components/kudos/*` — `kudos-page-client.tsx`, `viet-kudo-modal.tsx`,
`kudo-recipient-field.tsx`, `kudo-title-field.tsx`, `kudo-message-editor.tsx`,
`kudo-hashtag-field.tsx`, `kudo-image-field.tsx`, `kudo-anonymous-field.tsx`,
`kudo-toolbar.tsx` (button alts), `kudo-mention-dropdown.tsx`, `kudo-feed-card.tsx` ("Từ"/"đến").
Plus `lib/kudos/validation.ts` (~5 error messages).

## Pattern
Follow shared pattern in phase-03 (`useTranslations('kudos')` / `getTranslations('kudos')`).
**Validation messages** in `lib/kudos/validation.ts`: these run outside React. Options —
(a) return message KEYS and translate at the call site, or (b) pass a `t` function in.
Pick the lower-churn option; document which. Toolbar/aria labels → `kudos` ns.

## Success criteria
- ✅ Kudos flow + validation feedback fully translated.
- ✅ Both catalogs matching keys.

## Delivered artifacts
- `messages/{vi,en}/kudos.json` catalogs populated (~35 keys: form labels, validation errors, button alts, "Từ"/"đến" labels).
- Kudos components converted to use `useTranslations('kudos')` / `getTranslations('kudos')`.
- `lib/kudos/validation.ts` error messages: translated via message keys + retrieved at call site (lower-churn approach).
- Server-action error codes included in translation catalog.
