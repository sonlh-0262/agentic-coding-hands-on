import Image from "next/image";

export interface AwardValueDisplay {
  /** Monetary amount string — structural, not translated (e.g. "7.000.000 VNĐ"). */
  amount: string;
  /** Translated note string (e.g. "cho mỗi giải thưởng" / "per award"). */
  note: string;
}

interface AwardValueBlockProps {
  /** Translated label, e.g. "Giá trị giải thưởng:" / "Award value:" */
  label: string;
  /** Translated "Or" separator, e.g. "Hoặc" / "Or" */
  orLabel: string;
  values: AwardValueDisplay[];
}

/**
 * AwardValueBlock — the award value block of an award section.
 * Renders the label row plus one or two value entries (Signature 2025 has two:
 * individual / collective, separated by an "Or" divider).
 * Receives all display strings as props (translated by the parent).
 */
export default function AwardValueBlock({
  label,
  orLabel,
  values,
}: AwardValueBlockProps) {
  return (
    <div className="flex flex-col" style={{ gap: "16px" }}>
      {/* Label row */}
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
          {label}
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

          {/* Separator between Signature values */}
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
                {orLabel}
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
