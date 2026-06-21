import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  DEFAULT_LOCALE,
  isValidLocale,
  LOCALE_COOKIE,
  NAMESPACES,
  type Locale,
} from "./locales";

/**
 * next-intl request configuration — "without i18n routing" + cookie locale.
 *
 * Reads the active locale from the `NEXT_LOCALE` cookie (defaulting to `vi`) and
 * assembles the message catalog by merging each namespace file
 * (`messages/<locale>/<namespace>.json`) under its namespace key. Reading the
 * cookie opts routes into dynamic rendering, which is acceptable here (most
 * pages are already request-dynamic for auth).
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;

  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => {
      const mod = await import(`../messages/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    }),
  );

  return {
    locale,
    messages: Object.fromEntries(entries),
  };
});
