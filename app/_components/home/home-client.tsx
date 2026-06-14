"use client";

import { useState, useEffect } from "react";
import { getRemaining } from "@/lib/event/countdown";
import type { Remaining } from "@/lib/event/countdown";
import SiteHeader from "./site-header";
import HeroSection from "./hero-section";
import RootFurtherSection from "./root-further-section";
import AwardsSection from "./awards-section";
import KudosSection from "./kudos-section";
import SiteFooter from "./site-footer";
import WidgetButton from "./widget-button";

export interface HomeUser {
  name: string;
  email: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

export interface HomeClientProps {
  user: HomeUser | null;
  /** ISO-8601 string for the event datetime */
  eventDatetime: string;
}

/**
 * HomeClient — top-level client composer for the Homepage SAA.
 *
 * Responsibilities:
 * - Holds menu open/close state (passed to header children via context — here
 *   by props to minimize prop drilling depth for this shallow tree).
 * - Runs the countdown timer: parses `eventDatetime`, computes remaining time,
 *   ticks every minute via setInterval.
 * - Passes `remaining` down to HeroSection → CountdownTimer.
 */
export default function HomeClient({ user, eventDatetime }: HomeClientProps) {
  const eventTarget = new Date(eventDatetime);

  const [remaining, setRemaining] = useState<Remaining>(() =>
    getRemaining(eventTarget),
  );

  useEffect(() => {
    // Initial value comes from the useState initializer (computed during SSR,
    // fresh because the page is force-dynamic). Here we only subscribe to the
    // clock, re-computing every minute.
    const target = new Date(eventDatetime);
    const interval = setInterval(() => {
      setRemaining(getRemaining(target));
    }, 60_000);

    return () => clearInterval(interval);
  }, [eventDatetime]);

  return (
    <main className="relative min-h-screen w-full bg-[#00101A]">
      <SiteHeader user={user} />

      {/* Hero — full-viewport section with keyvisual bg */}
      <HeroSection remaining={remaining} eventDatetime={eventDatetime} />

      {/* Root Further section */}
      <div style={{ padding: "120px 0 0 0" }}>
        <RootFurtherSection />
      </div>

      {/* Awards section */}
      <div style={{ padding: "120px 0 0 0" }}>
        <AwardsSection />
      </div>

      {/* Kudos section */}
      <div style={{ padding: "120px 0 0 0" }}>
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
