import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import AwardSystemClient from "@/app/_components/awards/award-system-client";
import type { HomeUser } from "@/app/_components/home/home-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("heThongGiai.title"),
    description: t("heThongGiai.description"),
  };
}

// Auth state is per-request; never serve a cached/prerendered version.
export const dynamic = "force-dynamic";

/**
 * Award System page (`/he-thong-giai`) — protected.
 *
 * Lists the full SAA 2025 award system (6 categories) with a scroll-spy nav.
 * Access requires authentication: the proxy redirects logged-out visitors to
 * `/login`, and this server component's `getCurrentUser()` is the authoritative
 * check. The resolved user is handed to the presentational client tree so the
 * header can render the account menu / notification controls.
 */
export default async function AwardSystemPage() {
  const user = await getCurrentUser();

  // Defense-in-depth: the proxy already redirects logged-out visitors, but the
  // page-level check is the authoritative gate (and covers any proxy bypass).
  if (!user) {
    redirect("/login");
  }

  const homeUser: HomeUser | null = user
    ? {
        name:
          (user.user_metadata?.full_name as string | undefined) ??
          (user.user_metadata?.name as string | undefined) ??
          user.email ??
          "bạn",
        email: user.email ?? "",
        avatarUrl:
          (user.user_metadata?.avatar_url as string | undefined) ??
          (user.user_metadata?.picture as string | undefined),
        // Admin status MUST come from server-controlled app_metadata only.
        isAdmin: (user.app_metadata?.role as string | undefined) === "admin",
      }
    : null;

  return <AwardSystemClient user={homeUser} />;
}
