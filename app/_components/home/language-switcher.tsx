"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "@/i18n/actions";

// Design tokens from MoMorph (fileKey: 9ypp4enmFmdK3YAFJLIu6C, screenId: hUyaaugye2)
// Dropdown container : background #00070C, border 1px solid #998C5F, border-radius 8px, padding 6px
// Selected row       : background rgba(255,234,158,0.2), width 108px, height 56px, border-radius 2px
// Option row         : transparent background, width 110px, height 56px
// Row inner button   : padding 16px, gap 4px (icon+text) / 2px (flag+text in trigger), border-radius 4px
// Icon container     : 24×24px; flag image: 20×15px
// Label text         : Montserrat 700 16px/24px letter-spacing 0.15px, color white

type LocaleCode = "vi" | "en";
type DisplayCode = "VN" | "EN";

interface LangOption {
  locale: LocaleCode;
  display: DisplayCode;
  flag: string;
}

const LANG_OPTIONS: LangOption[] = [
  { locale: "vi", display: "VN", flag: "/home/flag-vn.svg" },
  { locale: "en", display: "EN", flag: "/home/flag-en.svg" },
];

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-montserrat), sans-serif",
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "0.15px",
  color: "#ffffff",
};

const ICON_WRAPPER_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px",
  flexShrink: 0,
};

/**
 * LanguageSwitcher — reads active locale from next-intl, persists selection
 * via setLocale server action (cookie-based, no routing required).
 *
 * Design: MoMorph fileKey 9ypp4enmFmdK3YAFJLIu6C, screenId hUyaaugye2.
 * Selected row: #00070C bg, gold-tint highlight rgba(255,234,158,0.20), 108×56px.
 * Option row: 110×56px, no tint.
 * Text: Montserrat 700 16px/24px tracking 0.15px white.
 */
export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Click-outside close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    } else if (e.key === "Escape") {
      close();
    }
  }

  function handleOptionKeyDown(e: React.KeyboardEvent, lang: LangOption) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(lang);
    } else if (e.key === "Escape") {
      close();
    }
  }

  function handleSelect(lang: LangOption) {
    close();
    if (lang.locale === locale) return;
    startTransition(async () => {
      await setLocale(lang.locale);
      router.refresh();
    });
  }

  const activeOption =
    LANG_OPTIONS.find((o) => o.locale === locale) ?? LANG_OPTIONS[0];
  const activeFlagAlt =
    activeOption.locale === "en"
      ? t("language.flagEnAlt")
      : t("language.flagVnAlt");

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language.switch")}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        className="flex items-center justify-between cursor-pointer transition-[background-color] duration-200 ease-[ease] hover:bg-white/[0.08]"
        style={{
          width: "108px",
          height: "56px",
          padding: "16px",
          gap: "2px",
          borderRadius: "4px",
        }}
      >
        <span className="flex items-center" style={{ gap: "4px" }}>
          <span style={ICON_WRAPPER_STYLE}>
            <Image
              src={activeOption.flag}
              alt={activeFlagAlt}
              width={20}
              height={15}
            />
          </span>
          <span style={LABEL_STYLE}>{activeOption.display}</span>
        </span>
        {/* Chevron rotates when open */}
        <Image
          src="/home/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          aria-label={t("language.switch")}
          className="absolute top-full left-0 mt-1 z-50 flex flex-col"
          style={{
            background: "#00070C",
            border: "1px solid #998C5F",
            borderRadius: "8px",
            padding: "6px",
          }}
        >
          {LANG_OPTIONS.map((lang) => {
            const isSelected = lang.locale === locale;
            const optFlagAlt =
              lang.locale === "en"
                ? t("language.flagEnAlt")
                : t("language.flagVnAlt");
            const optLabel =
              lang.locale === "en" ? t("language.en") : t("language.vn");

            return (
              <li
                key={lang.locale}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className="flex items-center cursor-pointer outline-none focus:bg-white/[0.08]"
                style={{
                  // Selected row: 108px wide with gold-tint bg; option row: 110px, transparent
                  width: isSelected ? "108px" : "110px",
                  height: "56px",
                  backgroundColor: isSelected
                    ? "rgba(255, 234, 158, 0.20)"
                    : "transparent",
                  borderRadius: isSelected ? "2px" : "0px",
                  padding: "16px",
                  gap: "4px",
                  flexShrink: 0,
                }}
                onClick={() => handleSelect(lang)}
                onKeyDown={(e) => handleOptionKeyDown(e, lang)}
              >
                <span style={ICON_WRAPPER_STYLE}>
                  <Image
                    src={lang.flag}
                    alt={optFlagAlt}
                    width={20}
                    height={15}
                  />
                </span>
                <span style={LABEL_STYLE}>{optLabel}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
