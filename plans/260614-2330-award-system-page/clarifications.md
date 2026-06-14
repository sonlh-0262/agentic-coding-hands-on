# Clarifications — Award System Page (Hệ thống giải thưởng SAA 2025)

Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD

## Session 2026-06-14

- Q: Which route should the Award System page use (/he-thong-giai per test cases vs /awards per existing nav/proxy/homepage cards)? → A: /he-thong-giai — update NAV_LINKS, proxy PUBLIC_PATHS, and homepage award-card hrefs to this path
- Q: How should access be gated (public auth-aware vs protected)? → A: Protected — require login; unauthenticated users redirect to /login (do NOT add /he-thong-giai to proxy PUBLIC_PATHS)
- Q: How should the left-nav active state behave? → A: Scroll-spy + click — clicking smooth-scrolls and sets active; active also follows scroll position via IntersectionObserver
- Q: Section anchor slugs for award sections? → A: top-talent, top-project, top-project-leader, best-manager, signature-2025-creator, mvp (homepage cards deep-link to /he-thong-giai#<slug>)
- Q: Award detail content source? → A: Static data extracted from Figma design (no invented data), stored in app/_components/awards/awards-data.ts
- Q: Sun* Kudos "Chi tiết" button target? → A: /kudos (reuse existing KudosSection component)
