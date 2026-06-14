import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv } from "./env";

/**
 * Refresh the Supabase session on each request and return the current user.
 * Adapted from the Supabase SSR middleware pattern for Next.js 16 `proxy.ts`.
 *
 * When env vars are absent (placeholder state before the user configures
 * Supabase), it no-ops with a null user so the app still boots.
 */
export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: { id: string } | null;
}> {
  let response = NextResponse.next({ request });

  if (!hasSupabaseEnv()) {
    return { response, user: null };
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() revalidates the token; do not run logic between
  // createServerClient and getUser to avoid hard-to-debug session bugs.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
