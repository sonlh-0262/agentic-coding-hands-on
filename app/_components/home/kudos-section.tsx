"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { KUDOS_CONTENT } from "./home-data";

/**
 * KudosSection — Sun* Kudos section.
 * Background card: rounded dark #0F0F0F + kudos-bg.png.
 * Left: text content. Right: kudos wordmark SVG.
 */
export default function KudosSection() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  return (
    <section
      className="w-full"
      style={{ padding: "0 144px" }}
      aria-labelledby="kudos-section-title"
    >
      <div
        className="relative w-full overflow-hidden flex items-center"
        style={{
          maxWidth: "1120px",
          height: "500px",
          margin: "0 auto",
          borderRadius: "16px",
          background: "#0F0F0F",
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/home/kudos-bg.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "auto 100%",
            opacity: 0.6,
          }}
          aria-hidden="true"
        />

        {/* Left content */}
        <div
          className="relative z-10 flex flex-col"
          style={{
            gap: "32px",
            padding: "46px 64px",
            maxWidth: "520px",
          }}
        >
          <div className="flex flex-col" style={{ gap: "16px" }}>
            {/* Label */}
            <p
              className="font-bold text-white"
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "24px",
                lineHeight: "32px",
                margin: 0,
              }}
            >
              {t("kudos.label")}
            </p>

            {/* Title — "Sun* Kudos" is a brand name, kept as-is */}
            <h2
              id="kudos-section-title"
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "57px",
                fontWeight: 700,
                lineHeight: "64px",
                letterSpacing: "-0.25px",
                color: "rgba(255, 234, 158, 1)",
                margin: 0,
              }}
            >
              Sun* Kudos
            </h2>

            {/* Description */}
            <p
              className="font-bold text-white"
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.5px",
                textAlign: "justify",
                whiteSpace: "pre-line",
                margin: 0,
              }}
            >
              {t("kudos.description")}
            </p>
          </div>

          {/* CTA Button — uses common.details */}
          <Link
            href={KUDOS_CONTENT.ctaHref}
            className="inline-flex items-center gap-2 font-bold rounded-[4px] transition-all duration-200 hover:opacity-90"
            style={{
              padding: "16px",
              backgroundColor: "rgba(255, 234, 158, 1)",
              color: "rgba(0, 16, 26, 1)",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.15px",
              height: "56px",
              alignSelf: "flex-start",
            }}
          >
            {tCommon("details")}
            <Image
              src="/home/icon-arrow.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Right: Kudos wordmark */}
        <div
          className="absolute right-12 top-1/2 -translate-y-1/2 z-10"
          aria-hidden="true"
        >
          <Image
            src="/home/kudos-wordmark.svg"
            alt={t("kudos.wordmarkAlt")}
            width={364}
            height={72}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
