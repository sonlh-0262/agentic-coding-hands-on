import "server-only";

import { createClient } from "@/lib/supabase/server";
import { htmlToPlainText } from "@/lib/kudos/validation";
import type {
  FeedDirection,
  ProfileFeedKudo,
  ProfileStatsData,
} from "./types";

/**
 * Read-side data access for the Profile page. All reads run as the
 * authenticated user via the SSR client, so RLS is enforced. Counts use
 * head+exact (no rows transferred). The feed embeds sender/recipient names,
 * hashtags and a heart count; heartedByMe is resolved in a single follow-up
 * query over just the visible kudo ids.
 */

/** Section B stats: kudos received/sent and hearts received (boxes are mock). */
export async function getProfileStats(
  userId: string,
): Promise<ProfileStatsData> {
  const supabase = await createClient();

  // Fetch received kudo ids (also gives the received count) and the sent count.
  // Counting hearts-received via an embedded filter + head:true is unreliable
  // in PostgREST (the embedded filter is not applied when no rows are
  // materialised), so we count hearts with a top-level `in (received ids)`.
  const [receivedRes, sentRes] = await Promise.all([
    supabase.from("kudos").select("id").eq("recipient_id", userId),
    supabase
      .from("kudos")
      .select("id", { count: "exact", head: true })
      .eq("sender_id", userId),
  ]);

  const receivedIds = (receivedRes.data ?? []).map((r) => r.id as string);

  let heartsReceived = 0;
  if (receivedIds.length > 0) {
    const { count } = await supabase
      .from("kudo_hearts")
      .select("kudo_id", { count: "exact", head: true })
      .in("kudo_id", receivedIds);
    heartsReceived = count ?? 0;
  }

  return {
    kudosReceived: receivedIds.length,
    kudosSent: sentRes.count ?? 0,
    heartsReceived,
  };
}

interface FeedRow {
  id: string;
  message_html: string;
  image_urls: string[] | null;
  is_anonymous: boolean;
  anonymous_name: string | null;
  created_at: string;
  recipient:
    | { full_name: string; avatar_url: string | null }
    | { full_name: string; avatar_url: string | null }[]
    | null;
  sender:
    | { full_name: string; avatar_url: string | null }
    | { full_name: string; avatar_url: string | null }[]
    | null;
  kudo_hashtags:
    | { hashtags: { label: string } | { label: string }[] | null }[]
    | null;
  hearts: { count: number }[] | null;
}

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

/**
 * Feed for the profile: kudos the user SENT or RECEIVED, newest first, with
 * heart counts and whether the current user hearted each one.
 */
export async function getProfileFeed(
  userId: string,
  direction: FeedDirection,
  limit = 20,
): Promise<ProfileFeedKudo[]> {
  const supabase = await createClient();
  const column = direction === "sent" ? "sender_id" : "recipient_id";

  const { data, error } = await supabase
    .from("kudos")
    .select(
      `id, message_html, image_urls, is_anonymous, anonymous_name, created_at,
       recipient:profiles!kudos_recipient_id_fkey(full_name, avatar_url),
       sender:profiles!kudos_sender_id_fkey(full_name, avatar_url),
       kudo_hashtags(hashtags(label)),
       hearts:kudo_hearts(count)`,
    )
    .eq(column, userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;

  const rows = (data ?? []) as unknown as FeedRow[];
  if (rows.length === 0) return [];

  // Resolve heartedByMe for the visible kudos in one query.
  const ids = rows.map((r) => r.id);
  const { data: mine } = await supabase
    .from("kudo_hearts")
    .select("kudo_id")
    .eq("user_id", userId)
    .in("kudo_id", ids);
  const heartedIds = new Set((mine ?? []).map((r) => r.kudo_id as string));

  return rows.map((row) => {
    const sender = one(row.sender);
    const recipient = one(row.recipient);
    const senderName = row.is_anonymous
      ? row.anonymous_name?.trim() || "Ẩn danh"
      : sender?.full_name || "Ẩn danh";
    return {
      id: row.id,
      senderName,
      senderAvatar: row.is_anonymous ? null : sender?.avatar_url ?? null,
      recipientName: recipient?.full_name ?? "",
      recipientAvatar: recipient?.avatar_url ?? null,
      message: htmlToPlainText(row.message_html),
      imageUrls: row.image_urls ?? [],
      hashtags: (row.kudo_hashtags ?? [])
        .map((kh) => one(kh.hashtags)?.label)
        .filter((label): label is string => Boolean(label)),
      createdAt: row.created_at,
      heartCount: one(row.hearts)?.count ?? 0,
      heartedByMe: heartedIds.has(row.id),
    };
  });
}
