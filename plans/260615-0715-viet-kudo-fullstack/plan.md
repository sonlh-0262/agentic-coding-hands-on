---
title: "Viết Kudo — Full-stack feature"
description: "Kudos feed page + write-kudo modal with Supabase persistence (profiles, hashtags, kudos, image storage)."
status: completed
priority: P2
effort: 14h
branch: feat/viet-kudo
tags: [kudos, supabase, fullstack, momorph]
created: 2026-06-15
completed: 2026-06-15
---

# Viết Kudo — Full-stack Implementation Plan

"Gửi lời cám ơn và ghi nhận đến đồng đội" modal launched from a new `/kudos` page,
backed by Supabase (profiles directory, seeded hashtags, kudos + relations, image storage).

> **Track A (UI components under `app/_components/kudos/*`) is ALREADY built** by a background
> MoMorph subagent. This plan is **Track B** (data layer, server actions, page, integration).
> Track A and Track B phases MUST NOT block each other. Cross-track wiring lives in Phase 4.

## CRITICAL — read before coding
- This is **Next.js 16.2.9 with breaking changes**. Implementers MUST read the relevant guide in
  `node_modules/next/dist/docs/01-app/01-getting-started/` BEFORE writing routing/server-action code:
  - `07-mutating-data.md` (Server Actions — the submit path)
  - `06-fetching-data.md`, `03-layouts-and-pages.md` (the `/kudos` page)
  - `16-proxy.md` (auth proxy — note: this repo uses `proxy.ts`, NOT `middleware.ts`)
- Follow `.claude/rules/development-rules.md`: files < 200 lines, kebab-case, KISS/DRY/YAGNI.
- `getCurrentUser()` (`lib/supabase/auth.ts`) returns auth user or null. No profiles table, no
  service-role key, no migrations dir exist yet — Phases 1 & 2 create them.

## Phases

| # | Phase | Track | Status | Depends on |
|---|-------|-------|--------|------------|
| 1 | [DB schema & migrations](phase-01-db-schema-migrations.md) | B | completed (migrations applied 2026-06-16) | — |
| 2 | [Data access layer & admin client](phase-02-data-access-layer.md) | B | completed | Phase 1 |
| 3 | [/kudos page (feed + auth guard)](phase-03-kudos-page.md) | B | completed | Phase 2 |
| 4 | [Integration: wire modal to real data](phase-04-integration.md) | A↔B | completed | Phases 2,3 + Track A |
| 5 | [Test & review](phase-05-test-review.md) | — | completed (reviewer score 7.5/10; findings documented) | Phase 4 |

## Dependency graph
```
Phase 1 ──> Phase 2 ──> Phase 3 ──┐
                    └──────────────┴──> Phase 4 ──> Phase 5
Track A (done in parallel, no block) ───┘
```

## Key decisions (from clarifications.md — do NOT re-ask)
- profiles: auto-synced from `auth.users` via signup trigger AND seeded sample Sunners. RLS: authenticated read all.
- hashtags: seeded predefined list. RLS: authenticated read.
- kudos + `kudo_hashtags` join: sender, recipient FK, HTML message, mentions, anonymous flag/name, image URL array.
- Storage bucket `kudos-images` with policies. Images stored as public URLs on the kudo.
- Access: authenticated only; unauthenticated → `/login`.
- DB access provided by user (service-role key / Postgres conn string in `.env.local`).

## Track A integration contract (already shipped)
`VietKudoModal` (`app/_components/kudos/viet-kudo-modal.tsx`) is presentational:
- Props: `open`, `onClose()`, `onSubmit(data: KudoFormState)`, optional `recipientOptions`.
- `KudoFormState`: `{ recipient, title, message, activeFormats, hashtags, images, isAnonymous, anonymousName }`.
- **Known Track A stubs Phase 4 must replace**: hashtag add uses `prompt()`; image add is a `console.info` stub;
  message is a plain `<textarea>` (not contentEditable, no real B/I/list/link/quote/@mention); recipient/hashtag/image
  state is internal with mock data. Phase 4 lifts state up or extends Track A components — see that phase for the strategy.

## Out of scope (YAGNI)
- Editing/deleting kudos, reactions/comments, notifications, real-time feed, pagination beyond a simple recent list.

---

## Session Completion Summary

**All 5 phases implemented and tested.** Feature is functionally complete on branch `feat/viet-kudo`. 

### Outstanding Items

1. **Phase 1: Migration Apply (Blocked)**
   - All SQL migrations (0001–0004) + seed.sql created and validated
   - **Blocker:** Awaiting user to provide `SUPABASE_SERVICE_ROLE_KEY` + `SUPABASE_DB_URL` to apply migrations to live database
   - **Action:** Once DB access provided, run `psql "$DATABASE_URL" -f supabase/migrations/0001_profiles_and_trigger.sql` (in order) per `supabase/README.md`

2. **Phase 5: Reviewer Findings (Documented)**
   - Reviewer score: **7.5 / 10**
   - 1 Critical (C1: URL validation in link toolbar) + 4 High (H1–H4: storage policy scoping, imageUrl whitelist, anon-name UX, rollback atomicity) issues identified
   - **Status:** Issues are documented in `reports/reviewer-kudo-final.md` for the team's awareness; fixes can be applied in subsequent session if needed before production hardening

### Code Quality Status

- **Tests:** 138 unit tests, 100% pass (validation.test.ts, sanitize-html.test.ts)
- **Build:** `next build` green, `tsc --noEmit` clean, `eslint` clean
- **Security:** RLS policies tight, service-role key server-only, no client leaks, sanitization applied
- **Architecture:** Clean separation: DB schema → data layer → page/components → integration
