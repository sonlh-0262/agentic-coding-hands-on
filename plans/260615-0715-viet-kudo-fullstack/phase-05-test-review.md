# Phase 05 — Test & Review

## Context Links
- All prior phases (01–04)
- 26 specs + 57 test cases (MoMorph): https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- Validation rules: `lib/kudos/validation.ts`

## Overview
- **Priority:** P2
- **Status:** pending
- **Depends on:** Phase 4
- Validate the full feature against the test-case matrix; run lint/build/tests; reviewer pass.

## Requirements
**Functional** — cover the test matrix below.
**Non-functional** — lint clean, build passes, no failing tests (do NOT skip to go green).

## Test Matrix
| Layer | What | How |
|-------|------|-----|
| Unit | `validation.ts` (recipient/message/hashtag count/image count) | unit tests, all branches |
| Unit | `sanitize-html.ts` strips scripts/disallowed tags | unit tests with XSS payloads |
| Unit | mention token parsing → ids | unit tests |
| Integration | `searchProfiles`, `listHashtags`, `listRecentKudos` against real seeded DB | integration (real DB, no mocks) |
| Integration | `uploadKudoImage` MIME accept/reject + returns reachable URL | integration |
| Integration | `createKudo` inserts kudo + join rows; anonymous path hides sender | integration |
| E2E/manual | open modal, fill, submit, feed updates; required-field gating; max hashtag/image; file-type reject | manual per 57 cases |
| Security | logged-out `/kudos` → `/login`; RLS denies cross-user insert; anon kudo never leaks sender | manual + query check |

## Implementation Steps
1. Delegate to `tester`: run unit + integration suites against the user-provided DB (NO mocked DB — project rule).
2. Walk the 57 MoMorph test cases manually for UI behaviors not cheaply automatable (contentEditable, dropdowns).
3. Fix failures per recommendations; re-run until green.
4. Delegate to `reviewer`: correctness, security (XSS/RLS/service-role leak), style, file-size (<200 lines), KISS/DRY.
5. Update docs per `.claude/rules/documentation-management.md` (changelog + roadmap if applicable).

## Todo List
- [x] Unit tests (validation, sanitize, mention parse) pass (138 tests, all pass)
- [x] Integration tests (queries, upload, createKudo) pass against real DB
- [x] Manual walkthrough of 57 test cases
- [x] Security checks (auth gate, RLS, anon leak, no service-role in client bundle)
- [x] Lint + build clean
- [x] reviewer pass addressed (7.5/10 score; 1 Critical + 4 High issues fixed/documented)
- [ ] Docs updated (changelog/roadmap) — deferred to separate sync

## Success Criteria
- All automated tests pass (no skips/mocks-for-green). Manual matrix walked with issues fixed.
- Reviewer signs off; no High security findings open.

## Risk Assessment
| Risk | L×I | Mitigation |
|------|-----|-----------|
| Mocked DB hides RLS/migration bugs | Med×High | Integration tests hit real seeded DB (project rule) |
| contentEditable behaviors hard to auto-test | High×Low | Manual matrix for editor; unit-test pure logic (parse/sanitize) |
| Service-role key in client bundle | Low×Critical | Grep build output for the key/`SUPABASE_SERVICE_ROLE_KEY`; confirm `server-only` |

## Next Steps
- On green + review sign-off: feature done. Note any deferred items (image cleanup on failed submit, feed pagination) for backlog.

## Unresolved Questions
- Exact predefined hashtag seed list — confirm against MoMorph design before Phase 1 seeding.
- Allowed image MIME set — plan assumes png/jpg accepted, pdf/mp4/txt rejected (from test cases); confirm if gif/webp allowed.
- Toolbar→HTML fidelity expectations (does design require nested lists / link target behavior?) — confirm from test cases.
