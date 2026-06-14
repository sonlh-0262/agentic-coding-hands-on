"use client";

import SiteHeader from "@/app/_components/home/site-header";
import SiteFooter from "@/app/_components/home/site-footer";
import WidgetButton from "@/app/_components/home/widget-button";
import KudosSection from "@/app/_components/home/kudos-section";
import type { HomeUser } from "@/app/_components/home/home-client";
import AwardsHero from "./awards-hero";
import AwardsBody from "./awards-body";

export interface AwardSystemClientProps {
  /** Auth user, or null if logged out. Passed through to SiteHeader. */
  user: HomeUser | null;
}

/**
 * AwardSystemClient — Top-level client composer for the Award System page.
 *
 * Assembles (top to bottom):
 *   1. SiteHeader (sticky, auth-aware)
 *   2. AwardsHero (full-width keyvisual + page title)
 *   3. AwardsBody (sticky nav + detail sections, client-side scroll-spy)
 *   4. KudosSection (reused from home)
 *   5. SiteFooter
 *   6. WidgetButton (fixed bottom-right)
 *
 * Does NOT contain routing or auth logic — that is wired by the page.tsx integrator.
 */
export default function AwardSystemClient({ user }: AwardSystemClientProps) {
  return (
    <main className="relative min-h-screen w-full bg-[#00101A]">
      <SiteHeader user={user} />

      {/* Hero / Keyvisual */}
      <AwardsHero />

      {/* Award system body: sticky nav + detail sections */}
      <div style={{ paddingTop: "80px", paddingBottom: "0" }}>
        <AwardsBody />
      </div>

      {/* Sun* Kudos banner */}
      <div style={{ paddingTop: "120px" }}>
        <KudosSection />
      </div>

      {/* Footer */}
      <div style={{ paddingTop: "120px" }}>
        <SiteFooter />
      </div>

      {/* Fixed widget button */}
      <WidgetButton />
    </main>
  );
}
