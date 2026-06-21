import type { KudoInput } from "./types";

/** Allowed image MIME types for kudo attachments (per test cases ID-21..24, 55). */
export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_HASHTAGS = 5;
export const MIN_HASHTAGS = 1;
export const MAX_IMAGES = 5;

/** Strip HTML tags to test whether the rich-text message has real content. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Structured i18n message key descriptors returned by `validateKudoInput`.
 * React components translate these via `t(errorKey.key, errorKey.params)`.
 * Keys correspond to `kudos.errors.*` entries in the message catalog.
 */
export type ValidationErrorKey =
  | { key: "errors.recipientRequired" }
  | { key: "errors.titleRequired" }
  | { key: "errors.messageRequired" }
  | { key: "errors.hashtagRequired" }
  | { key: "errors.hashtagMax"; params: { max: number } }
  | { key: "errors.imageMax"; params: { max: number } };

export interface ValidationResult {
  ok: boolean;
  /**
   * Structured error descriptors for React components — translate via t().
   * Use this in client components that have access to useTranslations('kudos').
   */
  errorKeys: ValidationErrorKey[];
  /**
   * Fallback Vietnamese error strings for server-side callers (e.g. actions.ts)
   * that cannot access the next-intl request context.
   * @deprecated Prefer `errorKeys` in client components.
   */
  errors: string[];
}

/**
 * Pure validator for a kudo submission. Mirrors the UI rules so the same logic
 * runs client-side (disable "Gửi") and server-side (never trust the client).
 *
 * Returns both `errorKeys` (for next-intl translation in React) and `errors`
 * (Vietnamese strings for server-side callers that cannot use next-intl).
 */
export function validateKudoInput(input: KudoInput): ValidationResult {
  const errorKeys: ValidationErrorKey[] = [];
  const errors: string[] = [];

  function addError(key: ValidationErrorKey, fallback: string) {
    errorKeys.push(key);
    errors.push(fallback);
  }

  if (!input.recipientId) {
    addError({ key: "errors.recipientRequired" }, "Người nhận không được để trống");
  }
  if (input.title.trim().length === 0) {
    addError({ key: "errors.titleRequired" }, "Danh hiệu không được để trống");
  }
  if (htmlToPlainText(input.messageHtml).length === 0) {
    addError({ key: "errors.messageRequired" }, "Nội dung không được để trống");
  }
  if (input.hashtagIds.length < MIN_HASHTAGS) {
    addError({ key: "errors.hashtagRequired" }, "Hashtag không được để trống");
  }
  if (input.hashtagIds.length > MAX_HASHTAGS) {
    addError(
      { key: "errors.hashtagMax", params: { max: MAX_HASHTAGS } },
      `Tối đa ${MAX_HASHTAGS} hashtag`,
    );
  }
  if (input.imageUrls.length > MAX_IMAGES) {
    addError(
      { key: "errors.imageMax", params: { max: MAX_IMAGES } },
      `Tối đa ${MAX_IMAGES} ảnh`,
    );
  }
  // anonymousName is OPTIONAL (UI labels it "tuỳ chọn"); the feed falls back to
  // "Ẩn danh" when it is blank, so no validation guard here.

  return { ok: errorKeys.length === 0, errorKeys, errors };
}

/** True when the file's MIME type is an accepted image format. */
export function isAllowedImageType(mime: string): boolean {
  return (ALLOWED_IMAGE_MIME as readonly string[]).includes(mime);
}
