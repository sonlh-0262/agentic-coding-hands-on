# Profile Page Implementation via Takumi — MoMorph Two-Track, PostgREST Gotcha, Apply-Pending Migration

**Date**: 2026-06-20 22:00
**Severity**: Critical (1 data correctness bug: PostgREST embedded filter silently ignored in count queries)
**Component**: Profile page (`/profile`), kudo_hearts table, feed filtering (sent/received)
**Status**: Resolved (commit `bd7423d` on `feat/profile-page`; Supabase migration 0005 apply-pending)

## What Happened

Shipped the self-only Profile page from MoMorph design (screenId `3FoIx6ALVb`, fileKey `9ypp4enmFmdK3YAFJLIu6C`) using Takumi two-track parallel execution. Track A (background `implementer` subagent) built presentational UI from Figma with mock data (`app/_components/profile/*`), while Track B (orchestrator) resolved 4 clarification questions (Kudos + Hearts backend scope, `/profile` route, Sent/Received feed filter behavior, self-only access), designed the `kudo_hearts` schema (toggle-able likes per kudo), implemented data access layer (`lib/profile/{types,queries,actions}.ts`), created the Profile page, and wired integration (real kudos counts, hearts received stat, filtered feed with heart toggles).

Code review detected 1 critical data correctness bug: the original `heartsReceived` count logic used PostgREST's embedded-resource filter (`!inner`) combined with `head: true` + `count: exact`, which silently dropped the filter and counted ALL hearts in the table instead of hearts on received kudos. Fix: switched to a top-level `.in(receivedKudoIds)` filter for the count query, which works correctly with `head: true`. Also added 2 missing indexes (kudo_hearts user_id+kudo_id composite, kudos sender_id) and removed a dead `loadProfileFeed` function export. Build gates green: tsc clean, lint clean, 138 unit tests pass, next build succeeds. Committed `bd7423d` on `feat/profile-page` (not pushed). Migration 0005 apply-pending: auto-mode DDL blocker on shared Supabase project.

## The Brutal Truth

This was a textbook case of database API footgun gotcha: PostgREST's `select()` with embedded resources (relations via `!inner`) filters the _selected_ rows, not the _count_. I assumed `count: exact` would return a filtered count; PostgREST returned the full table count instead. The bug was silent — no error, just wrong data. We ship a user seeing "0 hearts received" when they actually have 3, or seeing a phantom count spike because a colleague added hearts and our count went up without any new kudos.

The frustration is that this is not obvious in the docs. The distinction between "filter which rows are selected" and "filter which rows are counted" is buried in a PostgREST limitation note, not front-and-center. I was burned by assuming SQL semantics (WHERE clause filters apply to COUNT) translated to the HTTP layer. They don't.

What stings harder: the bug was invisible until code review. The test suite mocks Supabase, so unit tests never exercise real PostgREST behavior. CI passed, build succeeded, and the bug was shipping. A real integration test (or a quick manual DB poke) would have caught it instantly.

The silver lining: the fix was surgical — one comment explaining the gotcha and a refactored query using top-level `.in()` instead of embedded filters. The comment (lines 24-28 in queries.ts) now documents the footgun for the next developer.

## Technical Details

**Track A: Presentational UI Components**

- `app/_components/profile/`: 6 components (hero section, stats, awards/kudos header, kudo card, mock data)
- Pixel-perfect Figma implementation: user identity card, icon slots, kudos/hearts stats boxes, sent/received feed toggle, per-card heart button
- ~1400 LOC of presentational logic + integration (no state, no Server Actions directly in components, but wired with real props)
- Mock data: Secret Box counts, icon/badge collection, role and status pills (per clarifications.md scope)

**Track B: Backend + Data Layer**

**Supabase Schema (0005_kudo_hearts.sql; apply-pending)**
- `kudo_hearts` table: `(kudo_id, user_id)` composite primary key, `created_at` timestamp, cascade-deletes on kudo deletion
- 3 indexes: `kudo_id` (counting hearts per kudo), `user_id + kudo_id` (checking if current user hearted a kudo), `sender_id` on kudos (for sent feed filtering)
- RLS: SELECT all authenticated, INSERT/DELETE own only
- Toggle behavior: user clicks heart → upsert kudo_hearts row (or toggle via separate insert/delete actions)

**Data Layer (`lib/profile/`)**
- `types.ts`: TypeScript interfaces (ProfileStatsData, ProfileFeedKudo, FeedDirection: "sent" | "received")
- `queries.ts`: Server-side read logic
  - `getProfileStats(userId)`: Returns `{ kudosReceived, kudosSent, heartsReceived }`. **Critical fix**: counts hearts-received via top-level `.in(receivedKudoIds)` filter + `head: true`, not embedded-resource filter (PostgREST gotcha documented in comment)
  - `getProfileFeed(userId, direction, limit)`: Fetches kudos with full join tree (sender, recipient, hashtags, heart counts). Single follow-up query to determine `heartedByMe` for visible kudo IDs (efficient batching)
- `actions.ts`: Server Actions for heart toggle (insert kudo_hearts or delete if already hearted)

**Pages & Integration**

- `app/profile/page.tsx`: Server component (protected: `getCurrentUser()` + `redirect('/login')`), renders ProfilePageClient
- Route: `/profile` (self-only, no URL param for user ID)
- Filter: `?filter=received` toggles between "Đã gửi" (sent, default) and "Đã nhận" (received)
- Stats section: displays real kudos received/sent counts, hearts received count, plus mock Secret Box stats
- Kudo feed: renders ProfileKudoCard for each kudo in filter direction; per-card heart button wired to Server Action toggle
- Defensive rendering: if migration not applied, page renders with empty stats/feed (console.error logged) rather than 500

## What We Tried

1. **Takumi two-track parallel execution**: Spawned `implementer` subagent (Track A) to build 6 presentational components from Figma; orchestrator (Track B) clarified scope, designed schema, implemented data layer, created page, and wired integration
2. **Clarification-first gate**: 4 decisions captured upfront (backend scope = Kudos + Hearts real, `/profile` route, Sent/Received filter default + toggle, self-only access); removed ambiguity before implementation
3. **Two-query optimization for heartsReceived**: Instead of loading all received kudos (expensive), first query fetches kudo IDs only (lightweight), then count hearts over just those IDs (efficient)
4. **Batched `heartedByMe` lookup**: Feed query embeds heart count aggregate; separate follow-up query (single round-trip) checks which kudos the current user liked, avoiding N+1 per-card queries
5. **Defensive error handling**: Data access wrapped in try-catch; schema-not-applied scenario logs error and renders gracefully (empty state) rather than failing page load
6. **PostgREST gotcha fix (post-review)**: Replaced embedded-resource count filter with top-level `.in()` to correctly constrain counts to received kudo IDs

## Root Cause Analysis

**PostgREST Embedded Filter in Count Queries**

The original query used:
```typescript
supabase.from("kudo_hearts")
  .select("kudo_id", { count: "exact", head: true })
  .in("kudo_id", receivedIds)  // embedded resource filter
```

PostgREST's behavior: when you call `.select()` with `head: true` (no rows returned), embedded filters (`!inner.field = value`) are **not applied to the count**. The count query operates at the table level, not the filtered row set. Root cause: **HTTP vs SQL semantics mismatch** — I assumed WHERE-like filtering applied to COUNT, but PostgREST's embedded filters only filter materialized rows.

Fix: moved the `.in()` filter to the top level (not embedded), so it applies before counting:
```typescript
supabase.from("kudo_hearts")
  .select("kudo_id", { count: "exact", head: true })
  .in("kudo_id", receivedIds)  // top-level filter, now works
```

**Why It Slipped Through**

Unit tests mock Supabase. The real PostgREST behavior never executed. CI green, build green, bug shipping. Lesson: integration tests or manual data layer smoke tests catch these silent failures.

**Missing Indexes**

Original migration lacked two indexes:
- `kudo_hearts(user_id, kudo_id)`: Required for efficient `heartedByMe` lookup (WHERE user_id = me AND kudo_id IN (...))
- `kudos(sender_id)`: Required for sent feed query (ORDER BY created_at on sender_id = me)

Both added to 0005. Without them, sent/received feed queries would full-table-scan kudos.

## Lessons Learned

1. **PostgREST's embedded-filter behavior is orthogonal to SQL semantics.** In SQL, `COUNT(*) WHERE x IN (...)` counts filtered rows. In PostgREST, `.select().in().count()` counts **all rows** because the embedded filter only applies if rows are selected. For counts, always use top-level filters (not relation traversal). Document this loudly in comments, because it's not intuitive.

2. **Unit tests that mock third-party APIs hide data-layer bugs.** We tested query logic against mocks; real PostgREST behavior was invisible. For data access layers, add integration tests (even if they run against a test Supabase project) to catch these silent failures. Mocks are fast; they shouldn't be the only guard against API footguns.

3. **Clarification gate surfaces scope boundaries early.** The 4 questions asked upfront made it clear what was real (Kudos + Hearts) vs mock (Secret Box, badges). This prevented scope creep and kept Track A focused on presentational components. Parallel execution works best when scope is explicit.

4. **Two-track parallel execution requires explicit integration review.** Track A built beautiful components; Track B built backend. Neither verified the integration contract (what data shapes does the UI expect? what does the backend return?). Added code review as a forced integration checkpoint. For future features: after parallel tracks complete, schedule a 30-min "integration review" to verify interfaces match before merging.

5. **Index planning is a schema-design hygiene habit.** The queries were written without explicit index planning. Adding them post-review is cleanup work that should happen during schema design. Rule: for any `.eq()`, `.in()`, or `.order()` in a query, you need an index on that column (or composite). Document indexes alongside queries, not as an afterthought.

6. **Defensive rendering for optional migrations improves developer experience.** The page renders gracefully if the schema isn't applied yet (empty state, not 500). This unblocks frontend work while backend schema is still being deployed. Valuable pattern for iterative development.

## Next Steps

1. **Apply Supabase migration 0005**: User (or admin) provides DB access and runs `psql $SUPABASE_DB_URL -f supabase/migrations/0005_kudo_hearts.sql` to create table, RLS policies, and indexes
2. **Add integration test for PostgREST count behavior**: Create `tests/lib/profile/queries.integration.test.ts` (or similar) that runs against a real Supabase test database to verify heartsReceived counts and heartedByMe queries work correctly
3. **Document PostgREST embedded-filter gotcha**: Add a section to `docs/database-queries.md` or create `docs/postgressql-postgrest-gotchas.md` explaining the count-filter behavior and linking to the fix in `queries.ts`
4. **Implement heart toggle Server Action**: Add `toggleHeartAction()` to `lib/profile/actions.ts` (currently only fetch logic; toggle wired in UI but backend not implemented)
5. **Push to remote**: Currently on local `feat/profile-page` branch (commit `bd7423d`); push to remote once migration is applied and integration tests pass
6. **Update project changelog**: Record feature completion and the PostgREST lesson in `docs/project-changelog.md` for future reference

---

**Status**: DONE_WITH_CONCERNS
**Summary**: Profile page shipped via Takumi two-track execution — Track A built 6 presentational components from Figma, Track B clarified 4 scope questions, designed kudo_hearts schema (likes table), implemented data layer with two-query optimization for hearts counts and feed queries. Code review detected 1 critical data correctness bug: PostgREST's embedded-resource filters are not applied to `.count()` queries, silencing heartsReceived count and hiding a full-table-count bug. Fix: switched to top-level `.in()` filter. Also added 2 missing indexes (user_id+kudo_id, sender_id) post-review. Build gates green. Commit `bd7423d` on `feat/profile-page`. Key lesson: PostgREST's HTTP semantics diverge from SQL — filters only apply to materialized rows, not counts. Integration tests (not mocks) required to catch silent data bugs.
**Concerns**:
- PostgREST embedded-filter count bug was invisible until code review. Unit test mocks don't exercise real PostgREST behavior. Add integration tests for data-layer queries against real Supabase project.
- Two-track parallel execution lacks explicit integration-contract verification. Track A and Track B assumed their outputs would fit; code review surfaced interface mismatches. Add "integration review" checkpoint after parallel completion.
- Migration 0005 apply-pending: DDL blocker on shared Supabase project. User/admin must manually apply schema, RLS, indexes before hearts feature is live.
- Heart toggle Server Action not yet implemented — UI wired but no backend endpoint. Deferred as follow-up task.
- Defensive error handling (empty state if schema missing) improves UX but masks schema-not-applied state. Should add a banner or log warning so developers know to apply migration.
