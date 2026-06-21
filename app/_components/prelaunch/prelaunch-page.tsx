import Image from "next/image";
import PrelaunchCountdown from "./prelaunch-countdown";
import type { Remaining } from "@/lib/event/countdown";

export interface PrelaunchPageProps {
  /**
   * Pre-computed remaining time — fed by parent (server component or
   * interval-driven client wrapper). Defaults to static mock for standalone
   * rendering.
   */
  remaining?: Remaining;
}

const MOCK_REMAINING: Remaining = {
  days: 0,
  hours: 5,
  minutes: 20,
  ended: false,
};

/**
 * Full-screen prelaunch / coming-soon layout.
 *
 * Figma frame: "Countdown - Prelaunch page" (2268:35127)
 * - root: 1512×1077px, backgroundColor rgba(0,16,26,1)
 * - Layer 1: MM_MEDIA_BG Image — background image, object-cover, fill viewport
 * - Layer 2: Cover — semi-transparent gradient overlay (linear-gradient 18deg)
 * - Layer 3: Bìa — centered content (flex-col, gap 120px, padding 96px 144px)
 *   └── Frame 487 (flex-col gap 60px)
 *       └── Frame 523 (flex-col gap 24px, align center)
 *           └── Countdown time — title + tiles
 *
 * NOTE: background image public/prelaunch/bg.png is the design's dedicated
 * decorative background (colorful organic root-line pattern). This is DIFFERENT
 * from public/home/keyvisual-bg.png which is the home hero background.
 * Both are visually distinct — do NOT substitute keyvisual-bg.png here.
 */
export default function PrelaunchPage({
  remaining = MOCK_REMAINING,
}: PrelaunchPageProps) {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 16, 26, 1)" }}
    >
      {/* Layer 1: Decorative background image */}
      <Image
        src="/prelaunch/bg.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
        aria-hidden="true"
      />

      {/* Layer 2: Gradient overlay for text contrast */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(18deg, #00101A 15.48%, rgba(0, 18, 29, 0.46) 52.13%, rgba(0, 19, 32, 0.00) 63.41%)",
        }}
        aria-hidden="true"
      />

      {/* Layer 3: Centered content */}
      <div
        className="relative z-20 flex items-center justify-center w-full"
        style={{ padding: "96px 144px" }}
      >
        <PrelaunchCountdown remaining={remaining} />
      </div>
    </div>
  );
}
