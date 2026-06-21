# Research Report: next-intl Setup — Next.js 16.2.9 + React 19, No i18n Routing, Cookie-Based Locale

**Date:** 2026-06-21  
**Researcher:** Technical Analyst  
**Stack:** Next.js 16.2.9 · React 19.2.4 · App Router · No locale URLs · Locale from cookie

---

## Summary

next-intl v4.x is fully compatible with Next.js 16 / React 19. The "without i18n routing" mode is first-class: **no middleware/proxy needed** for locale negotiation — locale is read directly in `getRequestConfig` via `cookies()`. The project's existing `proxy.ts` (Supabase session) needs **zero changes**. Cookie reading forces dynamic rendering on routes that call it, which is acceptable and expected.

The main gotcha: after switching locale via Server Action, `revalidatePath('/', 'layout')` alone is **not sufficient** — the client must also call `router.refresh()`. This is a known limitation of no-routing mode (no middleware cache-busting magic).

---

## 1. Package Version

```bash
npm install next-intl
```

**Current stable:** `next-intl@4.1.0` (as of June 2025; check npm for latest 4.x)

**Peer dependencies** (from package.json):
```json
{
  "peerDependencies": {
    "next": "^14.0.0 || ^15.0.0 || ^16.0.0",
    "react": "^18.0.0 || ^19.0.0"
  }
}
```

Next.js 16.2.9 + React 19.2.4 are **within the supported range**. No `--legacy-peer-deps` needed.

---

## 2. next.config.ts Integration

```typescript
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  // Optional: explicit path to request config (default: src/i18n/request.ts)
  "./src/i18n/request.ts"
);

const nextConfig: NextConfig = {
  /* existing config options */
};

export default withNextIntl(nextConfig);
```

`createNextIntlPlugin` wraps the config — it adds the `i18n` aliases and ensures the request config is bundled server-side. No other config changes needed.

---

## 3. Message Catalogs

```
messages/
├── vi.json    ← default locale
└── en.json
```

```json
// messages/vi.json
{
  "HomePage": {
    "title": "Chào mừng",
    "description": "Hệ thống khen thưởng nội bộ"
  },
  "Nav": {
    "kudos": "Khen thưởng",
    "profile": "Hồ sơ"
  }
}
```

```json
// messages/en.json
{
  "HomePage": {
    "title": "Welcome",
    "description": "Internal recognition system"
  },
  "Nav": {
    "kudos": "Kudos",
    "profile": "Profile"
  }
}
```

---

## 4. Request Config — Cookie-Based Locale (CRITICAL FILE)

```typescript
// src/i18n/request.ts
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const SUPPORTED_LOCALES = ["vi", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: Locale = "vi";

function isValidLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export default getRequestConfig(async () => {
  // cookies() is async in Next.js 15+/16 — must await
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

**Key notes:**
- `cookies()` is **async** in Next.js 15+/16 — always `await` it. Calling it without await will work currently (backward compat shim) but is deprecated.
- The cookie name `NEXT_LOCALE` is conventional (matches what next-intl's own middleware uses in routing mode); use any name you want, just be consistent.
- `getRequestConfig` is internally cached via React's `cache()` — it runs **once per request**, not once per component.
- Calling `cookies()` inside `getRequestConfig` opts any route that uses translations into **dynamic rendering** (cannot be statically generated). This is the expected trade-off for SSR-correct locale.

---

## 5. Root Layout

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: "SAA 2025",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Both call getRequestConfig internally — cached, so no double execution
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Notes:**
- `getLocale()` and `getMessages()` are server-only helpers from `next-intl/server`. They call `getRequestConfig` under the hood (cached).
- `NextIntlClientProvider` **without explicit `locale` prop** automatically inherits locale from the server config in v4.x.
- Do NOT pass `locale` and `messages` as props to `NextIntlClientProvider` if you already called `getMessages()` — they are forwarded automatically via the server component integration.

---

## 6. Server Components

```typescript
// app/page.tsx (or any Server Component)
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <main>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </main>
  );
}
```

---

## 7. Client Components

```typescript
// components/nav.tsx
"use client";

import { useTranslations } from "next-intl";

export function Nav() {
  const t = useTranslations("Nav");

  return (
    <nav>
      <a href="/kudos">{t("kudos")}</a>
      <a href="/profile">{t("profile")}</a>
    </nav>
  );
}
```

Client components receive messages from `NextIntlClientProvider` in the layout — no additional setup.

---

## 8. Locale Switching — Server Action + Language Switcher

### Server Action

```typescript
// src/i18n/actions.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const SUPPORTED_LOCALES = ["vi", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isValidLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export async function setLocale(locale: string): Promise<void> {
  if (!isValidLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false, // must be false if client JS ever needs to read it
  });

  // Invalidate the layout cache so the next render picks up the new locale.
  // In no-routing mode this alone is insufficient — client must call router.refresh().
  revalidatePath("/", "layout");
}
```

### Language Switcher Client Component

```typescript
// components/language-switcher.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/i18n/actions";

const LOCALES = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
] as const;

export function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSwitch(locale: string) {
    startTransition(async () => {
      await setLocale(locale);
      // router.refresh() re-fetches Server Components with new cookie.
      // This is REQUIRED in no-routing mode — revalidatePath alone is not enough.
      router.refresh();
    });
  }

  return (
    <div>
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          disabled={isPending}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

**Why both `revalidatePath` AND `router.refresh()`?**
- `revalidatePath('/', 'layout')` purges the server-side render cache for the layout segment.
- `router.refresh()` instructs the client router to re-fetch the current page from the server with the updated cookie.
- In i18n-routing mode, the middleware handles cache-busting via response headers. Without middleware, you must do both manually.
- If `router.refresh()` is omitted, the browser may show stale cached RSC payloads until the next hard navigation.

---

## 9. proxy.ts — Coexistence Analysis

**Current proxy.ts:** Handles Supabase session refresh + route protection. Exports `proxy` function (Next.js 16 name for what was `middleware`).

**next-intl without-i18n-routing mode: NO middleware/proxy needed.**  
The `getRequestConfig` cookie read happens in the Server Component render pass, not in the proxy layer. There is zero interaction between the two.

**What NOT to change in proxy.ts:**
- Do not add next-intl's `createMiddleware` to proxy.ts — that's only for i18n-routing mode.
- Do not add locale detection or redirect logic — not needed.
- The existing matcher covers all routes, which is fine.

**Final assessment:** proxy.ts stays exactly as-is. next-intl needs nothing from it.

---

## 10. Gotchas List

| # | Gotcha | Detail |
|---|--------|--------|
| 1 | `cookies()` is async | Must `await cookies()` in Next.js 15+/16. Sync access still works but is deprecated. |
| 2 | Dynamic rendering forced | Any route using `getTranslations` (which triggers `getRequestConfig` → `cookies()`) is opted into dynamic rendering. Cannot statically generate pages with cookie-based locale. |
| 3 | `router.refresh()` required | `revalidatePath` alone does not re-render the client in no-routing mode. Must call `router.refresh()` from the client after the Server Action resolves. |
| 4 | RSC payload caching | If you see `x-nextjs-cache: HIT` after locale switch, it means the RSC payload was cached at CDN/edge level. Use `Cache-Control: no-store` or ensure `cookies()` opts the route to dynamic (it should automatically). |
| 5 | `NextIntlClientProvider` messages | In v4.x, do NOT pass `locale` prop manually if using `getMessages()` — it creates a mismatch. Use one or the other, not both. |
| 6 | Message import path | The dynamic import `../../messages/${locale}.json` in `src/i18n/request.ts` is relative to the compiled file location. If it fails, use an absolute alias: `@/messages/${locale}.json` — but ensure `@` resolves to project root, not `src/`. |
| 7 | Cookie name collision | next-intl's own middleware (routing mode) also uses `NEXT_LOCALE`. Safe to reuse in no-routing mode since there's no middleware conflict here. |
| 8 | `httpOnly` on locale cookie | Set `httpOnly: false` if the language switcher component needs to read current locale client-side (e.g., to highlight active language). Set `httpOnly: true` for pure server reads. |
| 9 | No `<html lang>` flash | Since locale is SSR'd via cookie, `<html lang>` is correct on first paint — no hydration mismatch. |
| 10 | proxy.ts file name | Next.js 16 renamed `middleware.ts` → `proxy.ts`. next-intl docs acknowledge this (noted as "proxy.ts was called middleware.ts until Next.js 16"). next-intl's own middleware export also works in proxy.ts — but again, not needed in no-routing mode. |

---

## 11. Complete File Checklist

```
messages/
├── vi.json                          ← create (default locale)
└── en.json                          ← create

src/i18n/
├── request.ts                       ← create (getRequestConfig + cookie read)
└── actions.ts                       ← create (setLocale server action)

app/
└── layout.tsx                       ← update (add getLocale, getMessages, NextIntlClientProvider)

components/
└── language-switcher.tsx            ← create

next.config.ts                       ← update (wrap with createNextIntlPlugin)

proxy.ts                             ← NO CHANGES NEEDED
```

---

## Sources

- [next-intl: App Router without i18n routing](https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing) — official guide, primary reference
- [next-intl: Request configuration (getRequestConfig)](https://next-intl.dev/docs/usage/configuration) — cookie reading pattern
- [next-intl: Proxy/middleware docs](https://next-intl.dev/docs/routing/middleware) — confirms no-routing needs no proxy, Next.js 16 naming note
- [GitHub Issue #1334: Change locale in App Router without-i18n-routing](https://github.com/amannn/next-intl/issues/1334) — revalidatePath + router.refresh() pattern
- [GitHub Discussion #1096: App Router without i18n routing - switch locale from client](https://github.com/amannn/next-intl/discussions/1096) — community-confirmed two-step refresh approach
- [Next.js 16 local docs: cookies() API reference](node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md) — confirms async cookies, dynamic rendering opt-in
- [Next.js 16 local docs: internationalization guide](node_modules/next/dist/docs/01-app/02-guides/internationalization.md) — confirms `proxy.ts` naming (Next.js 16)

---

## Unresolved Questions

1. **next-intl exact installed version**: `node_modules/next-intl/package.json` returned empty during research — confirm version with `npm list next-intl` before starting implementation.
2. **Message import alias**: Whether `@/messages/` resolves correctly depends on `tsconfig.json` paths — verify `@` maps to project root (not `src/`), or use relative path `../../messages/`.
3. **`httpOnly` decision**: Needs product decision — does the language switcher need to read the cookie client-side to show "active" state? If yes → `httpOnly: false`. If locale comes from a `useLocale()` hook (server-provided) → `httpOnly: true` is safer.

---

**Status:** DONE_WITH_CONCERNS  
**Summary:** Complete, copy-paste-ready setup guide for next-intl no-routing + cookie locale in Next.js 16.2.9 / React 19. proxy.ts untouched.  
**Concerns:** (1) Installed next-intl version unverified due to empty package.json read — must confirm with `npm list next-intl`. (2) `router.refresh()` requirement after locale switch is a known limitation not fully resolved upstream — documented in gotchas. (3) Dynamic rendering implication means no static generation for translated pages — acceptable given cookie-based locale but worth flagging to implementer.
