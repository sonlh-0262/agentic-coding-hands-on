"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { ToggleHeartResult } from "./types";

/**
 * Client-callable server action for the Profile page: toggling a heart. Runs as
 * the authenticated user; RLS enforces that hearts are scoped to them. The
 * Sent/Received filter is handled by navigation (URL search param) + SSR
 * refetch, so it needs no action here.
 */

/** Add or remove the current user's heart on a kudo. Returns the new state. */
export async function toggleHeart(kudoId: string): Promise<ToggleHeartResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bạn cần đăng nhập", errorCode: "unauthenticated" };

  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase
    .from("kudo_hearts")
    .select("kudo_id")
    .eq("kudo_id", kudoId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (readError) return { ok: false, error: readError.message };

  if (existing) {
    const { error } = await supabase
      .from("kudo_hearts")
      .delete()
      .eq("kudo_id", kudoId)
      .eq("user_id", user.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("kudo_hearts")
      .insert({ kudo_id: kudoId, user_id: user.id });
    if (error) return { ok: false, error: error.message };
  }

  const { count } = await supabase
    .from("kudo_hearts")
    .select("user_id", { count: "exact", head: true })
    .eq("kudo_id", kudoId);

  revalidatePath("/profile");
  return { ok: true, hearted: !existing, count: count ?? 0 };
}
