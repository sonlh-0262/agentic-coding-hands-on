"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { KudoFeedItem } from "@/lib/kudos/types";
import { htmlToPlainText } from "@/lib/kudos/validation";

/**
 * KudoFeedCard — one kudo in the feed. Presentational.
 *
 * The message is rendered as a PLAIN-TEXT excerpt (HTML stripped) so the feed
 * never injects unsanitized markup. Anonymous kudos already arrive with their
 * real sender stripped (see lib/kudos/queries.listRecentKudos).
 */
export default function KudoFeedCard({ kudo }: { kudo: KudoFeedItem }) {
  const t = useTranslations("kudos");
  const excerpt = htmlToPlainText(kudo.messageHtml);
  const authorDisplay = kudo.authorName ?? t("feed.anonymous");

  return (
    <article
      style={{
        background: "rgba(255, 248, 225, 1)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        fontFamily: "var(--font-montserrat), sans-serif",
        color: "rgba(0, 16, 26, 1)",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
        <span style={{ opacity: 0.7 }}>{t("feed.from")}</span> {authorDisplay}{" "}
        <span style={{ opacity: 0.7 }}>{t("feed.to")}</span> {kudo.recipientName}
      </p>

      {kudo.title && (
        <p style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
          {kudo.title}
        </p>
      )}

      <p
        style={{
          margin: 0,
          fontSize: "16px",
          lineHeight: "24px",
          whiteSpace: "pre-line",
        }}
      >
        {excerpt}
      </p>

      {kudo.imageUrls.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {kudo.imageUrls.map((url) => (
            <Image
              key={url}
              src={url}
              alt=""
              width={80}
              height={80}
              style={{ borderRadius: "8px", objectFit: "cover" }}
              unoptimized
            />
          ))}
        </div>
      )}

      {kudo.hashtags.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {kudo.hashtags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "999px",
                border: "1px solid #998C5F",
                background: "rgba(255, 234, 158, 0.25)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
