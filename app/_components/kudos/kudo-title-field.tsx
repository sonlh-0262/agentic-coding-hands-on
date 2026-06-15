"use client";

import Image from "next/image";

interface KudoTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * KudoTitleField — "Danh hiệu" field (Frame 552 / mms_B_Danh hiệu).
 * Label + required asterisk on left, dropdown input on right.
 * Helper text below: "Ví dụ: Người truyền động lực cho tôi. ..."
 */
export default function KudoTitleField({ value, onChange }: KudoTitleFieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "0px",
      }}
    >
      {/* Row: label + input */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
          width: "100%",
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
            width: "139px",
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
            Danh hiệu
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

        {/* Input */}
        <div style={{ flex: "1 0 0", position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "16px 24px",
              border: "1px solid #998C5F",
              borderRadius: "8px",
              background: "#FFF",
              gap: "4px",
            }}
          >
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Dành tặng một danh hiệu cho đồng đội"
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
            <Image
              src="/viet-kudo/Down.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            />
          </div>
        </div>
      </div>

      {/* Helper text */}
      <div
        style={{
          paddingLeft: "calc(139px + 16px)",
          marginTop: "6px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "rgba(153, 153, 153, 1)",
            whiteSpace: "pre-line",
          }}
        >
          {`Ví dụ: Người truyền động lực cho tôi.\nDanh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.`}
        </p>
      </div>
    </div>
  );
}
