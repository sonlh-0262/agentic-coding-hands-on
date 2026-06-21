"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface HashtagChip {
  id: string;
  label: string;
}

interface KudoHashtagFieldProps {
  chips: HashtagChip[];
  /** Seeded hashtags available to add (already excludes selected chips). */
  options: HashtagChip[];
  onAdd: (option: HashtagChip) => void;
  onRemove: (id: string) => void;
  maxCount?: number;
}

/**
 * KudoHashtagField — "Hashtag" field (mms_E_Frame 536).
 * Label on left, "+ Hashtag / Tối đa 5" button + chips on right. Clicking the
 * add button opens a dropdown of the seeded hashtags; picking one adds a chip.
 * Chips show an x button to remove. Add button hides at maxCount.
 */
export default function KudoHashtagField({
  chips,
  options,
  onAdd,
  onRemove,
  maxCount = 5,
}: KudoHashtagFieldProps) {
  const t = useTranslations("kudos");
  const canAdd = chips.length < maxCount;
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "16px",
        width: "100%",
        minHeight: "48px",
      }}
    >
      {/* Label */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "2px",
          flexShrink: 0,
          width: "108px",
          paddingTop: "10px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            lineHeight: "28px",
            color: "rgba(0, 16, 26, 1)",
          }}
        >
          {t("hashtag.label")}
        </span>
        <span
          style={{
            fontFamily: "Noto Sans JP, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "20px",
            color: "rgba(207, 19, 34, 1)",
          }}
          aria-hidden="true"
        >
          *
        </span>
      </div>

      {/* Tag group */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Add button + seeded-hashtag dropdown */}
        {canAdd && (
          <div style={{ position: "relative" }}>
          <button
            type="button"
            aria-label={t("hashtag.addAriaLabel")}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 8px",
              border: "1px solid #998C5F",
              borderRadius: "8px",
              background: "#FFF",
              cursor: "pointer",
              height: "48px",
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,234,158,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#FFF";
            }}
          >
            <Image
              src="/viet-kudo/Plus.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  lineHeight: "16px",
                  letterSpacing: "0.5px",
                  color: "#999",
                }}
              >
                {t("hashtag.label")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  lineHeight: "16px",
                  letterSpacing: "0.5px",
                  color: "#999",
                }}
              >
                {t("hashtag.maxCount", { count: maxCount })}
              </span>
            </div>
          </button>
          {open && (
            <ul
              role="listbox"
              aria-label={t("hashtag.dropdownAriaLabel")}
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                zIndex: 50,
                margin: 0,
                padding: "4px 0",
                listStyle: "none",
                background: "#FFF",
                border: "1px solid #998C5F",
                borderRadius: "8px",
                minWidth: "200px",
                maxHeight: "200px",
                overflowY: "auto",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}
            >
              {options.length === 0 ? (
                <li
                  style={{
                    padding: "8px 16px",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "14px",
                    color: "#999",
                  }}
                >
                  {t("hashtag.noOptions")}
                </li>
              ) : (
                options.map((opt) => (
                  <li key={opt.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => {
                        onAdd(opt);
                        setOpen(false);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 16px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "rgba(0,16,26,1)",
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
          </div>
        )}

        {/* Chips */}
        {chips.map((chip) => (
          <div
            key={chip.id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 10px",
              border: "1px solid #998C5F",
              borderRadius: "8px",
              background: "rgba(255, 234, 158, 0.2)",
              height: "36px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                lineHeight: "20px",
                color: "rgba(0, 16, 26, 1)",
              }}
            >
              {chip.label}
            </span>
            <button
              type="button"
              aria-label={t("hashtag.removeAriaLabel", { label: chip.label })}
              onClick={() => onRemove(chip.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "rgba(212, 39, 29, 1)",
                border: "none",
                cursor: "pointer",
                padding: "1.5px",
                flexShrink: 0,
              }}
            >
              <Image
                src="/viet-kudo/Close_Tiny.svg"
                alt={t("hashtag.removeAlt", { label: chip.label })}
                width={17}
                height={17}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
