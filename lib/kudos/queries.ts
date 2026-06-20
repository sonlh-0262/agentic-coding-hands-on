import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Hashtag, KudoFeedItem, Profile } from "./types";

/**
 * Read-side data access for Kudos. All reads run as the authenticated user via
 * the SSR server client, so RLS is enforced. Mappers convert snake_case rows to
 * the camelCase app types and — critically — drop the real sender for anonymous
 * kudos before the data ever reaches the client.
 */

/** Search the directory by name/email for the recipient selector and @mentions. */
export async function searchProfiles(
  query: string,
  limit = 10,
): Promise<Profile[]> {
  const term = query.trim();
  const supabase = await createClient();
  let request = supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .order("full_name", { ascending: true })
    .limit(limit);

  if (term.length > 0) {
    const pattern = `%${term}%`;
    request = request.or(`full_name.ilike.${pattern},email.ilike.${pattern}`);
  }

  const { data, error } = await request;
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    avatarUrl: row.avatar_url,
  }));
}

/** All predefined hashtags for the "+ Hashtag" dropdown. */
export async function listHashtags(): Promise<Hashtag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hashtags")
    .select("id, label")
    .order("label", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, label: row.label }));
}

interface KudoRow {
  id: string;
  title: string;
  message_html: string;
  image_urls: string[] | null;
  is_anonymous: boolean;
  anonymous_name: string | null;
  created_at: string;
  recipient: { full_name: string } | { full_name: string }[] | null;
  sender: { full_name: string } | { full_name: string }[] | null;
  kudo_hashtags: { hashtags: { label: string } | { label: string }[] | null }[] | null;
}

function one<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

/** Recent kudos for the feed. Sender name is hidden for anonymous kudos. */
export async function listRecentKudos(limit = 20): Promise<KudoFeedItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kudos")
    .select(
      `id, title, message_html, image_urls, is_anonymous, anonymous_name, created_at,
       recipient:profiles!kudos_recipient_id_fkey(full_name),
       sender:profiles!kudos_sender_id_fkey(full_name),
       kudo_hashtags(hashtags(label))`,
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;

  return ((data ?? []) as unknown as KudoRow[]).map((row) => {
    const sender = one(row.sender);
    const recipient = one(row.recipient);
    const authorName = row.is_anonymous
      ? row.anonymous_name?.trim() || "Ẩn danh"
      : sender?.full_name || "Ẩn danh";
    return {
      id: row.id,
      title: row.title ?? "",
      messageHtml: row.message_html,
      imageUrls: row.image_urls ?? [],
      isAnonymous: row.is_anonymous,
      authorName,
      recipientName: recipient?.full_name ?? "",
      hashtags: (row.kudo_hashtags ?? [])
        .map((kh) => one(kh.hashtags)?.label)
        .filter((label): label is string => Boolean(label)),
      createdAt: row.created_at,
    };
  });
}
