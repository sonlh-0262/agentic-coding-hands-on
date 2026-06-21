/**
 * home-data.ts — Structural/static content for the Homepage SAA.
 * Display copy (labels, titles, descriptions) has been moved to
 * messages/{locale}/home.json and is consumed via t() in each component.
 * Only structural fields (hrefs, image paths, slugs, ids, counts) remain here.
 */

export interface NavLink {
  /** i18n key within home.header.nav (or home.footer.nav) */
  labelKey: string;
  href: string;
}

// Active state is derived from the current pathname in the header/footer
// components (route-aware), not hardcoded here.
export const NAV_LINKS: NavLink[] = [
  { labelKey: "aboutSaa", href: "/" },
  { labelKey: "awardsInformation", href: "/he-thong-giai" },
  { labelKey: "sunKudos", href: "/kudos" },
];

export const FOOTER_NAV_LINKS: NavLink[] = [
  { labelKey: "aboutSaa", href: "/" },
  { labelKey: "awardsInformation", href: "/he-thong-giai" },
  { labelKey: "sunKudos", href: "/kudos" },
  { labelKey: "commonCriteria", href: "/criteria" },
];

export interface AwardCard {
  slug: string;
  /** i18n key within home.awards.cards (camelCase) */
  cardKey: string;
  nameImage: string;
  nameImageWidth: number;
  nameImageHeight: number;
}

export const AWARD_CARDS: AwardCard[] = [
  {
    slug: "top-talent",
    cardKey: "topTalent",
    nameImage: "/home/award-name-top-talent.png",
    nameImageWidth: 221,
    nameImageHeight: 35,
  },
  {
    slug: "top-project",
    cardKey: "topProject",
    nameImage: "/home/award-name-top-project.png",
    nameImageWidth: 232,
    nameImageHeight: 35,
  },
  {
    slug: "top-project-leader",
    cardKey: "topProjectLeader",
    nameImage: "/home/award-name-top-project-leader.png",
    nameImageWidth: 232,
    nameImageHeight: 64,
  },
  {
    slug: "best-manager",
    cardKey: "bestManager",
    nameImage: "/home/award-name-best-manager.png",
    nameImageWidth: 232,
    nameImageHeight: 30,
  },
  {
    slug: "signature-2025-creator",
    cardKey: "signature2025Creator",
    nameImage: "/home/award-name-signature-creator.png",
    nameImageWidth: 232,
    nameImageHeight: 54,
  },
  {
    slug: "mvp",
    cardKey: "mvp",
    nameImage: "/home/award-name-mvp.png",
    nameImageWidth: 116,
    nameImageHeight: 52,
  },
];

// Date/time are derived from NEXT_PUBLIC_EVENT_DATETIME (see hero-section),
// so only the non-env fields live here.
export const EVENT_INFO = {
  /** Venue name — display value, not translated (proper noun) */
  venue: "Âu Cơ Art Center",
};

export const KUDOS_CONTENT = {
  ctaHref: "/kudos",
};
