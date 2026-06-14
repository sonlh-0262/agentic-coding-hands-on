import { getCurrentUser } from "@/lib/supabase/auth";
import { resolveEventDatetime } from "@/lib/event/countdown";
import HomeClient, { type HomeUser } from "@/app/_components/home/home-client";

// Auth state is per-request; never serve a cached/prerendered version.
export const dynamic = "force-dynamic";

/**
 * Homepage SAA (`/`) — public + auth-aware landing page.
 *
 * Renders for everyone; user-specific controls (notification bell, account
 * menu) are layered in by the client when a session exists. The proxy keeps
 * `/` public; this server component resolves the auth state + event datetime
 * and hands them to the presentational client tree.
 */
export default async function Home() {
  const user = await getCurrentUser();
  const eventDatetime = resolveEventDatetime(
    process.env.NEXT_PUBLIC_EVENT_DATETIME,
  );

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
        // user_metadata is writable by the user via updateUser(), so trusting
        // it would let anyone self-promote to admin.
        isAdmin: (user.app_metadata?.role as string | undefined) === "admin",
      }
    : null;

  return <HomeClient user={homeUser} eventDatetime={eventDatetime} />;
}
