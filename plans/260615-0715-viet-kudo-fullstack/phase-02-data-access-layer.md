# Phase 02 — Supabase Data Access Layer & Admin Client

## Context Links
- Phase 1 schema: `phase-01-db-schema-migrations.md`
- Existing clients: `lib/supabase/{server.ts,client.ts,env.ts,auth.ts}`
- Next.js mutating-data guide: `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` (READ FIRST)

## Overview
- **Priority:** P1
- **Status:** pending
- **Track:** B
- **Depends on:** Phase 1
- Typed query/mutation layer + Server Actions for: profile search, hashtag list, image upload, insert kudo.
  Add admin (service-role) client + env wiring.

## Key Insights
- This is Next.js 16.2.9 — **Server Actions are the submit path**. `cookies()` is async; reuse
  `lib/supabase/server.ts` `createClient()` (already awaits). Do NOT invent a new pattern.
- Most reads/writes run as the authenticated user (RLS enforces ownership). Service-role admin client
  is needed ONLY where RLS must be bypassed (e.g. server-side seed/admin tasks) — keep its use minimal (YAGNI).
- Image upload from a Server Action: receive `File`/`Blob` from `FormData`, upload via authenticated client
  to `kudos-images`, return public URL.

## Requirements
**Functional**
- `searchProfiles(query: string, limit=10): Profile[]` — `ilike` on `full_name`/`email`, excludes self optional.
- `listHashtags(): Hashtag[]` — all seeded tags.
- `uploadKudoImage(file): { url }` — validate image MIME server-side, upload, return public URL.
- `createKudo(input): { id }` — Server Action: validate, insert `kudos` row, insert `kudo_hashtags`,
  return new id. Sets `sender_id = auth.uid()`. Honors `is_anonymous`/`anonymous_name`.
- `listRecentKudos(limit=20): KudoFeedItem[]` — for the feed (Phase 3). Joins recipient profile + hashtags.

**Non-functional**
- Each module < 200 lines, kebab-case. Shared TS types in one `types.ts`. DRY: one mapper per table row → app type.
- Server-side validation mirrors UI rules (message required, hashtags 1–5, images ≤5, recipient required).

## Architecture / Data Flow
```
Client modal ──Server Action(createKudo)──> validate ──> supabase(server, RLS=auth.uid())
   FormData(images) ──uploadKudoImage──> Storage kudos-images ──public URL──> image_urls[]
Client search box ──searchProfiles──> profiles (ilike)
Modal mount ──listHashtags──> hashtags
```

## Related Code Files
**Create**
- `lib/kudos/types.ts` — `Profile`, `Hashtag`, `KudoInput`, `KudoFeedItem`.
- `lib/kudos/queries.ts` — `searchProfiles`, `listHashtags`, `listRecentKudos` (read, server).
- `lib/kudos/actions.ts` — `"use server"` actions: `createKudo`, `uploadKudoImage`.
- `lib/kudos/validation.ts` — pure validators reused by action + (optionally) client.
- `lib/supabase/admin.ts` — service-role client (server-only; guard against client import).
- `lib/supabase/env.ts` — **edit**: add `getSupabaseServiceRoleKey()` / `hasServiceRole()`.

**Edit**
- `.env.example` — document `SUPABASE_SERVICE_ROLE_KEY` (server-only, never `NEXT_PUBLIC_`).

## Implementation Steps
1. Read `07-mutating-data.md` for the exact Next 16 Server Action signature/conventions.
2. `types.ts`: define row→app types matching Phase 1 columns exactly.
3. `validation.ts`: pure functions returning `{ ok, errors }`. Rules: recipient set, message non-empty
   (strip HTML to check), hashtags length 1–5, images ≤5, anonymous_name optional.
4. `lib/supabase/env.ts`: add service-role getter (throws actionable error if missing) + `hasServiceRole()`.
5. `lib/supabase/admin.ts`: `createAdminClient()` using service-role; add `import "server-only"` guard.
6. `queries.ts`: implement reads via `createClient()` (auth user). `searchProfiles` uses `.ilike()` + `.limit()`.
7. `actions.ts`: `uploadKudoImage` (MIME allowlist `image/png`,`image/jpeg` per test cases — reject pdf/mp4/txt);
   `createKudo` validates → inserts kudo → inserts join rows → `revalidatePath("/kudos")` → returns id.
8. Compile check (typecheck/build) after each file.

## Todo List
- [x] lib/kudos/types.ts
- [x] lib/kudos/validation.ts
- [x] lib/supabase/env.ts service-role getters
- [x] lib/supabase/admin.ts (server-only)
- [x] lib/kudos/queries.ts (search, hashtags, recent)
- [x] lib/kudos/actions.ts (upload, createKudo, revalidate)
- [x] .env.example documents SUPABASE_SERVICE_ROLE_KEY
- [x] Typecheck/build passes

## Success Criteria
- `searchProfiles("ng")` returns matching seeded Sunners as an authenticated user.
- `uploadKudoImage` rejects non-image MIME, accepts png/jpg, returns reachable public URL.
- `createKudo` inserts kudo + join rows atomically-enough (join failure cleans up or is acceptable);
  anonymous kudo stores `is_anonymous=true` + name; non-anonymous stores `sender_id`.
- No service-role key reaches client bundle (verify no `NEXT_PUBLIC_` prefix; `server-only` import present).

## Risk Assessment
| Risk | L×I | Mitigation |
|------|-----|-----------|
| Service-role key leaks to client | Low×Critical | `server-only` import, no `NEXT_PUBLIC_`, only imported in `actions.ts`/admin tasks |
| Server Action signature wrong for Next 16.2.9 | Med×High | Read `07-mutating-data.md` before writing; mirror existing repo patterns |
| Partial insert (kudo ok, hashtags fail) | Med×Med | Insert join rows in same action; on join error delete the kudo (or wrap in rpc) and surface error |
| MIME spoof (renamed .exe → .png) | Low×Med | Check MIME + extension allowlist; rely on Storage + size cap |

## Backwards Compatibility
- New `lib/kudos/*` + `lib/supabase/admin.ts`; only additive edits to `env.ts`/`.env.example`.
- Existing auth flow untouched. Rollback = delete new files + revert env edits.

## Security Considerations
- All writes scoped by RLS (`sender_id = auth.uid()`). Server Action re-checks `getCurrentUser()` and redirects/throws if null.
- Validate every input server-side regardless of client checks (never trust client).

## Next Steps
- Unblocks Phase 3 (feed query) and Phase 4 (modal wiring). Confirm allowed image MIME list against test cases.
