"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/** Toolbar button IDs matching the Figma mms_C_* sections */
export type ToolbarAction =
  | "bold"
  | "italic"
  | "strikethrough"
  | "numberList"
  | "link"
  | "quote";

const TOOLBAR_BUTTONS: {
  id: ToolbarAction;
  labelKey: string;
  icon: string;
}[] = [
  { id: "bold", labelKey: "toolbar.bold", icon: "/viet-kudo/Bold.svg" },
  { id: "italic", labelKey: "toolbar.italic", icon: "/viet-kudo/Italic.svg" },
  {
    id: "strikethrough",
    labelKey: "toolbar.strikethrough",
    icon: "/viet-kudo/Strikethrough.svg",
  },
  {
    id: "numberList",
    labelKey: "toolbar.numberList",
    icon: "/viet-kudo/Number_List.svg",
  },
  { id: "link", labelKey: "toolbar.link", icon: "/viet-kudo/Link.svg" },
  { id: "quote", labelKey: "toolbar.quote", icon: "/viet-kudo/Quote.svg" },
];

interface KudoToolbarProps {
  activeFormats?: Set<ToolbarAction>;
  onToggle?: (action: ToolbarAction) => void;
}

/**
 * KudoToolbar — Rich-text toolbar row (mms_C_Chức năng).
 * 6 icon buttons: Bold, Italic, Strikethrough, Number List, Link, Quote.
 * Top-left two corners rounded (8px 0 0 0) for the first button;
 * top-right (0 8px 0 0) for the last group.
 * Border: 1px solid #998C5F on each button, shared edge collapsed.
 */
export default function KudoToolbar({
  activeFormats = new Set(),
  onToggle,
}: KudoToolbarProps) {
  const t = useTranslations("kudos");

  return (
    <div
      className="flex items-center"
      style={{ alignSelf: "stretch" }}
      role="toolbar"
      aria-label={t("toolbar.ariaLabel")}
    >
      {TOOLBAR_BUTTONS.map((btn, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === TOOLBAR_BUTTONS.length - 1;
        const isActive = activeFormats.has(btn.id);
        const label = t(btn.labelKey as Parameters<typeof t>[0]);

        let borderRadius = "0px";
        if (isFirst) borderRadius = "8px 0 0 0";
        if (isLast) borderRadius = "0 8px 0 0";

        return (
          <button
            key={btn.id}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => onToggle?.(btn.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 16px",
              height: "40px",
              border: "1px solid #998C5F",
              borderRadius,
              marginLeft: isFirst ? 0 : "-1px",
              background: isActive
                ? "rgba(255, 234, 158, 0.2)"
                : "rgba(0, 0, 0, 0.00)",
              cursor: "pointer",
              position: "relative",
              zIndex: isActive ? 1 : 0,
              transition: "background 150ms ease",
            }}
          >
            <Image
              src={btn.icon}
              alt={label}
              width={24}
              height={24}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
