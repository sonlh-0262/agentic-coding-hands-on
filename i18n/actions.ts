"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isValidLocale, LOCALE_COOKIE } from "./locales";

/**
 * Persists the chosen locale in the `NEXT_LOCALE` cookie and revalidates the
 * layout so server components re-render with the new language. The client must
 * also call `router.refresh()` after this resolves (no-routing mode requirement).
 */
export async function setLocale(locale: string): Promise<void> {
  if (!isValidLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/", "layout");
}
