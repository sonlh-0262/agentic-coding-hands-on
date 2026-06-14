# Clarifications — Login Page (/login) + Supabase Auth

Screen: Login — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
fileKey: 9ypp4enmFmdK3YAFJLIu6C | screenId: GzbNeVGJHz

## Session 2026-06-13

- Q: How to stand up Supabase (no project in repo; CLI absent; Docker running)? → A: Use a hosted Supabase cloud project; user provides API URL + anon key via env
- Q: How to handle Google OAuth credentials? → A: Wire the full OAuth flow now; leave Google Client ID/Secret as env/dashboard placeholders for the user to fill
- Q: Where should a successful login land (test cases say "main application page", only `/` exists)? → A: Existing `/` home page; protect it so unauthenticated users are redirected to /login
- Q: How much of the VN language switcher / i18n is in scope? → A: Static button only; functional dropdown and VN/EN translations are out of scope
