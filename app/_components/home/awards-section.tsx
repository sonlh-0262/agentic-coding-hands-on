import AwardCard from "./award-card";
import { AWARD_CARDS } from "./home-data";

/**
 * AwardsSection — "Hệ thống giải thưởng" section.
 * Contains: caption, title, divider, responsive grid of 6 award cards.
 * Desktop: 3 cols. Tablet/mobile: 2 cols → 1 col on small.
 */
export default function AwardsSection() {
  return (
    <section
      className="w-full"
      style={{ padding: "0 144px" }}
      aria-labelledby="awards-section-title"
    >
      <div
        className="w-full flex flex-col"
        style={{ gap: "80px", maxWidth: "1224px", margin: "0 auto" }}
      >
        {/* Header */}
        <div className="flex flex-col" style={{ gap: "16px" }}>
          {/* Caption */}
          <p
            className="font-bold text-white"
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "24px",
              lineHeight: "32px",
              margin: 0,
            }}
          >
            Sun* annual awards 2025
          </p>

          {/* Divider */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(46, 57, 64, 1)",
              margin: 0,
            }}
            aria-hidden="true"
          />

          {/* Title */}
          <h2
            id="awards-section-title"
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "57px",
              fontWeight: 700,
              lineHeight: "64px",
              letterSpacing: "-0.25px",
              color: "rgba(255, 234, 158, 1)",
              margin: 0,
            }}
          >
            Hệ thống giải thưởng
          </h2>
        </div>

        {/* Award cards grid — 2 rows of 3 cards */}
        <div className="flex flex-col" style={{ gap: "80px" }}>
          {/* Row 1 */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(3, 336px)",
              justifyContent: "space-between",
              gap: "80px",
            }}
          >
            {AWARD_CARDS.slice(0, 3).map((award) => (
              <AwardCard key={award.slug} award={award} />
            ))}
          </div>

          {/* Row 2 */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(3, 336px)",
              justifyContent: "space-between",
              gap: "80px",
            }}
          >
            {AWARD_CARDS.slice(3, 6).map((award) => (
              <AwardCard key={award.slug} award={award} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
