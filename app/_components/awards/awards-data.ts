/**
 * awards-data.ts — Structural (non-translatable) data for the Award System page.
 *
 * Display copy (navLabel, title, description, quantityUnit, value notes) lives in
 * the `awards` i18n catalog: messages/<locale>/awards.json → items.<slug>.*
 *
 * Keys kept here are purely structural: slug, route anchor, numeric quantity,
 * monetary amount strings, image paths, dimensions, and layout direction.
 */

export interface AwardValue {
  /** Monetary amount string — structural, not translated (e.g. "7.000.000 VNĐ"). */
  amount: string;
  unit: string;
}

export interface AwardItem {
  /** URL slug used as both anchor ID and in /he-thong-giai#<slug> links */
  slug: string;
  /** Number of awards (e.g. "10", "02") */
  quantity: string;
  /**
   * Award value(s). Single award has one entry; Signature 2025 has two
   * (individual + collective).
   */
  values: AwardValue[];
  /**
   * Award image in the section: reuses the homepage card bg image + award name.
   * Points to the existing public/home/ assets.
   */
  nameImage: string;
  nameImageWidth: number;
  nameImageHeight: number;
  /**
   * Layout direction for the image+content row.
   * "image-left" = image on left, content on right.
   * "image-right" = content on left, image on right.
   */
  imagePosition: "image-left" | "image-right";
}

/** Structural slug list — used for nav order and IntersectionObserver setup. */
export const AWARD_SLUGS = [
  "top-talent",
  "top-project",
  "top-project-leader",
  "best-manager",
  "signature-2025-creator",
  "mvp",
] as const;

export type AwardSlug = (typeof AWARD_SLUGS)[number];

export const AWARDS_LIST: AwardItem[] = [
  {
    slug: "top-talent",
    quantity: "10",
    values: [{ amount: "7.000.000 VNĐ", unit: "" }],
    nameImage: "/home/award-name-top-talent.png",
    nameImageWidth: 221,
    nameImageHeight: 35,
    imagePosition: "image-left",
  },
  {
    slug: "top-project",
    quantity: "02",
    values: [{ amount: "15.000.000 VNĐ", unit: "" }],
    nameImage: "/home/award-name-top-project.png",
    nameImageWidth: 232,
    nameImageHeight: 35,
    imagePosition: "image-right",
  },
  {
    slug: "top-project-leader",
    quantity: "03",
    values: [{ amount: "7.000.000 VNĐ", unit: "" }],
    nameImage: "/home/award-name-top-project-leader.png",
    nameImageWidth: 232,
    nameImageHeight: 64,
    imagePosition: "image-left",
  },
  {
    slug: "best-manager",
    quantity: "01",
    values: [{ amount: "10.000.000 VNĐ", unit: "" }],
    nameImage: "/home/award-name-best-manager.png",
    nameImageWidth: 232,
    nameImageHeight: 30,
    imagePosition: "image-right",
  },
  {
    slug: "signature-2025-creator",
    quantity: "01",
    values: [
      { amount: "5.000.000 VNĐ", unit: "" },
      { amount: "8.000.000 VNĐ", unit: "" },
    ],
    nameImage: "/home/award-name-signature-creator.png",
    nameImageWidth: 232,
    nameImageHeight: 54,
    imagePosition: "image-left",
  },
  {
    slug: "mvp",
    quantity: "01",
    values: [{ amount: "15.000.000 VNĐ", unit: "" }],
    nameImage: "/home/award-name-mvp.png",
    nameImageWidth: 116,
    nameImageHeight: 52,
    imagePosition: "image-right",
  },
];
