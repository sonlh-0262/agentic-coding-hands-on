# Plan — Profile bản thân (`/profile`)

MoMorph screen `3FoIx6ALVb` · SAA 2025 Internal Live Coding · Next.js 16 / React 19 / Supabase / Tailwind v4

Self-profile page for the logged-in user: identity + icon collection (A), stats (B),
awards/KUDOS header + feed filter (C), kudo feed (D), shared header/footer.

Two parallel tracks per MoMorph protocol — Track A (UI) and Track B (backend) run
independently, integrate as outputs land. No blocking merge point.

## Decisions (see clarifications.md)
- Scope: **Kudos + Hearts** real; Secret Box, badges, role pills, Spam/IDOL labels = mock.
- Route **/profile**, **self only**, feed filter **Sent default + Received toggle**.

## Phases
| # | Track | Phase | Status |
|---|-------|-------|--------|
| A | A (UI) | Profile screen UI from Figma (mock data) — `app/_components/profile/*` | ✅ complete |
| 1 | B | Hearts schema — `supabase/migrations/0005_kudo_hearts.sql` | ✅ complete |
| 2 | B | Profile data layer + hearts action — `lib/profile/*` | ✅ complete |
| 3 | B+A | Route `/profile` + wire real stats/feed/hearts into UI | ✅ complete |

Track A and Track B (phases 1–2) are parallel-runnable. Phase 3 is the integration
point: it consumes Track A's components + Track B's data layer.

## Detail
- Track B backend: [phase-01-hearts-schema.md](phase-01-hearts-schema.md)
- (Phases 2–3 detailed inline below / in this file — kept lightweight for live-coding iteration.)

### Phase 2 — Profile data layer (`lib/profile/`)
- `types.ts`: `ProfileStats { kudosReceived, kudosSent, heartsReceived, secretBoxOpened, secretBoxUnopened }`
  (last two are mock-sourced), `ProfileKudoItem` (extends feed item with `heartCount`, `heartedByMe`).
- `queries.ts` (server-only):
  - `getProfileStats(userId)` — counts: kudos where recipient_id=userId (received), sender_id=userId (sent),
    kudo_hearts on kudos whose recipient_id=userId (heartsReceived). Box counts come from mock layer.
  - `getProfileFeed(userId, direction)` — kudos filtered by sender_id (sent) or recipient_id (received),
    newest first, with heart count + heartedByMe for current user.
- `actions.ts` (`"use server"`): `toggleHeart(kudoId)` insert/delete `kudo_hearts` for auth user,
  `revalidatePath("/profile")`; `loadProfileFeed(direction)` for the filter toggle.

### Phase 3 — Route + integration
- `app/profile/page.tsx`: `force-dynamic`; `getCurrentUser()` → redirect `/login` if null;
  fetch stats + sent feed; build `HomeUser`; render `ProfilePageClient`. Defensive try/catch
  (render with mock/empty if schema not yet applied), matching `/kudos` page.
- Wire Track A `ProfilePageClient` to accept real `user`, `stats`, `feed`, `filter` state,
  `onToggleHeart`, `onChangeFilter`. Mock props (boxes, badges, role pills, status labels) preserved.

## Key constraints
- Follow `app/_components/{feature}/` layout; reuse `SiteHeader`/`SiteFooter`.
- Match existing kudos data-layer idioms (snake→camel mappers, RLS-scoped reads, `server-only`).
- Files < 200 lines. No invented design values (MoMorph authoritative).

## Outcome

**Real implementations:**
- Kudos sent/received counts (real DB counts)
- Hearts: real `kudo_hearts` table + user toggle (insert/delete)
- Profile feed: filtered by direction (Sent default + Received toggle)
- Auth guard: self-only, logged-in user only

**Mock implementations (preserved):**
- Secret Box counts (mock-sourced)
- Badges, role pills, Spam/IDOL labels (UI-only)

**Status:**
- Migration `0005_kudo_hearts.sql` authored and fully idempotent (includes 3 indexes: kudo_id, user_id+kudo_id, sender_id)
- **Apply pending**: manual DB application required (auto-mode blocked on shared Supabase); documented in `supabase/README.md`
- All code: tsc clean, lint clean, 138 unit tests pass, next build succeeds
- Reviewer pass: 1 critical bug fixed (heartsReceived filter), 2 extra indexes added during QA, dead export removed, heartedByMe fallback fixed
