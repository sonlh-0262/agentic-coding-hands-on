import Image from "next/image";
import type { AwardValue } from "./awards-data";

interface AwardValueBlockProps {
  values: AwardValue[];
}

/**
 * AwardValueBlock — the "Giá trị giải thưởng:" block of an award section.
 * Renders the label row plus one or two value entries (Signature 2025 has two:
 * cá nhân / tập thể, separated by a "Hoặc" divider).
 */
export default function AwardValueBlock({ values }: AwardValueBlockProps) {
  return (
    <div className="flex flex-col" style={{ gap: "16px" }}>
      {/* "Giá trị giải thưởng:" label row */}
      <div className="flex items-center" style={{ gap: "16px" }}>
        <Image
          src="/awards/icon-license.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "rgba(255, 234, 158, 1)",
          }}
        >
          Giá trị giải thưởng:
        </span>
      </div>

      {/* Value entries (1 or 2 for Signature) */}
      {values.map((val, idx) => (
        <div key={val.amount + val.note} className="flex flex-col" style={{ gap: "4px" }}>
          {/* Amount */}
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: "44px",
              color: "#fff",
            }}
          >
            {val.amount}
          </span>
          {/* Note */}
          {val.note ? (
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                lineHeight: "20px",
                letterSpacing: "0.1px",
                color: "#fff",
              }}
            >
              {val.note}
            </span>
          ) : null}

          {/* "Hoặc" separator between Signature values */}
          {idx < values.length - 1 && (
            <div
              className="flex items-center"
              style={{ gap: "8px", marginTop: "8px" }}
              aria-hidden="true"
            >
              <span
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  lineHeight: "20px",
                  letterSpacing: "0.1px",
                  color: "rgba(46, 57, 64, 1)",
                }}
              >
                Hoặc
              </span>
              <hr
                style={{
                  flex: 1,
                  border: "none",
                  borderTop: "1px solid rgba(46, 57, 64, 1)",
                  margin: 0,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
