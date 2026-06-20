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

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

/**
 * Pure validator for a kudo submission. Mirrors the UI rules so the same logic
 * runs client-side (disable "Gửi") and server-side (never trust the client).
 */
export function validateKudoInput(input: KudoInput): ValidationResult {
  const errors: string[] = [];

  if (!input.recipientId) {
    errors.push("Người nhận không được để trống");
  }
  if (input.title.trim().length === 0) {
    errors.push("Danh hiệu không được để trống");
  }
  if (htmlToPlainText(input.messageHtml).length === 0) {
    errors.push("Nội dung không được để trống");
  }
  if (input.hashtagIds.length < MIN_HASHTAGS) {
    errors.push("Hashtag không được để trống");
  }
  if (input.hashtagIds.length > MAX_HASHTAGS) {
    errors.push(`Tối đa ${MAX_HASHTAGS} hashtag`);
  }
  if (input.imageUrls.length > MAX_IMAGES) {
    errors.push(`Tối đa ${MAX_IMAGES} ảnh`);
  }
  // anonymousName is OPTIONAL (UI labels it "tuỳ chọn"); the feed falls back to
  // "Ẩn danh" when it is blank, so no validation guard here.

  return { ok: errors.length === 0, errors };
}

/** True when the file's MIME type is an accepted image format. */
export function isAllowedImageType(mime: string): boolean {
  return (ALLOWED_IMAGE_MIME as readonly string[]).includes(mime);
}
