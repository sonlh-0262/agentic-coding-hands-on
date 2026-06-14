import { hasSupabaseEnv } from "./env";
import { createClient } from "./server";

/**
 * Returns the current authenticated Supabase user, or null.
 * Safe to call before Supabase env is configured (returns null instead
 * of throwing), so pages render in the placeholder state.
 */
export async function getCurrentUser() {
  if (!hasSupabaseEnv()) {
    return null;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
