import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

/**
 * OAuth callback: Supabase redirects here with a `code` after Google sign-in.
 * Exchange the code for a session (sets auth cookies), then redirect onward.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  if (!hasSupabaseEnv()) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const code = searchParams.get("code");
  // Only allow same-origin relative redirects to avoid open-redirect abuse.
  const nextParam = searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // No code or exchange failed.
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
