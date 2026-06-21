"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * AwardsHero — Full-width keyvisual banner for the Award System page.
 *
 * Composition (matches Figma keyvisual 313:8437):
 *   - Background: the "Root Further" roots artwork (decorative, full-res).
 *   - "ROOT FURTHER" wordmark, upper-left.
 *   - Centered subtitle + divider + gold page title, lower portion.
 *
 * Reuses the homepage's full-resolution assets (/home/keyvisual-bg.png +
 * /home/root-further-logo.png) — the same brand artwork rendered on the hero.
 */
export default function AwardsHero() {
  const t = useTranslations("awards");

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "480px" }}
      aria-labelledby="awards-hero-title"
    >
      {/* Full-width keyvisual artwork background (decorative) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/home/keyvisual-bg.png')" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className="relative z-10 flex h-full flex-col justify-between"
        style={{ padding: "96px 144px 56px" }}
      >
        {/* ROOT FURTHER wordmark — upper-left */}
        <Image
          src="/home/root-further-logo.png"
          alt="Root Further"
          width={300}
          height={133}
          style={{ objectFit: "contain", width: "300px", height: "auto" }}
          priority
        />

        {/* Centered subtitle + divider + title — lower portion */}
        <div
          className="flex flex-col"
          style={{ gap: "16px", width: "100%", margin: "0 auto" }}
        >
          {/* Subtitle */}
          <p
            className="font-bold text-white"
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              margin: 0,
              textAlign: "center",
            }}
          >
            {t("hero.subtitle")}
          </p>

          {/* Horizontal rule */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(46, 57, 64, 1)",
              margin: 0,
            }}
            aria-hidden="true"
          />

          {/* Main title */}
          <h1
            id="awards-hero-title"
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "57px",
              fontWeight: 700,
              lineHeight: "64px",
              letterSpacing: "-0.25px",
              color: "rgba(255, 234, 158, 1)",
              margin: 0,
              textAlign: "center",
            }}
          >
            {t("hero.title")}
          </h1>
        </div>
      </div>
    </section>
  );
}
