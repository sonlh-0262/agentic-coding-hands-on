# UI Implementation Report — Homepage SAA

**Date:** 2026-06-14
**Screen:** Homepage SAA — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
**Status:** DONE

---

## Files Created

All under `app/_components/home/` (14 files total):

| File | Lines | Description |
|------|-------|-------------|
| `home-data.ts` | 113 | All mock/static content from Figma design |
| `home-client.tsx` | 68 | "use client" — composer, countdown timer state |
| `site-header.tsx` | 88 | Fixed header: logo + nav + language/user controls |
| `language-switcher.tsx` | 97 | "use client" — VN flag + chevron dropdown (a11y) |
| `account-menu.tsx` | 113 | "use client" — user icon + dropdown w/ sign-out form |
| `notification-button.tsx` | 66 | "use client" — bell icon + empty notification panel |
| `hero-section.tsx` | 140 | Hero with keyvisual bg, countdown, event info, CTAs |
| `countdown-timer.tsx` | 112 | 3 tiles: DAYS/HOURS/MINUTES, glassmorphism digit boxes |
| `root-further-section.tsx` | 77 | ROOT/FURTHER decorative images + paragraphs |
| `awards-section.tsx` | 80 | Section header + 2-row grid of award cards |
| `award-card.tsx` | 99 | Single award card: image overlay + text + Chi tiết link |
| `kudos-section.tsx` | 110 | Dark card + bg image + content + kudos wordmark |
| `site-footer.tsx` | 71 | Footer: logo + nav links + copyright |
| `widget-button.tsx` | 80 | "use client" — fixed bottom-right yellow pill button |

---

## Component Tree

```
HomeClient (use client — countdown state)
├── SiteHeader
│   ├── Logo (next/image)
│   ├── NAV_LINKS (Link × 3)
│   ├── LanguageSwitcher (use client)
│   └── [user ? AccountMenu + NotificationButton : Link to /login]
│       ├── AccountMenu (use client)
│       └── NotificationButton (use client)
├── HeroSection
│   ├── keyvisual-bg (CSS background)
│   ├── root-further-logo (next/image)
│   ├── CountdownTimer (receives Remaining)
│   │   └── CountdownTile × 3 (DAYS/HOURS/MINUTES)
│   ├── Event info (date/venue/livestream)
│   └── CTA buttons (ABOUT AWARDS / ABOUT KUDOS)
├── RootFurtherSection
│   ├── root-text.png + further-text.png (next/image)
│   └── Paragraphs + English proverb
├── AwardsSection
│   ├── Section header (caption + divider + title)
│   └── AwardCard × 6 (3+3 rows)
│       └── award-bg.png + award-name-*.png + text + Chi tiết
├── KudosSection
│   ├── kudos-bg.png (CSS background)
│   ├── Text content (label + title + description)
│   ├── Chi tiết button
│   └── kudos-wordmark.svg (next/image)
├── SiteFooter
│   ├── footer-logo.png
│   ├── FOOTER_NAV_LINKS
│   └── Copyright text
└── WidgetButton (use client — pen + SAA icons, bottom-right fixed)
```

---

## Props / Data Interfaces

### `HomeClient` (matches integration contract exactly)
```ts
interface HomeUser { name: string; email: string; avatarUrl?: string; isAdmin: boolean }
interface HomeClientProps { user: HomeUser | null; eventDatetime: string }
```

### `SiteHeader`
```ts
{ user: HomeUser | null }
```

### `HeroSection`
```ts
{ remaining: Remaining }  // from lib/event/countdown
```

### `CountdownTimer`
```ts
{ remaining: Remaining }  // { days, hours, minutes, ended }
```

### `AccountMenu`
```ts
{ user: HomeUser }
```

### `NotificationButton`
```ts
{ unreadCount?: number }  // defaults to 0 — no badge shown
```

### `AwardCard`
```ts
{ award: AwardCard }  // from home-data.ts — slug/title/description/nameImage/dimensions
```

---

## Integration Contract Verification

- [x] `HomeUser` interface: `name`, `email`, `avatarUrl?`, `isAdmin` — exact match
- [x] `HomeClientProps`: `user: HomeUser | null`, `eventDatetime: string` — exact match
- [x] `user === null`: header shows NO bell/account-menu; shows login icon link to `/login`
- [x] `user` present: shows bell + account menu with user.name/avatarUrl
- [x] `eventDatetime`: parsed to Date in home-client, countdown computed via `getRemaining()`, tick every 60s via setInterval, cleaned up on unmount
- [x] Countdown 0-padded: uses `padded()` from `lib/event/countdown`
- [x] Sign out: `<form method="post" action="/auth/signout"><button type="submit">`
- [x] Admin Dashboard: only rendered when `user.isAdmin === true`

---

## Design Fidelity

### Exact values from Figma:
- Header: `80px` height, `padding: 12px 144px`, `background: rgba(16, 20, 23, 0.80)`
- Nav active state: `color: #FFEA9E`, `border-bottom: 1px solid #FFEA9E`, `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`
- Countdown tiles: `51×82px`, `border: 0.5px solid #FFEA9E`, `border-radius: 8px`, `backdrop-filter: blur(16.64px)`
- Award cards: `336×336px` image, `box-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`, `border-radius: 24px`
- Widget button: `106×64px`, `border-radius: 100px`, `background: rgba(255, 234, 158, 1)`
- Footer: `padding: 40px 90px`, `border-top: 1px solid #2E3940`
- Kudos card: `1120×500px max`, `border-radius: 16px`, `background: #0F0F0F`

### Text content from Figma (verbatim):
- Navigation: "About SAA 2025", "Award Information", "Sun* Kudos", "Tiêu chuẩn chung"
- Hero "Coming soon" label (design typo preserved: "Comming soon")
- Event: date `26/12/2025`, venue `Âu Cơ Art Center`
- Awards title: `Hệ thống giải thưởng`, caption: `Sun* annual awards 2025`
- 6 award cards with descriptions from Figma text nodes
- Kudos: `Phong trào ghi nhận`, `Sun* Kudos`, full description paragraph from Figma
- Footer copyright: `Bản quyền thuộc về Sun* © 2025`

---

## Deviations / Assumptions

1. **No `Digital Numbers` font** — Figma uses `Digital Numbers` font for countdown digits; the project has Montserrat + Montserrat Alternates loaded. Used `var(--font-geist-mono), monospace` as fallback. Would need to add the font to `layout.tsx` to match exactly.

2. **Hero section height** — Design shows a fixed 1392px keyvisual. Implemented as `min-h-screen` with absolute positioning to allow content flexibility. Background positioned via CSS `background-image`.

3. **Root Further section background** — The design shows a dark card container (`Frame 486`, `padding: 120px 104px`). Replicated with equivalent padding.

4. **Award card grid** — Design uses `justifyContent: space-between` with `gap: 80px` on 3 fixed-width (336px) cards within a 1224px container. Implemented using CSS Grid with fixed column template to match.

5. **`next/img` for avatarUrl** — Used `<img>` (not `next/image`) for user avatars from Supabase OAuth since the domain is not known at build time and `next/image` requires domain allowlist config. Added `// eslint-disable-next-line` comment.

6. **Responsive breakpoints** — Phase 4 polish (responsive/hover/transitions) is partially included inline (hover states on cards, buttons, links). Full responsive breakpoint adaptation (mobile/tablet stacking) is deferred to Phase 4 polish pass as per skill workflow.

---

**Status:** DONE
**Summary:** All 14 component files under `app/_components/home/` created. `HomeClient` matches the integration contract exactly. TypeScript compiles clean (`tsc --noEmit` exits 0). All mock data extracted verbatim from Figma design nodes.
**Concerns:** `Digital Numbers` font for countdown digits is not loaded in the project — countdown numbers will render in Geist Mono fallback rather than the segmented-display font from Figma.
