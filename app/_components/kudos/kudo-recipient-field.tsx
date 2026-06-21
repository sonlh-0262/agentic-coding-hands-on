"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export interface RecipientOption {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface KudoRecipientFieldProps {
  value: RecipientOption | null;
  searchText: string;
  isOpen: boolean;
  options: RecipientOption[];
  onSearchChange: (text: string) => void;
  onSelect: (option: RecipientOption) => void;
  onToggleOpen: () => void;
}

/**
 * KudoRecipientField — "Người nhận" field (mms_B).
 * Label + required asterisk left, dropdown search input right.
 * Dropdown arrow from Figma: /viet-kudo/Down.svg
 */
export default function KudoRecipientField({
  value,
  searchText,
  isOpen,
  options,
  onSearchChange,
  onSelect,
  onToggleOpen,
}: KudoRecipientFieldProps) {
  const t = useTranslations("kudos");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "16px",
        width: "100%",
        height: "56px",
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
          width: "146px",
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
          {t("recipient.label")}
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

      {/* Search/Select input */}
      <div style={{ flex: "1 0 0", position: "relative" }}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={t("recipient.searchAriaLabel")}
          onClick={onToggleOpen}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "16px 24px",
            border: "1px solid #998C5F",
            borderRadius: "8px",
            background: "#FFF",
            cursor: "pointer",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "24px",
              letterSpacing: "0.15px",
              color: value ? "rgba(0, 16, 26, 1)" : "rgba(153, 153, 153, 1)",
              flex: 1,
              textAlign: "left",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value ? value.name : t("recipient.searchPlaceholder")}
          </span>
          <Image
            src="/viet-kudo/Down.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
            style={{
              flexShrink: 0,
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
            }}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            role="listbox"
            aria-label={t("recipient.listAriaLabel")}
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "#FFF",
              border: "1px solid #998C5F",
              borderRadius: "8px",
              zIndex: 50,
              maxHeight: "200px",
              overflowY: "auto",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}
          >
            {/* Search input inside dropdown */}
            <div style={{ padding: "8px 16px", borderBottom: "1px solid #E5E5E5" }}>
              <input
                type="text"
                placeholder={t("recipient.searchPlaceholder")}
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: "24px",
                  color: "rgba(0,16,26,1)",
                }}
              />
            </div>
            {options.length === 0 ? (
              <div
                style={{
                  padding: "12px 16px",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "14px",
                  color: "#999",
                }}
              >
                {t("recipient.noResults")}
              </div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={value?.id === opt.id}
                  onClick={() => onSelect(opt)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 16px",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: "24px",
                    color: "rgba(0,16,26,1)",
                    background:
                      value?.id === opt.id
                        ? "rgba(255,234,158,0.3)"
                        : "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,234,158,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      value?.id === opt.id
                        ? "rgba(255,234,158,0.3)"
                        : "transparent";
                  }}
                >
                  {opt.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
