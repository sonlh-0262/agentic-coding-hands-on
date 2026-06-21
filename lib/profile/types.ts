/**
 * Types for the Profile page data layer (lib/profile). Domain shapes are
 * snake_case-free (camelCase); queries.ts maps from DB rows. The page component
 * (app/profile) adapts these into the presentational props expected by
 * app/_components/profile.
 */

/** Which side of a kudo to filter the feed by. */
export type FeedDirection = "sent" | "received";

/** Real, DB-derived statistics shown in Section B (boxes/badges stay mock). */
export interface ProfileStatsData {
  /** Kudos where the user is the recipient. */
  kudosReceived: number;
  /** Kudos where the user is the sender. */
  kudosSent: number;
  /** Hearts on kudos the user received ("Số tim bạn nhận được"). */
  heartsReceived: number;
}

/** A kudo in the profile feed, with heart aggregates for the current user. */
export interface ProfileFeedKudo {
  id: string;
  /**
   * Display name of the author. Null when anonymous AND no custom name was
   * given — consumer must substitute a translated fallback.
   */
  senderName: string | null;
  /** Author avatar URL (null for anonymous or missing). */
  senderAvatar: string | null;
  recipientName: string;
  recipientAvatar: string | null;
  /** Plain-text excerpt (HTML stripped). */
  message: string;
  imageUrls: string[];
  hashtags: string[];
  createdAt: string;
  heartCount: number;
  /** Whether the current user has hearted this kudo. */
  heartedByMe: boolean;
}

/** Stable error codes returned by server actions (profile namespace). */
export type ProfileActionErrorCode = "unauthenticated";

/** Result of toggling a heart. */
export type ToggleHeartResult =
  | { ok: true; hearted: boolean; count: number }
  | { ok: false; error: string; errorCode?: ProfileActionErrorCode };
