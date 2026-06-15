"use client";

import { useState } from "react";
import SiteHeader from "@/app/_components/home/site-header";
import SiteFooter from "@/app/_components/home/site-footer";
import WidgetButton from "@/app/_components/home/widget-button";
import type { HomeUser } from "@/app/_components/home/home-client";
import type { Hashtag, KudoFeedItem, KudoInput } from "@/lib/kudos/types";
import { createKudo, searchRecipients, uploadKudoImage } from "@/lib/kudos/actions";
import VietKudoModal from "./viet-kudo-modal";
import type { RecipientOption } from "./kudo-recipient-field";
import KudoFeedCard from "./kudo-feed-card";

export interface KudosPageClientProps {
  user: HomeUser | null;
  feed: KudoFeedItem[];
  hashtagOptions: Hashtag[];
}

/**
 * KudosPageClient — client wrapper for /kudos.
 * Owns the modal open state and bridges the modal to the Supabase server
 * actions (recipient search, image upload, createKudo).
 */
export default function KudosPageClient({
  user,
  feed,
  hashtagOptions,
}: KudosPageClientProps) {
  const [open, setOpen] = useState(false);

  const handleSearchRecipients = async (
    query: string,
  ): Promise<RecipientOption[]> => {
    const profiles = await searchRecipients(query);
    return profiles.map((p) => ({ id: p.id, name: p.fullName }));
  };

  const handleUploadImage = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return uploadKudoImage(form);
  };

  const handleSubmit = (input: KudoInput) => createKudo(input);

  return (
    <main className="relative min-h-screen w-full bg-[#00101A]">
      <SiteHeader user={user} />

      <section
        style={{ padding: "80px 144px 0", maxWidth: "1120px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "40px",
              fontWeight: 700,
              color: "rgba(255, 234, 158, 1)",
            }}
          >
            Sun* Kudos
          </h1>

          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              padding: "16px 32px",
              border: "none",
              borderRadius: "8px",
              background: "rgba(255, 234, 158, 1)",
              color: "rgba(0, 16, 26, 1)",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Viết Kudo
          </button>
        </div>

        {feed.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Chưa có kudo nào. Hãy là người đầu tiên gửi lời cám ơn!
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {feed.map((kudo) => (
              <KudoFeedCard key={kudo.id} kudo={kudo} />
            ))}
          </div>
        )}
      </section>

      <div style={{ paddingTop: "120px" }}>
        <SiteFooter />
      </div>

      <WidgetButton />

      <VietKudoModal
        open={open}
        hashtagOptions={hashtagOptions}
        onClose={() => setOpen(false)}
        onSearchRecipients={handleSearchRecipients}
        onUploadImage={handleUploadImage}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
