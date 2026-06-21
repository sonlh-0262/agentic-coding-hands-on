import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { resolveEventDatetime } from "@/lib/event/countdown";
import PrelaunchClient from "@/app/_components/prelaunch/prelaunch-client";

// The countdown is clock-dependent; never serve a cached/prerendered frame.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("countdown.title"),
    description: t("countdown.description"),
  };
}

/**
 * Prelaunch countdown page (`/countdown`) — public "coming soon" screen.
 *
 * Resolves the event datetime from `NEXT_PUBLIC_EVENT_DATETIME` (the same single
 * source of truth used by the homepage hero) and hands it to the client, which
 * runs the live countdown. Public route — no auth gate (see proxy.ts PUBLIC_PATHS).
 */
export default function CountdownPage() {
  const eventDatetime = resolveEventDatetime(
    process.env.NEXT_PUBLIC_EVENT_DATETIME,
  );

  return <PrelaunchClient eventDatetime={eventDatetime} />;
}
