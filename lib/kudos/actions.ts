"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/auth";
import { hasServiceRole } from "@/lib/supabase/env";
import { isAllowedImageType, validateKudoInput } from "./validation";
import { sanitizeKudoHtml } from "./sanitize-html";
import { searchProfiles } from "./queries";
import type {
  CreateKudoResult,
  KudoInput,
  Profile,
  UploadImageResult,
} from "./types";

const BUCKET = "kudos-images";

/**
 * Client-callable directory search for the recipient selector and @mentions.
 * Wraps the server-only query so it can be invoked from the modal (debounced).
 */
export async function searchRecipients(query: string): Promise<Profile[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return searchProfiles(query, 8);
}

/**
 * Ensure the authenticated user has a profiles row before they author a kudo.
 * The signup trigger covers users created after it was installed; this backfills
 * pre-existing users. Requires the service-role key (RLS blocks profile inserts
 * from normal users). No-op when the key is absent — the trigger is then the
 * only path and the FK insert will surface a clear error if the row is missing.
 */
async function ensureSenderProfile(userId: string): Promise<void> {
  if (!hasServiceRole()) return;
  const user = await getCurrentUser();
  const meta = (user?.user_metadata ?? {}) as Record<string, string | undefined>;
  const admin = createAdminClient();
  await admin.from("profiles").upsert(
    {
      id: userId,
      email: user?.email ?? null,
      full_name: meta.full_name ?? meta.name ?? user?.email ?? "Sunner",
      avatar_url: meta.avatar_url ?? meta.picture ?? null,
    },
    { onConflict: "id" },
  );
}

/**
 * Upload a single kudo image. Server-side MIME allowlist (never trust the
 * client). Returns a public URL on success.
 */
export async function uploadKudoImage(
  formData: FormData,
): Promise<UploadImageResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bạn cần đăng nhập", errorCode: "unauthenticated" };

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "Không tìm thấy tệp", errorCode: "fileNotFound" };
  }
  if (!isAllowedImageType(file.type)) {
    return { ok: false, error: "Định dạng tệp không hợp lệ", errorCode: "invalidImageType" };
  }

  const supabase = await createClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "img";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

/**
 * Create a kudo: validate, ensure sender profile, insert the kudo row scoped to
 * the authenticated sender (RLS `with check sender_id = auth.uid()`), then the
 * hashtag join rows. Revalidates the feed. Re-validates everything server-side.
 */
export async function createKudo(input: KudoInput): Promise<CreateKudoResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, errors: ["Bạn cần đăng nhập"], errorCodes: ["unauthenticated"] };

  const result = validateKudoInput(input);
  if (!result.ok) return { ok: false, errors: result.errors };

  // Only accept image URLs that originate from our own Storage bucket — a user
  // bypassing the UI must not inject arbitrary external URLs into the feed.
  const storagePrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  if (input.imageUrls.some((url) => !url.startsWith(storagePrefix))) {
    return { ok: false, errors: ["Ảnh không hợp lệ"], errorCodes: ["invalidImage"] };
  }

  await ensureSenderProfile(user.id);

  const supabase = await createClient();
  const { data: kudo, error: insertError } = await supabase
    .from("kudos")
    .insert({
      sender_id: user.id,
      recipient_id: input.recipientId,
      title: input.title.trim(),
      message_html: sanitizeKudoHtml(input.messageHtml),
      mentions: input.mentionIds,
      is_anonymous: input.isAnonymous,
      anonymous_name: input.isAnonymous ? input.anonymousName.trim() : null,
      image_urls: input.imageUrls,
    })
    .select("id")
    .single();

  if (insertError || !kudo) {
    return {
      ok: false,
      errors: [insertError?.message ?? "Không thể gửi kudo"],
      errorCodes: ["sendFailed"],
    };
  }

  if (input.hashtagIds.length > 0) {
    const rows = input.hashtagIds.map((hashtagId) => ({
      kudo_id: kudo.id,
      hashtag_id: hashtagId,
    }));
    const { error: joinError } = await supabase.from("kudo_hashtags").insert(rows);
    if (joinError) {
      // Roll back the orphaned kudo so the feed never shows a tagless record
      // that violates the "min 1 hashtag" rule. Log if the compensating delete
      // also fails so an orphan can be cleaned up manually.
      const { error: rollbackError } = await supabase
        .from("kudos")
        .delete()
        .eq("id", kudo.id);
      if (rollbackError) {
        console.error(
          `[createKudo] orphaned kudo ${kudo.id} — rollback failed:`,
          rollbackError,
        );
      }
      return { ok: false, errors: [joinError.message] };
    }
  }

  revalidatePath("/kudos");
  return { ok: true, id: kudo.id };
}
