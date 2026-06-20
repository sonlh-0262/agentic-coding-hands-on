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
  /** Display name of the author: real sender name, or anonymous_name. */
  authorName: string;
  recipientName: string;
  hashtags: string[];
  createdAt: string;
}

/** Result envelope for the createKudo action. */
export type CreateKudoResult =
  | { ok: true; id: string }
  | { ok: false; errors: string[] };

/** Result envelope for image upload. */
export type UploadImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string };
