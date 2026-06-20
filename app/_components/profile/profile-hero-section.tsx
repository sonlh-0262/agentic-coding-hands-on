/**
 * profile-hero-section.tsx
 *
 * Section A — "Myself Profile"
 * Hero banner: avatar + name + department/title info + 6 icon badge slots.
 *
 * Layout sits over the Keyvisual background (gradient overlay applied in
 * ProfilePageClient). This component handles absolute centering logic via
 * flexbox column.
 */

import Image from "next/image";
import type { IconSlot, UserBadge } from "./profile-mock-data";

interface ProfileHeroSectionProps {
  avatarSrc?: string;
  name: string;
  department: string;
  title: UserBadge["title"];
  iconSlots: IconSlot[];
}

/** Gray placeholder circle for a locked badge slot */
function BadgeSlotPlaceholder() {
  return (
    <div
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "100px",
        border: "2px solid #FFF",
        background: "#323231",
        flexShrink: 0,
      }}
      aria-label="Huy hiệu chưa mở khóa"
    />
  );
}

export default function ProfileHeroSection({
  avatarSrc,
  name,
  department,
  title,
  iconSlots,
}: ProfileHeroSectionProps) {
  return (
    <section
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        paddingTop: "120px", // clear fixed header (80px) + visual breathing room
        paddingBottom: "40px",
      }}
    >
      {/* A.1 Avatar */}
      <div
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "200px",
          border: "4px solid #FFF",
          overflow: "hidden",
          flexShrink: 0,
          background: "#2E3940",
        }}
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={`Ảnh đại diện của ${name}`}
            width={200}
            height={200}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            unoptimized
          />
        ) : (
          /* Fallback: initials circle */
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "48px",
              fontWeight: 700,
              color: "rgba(255,234,158,1)",
            }}
          >
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* A.2 Name + info */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* A.2.1 Name */}
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "36px",
            fontWeight: 700,
            lineHeight: "44px",
            letterSpacing: "0px",
            color: "rgba(255, 234, 158, 1)",
            textAlign: "center",
          }}
        >
          {name}
        </p>

        {/* A.2.2 Department + title pill */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              lineHeight: "28px",
              color: "#FFF",
            }}
          >
            {department}
          </span>

          {/* Dot separator */}
          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(153,153,153,1)",
              opacity: 0.4,
              flexShrink: 0,
            }}
          />

          {/* Title badge pill */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 8px",
              border: "0.5px solid #FFEA9E",
              borderRadius: "48px",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "12.82px",
              fontWeight: 700,
              lineHeight: "17px",
              color: "#FFF",
              textShadow: "0 0 1.3px #FFF",
              letterSpacing: "0.092px",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            {title}
          </span>
        </div>
      </div>

      {/* A.3 Icon badge collection row */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {iconSlots.map((slot) =>
            slot.imageSrc ? (
              <div
                key={slot.index}
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "100px",
                  border: "2px solid #FFF",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={slot.imageSrc}
                  alt={slot.alt ?? `Huy hiệu ${slot.index}`}
                  width={64}
                  height={64}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  unoptimized
                />
              </div>
            ) : (
              <BadgeSlotPlaceholder key={slot.index} />
            )
          )}
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            lineHeight: "28px",
            color: "#FFF",
          }}
        >
          Bộ sưu tập icon của tôi
        </p>
      </div>
    </section>
  );
}
