"use client";

import { useState, useEffect } from "react";
import { getRemaining } from "@/lib/event/countdown";
import type { Remaining } from "@/lib/event/countdown";
import PrelaunchPage from "./prelaunch-page";

export interface PrelaunchClientProps {
  /** ISO-8601 string for the event datetime. */
  eventDatetime: string;
}

/**
 * PrelaunchClient — behavioral wrapper for the `/countdown` prelaunch page.
 *
 * Mirrors the homepage countdown: the initial `remaining` is computed during SSR
 * (fresh, since the page is force-dynamic), then re-computed every minute via
 * setInterval. `getRemaining` clamps to `00` once the target time is reached, so
 * the display naturally freezes at `00 / 00 / 00` on completion (no redirect).
 *
 * All presentation (full-screen background, overlay, title, LED digits) lives in
 * <PrelaunchPage>.
 */
export default function PrelaunchClient({
  eventDatetime,
}: PrelaunchClientProps) {
  const [remaining, setRemaining] = useState<Remaining>(() =>
    getRemaining(new Date(eventDatetime)),
  );

  useEffect(() => {
    const target = new Date(eventDatetime);
    const interval = setInterval(() => {
      setRemaining(getRemaining(target));
    }, 60_000);

    return () => clearInterval(interval);
  }, [eventDatetime]);

  return <PrelaunchPage remaining={remaining} />;
}
