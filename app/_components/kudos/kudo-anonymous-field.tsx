"use client";

interface KudoAnonymousFieldProps {
  checked: boolean;
  anonymousName: string;
  onToggle: () => void;
  onNameChange: (name: string) => void;
}

/**
 * KudoAnonymousField — "Gửi ẩn danh" checkbox row (mms_G_Gửi ẩn danh).
 * When checked, reveals a text field for anonymous display name.
 * Figma: checkbox 24×24px, border 1px solid #999, bg #FFF, border-radius 4px.
 */
export default function KudoAnonymousField({
  checked,
  anonymousName,
  onToggle,
  onNameChange,
}: KudoAnonymousFieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      {/* Checkbox row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
          width: "100%",
          height: "28px",
        }}
      >
        {/* Custom checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label="Gửi lời cám ơn và ghi nhận ẩn danh"
          onClick={onToggle}
          style={{
            width: "24px",
            height: "24px",
            flexShrink: 0,
            border: "1px solid #999",
            borderRadius: "4px",
            background: checked ? "rgba(255, 234, 158, 1)" : "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 150ms ease",
          }}
        >
          {checked && (
            /* Checkmark SVG */
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1 5L5 9L13 1"
                stroke="rgba(0,16,26,1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Label */}
        <span
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            lineHeight: "28px",
            color: checked ? "rgba(0, 16, 26, 1)" : "rgba(153, 153, 153, 1)",
            transition: "color 150ms ease",
          }}
        >
          Gửi lời cám ơn và ghi nhận ẩn danh
        </span>
      </div>

      {/* Revealed: anonymous name input */}
      {checked && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "14px 24px",
            border: "1px solid #998C5F",
            borderRadius: "8px",
            background: "#FFF",
          }}
        >
          <input
            type="text"
            value={anonymousName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Tên hiển thị ẩn danh (tuỳ chọn)"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "24px",
              letterSpacing: "0.15px",
              color: "rgba(0, 16, 26, 1)",
            }}
          />
        </div>
      )}
    </div>
  );
}
