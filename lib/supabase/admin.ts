import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv, getSupabaseServiceRoleKey } from "./env";

/**
 * Service-role Supabase client — BYPASSES RLS. Server-only (the `server-only`
 * import makes any client bundle import a build error).
 *
 * Use ONLY for admin tasks that genuinely need to bypass RLS (e.g. seeding,
 * back-office operations). The normal authenticated path (`lib/supabase/server`)
 * is preferred everywhere else so RLS stays in force.
 */
export function createAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
