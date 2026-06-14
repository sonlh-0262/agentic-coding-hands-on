import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * Next.js 16 Proxy (formerly Middleware). Runs on the Node.js runtime.
 *
 * Responsibilities:
 *  - Refresh the Supabase auth session (rotate cookies) on every request.
 *  - Optimistic route protection (secure-by-default):
 *      unauthenticated + non-public route -> redirect to /login
 *      authenticated   + /login           -> redirect to /
 *  - Public routes (homepage, login) are viewable without auth.
 *  - `/auth/*` (OAuth callback, sign-out) always passes through.
 *
 * Page-level `getUser()` checks remain the authoritative security layer.
 */

/**
 * Routes viewable without authentication. The homepage is public + auth-aware:
 * it renders for everyone and layers in user controls only when logged in.
 * The kudos/criteria routes are public-facing nav targets (not built yet —
 * they 404); listing them avoids bouncing logged-out visitors to /login.
 * The award system page (/he-thong-giai) is intentionally NOT listed: it is
 * protected, so logged-out visitors are redirected to /login.
 * Account-scoped routes (e.g. /profile, /admin) stay protected by default.
 */
const PUBLIC_PATHS = ["/", "/login", "/kudos", "/criteria"];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Let the auth flow routes run untouched.
  if (path.startsWith("/auth")) {
    return response;
  }

  // Authenticated users have no reason to see the login page.
  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Unauthenticated users may only see public routes.
  if (!user && !PUBLIC_PATHS.includes(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on all routes except static assets and image files.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
