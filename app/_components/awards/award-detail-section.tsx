import Image from "next/image";
import type { AwardItem } from "./awards-data";
import AwardQuantityRow from "./award-quantity-row";
import AwardValueBlock from "./award-value-block";

interface AwardDetailSectionProps {
  award: AwardItem;
}

/**
 * AwardDetailSection — One detailed award section in the right-hand content column.
 * Layout (per design):
 *   - image-left: circular award image left, text content right
 *   - image-right: text content left, circular award image right
 * Each section has:
 *   - Award title (gold)
 *   - Description paragraph
 *   - Divider
 *   - "Số lượng giải thưởng:" + quantity + unit
 *   - Divider
 *   - "Giá trị giải thưởng:" + amount + note (one or two rows for Signature)
 * Ends with a horizontal rule divider between sections.
 */
export default function AwardDetailSection({ award }: AwardDetailSectionProps) {
  const isImageLeft = award.imagePosition === "image-left";

  return (
    <section
      id={award.slug}
      className="flex flex-col"
      style={{ gap: "80px", scrollMarginTop: "96px" }}
      aria-labelledby={`award-title-${award.slug}`}
    >
      {/* Row: image + content */}
      <div
        className="flex"
        style={{
          gap: "40px",
          flexDirection: isImageLeft ? "row" : "row-reverse",
          alignItems: "flex-start",
        }}
      >
        {/* Glowing circular award image */}
        <div
          className="relative flex items-center justify-center flex-shrink-0"
          style={{
            width: "336px",
            height: "336px",
            boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 0 6px 0 #FAE287",
            mixBlendMode: "screen",
            borderRadius: "50%",
          }}
          aria-hidden="true"
        >
          {/* Award background */}
          <Image
            src="/home/award-bg.png"
            alt=""
            fill
            sizes="336px"
            className="object-cover"
            style={{ borderRadius: "50%", border: "0.955px solid rgba(255, 234, 158, 1)" }}
          />
          {/* Award name image — centered overlay */}
          <div
            className="relative z-10 flex items-center justify-center"
            style={{ width: award.nameImageWidth, height: award.nameImageHeight }}
          >
            <Image
              src={award.nameImage}
              alt={award.title}
              width={award.nameImageWidth}
              height={award.nameImageHeight}
              className="object-contain"
            />
          </div>
        </div>

        {/* Text content */}
        <div
          className="flex flex-col"
          style={{ gap: "32px", flex: 1, minWidth: 0 }}
        >
          {/* Title + description block */}
          <div className="flex flex-col" style={{ gap: "24px" }}>
            {/* Award title */}
            <div className="flex items-center" style={{ gap: "16px" }}>
              <Image
                src="/awards/icon-target.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              />
              <h2
                id={`award-title-${award.slug}`}
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: "32px",
                  letterSpacing: "0px",
                  color: "rgba(255, 234, 158, 1)",
                  margin: 0,
                }}
              >
                {award.title}
              </h2>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "0.5px",
                color: "#fff",
                textAlign: "justify",
                margin: 0,
              }}
            >
              {award.description}
            </p>
          </div>

          {/* Divider */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(46, 57, 64, 1)",
              margin: 0,
            }}
            aria-hidden="true"
          />

          {/* Quantity row */}
          <AwardQuantityRow
            quantity={award.quantity}
            quantityUnit={award.quantityUnit}
          />

          {/* Divider */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(46, 57, 64, 1)",
              margin: 0,
            }}
            aria-hidden="true"
          />

          {/* Value block */}
          <AwardValueBlock values={award.values} />
        </div>
      </div>

      {/* Section divider */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid rgba(46, 57, 64, 1)",
          margin: 0,
        }}
        aria-hidden="true"
      />
    </section>
  );
}
