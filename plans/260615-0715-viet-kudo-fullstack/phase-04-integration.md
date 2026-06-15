# Phase 04 — Integration: Wire Modal to Real Data

## Context Links
- Track A modal: `app/_components/kudos/viet-kudo-modal.tsx` + field components (recipient/hashtag/image/anonymous/toolbar/title)
- Track A contract: `KudoFormState`, `RecipientOption`, `HashtagChip`, `ImageItem`, `ToolbarAction` (see `index.ts`)
- Phase 2 layer: `lib/kudos/{queries.ts,actions.ts,validation.ts}`
- Phase 3 mount: `app/_components/kudos/kudos-page-client.tsx`
- Next.js mutating-data guide: `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` (READ FIRST)

## MoMorph refs
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- Clarifications: plans/260615-0715-viet-kudo-fullstack/clarifications.md

## Overview
- **Priority:** P1 (the payoff phase)
- **Status:** pending
- **Track:** A↔B integration (runs after Track A done + Phases 2,3)
- Replace Track A mock data + stubs with real recipient search, seeded hashtag dropdown, real image
  upload, @mention, rich-text behavior, validation, loading/error states, and the real `createKudo` submit.

## Key Insights — Track A current state (MUST reconcile)
The shipped modal is presentational but has **mock/stub behavior** that integration must replace:
1. `MOCK_RECIPIENTS/MOCK_HASHTAGS/MOCK_IMAGES` defaults + hashtags/images **prefilled** with mock → must start empty, fed by real data.
2. Hashtag add = `prompt()` free-text → must become a **dropdown of SEEDED hashtags** (block 6th, max 5).
3. Image add = `console.info` stub → must open **file picker → uploadKudoImage → Storage URL** (≤5, reject non-image).
4. Message is a plain `<textarea>` → spec requires **contentEditable rich-text** (B/I/strike/number-list/link/quote)
   + **@mention dropdown**. Toolbar currently only toggles `activeFormats` visually (no `document.execCommand`/Selection wiring).
5. Recipient search filters in-memory mock → must call `searchProfiles` (debounced).
6. `onSubmit` just bubbles state → must call `createKudo` Server Action, show loading, close on success.
7. "Gửi" is always enabled → must disable until required fields valid.

**Strategy (KISS/DRY):** keep Track A field components' presentational props; lift form state into a
controller hook/component (`use-kudo-form.ts`) consumed by `kudos-page-client.tsx`, passing real options +
handlers into `VietKudoModal`. Extend (not rewrite) the message editor to contentEditable + mention; if the
plain-textarea-vs-contentEditable gap is large, replace ONLY the message sub-block, leaving other fields intact.

## Requirements
**Functional**
- Recipient: debounced `searchProfiles`; select one Sunner (required).
- Message: contentEditable editor; toolbar B/I/strike/number-list/link/quote apply real formatting; `@`+typing
  opens colleague dropdown (reuse `searchProfiles`), inserts a mention token; collect mention ids for `mentions`.
- Hashtag: dropdown from `listHashtags`; add as chip; block 6th; min 1 enforced on submit.
- Image: file input; per-file MIME check; upload via `uploadKudoImage`; thumbnail; remove; hide "+ Image" at 5.
- Anonymous: checkbox reveals name field (already wired in component); pass through to action.
- Submit: validate (client mirror of `validation.ts`) → disable "Gửi" until valid → loading state →
  `createKudo` → on success close + reset + refresh feed; on error show inline error, keep modal open.
- Unauthenticated submit (session expired mid-form) → action redirects to `/login`.

**Non-functional**
- Sanitize message HTML before persist AND before feed render (XSS). Choose minimal allowlist; no heavy dep (YAGNI) — prefer a tiny sanitizer or DOMPurify only if already available.
- Controller/editor files < 200 lines; split mention dropdown + sanitizer into own files.

## Architecture / Data Flow
```
kudos-page-client ─uses─ use-kudo-form (state, handlers)
  recipient input ──debounce──> searchProfiles ──> options
  message editor (contentEditable) ── toolbar/execCommand ──> html; "@" ──searchProfiles──> mention insert
  hashtag "+ " ──listHashtags──> dropdown ──> chips (max5)
  image "+ " ──file input──> uploadKudoImage ──> url ──> thumbnails (max5)
  "Gửi" ──valid?──> createKudo(action) ──success──> close+reset+revalidate(/kudos)
                                       └error──> inline message, stay open
```

## Related Code Files
**Create**
- `app/_components/kudos/use-kudo-form.ts` — form state + handlers + submit (client hook).
- `app/_components/kudos/kudo-mention-dropdown.tsx` — @mention popover (presentational).
- `lib/kudos/sanitize-html.ts` — sanitize message HTML (allowlist).

**Edit**
- `app/_components/kudos/viet-kudo-modal.tsx` — remove mock defaults; accept real handlers/options; replace
  message `<textarea>` with contentEditable editor + mention; wire toolbar to real formatting; disable "Gửi" until valid; loading state.
- `app/_components/kudos/kudo-hashtag-field.tsx` — replace `prompt()` add path with seeded dropdown.
- `app/_components/kudos/kudo-image-field.tsx` — wire `onAdd` to hidden file input + MIME reject.
- `app/_components/kudos/kudo-recipient-field.tsx` — drive options from async search (debounced).
- `app/_components/kudos/kudos-page-client.tsx` — use `use-kudo-form`, pass real data + `createKudo`.

## Implementation Steps
1. Read `07-mutating-data.md`; confirm calling a Server Action from a client component in Next 16.2.9.
2. Build `use-kudo-form.ts`: holds recipient/message-html/mentions/hashtags/images/anon state + validity selector.
3. Recipient: debounced search calling `searchProfiles`; selection sets recipient.
4. Message editor: convert message block to `contentEditable`; implement toolbar via Selection/execCommand
   (bold/italic/strike/insertOrderedList/createLink/formatBlock quote); placeholder + hint preserved.
5. Mention: detect `@` token, open `kudo-mention-dropdown` with `searchProfiles` results, insert mention span, track ids.
6. Hashtag: load `listHashtags`; dropdown select → chip; enforce max 5 (hide add) and min 1 on submit.
7. Image: hidden `<input type=file accept="image/png,image/jpeg">`; on change validate MIME, call `uploadKudoImage`,
   push returned URL; remove drops from list; hide add at 5.
8. Submit: validate via shared `validation.ts`; sanitize html; call `createKudo`; loading + error handling; close+reset on success.
9. Remove all `MOCK_*` defaults; start empty.
10. Compile + manual smoke per test cases (see Phase 5).

## Todo List
- [x] use-kudo-form.ts controller (implemented as state within kudo-message-editor.tsx; equivalent outcome)
- [x] recipient debounced search wired
- [x] contentEditable message editor + working toolbar
- [x] @mention dropdown + token insertion + mention ids
- [x] hashtag seeded dropdown (max5/min1)
- [x] image file input + upload + MIME reject (≤5)
- [x] sanitize-html.ts applied on persist + render
- [x] "Gửi" disabled-until-valid + loading + error states
- [x] remove MOCK_* defaults
- [x] createKudo submit → close/reset/revalidate
- [x] Build passes

## Success Criteria (maps to 57 test cases — sample)
- Cannot submit with empty recipient / empty message / zero hashtags. Can submit when all required filled.
- Cannot add 6th hashtag or 6th image; "+ Image" hidden at 5.
- `.pdf/.mp4/.txt` rejected; `.jpg/.png` accepted and uploaded.
- Bold/italic/strike/list/link/quote produce corresponding HTML; `@name` inserts a mention.
- Anonymous checked → name field shown; submitted kudo stored anonymous; feed hides real sender.
- Submit shows loading, inserts row, closes modal, feed updates.

## Risk Assessment
| Risk | L×I | Mitigation |
|------|-----|-----------|
| contentEditable + execCommand cross-browser quirks | High×Med | Stick to widely-supported commands; test in Chromium; keep editor minimal (YAGNI) |
| XSS via message HTML | Med×High | `sanitize-html.ts` allowlist on persist AND render; no raw `dangerouslySetInnerHTML` without sanitize |
| Track A component shape drifts from this plan | Med×Med | Re-read field components before editing; adapt props rather than rewrite |
| Orphan uploaded images if submit fails | Low×Low | Acceptable for v1; note cleanup as future work |
| Debounced search hammering DB | Low×Low | 250–300ms debounce + `.limit()` |

## Backwards Compatibility
- Edits Track A files in place (rule: update existing files, no "enhanced" copies). Presentational props
  preserved where possible so visual validation from Track A still holds.
- File ownership vs Phase 3: Phase 3 owns feed files; Phase 4 owns modal + field + form-hook files. No overlap on `app/kudos/page.tsx`.
- Rollback: revert modal/field edits to Track A versions; delete `use-kudo-form.ts`, `kudo-mention-dropdown.tsx`, `sanitize-html.ts`.

## Security Considerations
- Server Action re-validates everything + re-checks auth (never trust client validity).
- Sanitize HTML; mentions stored as ids (not trust client display names for authz).

## Next Steps
- Hand to Phase 5 for tests + review. Confirm exact toolbar→HTML expectations against MoMorph test cases.
