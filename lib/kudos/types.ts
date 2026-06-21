/**
 * Shared types for the Kudos feature. Row shapes mirror the columns created in
 * supabase/migrations (Phase 1). App-facing types are camelCase; mappers in
 * queries.ts convert from snake_case DB rows.
 */

/** A user in the directory — recipient search and @mentions. */
export interface Profile {
  id: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
}

/** A predefined hashtag. */
export interface Hashtag {
  id: string;
  label: string;
}

/** Input accepted by the createKudo server action. */
export interface KudoInput {
  recipientId: string;
  /** "Danh hiệu" — the kudo title/honour. */
  title: string;
  messageHtml: string;
  /** Profile ids referenced via "@" in the message body. */
  mentionIds: string[];
  hashtagIds: string[];
  imageUrls: string[];
  isAnonymous: boolean;
  anonymousName: string;
}

/** A kudo as shown in the feed. Sender is omitted when anonymous. */
export interface KudoFeedItem {
  id: string;
  title: string;
  messageHtml: string;
  imageUrls: string[];
  isAnonymous: boolean;
  /**
   * Display name of the author: real sender name, or the anonymous_name they
   * chose. Null when the author is anonymous AND chose no display name — the
   * consumer is responsible for substituting a translated fallback string.
   */
  authorName: string | null;
  recipientName: string;
  hashtags: string[];
  createdAt: string;
}

/** Stable error codes returned by server actions (kudos namespace). */
export type KudoActionErrorCode =
  | "unauthenticated"
  | "fileNotFound"
  | "invalidImageType"
  | "invalidImage"
  | "sendFailed";

/** Result envelope for the createKudo action. */
export type CreateKudoResult =
  | { ok: true; id: string }
  | { ok: false; errors: string[]; errorCodes?: KudoActionErrorCode[] };

/** Result envelope for image upload. */
export type UploadImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string; errorCode?: KudoActionErrorCode };
