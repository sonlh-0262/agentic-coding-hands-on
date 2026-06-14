"use client";

import Image from "next/image";
import { AWARDS_NAV_ITEMS } from "./awards-data";

interface AwardsNavProps {
  activeSlug: string;
  onNavClick: (slug: string) => void;
}

/**
 * AwardsNav — Sticky left navigation for the awards detail section.
 * 6 items: Top Talent, Top Project, Top Project Leader, Best Manager,
 * Signature 2025 Creator, MVP.
 * Active item: gold text + bottom-border indicator + glow text-shadow.
 * Clicking smooth-scrolls to the matching section anchor.
 */
export default function AwardsNav({ activeSlug, onNavClick }: AwardsNavProps) {
  return (
    <nav
      className="sticky flex flex-col"
      style={{
        top: "96px", // 80px header + 16px gap
        width: "178px",
        gap: "16px",
        flexShrink: 0,
        alignSelf: "flex-start",
      }}
      aria-label="Awards navigation"
    >
      {AWARDS_NAV_ITEMS.map((item) => {
        const isActive = activeSlug === item.slug;
        return (
          <button
            key={item.slug}
            type="button"
            onClick={() => onNavClick(item.slug)}
            className="flex items-center text-left transition-colors duration-200"
            style={{
              gap: "4px",
              padding: "16px",
              borderBottom: isActive
                ? "1px solid rgba(255, 234, 158, 1)"
                : "1px solid transparent",
              borderRadius: isActive ? "0px" : "4px",
              background: "transparent",
              cursor: "pointer",
            }}
            aria-current={isActive ? true : undefined}
          >
            <span className="flex items-center" style={{ gap: "4px" }}>
              {/* Target icon */}
              <Image
                src="/awards/icon-target.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              />
              <span
                className="font-bold"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.25px",
                  color: isActive ? "rgba(255, 234, 158, 1)" : "#fff",
                  textShadow: isActive
                    ? "0 4px 4px rgba(0, 0, 0, 0.25), 0 0 6px #FAE287"
                    : "none",
                }}
              >
                {item.navLabel}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
