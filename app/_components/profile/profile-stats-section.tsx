/**
 * profile-stats-section.tsx
 *
 * Section B — "Thống kê" (Stats card)
 * Dark bordered card showing 5 stat rows + "Mở Secret Box" primary button.
 *
 * Card: background #00070C, border 1px #998C5F, borderRadius 17px, padding 40px.
 * Stats: label left, yellow number right (Montserrat 700 32px).
 * Separator: rgba(46,57,64,1) between row 3 and row 4.
 */

import type { ProfileStats } from "./profile-mock-data";

interface ProfileStatsSectionProps {
  stats: ProfileStats;
  onOpenSecretBox?: () => void;
}

interface StatRowProps {
  label: string;
  value: number;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "40px",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          lineHeight: "28px",
          color: "#FFF",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "32px",
          fontWeight: 700,
          lineHeight: "40px",
          letterSpacing: "0px",
          color: "rgba(255, 234, 158, 1)",
          minWidth: "46px",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ProfileStatsSection({
  stats,
  onOpenSecretBox,
}: ProfileStatsSectionProps) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          width: "680px",
          maxWidth: "100%",
          border: "1px solid #998C5F",
          borderRadius: "17px",
          padding: "40px",
          background: "#00070C",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Stat rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
            width: "100%",
          }}
        >
          <StatRow label="Số kudos bạn nhận được" value={stats.kudosReceived} />
          <StatRow label="Số kudos bạn đã gửi" value={stats.kudosSent} />
          <StatRow label="Số tim bạn nhận được" value={stats.heartsReceived} />

          {/* Separator between group 1 and group 2 */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background: "rgba(46, 57, 64, 1)",
            }}
          />

          <StatRow label="Secret Box bạn đã mở" value={stats.secretBoxOpened} />
          <StatRow
            label="Secret Box bạn chưa mở"
            value={stats.secretBoxUnopened}
          />

          {/* CTA button */}
          <button
            type="button"
            onClick={onOpenSecretBox}
            style={{
              width: "100%",
              height: "60px",
              borderRadius: "8px",
              border: "none",
              background: "rgba(255, 234, 158, 1)",
              color: "rgba(0, 16, 26, 1)",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              lineHeight: "28px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 200ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
          >
            Mở Secret Box 🎁
          </button>
        </div>
      </div>
    </section>
  );
}
