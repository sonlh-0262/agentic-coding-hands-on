import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { listHashtags, listRecentKudos } from "@/lib/kudos/queries";
import type { HomeUser } from "@/app/_components/home/home-client";
import type { Hashtag, KudoFeedItem } from "@/lib/kudos/types";
import KudosPageClient from "@/app/_components/kudos/kudos-page-client";

// Auth state is per-request; never serve a cached/prerendered version.
export const dynamic = "force-dynamic";

/**
 * Kudos page (`/kudos`) — protected.
 *
 * Shows a feed of recent kudos and a "Viết Kudo" button that opens the modal.
 * Access requires authentication: the proxy redirects logged-out visitors to
 * `/login`, and this server component's `getCurrentUser()` is the authoritative
 * check. Feed/hashtag fetches are wrapped defensively so the page still renders
 * (empty) before the Supabase schema (supabase/migrations) has been applied.
 */
export default async function KudosPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  let feed: KudoFeedItem[] = [];
  let hashtagOptions: Hashtag[] = [];
  try {
    [feed, hashtagOptions] = await Promise.all([
      listRecentKudos(),
      listHashtags(),
    ]);
  } catch (error) {
    // Schema not applied yet, or transient read error: render an empty feed
    // rather than a 500. Surfaced in server logs for debugging.
    console.error("[/kudos] failed to load feed/hashtags:", error);
  }

  const homeUser: HomeUser = {
    name:
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email ??
      "bạn",
    email: user.email ?? "",
    avatarUrl:
      (user.user_metadata?.avatar_url as string | undefined) ??
      (user.user_metadata?.picture as string | undefined),
    isAdmin: (user.app_metadata?.role as string | undefined) === "admin",
  };

  return (
    <KudosPageClient
      user={homeUser}
      feed={feed}
      hashtagOptions={hashtagOptions}
    />
  );
}
