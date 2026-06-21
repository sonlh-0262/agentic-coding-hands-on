/**
 * profile-mock-data.ts
 *
 * All mock data and TypeScript interfaces for the Profile page.
 * Backend integration: replace mock values with real API props — interfaces
 * are intentionally designed to match what a real API would return.
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface IconSlot {
  /** Slot index B2–B7 */
  index: number;
  /** If unlocked, the image src for the icon. null = show gray placeholder. */
  imageSrc: string | null;
  /** Alt text for unlocked icons */
  alt?: string;
}

export interface ProfileStats {
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
  secretBoxOpened: number;
  secretBoxUnopened: number;
}

export interface UserBadge {
  /** e.g. "CEVC10" */
  department: string;
  /** e.g. "Super Hero" | "Legend Hero" */
  title: string;
}

export interface ProfileKudoSender {
  name: string;
  avatarSrc: string;
  badge: UserBadge;
}

export interface ProfileKudoRecipient {
  name: string;
  avatarSrc: string;
  badge: UserBadge;
}

export type KudoStatusLabel = "Spam" | "IDOL GIỚI TRẺ" | null;

export interface ProfileKudoCard {
  id: string;
  sender: ProfileKudoSender;
  recipient: ProfileKudoRecipient;
  timestamp: string;
  /** Optional status label pill — "Spam" (orange), "IDOL GIỚI TRẺ" (dark), or null */
  statusLabel: KudoStatusLabel;
  message: string;
  images: string[];
  hashtags: string[];
  heartCount: string;
  /** Whether the current user has hearted this kudo (drives the filled heart). */
  heartedByMe?: boolean;
}

// ---------------------------------------------------------------------------
// Mock data — extracted from Figma design
// ---------------------------------------------------------------------------

export const PROFILE_USER_NAME = "Huỳnh Dương Xuân Nhật";

export const PROFILE_DEPARTMENT = "CEVC3";

export const PROFILE_TITLE: UserBadge["title"] = "Legend Hero";

/** 6 icon badge slots B2–B7; all placeholder (dark gray #323231) in the design */
export const PROFILE_ICON_SLOTS: IconSlot[] = [
  { index: 2, imageSrc: null },
  { index: 3, imageSrc: null },
  { index: 4, imageSrc: null },
  { index: 5, imageSrc: null },
  { index: 6, imageSrc: null },
  { index: 7, imageSrc: null },
];

export const PROFILE_STATS: ProfileStats = {
  kudosReceived: 5,
  kudosSent: 25,
  heartsReceived: 25,
  secretBoxOpened: 25,
  secretBoxUnopened: 25,
};

/** Placeholder avatar — real integration should replace with actual image URL */
const PLACEHOLDER_AVATAR = "/profile-ban-than/avatar-placeholder.png";

/** Placeholder sample image for kudo gallery */
const SAMPLE_IMAGE = "/profile-ban-than/sample-image.png";

export const PROFILE_KUDO_CARDS: ProfileKudoCard[] = [
  {
    id: "kudo-1",
    sender: {
      name: "Huỳnh Dương Xuân Nhật",
      avatarSrc: PLACEHOLDER_AVATAR,
      badge: { department: "CEVC10", title: "Super Hero" },
    },
    recipient: {
      name: "Huỳnh Dương Xuân Nhật",
      avatarSrc: PLACEHOLDER_AVATAR,
      badge: { department: "CEVC10", title: "Super Hero" },
    },
    timestamp: "10:00 - 10/30/2025",
    statusLabel: "Spam",
    message:
      "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...",
    images: [SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE],
    hashtags: ["#Dedicated", "#Inspring", "#Dedicated", "#Inspring", "#Dedicated", "#Inspring..."],
    heartCount: "1.000",
  },
  {
    id: "kudo-2",
    sender: {
      name: "Huỳnh Dương Xuân Nhật",
      avatarSrc: PLACEHOLDER_AVATAR,
      badge: { department: "CEVC10", title: "Super Hero" },
    },
    recipient: {
      name: "Huỳnh Dương Xuân Nhật",
      avatarSrc: PLACEHOLDER_AVATAR,
      badge: { department: "CEVC10", title: "Super Hero" },
    },
    timestamp: "10:00 - 10/30/2025",
    statusLabel: "Spam",
    message:
      "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...",
    images: [SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE],
    hashtags: ["#Dedicated", "#Inspring", "#Dedicated", "#Inspring", "#Dedicated", "#Inspring..."],
    heartCount: "1.000",
  },
  {
    id: "kudo-3",
    sender: {
      name: "Huỳnh Dương Xuân Nhật",
      avatarSrc: PLACEHOLDER_AVATAR,
      badge: { department: "CEVC10", title: "Super Hero" },
    },
    recipient: {
      name: "Huỳnh Dương Xuân Nhật",
      avatarSrc: PLACEHOLDER_AVATAR,
      badge: { department: "CEVC10", title: "Super Hero" },
    },
    timestamp: "10:00 - 10/30/2025",
    statusLabel: "IDOL GIỚI TRẺ",
    message:
      "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...",
    images: [SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE],
    hashtags: ["#Dedicated", "#Inspring", "#Dedicated", "#Inspring", "#Dedicated", "#Inspring..."],
    heartCount: "1.000",
  },
  {
    id: "kudo-4",
    sender: {
      name: "Huỳnh Dương Xuân Nhật",
      avatarSrc: PLACEHOLDER_AVATAR,
      badge: { department: "CEVC10", title: "Super Hero" },
    },
    recipient: {
      name: "Huỳnh Dương Xuân Nhật",
      avatarSrc: PLACEHOLDER_AVATAR,
      badge: { department: "CEVC10", title: "Super Hero" },
    },
    timestamp: "10:00 - 10/30/2025",
    statusLabel: "IDOL GIỚI TRẺ",
    message:
      "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...",
    images: [SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE],
    hashtags: ["#Dedicated", "#Inspring", "#Dedicated", "#Inspring", "#Dedicated", "#Inspring..."],
    heartCount: "1.000",
  },
];
