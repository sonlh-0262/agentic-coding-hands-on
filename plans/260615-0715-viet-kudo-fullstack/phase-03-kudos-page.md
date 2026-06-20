# Phase 03 — /kudos Page (Feed/Landing + Auth Guard)

## Context Links
- Reference page pattern: `app/he-thong-giai/page.tsx` (protected server component → `HomeUser` → client)
- `HomeUser` type: `app/_components/home/home-client.tsx` (`{ name, email, avatarUrl?, isAdmin }`)
- Phase 2 query: `listRecentKudos` in `lib/kudos/queries.ts`
- Next.js layouts/pages guide: `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` (READ FIRST)

## Overview
- **Priority:** P2
- **Status:** pending
- **Track:** B
- **Depends on:** Phase 2
- New `/kudos` route: protected feed/landing with a "Viết Kudo" button that opens the modal.
- KISS: minimal feed — recent kudos list. Do NOT over-build.

## Key Insights
- Mirror `he-thong-giai/page.tsx` exactly: `export const dynamic = "force-dynamic"`, `getCurrentUser()`,
  redirect to `/login` if null, map to `HomeUser`, render a client component.
- The modal is a client component using a portal; the page's client wrapper owns the `open` state +
  the "Viết Kudo" trigger button. The page (server) fetches feed + hashtags + passes user.
- Feed item must render anonymous kudos as the anonymous_name (never leak real sender).

## Requirements
**Functional**
- `app/kudos/page.tsx` (server): auth guard, fetch `listRecentKudos()` + `listHashtags()`, render client wrapper.
- Client wrapper `app/_components/kudos/kudos-page-client.tsx`: header/account menu (reuse home/awards header
  if shared), feed list, "Viết Kudo" button → opens `VietKudoModal`.
- Feed empty state ("Chưa có kudo nào") + simple kudo cards (recipient, message excerpt, hashtags, anon name if anonymous).

**Non-functional**
- Brand styling: bg `#00101A`, yellow `rgba(255,234,158,1)`, gold border `#998C5F`, `var(--font-montserrat)`,
  inline `style={{}}` px values (match home/awards convention). Files < 200 lines (split feed card into its own file).

## Architecture / Data Flow
```
GET /kudos (server) ─ getCurrentUser() ─ null? ─> redirect(/login)
                    └ listRecentKudos() + listHashtags() ─> kudos-page-client (user, feed, hashtags)
kudos-page-client ─ "Viết Kudo" ─> open=true ─> <VietKudoModal open onClose onSubmit>
```

## Related Code Files
**Create**
- `app/kudos/page.tsx` — server component, auth guard, data fetch.
- `app/_components/kudos/kudos-page-client.tsx` — client wrapper: state + trigger + modal mount + feed.
- `app/_components/kudos/kudo-feed-card.tsx` — single feed item (presentational).

**Edit**
- `app/_components/kudos/index.ts` — export new components (keep barrel tidy).

## Implementation Steps
1. Read `03-layouts-and-pages.md` for Next 16 routing/page conventions; confirm `app/kudos/page.tsx` is correct route.
2. Copy auth-guard structure from `he-thong-giai/page.tsx`; swap content for kudos feed fetch.
3. `kudos-page-client.tsx`: holds `open` state; renders trigger button + feed cards + `<VietKudoModal>`;
   passes `hashtags`/recipient search down (final wiring in Phase 4 — here use a placeholder `onSubmit`).
4. `kudo-feed-card.tsx`: render recipient name, message excerpt (render HTML safely — sanitize, see Phase 4),
   hashtag chips, sender or "Ẩn danh: {anonymous_name}".
5. Wire feed empty state. Compile check.

## Todo List
- [x] app/kudos/page.tsx with auth guard + data fetch
- [x] kudos-page-client.tsx (open state + trigger + modal mount)
- [x] kudo-feed-card.tsx
- [x] index.ts exports
- [x] Empty state
- [x] Build passes; `/kudos` redirects when logged out, renders when logged in

## Success Criteria
- Logged-out visit to `/kudos` → redirect `/login`. Logged-in → feed + working "Viết Kudo" button.
- Feed shows seeded/recent kudos; anonymous kudos never reveal real sender.
- Page matches brand styling; no console errors.

## Risk Assessment
| Risk | L×I | Mitigation |
|------|-----|-----------|
| Anonymous sender leaked in feed payload | Med×High | `listRecentKudos` omits `sender_id`/profile when `is_anonymous`; verify server payload |
| Rendering message_html → XSS | Med×High | Sanitize on render (Phase 4 owns sanitizer); excerpt as text in card if simpler |
| Route file wrong for Next 16 | Low×Med | Read routing doc; verify dev server resolves `/kudos` |

## Backwards Compatibility
- New route + components only. No existing route touched. Rollback = delete files.
- File ownership: this phase OWNS `app/kudos/*`, `kudos-page-client.tsx`, `kudo-feed-card.tsx`.
  Phase 4 owns modal wiring + field components — no overlap with feed files.

## Security Considerations
- Page-level `getCurrentUser()` is authoritative gate (defense-in-depth alongside proxy).
- Feed query runs under RLS; sanitize any HTML before render.

## Next Steps
- Unblocks Phase 4 (real `onSubmit` + live data into the modal mounted here).
