import { padded } from "@/lib/event/countdown";
import type { Remaining } from "@/lib/event/countdown";

export interface PrelaunchCountdownProps {
  /** Pre-computed remaining time. Pass mock value { days:0, hours:5, minutes:20, ended:false } for static preview. */
  remaining: Remaining;
}

interface TileProps {
  value: string;
  label: string;
}

/**
 * A single LED/7-segment digit box.
 *
 * Matches Figma node "Group 5 / Group 4" (componentId 186:2619):
 * - box: 77×123px, border-radius 12px
 * - border: 0.75px solid #FFEA9E at 0.5 opacity
 * - background: linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)
 * - backdrop-filter: blur(24.96px)
 * - digit font: "Digital Numbers" (LED style), 73.73px, weight 400, white
 */
function LedDigitBox({ char }: { char: string }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: "77px",
        height: "123px",
        borderRadius: "12px",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Glassmorphism background layer */}
      <div
        className="absolute inset-0"
        style={{
          border: "0.75px solid #FFEA9E",
          borderRadius: "12px",
          opacity: 0.5,
          background:
            "linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.10) 100%)",
          backdropFilter: "blur(24.96px)",
          WebkitBackdropFilter: "blur(24.96px)",
        }}
      />
      {/* LED digit character */}
      <span
        className="relative z-10 text-white"
        style={{
          fontFamily: "'Digital Numbers', monospace",
          fontSize: "73.73px",
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        {char}
      </span>
    </div>
  );
}

/**
 * One countdown unit: two LED digit boxes + label underneath.
 *
 * Figma structure "1_Days / 2_Hours / 3_Minutes":
 * - tile container: 175×192px, flex-col, gap 21px
 * - digit row (Frame 485): flex-row, gap 21px
 * - label: Montserrat Bold 36px / 48px lineHeight, white
 */
function LedCountdownTile({ value, label }: TileProps) {
  const digits = value.split("").slice(0, 2);

  return (
    <div
      className="flex flex-col items-start"
      style={{
        width: "175px",
        height: "192px",
        gap: "21px",
        flexShrink: 0,
      }}
    >
      {/* Digit boxes row */}
      <div className="flex flex-row items-center" style={{ gap: "21px" }}>
        {digits.map((char, i) => (
          <LedDigitBox key={i} char={char} />
        ))}
      </div>
      {/* Unit label */}
      <span
        className="font-bold text-white"
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "36px",
          fontWeight: 700,
          lineHeight: "48px",
          letterSpacing: 0,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Prelaunch countdown display — LED-style digit tiles for DAYS / HOURS / MINUTES.
 *
 * Figma node: "Countdown time" (2268:35136)
 * - title: "Sự kiện sẽ bắt đầu sau", Montserrat Bold 36px, white, centered
 * - tiles row ("Time" 2268:35138): 644×192px, flex-row, gap 60px
 * - outer wrapper uses flex-col gap 24px
 *
 * Presentational — no timer logic. Parent feeds `remaining`.
 */
export default function PrelaunchCountdown({
  remaining,
}: PrelaunchCountdownProps) {
  const { days, hours, minutes } = remaining;

  return (
    <div
      className="flex flex-col items-center"
      style={{ gap: "24px" }}
      role="timer"
      aria-label="Đếm ngược tới sự kiện"
    >
      {/* Title */}
      <p
        className="text-white font-bold text-center"
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "36px",
          fontWeight: 700,
          lineHeight: "48px",
          letterSpacing: 0,
          margin: 0,
        }}
      >
        Sự kiện sẽ bắt đầu sau
      </p>

      {/* Countdown tiles row */}
      <div className="flex flex-row items-start" style={{ gap: "60px" }}>
        {/* Tiles are 2-digit LED displays (spec range 00–99). Cap days at 99 so an
            out-of-range value shows a visible "99" instead of silently truncating. */}
        <LedCountdownTile value={padded(Math.min(days, 99))} label="DAYS" />
        <LedCountdownTile value={padded(hours)} label="HOURS" />
        <LedCountdownTile value={padded(minutes)} label="MINUTES" />
      </div>
    </div>
  );
}
