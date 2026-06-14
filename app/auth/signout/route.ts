import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

/**
 * Sign the user out and return to /login.
 * POST so it can be triggered from a simple <form> on any page.
 */
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(`${origin}/login`, { status: 303 });
}
