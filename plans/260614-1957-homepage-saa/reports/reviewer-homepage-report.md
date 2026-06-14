# Homepage SAA — Code Review Report

**Reviewer:** reviewer agent  
**Date:** 2026-06-14  
**Branch:** feat/login-supabase-oauth  
**Scope:** Track A (14 UI components) + Track B (page.tsx, proxy.ts, countdown.ts, home-links.ts, .env.example)

---

## Overall Assessment

Implementation is broadly correct and well-structured. The public+auth-aware homepage pattern is sound, force-dynamic prevents stale auth state, and the Supabase `getUser()` call (not `getSession()`) is used correctly throughout. The main concerns are: a security trust-boundary issue with `isAdmin` derivation, a rendering bug with the countdown tile when `days >= 100`, and several accessibility gaps in interactive menus. There are no critical data leaks or SQL injection vectors. TypeScript passes clean with no errors.

---

## Findings by Severity

### Critical

None.

---

### High

#### H1 — `isAdmin` derived from user-controllable `user_metadata.role`
**File:** `app/page.tsx:34-35`

```ts
isAdmin:
  (user.app_metadata?.role as string | undefined) === "admin" ||
  (user.user_metadata?.role as string | undefined) === "admin",
```

`app_metadata` is server-controlled and safe. `user_metadata` is writable by the authenticated user via Supabase's `updateUser()` client-side API. The OR means a regular user can self-promote to admin UI state by patching their own `user_metadata.role` to `"admin"`.

At this point `isAdmin` only gates the "Admin Dashboard" menu item — no actual admin page exists yet — so today's blast radius is cosmetic. But this is a pattern that will propagate: when `/admin` is built, if developers reuse this derivation in the server page to authorize actions, the security hole becomes real.

**Fix:** Drop the `user_metadata.role` branch. Trust only `app_metadata`:
```ts
isAdmin: (user.app_metadata?.role as string | undefined) === "admin",
```

---

#### H2 — Countdown tile silently truncates `days >= 100`
**File:** `app/_components/home/countdown-timer.tsx:47`

```ts
const [d1, d2] = value.split("");
```

`padded()` does not cap at 2 digits — it only zero-pads. When `days=100`, `padded(100)="100"`, `split("")` yields `["1","0","0"]`, array destructuring gives `d1="1"`, `d2="0"`. The third digit `"0"` is silently dropped. The tile displays "10" instead of "100".

The event date is 2026-12-26. Today is 2026-06-14 — that is ~195 days away. The countdown is currently showing a wrong value right now if the env var points at the real event date.

**Fix:** Either cap `days` at 99 and show "99+" for overflow, or change the tile to accept and render a 3-digit string with a third box. The simplest safe fix:
```ts
// In CountdownTile: accept arbitrary-length string, render one box per digit
const digits = value.split("");
```
and map over `digits` instead of destructuring into exactly `d1, d2`.

---

### Medium

#### M1 — `user_metadata.role` check additionally leaks a confused trust model into `HomeUser`
**File:** `app/page.tsx`, `app/_components/home/home-client.tsx`

`HomeUser.isAdmin: boolean` is passed as a client prop, meaning it travels in the serialised RSC payload. This is fine for UI gating. However, the field name `isAdmin` with no qualification encourages future callers to trust it for server-side authorization. A comment on the `HomeUser` type noting "UI gate only — re-check server-side via `app_metadata`" would prevent misuse.

---

#### M2 — `NotificationButton` panel is not keyboard-dismissible and lacks click-outside close
**File:** `app/_components/home/notification-button.tsx`

The notification panel opens on button click but has no close mechanism: no Escape handler, no click-outside listener, no close button. The only way to close it is to click the bell button again. This leaves keyboard users stranded inside `role="dialog"` with no way to escape.

Also: the panel uses `role="dialog"` but has no `aria-modal`, no focus trap, and does not move focus into the panel on open. If this ever becomes a real panel, all three are required. For now a `role="status"` or `role="region"` with `aria-live="polite"` would be more honest about what it actually is.

**Fix (minimal):**
```tsx
// Add to NotificationButton
useEffect(() => {
  if (!open) return;
  function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [open]);
```
And wrap in a `div` with `ref` + mousedown handler like the other menus do.

---

#### M3 — `AccountMenu` menu items have no `tabIndex` — not keyboard-reachable after opening
**File:** `app/_components/home/account-menu.tsx:114-150`

The dropdown `role="menu"` opens but its `role="menuitem"` children (`<a>` and `<button>`) only get focus via Tab key naturally. The ARIA menu pattern requires arrow-key navigation between items and the button trigger should set `tabIndex={-1}` on itself when the menu is open, then manage focus into the first item. Without this, keyboard users hitting Enter/Space on the account button open the dropdown but then have to Tab through the entire page to reach the menu items.

The `<a href="/profile">` and `<a href="/admin">` are native anchor tags so they are naturally focusable. The `<button type="submit">` in the sign-out form is also focusable. So Tab will eventually work. The real gap is the missing arrow-key management that `role="menu"` semantically promises.

**Severity rationale:** Downgraded from High because Tab will technically work; arrow keys are a WCAG 2.5.3 pattern, not a 2.1/2.2 hard requirement. Still a meaningful a11y gap.

---

#### M4 — `WidgetButton` menu has no keyboard close (Escape) and no click-outside handler
**File:** `app/_components/home/widget-button.tsx`

Same pattern as NotificationButton — open state has no close mechanism except clicking the pill again. The `role="menu"` + `role="menuitem"` items have no `onKeyDown` handlers. Escape key does nothing. No click-outside.

**Fix:** Mirror the `AccountMenu` pattern (containerRef + mousedown listener + Escape handler in `onKeyDown` on the container div).

---

#### M5 — `home-links.ts` is dead code — all components use `home-data.ts` instead
**File:** `lib/navigation/home-links.ts`

`lib/navigation/home-links.ts` exports `NavLink`, `PRIMARY_NAV`, `AwardCategory`, `awardHref()`, and `AWARD_CATEGORIES`. None of these are imported anywhere in the app (`grep` finds zero usages in `app/`). `home-data.ts` duplicates `NavLink` and the nav arrays. This creates two sources of truth for nav structure. If a link is updated in one file, the other silently diverges.

**Fix:** Delete `lib/navigation/home-links.ts` or make components import from it instead of `home-data.ts`.

---

#### M6 — `FOOTER_NAV_LINKS` includes `/criteria` which is a protected route
**File:** `app/_components/home/home-data.ts:22`

```ts
{ label: "Tiêu chuẩn chung", href: "/criteria" },
```

`/criteria` is not in `PUBLIC_PATHS`. An unauthenticated user clicking this footer link will hit the proxy and be redirected to `/login` with no explanation. This is a confusing UX break on a public page. The footer is rendered for all visitors.

**Fix:** Either add `/criteria` to `PUBLIC_PATHS` when that page is built, or remove it from the footer until auth requirements are decided. At minimum, document the intent.

---

### Low

#### L1 — Hardcoded `active` state in nav/footer arrays is wrong on navigation
**File:** `app/_components/home/home-data.ts:13,20`

```ts
{ label: "About SAA 2025", href: "/", active: true },     // header: always active
{ label: "Award Information", href: "/awards", active: true }, // footer: always active
```

The `active` flag is static data, not derived from the current route. The header always shows "About SAA 2025" as active even when the user navigates to `/awards`. The footer always shows "Award Information" as active regardless of page. This will look wrong when additional pages are built.

**Fix:** Derive `active` from `usePathname()` (client) or the request path (server). For now, it's cosmetically acceptable since only `/` exists, but it will break when other pages ship.

---

#### L2 — `eventTarget` re-created on every render without `useMemo`
**File:** `app/_components/home/home-client.tsx:38`

```ts
const eventTarget = new Date(eventDatetime); // line 38 — computed on every render
```

`eventTarget` is only used to seed `useState` (which ignores re-runs of the initializer after mount). It is harmless, but the `useEffect` correctly creates its own `target` variable. The line-38 variable is misleading — it looks like it should be passed somewhere meaningful but only affects the initial hydration state. This can confuse future maintainers into thinking `eventTarget` is reactive.

**Fix:** Remove line 38. The `useState` initializer can inline: `useState<Remaining>(() => getRemaining(new Date(eventDatetime)))`.

---

#### L3 — Hydration mismatch risk: countdown computed during SSR vs client
**File:** `app/_components/home/home-client.tsx:40-41`

`useState(() => getRemaining(eventTarget))` runs on the server during RSC render and on the client during hydration. If more than one minute elapses between server render and client hydration (slow connection, aggressive caching middleware upstream), React will detect a mismatch on the countdown values and trigger a full client re-render. `force-dynamic` prevents page-level caching but does not prevent edge/CDN time skew.

This is low-risk in practice for a fast SPA but worth noting for long-tail connections.

**Fix:** Suppress mismatch with `suppressHydrationWarning` on the timer wrapper, or move initial computation to `useEffect` only (accepting that the timer shows `--` on first paint). Alternatively, document the known risk.

---

#### L4 — `opacity: 2` is not a valid CSS value (dead code in `DigitTile`)
**File:** `app/_components/home/countdown-timer.tsx:35`

```ts
opacity: 2, // counters parent 0.5 — absolute children inherit; use z trick
```

`opacity` is clamped to `[0, 1]` by the CSS spec. `opacity: 2` is equivalent to `opacity: 1`. The comment describes an intent (overriding inherited opacity), but CSS `opacity` is not inherited — it applies to the element and its composited subtree. The parent opacity affects how the subtree composites against the page, and child `opacity: 2` cannot escape that. This is a misunderstanding of CSS compositing. The `z-10` on the `<span>` does not help either.

Also, `DigitTile` is entirely unused: line 138 does `void DigitTile;` to suppress the unused variable warning instead of deleting it.

**Fix:** Delete the unused `DigitTile` component and the `void DigitTile;` line.

---

#### L5 — `footer-logo.png` missing `alt` text (redundant logo link)
**File:** `app/_components/home/site-footer.tsx:30`

The footer logo `<Image>` has `alt="SAA 2025 logo"` but the wrapping `<Link>` also has `aria-label="SAA 2025 homepage"`. Because the image has a non-empty alt, screen readers announce both. The image alt should be empty (`alt=""`) since the link label already describes the destination, per WCAG technique H2.

This is minor but produces a doubled announcement: "SAA 2025 logo, SAA 2025 homepage link" → should be "SAA 2025 homepage link".

**Fix:** Change the footer logo `alt=""` (the link text provides the accessible name).

---

#### L6 — Typo: "Comming soon" in hero section
**File:** `app/_components/home/hero-section.tsx:74`

```tsx
Comming soon
```

Should be "Coming soon". Visible to all users.

---

#### L7 — `LanguageSwitcher` flag image always shows Vietnamese flag regardless of selected language
**File:** `app/_components/home/language-switcher.tsx:66-70`

```tsx
<Image src="/home/flag-vn.svg" alt="Vietnamese flag" … />
<span>{selected}</span>
```

The flag is hardcoded to `flag-vn.svg` even when "EN" is selected. The text label changes but the flag does not. Acknowledged as presentational-only scope, but this produces a confusing state (EN label + VN flag). Low risk given agreed i18n scope cut, noted for completeness.

---

#### L8 — `resolveEventDatetime` passes through whitespace-only strings as valid
**File:** `lib/event/countdown.ts:24-25`

```ts
if (raw && !Number.isNaN(Date.parse(raw))) {
```

`raw = "   "` (only spaces): `raw` is truthy, `Date.parse("   ")` returns `NaN` in V8, so the fallback is used. However, `Date.parse(" 2026-12-31 ")` (padded with spaces around a valid date) returns a valid number in V8 — so a misconfigured env var with leading/trailing spaces would be accepted as-is and `new Date(" 2026-12-31 ")` would parse correctly. This is benign but surprising. The test file does cover `"   "` correctly (returns fallback). No action required — just noting the edge.

---

### Nit

- **N1** `site-header.tsx` is a Server Component (no `"use client"`) but imports `AccountMenu` which is a Client Component. This is valid Next.js RSC composition — just noting for reviewers who might be surprised.
- **N2** `home-data.ts` duplicates the `NavLink` interface that already exists in `lib/navigation/home-links.ts`. See M5.
- **N3** `FOOTER_NAV_LINKS` active flag for "Award Information" (`active: true`) makes it glow on the homepage footer, which is misleading — the current page is `/`, not `/awards`. This is a direct consequence of L1.
- **N4** `root-further-section.tsx` uses `key={idx}` for paragraph array. Since the array is static and never reordered, this is harmless but mildly against convention. Use a stable string key derived from the first few chars.
- **N5** `kudos-section.tsx` marks the Kudos wordmark image as `aria-hidden="true"` on the wrapper div but the inner `<Image>` has `alt="Sun* Kudos"`. Screen readers will announce "Sun* Kudos" despite the `aria-hidden` on the parent because `aria-hidden` on a wrapper suppresses the wrapper's role but the `<img>` alt is still exposed in some AT implementations. Set `alt=""` on the image instead.

---

## Security Summary

| Concern | Status |
|---|---|
| Protect-by-default in proxy | Correct — only `/`, `/login`, `/auth/*` are open |
| `/criteria` footer link accessible to unauthenticated users | Will redirect to login (no data exposure, UX confusion only) |
| `isAdmin` via `user_metadata.role` | User-controllable; UI-gating only today, but dangerous pattern (H1) |
| CSRF on POST /auth/signout | Next.js Route Handlers do not get automatic CSRF protection like Server Actions. A cross-origin page can POST to `/auth/signout`. However, the endpoint only calls `supabase.auth.signOut()` and redirects to `/login` — no state-mutating data operation beyond invalidating the session. Signing a user out is annoying but not a security vulnerability proper. Low severity. |
| Token/secret leak to client | None found. `NEXT_PUBLIC_*` vars are correctly public-safe. No server secrets in client components. |
| `getCurrentUser()` is authoritative | Yes — uses `supabase.auth.getUser()` (JWT revalidation), not `getSession()` (local cookie trust). |

---

## Positive Observations

- `force-dynamic` on `page.tsx` is correct and prevents auth state from being cached.
- `getUser()` (not `getSession()`) is used in both `auth.ts` and `proxy-session.ts` — the right pattern.
- Sign-out uses `POST` form (not a `<a>` link), preventing logout CSRF via prefetch.
- `hasSupabaseEnv()` guard means the app boots without Supabase credentials configured — good DX.
- Countdown `getRemaining` handles `NaN` diff, past dates, and the `ended` state cleanly.
- Click-outside logic in `AccountMenu` and `LanguageSwitcher` is consistent and correct.
- `aria-current="page"` on the active nav link is correct usage.
- `aria-label` on icon-only buttons throughout is consistently applied.
- `role="timer"` + `aria-label` on the countdown container is a thoughtful addition.
- `padded()` clamps negatives to `0` via `Math.max`.
- TypeScript compiles clean: `npx tsc --noEmit` exits 0.

---

## Recommended Actions (Priority Order)

1. **[H1]** Remove `user_metadata.role` from `isAdmin` derivation. Use only `app_metadata.role`.
2. **[H2]** Fix countdown tile to render 3+ digits when `days >= 100`. The event is ~195 days away — this bug is live right now.
3. **[M2]** Add Escape key + click-outside close to `NotificationButton`.
4. **[M4]** Add Escape key + click-outside close to `WidgetButton` (mirror `AccountMenu` pattern).
5. **[M5]** Delete `lib/navigation/home-links.ts` (dead code) or consolidate nav data there.
6. **[M6]** Remove `/criteria` from footer nav or document its auth status.
7. **[L4]** Delete unused `DigitTile` component.
8. **[L6]** Fix typo "Comming soon" → "Coming soon".
9. **[L1]** Plan to derive `active` nav state from `usePathname()` before additional pages ship.
10. **[L5]** Set `alt=""` on footer logo image (link already has `aria-label`).

---

## Metrics

| Metric | Value |
|---|---|
| Files reviewed | 18 |
| TypeScript errors | 0 |
| Lint (next lint) | Could not run (CLI path issue in env); no obvious violations observed |
| Test coverage | `countdown.ts` fully covered; UI components have no tests (acceptable for presentational layer) |
| Files > 200 lines | `countdown.test.ts` (304 lines, test file — exempt); all source files under limit |
| Kebab-case file names | Compliant |
| Server-only imports in client components | None found |
