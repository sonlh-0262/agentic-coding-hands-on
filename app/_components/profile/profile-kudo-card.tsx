/**
 * profile-kudo-card.tsx
 *
 * Richer kudo card for the Profile page feed. Shows:
 *   - Sender info → arrow → Recipient info (with avatar, name, dept, title pill)
 *   - Optional "Spam" (orange) or "IDOL GIỚI TRẺ" (dark) status label
 *   - Timestamp
 *   - Message body (bordered yellow-tinted box)
 *   - 5-image gallery row (88×88, border-radius 18px)
 *   - Hashtag text row (red #D4271D)
 *   - Bottom row: heart count left, Copy Link button right
 *
 * All styling values extracted from Figma MCP data.
 */

import Image from "next/image";
import type { ProfileKudoCard as ProfileKudoCardType } from "./profile-mock-data";

interface ProfileKudoCardProps {
  card: ProfileKudoCardType;
  /** When provided, the heart becomes a toggle button. */
  onToggleHeart?: (kudoId: string) => void;
  /** When provided, Copy Link copies this URL; otherwise it copies the page URL. */
  shareUrl?: string;
}

interface UserInfoBlockProps {
  name: string;
  avatarSrc: string;
  department: string;
  title: string;
}

function UserInfoBlock({ name, avatarSrc, department, title }: UserInfoBlockProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "13px",
        width: "235px",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "64px",
          border: "1.869px solid #FFF",
          overflow: "hidden",
          background: "#EEE",
          flexShrink: 0,
        }}
      >
        <Image
          src={avatarSrc}
          alt={`Ảnh đại diện của ${name}`}
          width={64}
          height={64}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          unoptimized
        />
      </div>

      {/* Name + badges */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          width: "235px",
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
            color: "rgba(0, 16, 26, 1)",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.1px",
              color: "rgba(153, 153, 153, 1)",
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
          {/* Title pill */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "1px 6px",
              border: "0.5px solid #FFEA9E",
              borderRadius: "48px",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "11.64px",
              fontWeight: 700,
              lineHeight: "16.63px",
              color: "#FFF",
              textShadow: "0 0.395px 1.58px #000",
              background: "rgba(0,0,0,0.3)",
              letterSpacing: "0.083px",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Arrow SVG between sender and recipient */
function ArrowIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M6.667 16h18.666M18.667 9.333L25.333 16l-6.666 6.667"
        stroke="rgba(0,16,26,1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Heart icon — filled when the current user has hearted, outline otherwise. */
function HeartIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 27.333S4 20 4 11.333A6.667 6.667 0 0 1 16 7.44 6.667 6.667 0 0 1 28 11.333C28 20 16 27.333 16 27.333Z"
        fill={filled ? "rgba(212,39,29,1)" : "none"}
        stroke={filled ? "rgba(212,39,29,1)" : "rgba(0,16,26,1)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Link/copy icon */
function LinkIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="rgba(0,16,26,1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="rgba(0,16,26,1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfileKudoCard({
  card,
  onToggleHeart,
  shareUrl,
}: ProfileKudoCardProps) {
  const isSpam = card.statusLabel === "Spam";
  const isIdol = card.statusLabel === "IDOL GIỚI TRẺ";

  const handleCopyLink = () => {
    const url =
      shareUrl ??
      (typeof window !== "undefined" ? window.location.href : "");
    if (url && navigator?.clipboard) {
      void navigator.clipboard.writeText(url);
    }
  };

  return (
    <article
      style={{
        width: "680px",
        maxWidth: "100%",
        borderRadius: "24px",
        padding: "40px 40px 16px 40px",
        background: "rgba(255, 248, 225, 1)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "var(--font-montserrat), sans-serif",
        color: "rgba(0, 16, 26, 1)",
      }}
    >
      {/* Header: sender → recipient + optional status label */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "24px",
          width: "600px",
        }}
      >
        {/* Sender */}
        <UserInfoBlock
          name={card.sender.name}
          avatarSrc={card.sender.avatarSrc}
          department={card.sender.badge.department}
          title={card.sender.badge.title}
        />

        {/* Arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 0",
            flexShrink: 0,
          }}
        >
          <ArrowIcon />
        </div>

        {/* Recipient */}
        <UserInfoBlock
          name={card.recipient.name}
          avatarSrc={card.recipient.avatarSrc}
          department={card.recipient.badge.department}
          title={card.recipient.badge.title}
        />

        {/* Status label (Spam / IDOL GIỚI TRẺ) — top-right */}
        {card.statusLabel && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #EAEAEA",
              background: isSpam
                ? "rgba(255, 129, 4, 1)"
                : "rgba(0, 16, 26, 1)",
              flexShrink: 0,
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "0.5px",
                color: "#FFF",
                whiteSpace: "nowrap",
              }}
            >
              {card.statusLabel}
            </span>
          </div>
        )}
      </div>

      {/* Separator */}
      <div
        style={{ width: "600px", height: "1px", background: "rgba(255, 234, 158, 1)" }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "600px",
        }}
      >
        {/* Timestamp */}
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "rgba(153, 153, 153, 1)",
          }}
        >
          {card.timestamp}
        </p>

        {/* IDOL label row (only when statusLabel = IDOL GIỚI TRẺ) */}
        {isIdol && (
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "24px",
              letterSpacing: "0.5px",
              color: "rgba(0, 16, 26, 1)",
              textAlign: "center",
            }}
          >
            {card.statusLabel}
          </p>
        )}

        {/* Message bubble */}
        <div
          style={{
            border: "1px solid #FFEA9E",
            borderRadius: "12px",
            padding: "16px 24px",
            background: "rgba(255, 234, 158, 0.40)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: "32px",
              textAlign: "justify",
              color: "rgba(0, 16, 26, 1)",
            }}
          >
            {card.message}
          </p>
        </div>

        {/* Image gallery */}
        {card.images.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {card.images.slice(0, 5).map((src, i) => (
              <div
                key={i}
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "18px",
                  border: "1px solid #998C5F",
                  overflow: "hidden",
                  background: "#FFF",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={src}
                  alt={`Ảnh ${i + 1}`}
                  width={88}
                  height={88}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    borderRadius: "4px",
                    border: "1px solid #FFEA9E",
                  }}
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        {/* Hashtags */}
        {card.hashtags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "29.9px",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "0.5px",
                color: "rgba(212, 39, 29, 1)",
              }}
            >
              {card.hashtags.join(" ")}
            </p>
          </div>
        )}
      </div>

      {/* Bottom separator */}
      <div
        style={{ width: "600px", height: "1px", background: "rgba(255, 234, 158, 1)" }}
      />

      {/* Footer: hearts + copy link */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "600px",
          height: "56px",
          gap: "24px",
        }}
      >
        {/* Hearts — toggle button when interactive, static otherwise */}
        <button
          type="button"
          onClick={onToggleHeart ? () => onToggleHeart(card.id) : undefined}
          disabled={!onToggleHeart}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4px",
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: onToggleHeart ? "pointer" : "default",
            fontFamily: "var(--font-montserrat), sans-serif",
          }}
          aria-pressed={card.heartedByMe ?? false}
          aria-label={
            card.heartedByMe ? "Bỏ thích kudo này" : "Thích kudo này"
          }
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "32px",
              color: "rgba(0, 16, 26, 1)",
            }}
          >
            {card.heartCount}
          </span>
          <HeartIcon filled={card.heartedByMe ?? false} />
        </button>

        {/* Copy Link button */}
        <button
          type="button"
          onClick={handleCopyLink}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "16px",
            borderRadius: "4px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "rgba(0, 16, 26, 1)",
            transition: "background 200ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(0,16,26,0.06)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
          aria-label="Sao chép liên kết"
        >
          Copy Link
          <LinkIcon />
        </button>
      </div>
    </article>
  );
}
