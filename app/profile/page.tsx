import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getProfileStats, getProfileFeed } from "@/lib/profile/queries";
import type { FeedDirection, ProfileFeedKudo } from "@/lib/profile/types";
import type { HomeUser } from "@/app/_components/home/home-client";
import ProfilePageClient from "@/app/_components/profile/profile-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("profile.title"),
    description: t("profile.description"),
  };
}
import {
  PROFILE_ICON_SLOTS,
  PROFILE_STATS,
  type ProfileKudoCard,
} from "@/app/_components/profile/profile-mock-data";

// Auth + per-user data are request-scoped; never prerender/cache.
export const dynamic = "force-dynamic";

/** Fallback avatar when a profile has no picture. */
const FALLBACK_AVATAR = "/home/icon-user.svg";

/**
 * Role/department badges have no backend yet (mock scope) — a neutral
 * placeholder is shown rather than inventing per-user values.
 */
const PLACEHOLDER_BADGE = { department: "Sun*", title: "Sunner" } as const;

/**
 * Format a timestamp as "HH:mm - MM/DD/YYYY" to match the design, rendered in
 * Vietnam time (UTC+7) regardless of the server's timezone (review finding M5).
 */
function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("hour")}:${get("minute")} - ${get("month")}/${get("day")}/${get("year")}`;
}

/** Map a DB feed item into the presentational card shape (mock decorations). */
function toCard(kudo: ProfileFeedKudo): ProfileKudoCard {
  return {
    id: kudo.id,
    sender: {
      name: kudo.senderName,
      avatarSrc: kudo.senderAvatar ?? FALLBACK_AVATAR,
      badge: { ...PLACEHOLDER_BADGE },
    },
    recipient: {
      name: kudo.recipientName,
      avatarSrc: kudo.recipientAvatar ?? FALLBACK_AVATAR,
      badge: { ...PLACEHOLDER_BADGE },
    },
    timestamp: formatTimestamp(kudo.createdAt),
    statusLabel: null,
    message: kudo.message,
    images: kudo.imageUrls,
    hashtags: kudo.hashtags,
    heartCount: kudo.heartCount.toLocaleString("vi-VN"),
    heartedByMe: kudo.heartedByMe,
  };
}

interface ProfilePageProps {
  searchParams: Promise<{ filter?: string }>;
}

/**
 * Profile page (`/profile`) — protected, self only.
 *
 * Real data: kudos received/sent counts, hearts received, and the kudo feed
 * (filtered sent/received) with per-kudo heart counts. Mock data (per
 * clarifications.md): Secret Box counts, icon collection, role/status pills.
 * Reads are wrapped defensively so the page renders before the Supabase schema
 * (supabase/migrations) is applied — matching the /kudos page.
 */
export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { filter: rawFilter } = await searchParams;
  const filter: FeedDirection = rawFilter === "received" ? "received" : "sent";

  let stats = { kudosReceived: 0, kudosSent: 0, heartsReceived: 0 };
  let feed: ProfileFeedKudo[] = [];
  try {
    [stats, feed] = await Promise.all([
      getProfileStats(user.id),
      getProfileFeed(user.id, filter),
    ]);
  } catch (error) {
    // Schema not applied yet, or transient read error: render empty rather
    // than a 500. Surfaced in server logs for debugging.
    console.error("[/profile] failed to load profile data:", error);
  }

  const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
  const homeUser: HomeUser = {
    name: meta.full_name ?? meta.name ?? user.email ?? "bạn",
    email: user.email ?? "",
    avatarUrl: meta.avatar_url ?? meta.picture,
    isAdmin: (user.app_metadata?.role as string | undefined) === "admin",
  };

  return (
    <ProfilePageClient
      user={homeUser}
      profileUser={{
        name: homeUser.name,
        avatarSrc: homeUser.avatarUrl,
        department: PLACEHOLDER_BADGE.department,
        title: PLACEHOLDER_BADGE.title,
        iconSlots: PROFILE_ICON_SLOTS,
      }}
      stats={{
        kudosReceived: stats.kudosReceived,
        kudosSent: stats.kudosSent,
        heartsReceived: stats.heartsReceived,
        // Secret Box has no backend yet — mock (see clarifications.md).
        secretBoxOpened: PROFILE_STATS.secretBoxOpened,
        secretBoxUnopened: PROFILE_STATS.secretBoxUnopened,
      }}
      sentKudosCount={stats.kudosSent}
      receivedKudosCount={stats.kudosReceived}
      filter={filter}
      kudoCards={feed.map(toCard)}
    />
  );
}
