import { padded } from "@/lib/event/countdown";
import type { Remaining } from "@/lib/event/countdown";

interface CountdownTimerProps {
  remaining: Remaining;
}

interface TileProps {
  value: string;
  label: string;
}

/** A single glassmorphism digit box. */
function DigitBox({ char }: { char: string }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: "51px",
        height: "82px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          border: "0.5px solid #FFEA9E",
          borderRadius: "8px",
          opacity: 0.5,
          background:
            "linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.10) 100%)",
          backdropFilter: "blur(16.64px)",
        }}
      />
      <span
        className="relative z-10 font-bold text-white"
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "49px",
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        {char}
      </span>
    </div>
  );
}

function CountdownTile({ value, label }: TileProps) {
  // Render one box per digit so values >= 100 (e.g. "195" days) are not truncated.
  const digits = value.split("");
  return (
    <div
      className="flex flex-col items-start"
      style={{ gap: "14px", minWidth: "116px", height: "128px" }}
    >
      {/* Digit boxes */}
      <div className="flex flex-row items-center" style={{ gap: "14px" }}>
        {digits.map((char, i) => (
          <DigitBox key={i} char={char} />
        ))}
      </div>
      {/* Label */}
      <span
        className="font-bold text-white"
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "24px",
          lineHeight: "32px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Countdown timer — 3 tiles: DAYS / HOURS / MINUTES.
 * Receives pre-computed `remaining` from home-client (avoids running countdown
 * logic inside a presentational component).
 */
export default function CountdownTimer({ remaining }: CountdownTimerProps) {
  const { days, hours, minutes } = remaining;

  return (
    <div
      className="flex flex-row items-center"
      style={{ gap: "40px", width: "429px", height: "128px" }}
      role="timer"
      aria-label="Countdown to event"
    >
      <CountdownTile value={padded(days)} label="DAYS" />
      <CountdownTile value={padded(hours)} label="HOURS" />
      <CountdownTile value={padded(minutes)} label="MINUTES" />
    </div>
  );
}
