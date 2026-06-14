import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./countdown-timer";
import type { Remaining } from "@/lib/event/countdown";
import { EVENT_INFO } from "./home-data";

interface HeroSectionProps {
  remaining: Remaining;
}

/**
 * HeroSection — the main hero/keyvisual area.
 * Background: /home/keyvisual-bg.png.
 * Contains: Root Further logo, "Coming soon" label, countdown, event info, CTA buttons.
 */
export default function HeroSection({ remaining }: HeroSectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh" }}
      aria-label="Hero section"
    >
      {/* Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/home/keyvisual-bg.png')" }}
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,16,26,0.85) 0%, rgba(0,16,26,0.4) 60%, rgba(0,16,26,0.1) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content — positioned to start below fixed header */}
      <div
        className="relative z-10 flex flex-col"
        style={{
          paddingTop: "184px", // 80px header + 96px design padding
          paddingBottom: "96px",
          paddingLeft: "144px",
          paddingRight: "144px",
          gap: "40px",
        }}
      >
        {/* Root Further logo */}
        <div style={{ width: "451px", height: "200px" }}>
          <Image
            src="/home/root-further-logo.png"
            alt="Root Further"
            width={451}
            height={200}
            style={{ objectFit: "contain", aspectRatio: "115/51" }}
            priority
          />
        </div>

        {/* Countdown block */}
        <div className="flex flex-col" style={{ gap: "16px" }}>
          {/* "Coming soon" label — hidden when ended */}
          {!remaining.ended && (
            <p
              className="font-bold text-white"
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "24px",
                lineHeight: "32px",
              }}
            >
              Coming soon
            </p>
          )}

          <CountdownTimer remaining={remaining} />
        </div>

        {/* Event info block */}
        <div className="flex flex-col" style={{ gap: "8px" }}>
          <div className="flex flex-row items-center" style={{ gap: "60px" }}>
            {/* Date info */}
            <div className="flex flex-row items-baseline" style={{ gap: "8px" }}>
              <span
                className="font-bold text-white"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "0.15px",
                }}
              >
                Thời gian:
              </span>
              <span
                className="font-bold"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "24px",
                  lineHeight: "32px",
                  color: "rgba(255, 234, 158, 1)",
                }}
              >
                {EVENT_INFO.date}
              </span>
            </div>
            {/* Venue info */}
            <div className="flex flex-row items-baseline" style={{ gap: "8px" }}>
              <span
                className="font-bold text-white"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "0.15px",
                }}
              >
                Địa điểm:
              </span>
              <span
                className="font-bold"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "24px",
                  lineHeight: "32px",
                  color: "rgba(255, 234, 158, 1)",
                }}
              >
                {EVENT_INFO.venue}
              </span>
            </div>
          </div>

          {/* Livestream info */}
          <p
            className="font-bold text-white"
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.5px",
            }}
          >
            {EVENT_INFO.livestream}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row items-center" style={{ gap: "40px" }}>
          {/* About Awards — yellow fill */}
          <Link
            href="/awards"
            className="flex items-center justify-center gap-2 font-bold rounded-[8px] transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              padding: "16px 24px",
              backgroundColor: "rgba(255, 234, 158, 1)",
              color: "rgba(0, 16, 26, 1)",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.15px",
              height: "60px",
              minWidth: "276px",
            }}
          >
            ABOUT AWARDS
            <Image
              src="/home/icon-arrow.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </Link>

          {/* About Kudos — outline */}
          <Link
            href="/kudos"
            className="flex items-center justify-center gap-2 font-bold rounded-[8px] transition-all duration-200 hover:bg-white/[0.08]"
            style={{
              padding: "16px 24px",
              border: "1px solid #998C5F",
              background: "rgba(255, 234, 158, 0.10)",
              color: "#fff",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.15px",
              height: "60px",
            }}
          >
            ABOUT KUDOS
            <Image
              src="/home/icon-arrow.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
