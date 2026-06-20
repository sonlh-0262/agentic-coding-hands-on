"use client";

import type { RecipientOption } from "./kudo-recipient-field";

interface KudoMentionDropdownProps {
  options: RecipientOption[];
  /** Pixel position relative to the editor wrapper. */
  position: { top: number; left: number };
  onSelect: (option: RecipientOption) => void;
}

/**
 * KudoMentionDropdown — popover shown while typing "@name" in the editor.
 * Presentational: parent supplies filtered options + caret position.
 */
export default function KudoMentionDropdown({
  options,
  position,
  onSelect,
}: KudoMentionDropdownProps) {
  if (options.length === 0) return null;

  return (
    <ul
      role="listbox"
      aria-label="Gợi ý nhắc tên"
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        margin: 0,
        padding: "4px 0",
        listStyle: "none",
        background: "#FFF",
        border: "1px solid #998C5F",
        borderRadius: "8px",
        minWidth: "200px",
        maxHeight: "200px",
        overflowY: "auto",
        zIndex: 60,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      {options.map((opt) => (
        <li key={opt.id}>
          <button
            type="button"
            role="option"
            aria-selected={false}
            // onMouseDown (not onClick) so selection fires before the editor
            // loses focus / the caret moves.
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(opt);
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
              fontSize: "15px",
              fontWeight: 700,
              color: "rgba(0,16,26,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,234,158,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            {opt.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
