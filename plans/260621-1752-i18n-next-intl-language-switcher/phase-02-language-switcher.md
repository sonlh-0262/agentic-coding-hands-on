# Phase 02 — Language-switcher UI + locale switch

**Owner:** implementer · **Status:** ✅ complete · **Depends:** 01

## Goal
Restyle the existing `app/_components/home/language-switcher.tsx` dropdown to match the
MoMorph design AND wire it to actually change locale via next-intl.

## Design (MoMorph hUyaaugye2 — authoritative)
- Dropdown rows show **flag + language code** ("VN" / "EN"), NOT full text labels.
- Selected row highlighted (dark-gray bg); other option on near-black bg; rounded container.
- Item box ~110×56px. Fetch exact colors/sizes/radius from MoMorph design data.
- Trigger keeps flag + current code + chevron.

## Behavior
- Reflect the ACTIVE locale from next-intl (`useLocale()`), not local useState.
- On select: call `setLocale('vi'|'en')` server action inside `startTransition`, then
  `router.refresh()`. Close dropdown. Keep existing keyboard a11y + click-outside.
- VN ↔ `vi`, EN ↔ `en`.

## Assets
- Need an EN/UK flag asset (only `public/home/flag-vn.svg` exists). Fetch the flag from
  MoMorph design media, or add a `public/home/flag-en.svg` (UK flag). Flag VN reuse existing.

## Success criteria
- ✅ Dropdown visually matches design (flag+code, selected highlight).
- ✅ Clicking EN/VN switches app language end-to-end, persists via cookie, reflects active locale.

## Delivered artifacts
- `app/_components/home/language-switcher.tsx` restyled with flag + code labels, selected highlight.
- Wired to `setLocale` server action + `router.refresh()` inside `startTransition`.
- Added `public/home/flag-en.svg` (EN flag asset).
- Keyboard a11y + click-outside close preserved.

## Deferred / follow-ups
- **I-2 (Login-page LanguageSwitcher):** Login-header language-switcher remains a non-functional stub per user scope decision. Candidate for future follow-up.

## Refs
- MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2
- Clarifications: plans/260621-1752-i18n-next-intl-language-switcher/clarifications.md
