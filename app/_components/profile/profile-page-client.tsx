"use client";

/**
 * profile-page-client.tsx
 *
 * Root client compositor for the "Profile bản thân" screen.
 * Layout (top to bottom):
 *   1. SiteHeader (reused)
 *   2. Keyvisual hero banner (full-width background gradient)
 *   3. Section A — Profile hero (avatar, name, icon slots)
 *   4. Section B — Stats card
 *   5. Section C — Awards header + filter
 *   6. Section D — Kudo card feed
 *   7. SiteFooter (reused)
 *
 * All sections are center-aligned at max-width ~680px content column
 * (matching the Figma 680px content inside a 1440px artboard).
 *
 * Props are typed so the backend track can wire real data with minimal changes.
 */

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import SiteHeader from "@/app/_components/home/site-header";
import SiteFooter from "@/app/_components/home/site-footer";
import ProfileHeroSection from "./profile-hero-section";
import ProfileStatsSection from "./profile-stats-section";
import ProfileAwardsHeader from "./profile-awards-header";
import ProfileKudoCard from "./profile-kudo-card";
import { toggleHeart } from "@/lib/profile/actions";
import type { HomeUser } from "@/app/_components/home/home-client";
import type {
  IconSlot,
  ProfileStats,
  ProfileKudoCard as ProfileKudoCardType,
  UserBadge,
} from "./profile-mock-data";

type FeedDirection = "sent" | "received";

export interface ProfilePageClientProps {
  user: HomeUser | null;
  profileUser: {
    name: string;
    avatarSrc?: string;
    department: string;
    title: UserBadge["title"];
    iconSlots: IconSlot[];
  };
  stats: ProfileStats;
  sentKudosCount: number;
  receivedKudosCount: number;
  /** Active feed filter (drives Section C + Section D). */
  filter: FeedDirection;
  kudoCards: ProfileKudoCardType[];
}

export default function ProfilePageClient({
  user,
  profileUser,
  stats,
  sentKudosCount,
  receivedKudosCount,
  filter,
  kudoCards,
}: ProfilePageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Filter is reflected in the URL so the server re-fetches the right feed.
  const handleChangeFilter = (direction: FeedDirection) => {
    startTransition(() => {
      router.push(`/profile?filter=${direction}`, { scroll: false });
    });
  };

  // Heart toggle persists via the server action, then refreshes server data.
  const handleToggleHeart = (kudoId: string) => {
    startTransition(async () => {
      await toggleHeart(kudoId);
      router.refresh();
    });
  };

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: "#00101A",
        overflowX: "hidden",
      }}
    >
      {/* ① Top navigation */}
      <SiteHeader user={user} />

      {/* ② Keyvisual background image */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "512px",
          backgroundImage: "url(/home/keyvisual-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Gradient overlay (Cover layer in Figma) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "445px",
          left: 0,
          width: "100%",
          height: "957px",
          background:
            "linear-gradient(8deg, #00101A 8.6%, rgba(0, 19, 32, 0.00) 37.25%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Content wrapper — centers the 680px column */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ③ Section A — Profile hero */}
        <div style={{ width: "100%", maxWidth: "1440px" }}>
          <ProfileHeroSection
            avatarSrc={profileUser.avatarSrc}
            name={profileUser.name}
            department={profileUser.department}
            title={profileUser.title}
            iconSlots={profileUser.iconSlots}
          />
        </div>

        {/* ④ Section B — Stats */}
        <div
          style={{
            width: "100%",
            maxWidth: "1440px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ProfileStatsSection stats={stats} />
        </div>

        {/* ⑤ Section C — Awards header */}
        <div
          style={{
            width: "100%",
            maxWidth: "1440px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ProfileAwardsHeader
            sentCount={sentKudosCount}
            receivedCount={receivedKudosCount}
            filter={filter}
            onChangeFilter={handleChangeFilter}
          />
        </div>

        {/* ⑥ Section D — Kudo card feed */}
        <div
          style={{
            width: "680px",
            maxWidth: "calc(100% - 32px)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "40px 0 80px",
            opacity: isPending ? 0.6 : 1,
            transition: "opacity 150ms ease",
          }}
        >
          {kudoCards.length === 0 && (
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "16px",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              {filter === "sent"
                ? "Bạn chưa gửi kudo nào."
                : "Bạn chưa nhận kudo nào."}
            </p>
          )}
          {kudoCards.map((card) => (
            <ProfileKudoCard
              key={card.id}
              card={card}
              onToggleHeart={handleToggleHeart}
              heartDisabled={isPending}
            />
          ))}

          {/* Truncation note — the feed shows the most recent N; the filter
              count is the true total (review finding I1). */}
          {kudoCards.length > 0 &&
            kudoCards.length <
              (filter === "sent" ? sentKudosCount : receivedKudosCount) && (
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "14px",
                  textAlign: "center",
                  padding: "8px 0",
                }}
              >
                Đang hiển thị {kudoCards.length} kudo gần nhất /{" "}
                {filter === "sent" ? sentKudosCount : receivedKudosCount} tổng cộng
              </p>
            )}
        </div>
      </div>

      {/* ⑦ Footer */}
      <SiteFooter />
    </main>
  );
}
