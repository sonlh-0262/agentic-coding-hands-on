import Image from "next/image";

interface AwardQuantityRowProps {
  /** Translated label, e.g. "Số lượng giải thưởng:" / "Number of awards:" */
  label: string;
  quantity: string;
  /** Translated unit, e.g. "Cá nhân" / "Individuals" */
  quantityUnit: string;
}

/**
 * AwardQuantityRow — the quantity row of an award section.
 * Diamond icon + gold label + large quantity + unit.
 * Receives all display strings as props (translated by the parent).
 */
export default function AwardQuantityRow({
  label,
  quantity,
  quantityUnit,
}: AwardQuantityRowProps) {
  return (
    <div className="flex items-center" style={{ gap: "16px" }}>
      <Image
        src="/awards/icon-diamond.svg"
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
      <span
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "36px",
          fontWeight: 700,
          lineHeight: "44px",
          color: "#fff",
        }}
      >
        {quantity}
      </span>
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
        {quantityUnit}
      </span>
    </div>
  );
}
