/**
 * i18n locale configuration (next-intl, cookie-based, no URL routing).
 *
 * Locale is persisted in the `NEXT_LOCALE` cookie and read server-side in
 * `i18n/request.ts`. URLs never carry a locale prefix.
 */

export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

/** Cookie that stores the active locale. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Message namespaces. Each maps to `messages/<locale>/<namespace>.json`.
 * Split per feature area so translation work can proceed in parallel without
 * write conflicts on a single catalog file.
 */
export const NAMESPACES = [
  "common",
  "metadata",
  "home",
  "login",
  "kudos",
  "awards",
  "profile",
] as const;
export type Namespace = (typeof NAMESPACES)[number];

export function isValidLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
