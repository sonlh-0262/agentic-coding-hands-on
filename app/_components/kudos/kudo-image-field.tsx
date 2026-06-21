"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export interface ImageItem {
  id: string;
  /** URL or data URL for preview */
  previewUrl: string;
  /** Original file object, undefined for mock items */
  file?: File;
}

interface KudoImageFieldProps {
  images: ImageItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  maxCount?: number;
}

/**
 * KudoImageField — "Image" field (mms_F_Frame 537).
 * Label on left, image thumbnails (80×80px) with close button + "+ Image" button on right.
 * From Figma: 5 sample images max, thumbnails have border #FFEA9E + border-radius 4px.
 */
export default function KudoImageField({
  images,
  onAdd,
  onRemove,
  maxCount = 5,
}: KudoImageFieldProps) {
  const t = useTranslations("kudos");
  const canAdd = images.length < maxCount;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "16px",
        width: "100%",
        minHeight: "80px",
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
          width: "74px",
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
          {t("image.label")}
        </span>
      </div>

      {/* Thumbnails row */}
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
        {/* Existing images */}
        {images.map((img) => (
          <div
            key={img.id}
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
              border: "1px solid #998C5F",
              borderRadius: "18px",
              background: "#FFF",
              flexShrink: 0,
              overflow: "visible",
            }}
          >
            {/* Thumbnail */}
            <Image
              src={img.previewUrl}
              alt={t("image.thumbnailAlt")}
              fill
              style={{
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid rgba(255, 234, 158, 1)",
              }}
            />
            {/* Remove button */}
            <button
              type="button"
              aria-label={t("image.removeAriaLabel")}
              onClick={() => onRemove(img.id)}
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
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
                zIndex: 10,
              }}
            >
              <Image
                src="/viet-kudo/Close_Tiny.svg"
                alt={t("image.removeAlt")}
                width={17}
                height={17}
              />
            </button>
          </div>
        ))}

        {/* Add button */}
        {canAdd && (
          <button
            type="button"
            aria-label={t("image.addAriaLabel")}
            onClick={onAdd}
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
                {t("image.label")}
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
                {t("image.maxCount", { count: maxCount })}
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
