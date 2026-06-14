import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * Next.js 16 Proxy (formerly Middleware). Runs on the Node.js runtime.
 *
 * Responsibilities:
 *  - Refresh the Supabase auth session (rotate cookies) on every request.
 *  - Optimistic route protection:
 *      unauthenticated + protected route  -> redirect to /login
 *      authenticated   + /login           -> redirect to /
 *  - `/auth/*` (OAuth callback, sign-out) always passes through.
 *
 * Page-level `getUser()` checks remain the authoritative security layer.
 */
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

  // Unauthenticated users may only see /login.
  if (!user && path !== "/login") {
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
