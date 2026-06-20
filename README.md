This is a [Next.js](https://nextjs.org) 16 project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → service_role secret. **Server-only** — never prefix with `NEXT_PUBLIC_`. Used by the Kudos write path (`lib/supabase/admin.ts`). |
| `NEXT_PUBLIC_EVENT_DATETIME` | ISO-8601 datetime string for the homepage countdown target (e.g. `2026-12-31T18:30:00+07:00`). Optional — a fallback date is used if unset. |

### 2. Google OAuth (Supabase)

1. Go to **Supabase dashboard → Authentication → Providers → Google**.
2. Enable the provider and paste your Google Cloud OAuth client ID and secret.
3. Add the following redirect URL in both the Supabase provider settings and the Google Cloud console:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://<your-domain>/auth/callback`

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated requests redirect to `/login`; after signing in with Google you land on `/`.

> **Database migrations:** The Kudos feature requires Supabase schema migrations in `supabase/migrations/`. Apply them before using `/kudos`. See `supabase/README.md` for instructions.

---

## Auth architecture

- **Route protection** lives in `proxy.ts` — Next.js 16 renamed Middleware to Proxy. It refreshes the Supabase session cookie on every request and redirects unauthenticated users to `/login`.
- **Supabase helpers** are in `lib/supabase/`: `client.ts` (browser), `server.ts` (Server Components / Route Handlers), `proxy-session.ts` (cookie refresh in proxy), `env.ts` (typed env access).
- **Auth routes**: `/login` (Google sign-in button), `/auth/callback` (OAuth exchange), `/auth/signout` (server-side sign-out).
- Page-level `getUser()` calls remain the authoritative security check; the proxy layer is optimistic only.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

## Deploy on Vercel

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Remember to set the two Supabase env vars in your Vercel project settings and add the production callback URL to both Supabase and Google Cloud console.
