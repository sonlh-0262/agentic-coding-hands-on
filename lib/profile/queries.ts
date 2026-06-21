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

  // Received/sent are head+exact counts (no rows transferred). Hearts-received
  // is counted in the DB via a function (migration 0006) — counting it via an
  // embedded filter + head:true is unreliable in PostgREST, and fetching every
  // received-kudo id to a `.in(...)` filter does not scale (review finding I2).
  const [receivedRes, sentRes, heartsRes] = await Promise.all([
    supabase
      .from("kudos")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", userId),
    supabase
      .from("kudos")
      .select("id", { count: "exact", head: true })
      .eq("sender_id", userId),
    supabase.rpc("profile_hearts_received", { uid: userId }),
  ]);

  // Fail loudly (consistent with getProfileFeed) so the page's try/catch can
  // fall back to the empty state rather than silently showing wrong zeros.
  if (receivedRes.error) throw receivedRes.error;
  if (sentRes.error) throw sentRes.error;
  if (heartsRes.error) throw heartsRes.error;

  return {
    kudosReceived: receivedRes.count ?? 0,
    kudosSent: sentRes.count ?? 0,
    heartsReceived: Number(heartsRes.data ?? 0),
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
