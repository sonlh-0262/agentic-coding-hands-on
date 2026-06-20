"use client";

/**
 * profile-awards-header.tsx
 *
 * Section C — "Awards header"
 * Eyebrow "Sun* Annual Awards 2025", big yellow "KUDOS" title,
 * and a presentational "Đã gửi (5)" filter dropdown button.
 *
 * From design:
 *   - eyebrow: Montserrat 700 24px white
 *   - KUDOS: Montserrat 700 57px #FFEA9E letter-spacing -0.25px
 *   - separator: 1px rgba(46,57,64,1)
 *   - filter button: border 1px #998C5F, borderRadius 4px,
 *     background rgba(255,234,158,0.10), padding 16px 24px
 */

import { useState } from "react";

type FeedDirection = "sent" | "received";

interface ProfileAwardsHeaderProps {
  /** Number of kudos sent, shown when the "Đã gửi" filter is active. */
  sentCount: number;
  /** Number of kudos received, shown when the "Đã nhận" filter is active. */
  receivedCount: number;
  /** Active filter direction. */
  filter: FeedDirection;
  /** Called when the user picks a different filter. */
  onChangeFilter: (direction: FeedDirection) => void;
}

export default function ProfileAwardsHeader({
  sentCount,
  receivedCount,
  filter,
  onChangeFilter,
}: ProfileAwardsHeaderProps) {
  const [open, setOpen] = useState(false);
  const activeLabel =
    filter === "sent" ? `Đã gửi (${sentCount})` : `Đã nhận (${receivedCount})`;

  const handlePick = (direction: FeedDirection) => {
    setOpen(false);
    if (direction !== filter) onChangeFilter(direction);
  };

  return (
    <section
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 0 0",
      }}
    >
      <div
        style={{
          width: "680px",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "#FFF",
            letterSpacing: "0px",
          }}
        >
          Sun* Annual Awards 2025
        </p>

        {/* Separator */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "rgba(46, 57, 64, 1)",
          }}
        />

        {/* Title row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "57px",
              fontWeight: 700,
              lineHeight: "64px",
              letterSpacing: "-0.25px",
              color: "rgba(255, 234, 158, 1)",
            }}
          >
            KUDOS
          </h2>

          {/* Filter dropdown — Sent / Received */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 24px",
                border: "1px solid #998C5F",
                borderRadius: "4px",
                background: "rgba(255, 234, 158, 0.10)",
                color: "#FFF",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "0.15px",
                cursor: "pointer",
                transition: "background 200ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255, 234, 158, 0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255, 234, 158, 0.10)";
              }}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label={`Lọc kudos — đang hiển thị ${activeLabel}`}
            >
              {activeLabel}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{
                  transform: open ? "rotate(180deg)" : "none",
                  transition: "transform 200ms ease",
                }}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {open && (
              <ul
                role="listbox"
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  margin: 0,
                  padding: "4px",
                  listStyle: "none",
                  minWidth: "100%",
                  border: "1px solid #998C5F",
                  borderRadius: "4px",
                  background: "#0A1A24",
                  zIndex: 10,
                }}
              >
                {(
                  [
                    { dir: "sent" as const, label: `Đã gửi (${sentCount})` },
                    {
                      dir: "received" as const,
                      label: `Đã nhận (${receivedCount})`,
                    },
                  ]
                ).map((opt) => (
                  <li key={opt.dir} role="option" aria-selected={filter === opt.dir}>
                    <button
                      type="button"
                      onClick={() => handlePick(opt.dir)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 16px",
                        border: "none",
                        borderRadius: "4px",
                        background:
                          filter === opt.dir
                            ? "rgba(255, 234, 158, 0.18)"
                            : "transparent",
                        color: "#FFF",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "16px",
                        fontWeight: 700,
                        lineHeight: "24px",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
