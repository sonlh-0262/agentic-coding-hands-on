"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * RootFurtherSection — "ROOT FURTHER" decorative heading + description paragraphs.
 * Uses /home/root-text.png and /home/further-text.png as decorative bg images.
 * Background card: rounded dark container at 8px border-radius.
 */
export default function RootFurtherSection() {
  const t = useTranslations("home");
  const paragraphs = [
    t("rootFurther.paragraphs.0"),
    t("rootFurther.paragraphs.1"),
  ];
  const proverb = t("rootFurther.proverb");
  return (
    <section
      className="w-full flex flex-col items-center"
      style={{
        padding: "0 144px",
        backgroundColor: "#00101A",
      }}
      aria-label={t("rootFurther.sectionAriaLabel")}
    >
      <div
        className="w-full flex flex-col items-center"
        style={{
          gap: "32px",
          padding: "120px 104px",
          borderRadius: "8px",
          maxWidth: "1152px",
          margin: "0 auto",
        }}
      >
        {/* ROOT / FURTHER decorative text images */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: "290px", height: "134px" }}
          aria-hidden="true"
        >
          {/* Root text */}
          <Image
            src="/home/root-text.png"
            alt=""
            width={189}
            height={67}
            style={{
              position: "absolute",
              top: 0,
              left: "51px",
              aspectRatio: "189/67",
            }}
          />
          {/* Further text */}
          <Image
            src="/home/further-text.png"
            alt=""
            width={290}
            height={67}
            style={{
              position: "absolute",
              top: "67px",
              left: 0,
              aspectRatio: "290/67",
            }}
          />
        </div>

        {/* Description paragraphs */}
        <div
          className="w-full flex flex-col"
          style={{ gap: "32px", maxWidth: "1152px" }}
        >
          {paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className="font-bold text-white"
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "24px",
                lineHeight: "32px",
                letterSpacing: "0px",
                textAlign: "justify",
                whiteSpace: "pre-line",
              }}
            >
              {idx === 0 ? (
                <>
                  {paragraph}
                  {/* English proverb quote after first paragraph */}
                  <span
                    className="block text-center font-bold mt-8"
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: "20px",
                      lineHeight: "32px",
                      color: "#fff",
                    }}
                  >
                    {proverb}
                  </span>
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
