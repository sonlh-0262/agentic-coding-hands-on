# Clarifications — Homepage SAA (/)

Screen: Homepage SAA — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
fileKey: 9ypp4enmFmdK3YAFJLIu6C | screenId: i87tDx10uM

## Session 2026-06-14

- Q: Homepage access model (ID-0 expects public, current `/` redirects unauthenticated to /login)? → A: Public + auth-aware — anyone can view; notification bell + account menu render only when logged in, otherwise a login affordance
- Q: How to handle links to pages that don't exist yet (Awards Information, Sun* Kudos, Admin Dashboard, Profile)? → A: Placeholder hrefs — wire links to intended routes (/awards, /kudos, ...) and hash anchors as designed; do not build those pages now (they 404 until built)
- Q: Depth of interactive controls (language, notifications, account menu, widget menu)? → A: Presentational + menus open — real open/close menus with keyboard a11y; NO real i18n translation; notifications mocked as empty/no-badge
- Q: Countdown event datetime source? → A: Env var NEXT_PUBLIC_EVENT_DATETIME (ISO-8601) with a fixed future-date fallback when unset/invalid
