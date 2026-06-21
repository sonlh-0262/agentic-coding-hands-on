"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { AwardCard as AwardCardData } from "./home-data";

interface AwardCardProps {
  award: AwardCardData;
}

/**
 * AwardCard — single award item in the grid.
 * Contains: glowing award image (award-bg.png + award name image),
 * title, description (truncated), "Chi tiết" link with arrow.
 * Hover: lift + glow transition.
 */
export default function AwardCard({ award }: AwardCardProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const cardTitle = t(`awards.cards.${award.cardKey}.title`);
  const cardDescription = t(`awards.cards.${award.cardKey}.description`);
  return (
    <Link
      href={`/he-thong-giai#${award.slug}`}
      className="group flex flex-col no-underline"
      style={{ gap: "24px", width: "336px" }}
      aria-label={`${cardTitle} ${t("awards.cardAriaLabelSuffix")}`}
    >
      {/* Award image card */}
      <div
        className="relative flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_0_20px_0_rgba(250,226,135,0.5)]"
        style={{
          width: "336px",
          height: "336px",
          boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 0 6px 0 #FAE287",
          mixBlendMode: "screen",
        }}
      >
        {/* Background image */}
        <Image
          src="/home/award-bg.png"
          alt=""
          fill
          sizes="336px"
          className="object-cover rounded-[24px]"
          style={{
            border: "0.955px solid rgba(255, 234, 158, 1)",
            borderRadius: "24px",
          }}
          aria-hidden="true"
        />
        {/* Award name image — centered overlay */}
        <div
          className="relative z-10 flex items-center justify-center"
          style={{ width: award.nameImageWidth, height: award.nameImageHeight }}
        >
          <Image
            src={award.nameImage}
            alt={cardTitle}
            width={award.nameImageWidth}
            height={award.nameImageHeight}
            className="object-contain"
          />
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col" style={{ gap: "4px" }}>
        {/* Title */}
        <h3
          className="font-normal"
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "24px",
            lineHeight: "32px",
            color: "rgba(255, 234, 158, 1)",
            margin: 0,
          }}
        >
          {cardTitle}
        </h3>

        {/* Description — 2 line clamp */}
        <p
          className="overflow-hidden"
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "#fff",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: 0,
          }}
        >
          {cardDescription}
        </p>

        {/* Chi tiết link — uses common.details */}
        <div
          className="flex items-center mt-2 font-bold text-white transition-colors duration-200 group-hover:text-[#FFEA9E]"
          style={{ gap: "4px" }}
        >
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.15px",
            }}
          >
            {tCommon("details")}
          </span>
          <Image
            src="/home/icon-arrow.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
