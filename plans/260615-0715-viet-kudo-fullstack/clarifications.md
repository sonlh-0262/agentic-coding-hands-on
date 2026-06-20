# Clarifications — Viết Kudo (full-stack)

Screen: Viết Kudo — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
fileKey: 9ypp4enmFmdK3YAFJLIu6C | screenId: ihQ26W78P2

## Session 2026-06-15

- Q: Scope of backend/persistence → A: Full-stack Supabase (real kudos table, recipient search, hashtag source, image upload, real submit/insert)
- Q: Where the modal lives / launches → A: New /kudos page (feed/landing) + "Viết Kudo" button that opens the modal
- Q: Rich-text editor approach (B/I/Stroke/list/link/quote/@mention) → A: Custom contentEditable editor, no new dependency
- Q: User directory for recipient search + @mention (no profiles table exists) → A: Both — profiles table auto-synced from auth.users via signup trigger AND seeded with sample Sunners
- Q: Hashtag mechanism (min 1, max 5, required) → A: Seeded hashtags table; "+ Hashtag" picks from predefined list, stored as relations
- Q: Image upload (optional, max 5) → A: Supabase Storage bucket (kudos-images), store public URLs on the kudo
- Q: Schema delivery (only anon key available) → A: User will provide DB access (service-role key or Postgres connection string in .env.local) so migrations can be applied directly
