/**
 * Unit tests for validation.ts
 * Tests KudoInput validation, HTML-to-plain-text conversion, and image MIME type checking.
 * Run with: node --experimental-strip-types --test lib/kudos/validation.test.ts
 */

import { test } from "node:test";
import assert from "node:assert";
import {
  validateKudoInput,
  htmlToPlainText,
  isAllowedImageType,
  ALLOWED_IMAGE_MIME,
  MAX_HASHTAGS,
  MAX_IMAGES,
} from "./validation.ts";
import type { KudoInput } from "./types.ts";

test("htmlToPlainText", async (t) => {
  await t.test("strips HTML tags and collapses whitespace", () => {
    const html = "<p>Hello <b>world</b></p>";
    const result = htmlToPlainText(html);
    assert.strictEqual(result, "Hello world");
  });

  await t.test("converts &nbsp; to regular spaces", () => {
    const html = "Hello&nbsp;world";
    const result = htmlToPlainText(html);
    assert.strictEqual(result, "Hello world");
  });

  await t.test("collapses multiple whitespace to single space", () => {
    const html = "Hello    <p>   </p>   world";
    const result = htmlToPlainText(html);
    assert.strictEqual(result, "Hello world");
  });

  await t.test("trims leading and trailing whitespace", () => {
    const html = "   <p>content</p>   ";
    const result = htmlToPlainText(html);
    assert.strictEqual(result, "content");
  });

  await t.test("returns empty string for content that is only tags/whitespace", () => {
    const html = "<p>   </p><div></div><span>&nbsp;</span>";
    const result = htmlToPlainText(html);
    assert.strictEqual(result, "");
  });

  await t.test("preserves text content through nested tags", () => {
    const html = "<div><p><b>nested</b> content</p></div>";
    const result = htmlToPlainText(html);
    assert.strictEqual(result, "nested content");
  });

  await t.test("returns empty string for empty input", () => {
    const result = htmlToPlainText("");
    assert.strictEqual(result, "");
  });
});

test("isAllowedImageType", async (t) => {
  await t.test("returns true for image/jpeg", () => {
    assert.strictEqual(isAllowedImageType("image/jpeg"), true);
  });

  await t.test("returns true for image/png", () => {
    assert.strictEqual(isAllowedImageType("image/png"), true);
  });

  await t.test("returns true for image/webp", () => {
    assert.strictEqual(isAllowedImageType("image/webp"), true);
  });

  await t.test("returns true for image/gif", () => {
    assert.strictEqual(isAllowedImageType("image/gif"), true);
  });

  await t.test("returns false for application/pdf", () => {
    assert.strictEqual(isAllowedImageType("application/pdf"), false);
  });

  await t.test("returns false for video/mp4", () => {
    assert.strictEqual(isAllowedImageType("video/mp4"), false);
  });

  await t.test("returns false for text/plain", () => {
    assert.strictEqual(isAllowedImageType("text/plain"), false);
  });

  await t.test("returns false for empty string", () => {
    assert.strictEqual(isAllowedImageType(""), false);
  });

  await t.test("returns false for unrecognized MIME type", () => {
    assert.strictEqual(isAllowedImageType("image/svg+xml"), false);
  });
});

test("validateKudoInput", async (t) => {
  const validInput: KudoInput = {
    recipientId: "user-123",
    title: "Amazing work",
    messageHtml: "<p>You did great!</p>",
    mentionIds: [],
    hashtagIds: ["tag1"],
    imageUrls: ["https://example.com/img.jpg"],
    isAnonymous: false,
    anonymousName: "",
  };

  await t.test("accepts valid KudoInput", () => {
    const result = validateKudoInput(validInput);
    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(result.errors, []);
  });

  await t.test("rejects empty recipientId", () => {
    const input = { ...validInput, recipientId: "" };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.includes("Người nhận không được để trống"));
  });

  await t.test("rejects empty title", () => {
    const input = { ...validInput, title: "" };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.includes("Danh hiệu không được để trống"));
  });

  await t.test("rejects title with only whitespace", () => {
    const input = { ...validInput, title: "   " };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.includes("Danh hiệu không được để trống"));
  });

  await t.test("rejects messageHtml that is empty", () => {
    const input = { ...validInput, messageHtml: "" };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.includes("Nội dung không được để trống"));
  });

  await t.test("rejects messageHtml with only tags", () => {
    const input = { ...validInput, messageHtml: "<p></p><div></div>" };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.includes("Nội dung không được để trống"));
  });

  await t.test("rejects messageHtml with only whitespace in tags", () => {
    const input = { ...validInput, messageHtml: "<p>   </p><span>&nbsp;</span>" };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.includes("Nội dung không được để trống"));
  });

  await t.test("accepts messageHtml with real text content", () => {
    const input = { ...validInput, messageHtml: "<p>  Real content  </p>" };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });

  await t.test("rejects zero hashtags", () => {
    const input = { ...validInput, hashtagIds: [] };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.includes("Hashtag không được để trống"));
  });

  await t.test("accepts minimum required hashtags", () => {
    const input = { ...validInput, hashtagIds: ["tag1"] };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });

  await t.test("accepts MAX_HASHTAGS hashtags", () => {
    const input = {
      ...validInput,
      hashtagIds: Array.from({ length: MAX_HASHTAGS }, (_, i) => `tag${i}`),
    };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });

  await t.test("rejects more than MAX_HASHTAGS hashtags", () => {
    const input = {
      ...validInput,
      hashtagIds: Array.from({ length: MAX_HASHTAGS + 1 }, (_, i) => `tag${i}`),
    };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.some((e) => e.includes(`Tối đa ${MAX_HASHTAGS} hashtag`)));
  });

  await t.test("accepts zero imageUrls", () => {
    const input = { ...validInput, imageUrls: [] };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });

  await t.test("accepts MAX_IMAGES imageUrls", () => {
    const input = {
      ...validInput,
      imageUrls: Array.from({ length: MAX_IMAGES }, (_, i) => `https://example.com/img${i}.jpg`),
    };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });

  await t.test("rejects more than MAX_IMAGES imageUrls", () => {
    const input = {
      ...validInput,
      imageUrls: Array.from({ length: MAX_IMAGES + 1 }, (_, i) => `https://example.com/img${i}.jpg`),
    };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.some((e) => e.includes(`Tối đa ${MAX_IMAGES} ảnh`)));
  });

  // anonymousName is OPTIONAL (UI labels it "tuỳ chọn"); a blank name is valid
  // and the feed falls back to "Ẩn danh".
  await t.test("accepts isAnonymous=true with empty anonymousName", () => {
    const input = { ...validInput, isAnonymous: true, anonymousName: "" };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });

  await t.test("accepts isAnonymous=true with whitespace-only anonymousName", () => {
    const input = { ...validInput, isAnonymous: true, anonymousName: "   " };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });

  await t.test("accepts isAnonymous=true with valid anonymousName", () => {
    const input = { ...validInput, isAnonymous: true, anonymousName: "Secret Admirer" };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });

  await t.test("accepts isAnonymous=false regardless of anonymousName", () => {
    const input = { ...validInput, isAnonymous: false, anonymousName: "" };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });

  await t.test("accumulates multiple errors", () => {
    const input: KudoInput = {
      recipientId: "",
      title: "",
      messageHtml: "",
      mentionIds: [],
      hashtagIds: [],
      imageUrls: [],
      isAnonymous: true,
      anonymousName: "",
    };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, false);
    assert(result.errors.length >= 4);
    assert(result.errors.includes("Người nhận không được để trống"));
    assert(result.errors.includes("Danh hiệu không được để trống"));
    assert(result.errors.includes("Nội dung không được để trống"));
    assert(result.errors.includes("Hashtag không được để trống"));
  });

  await t.test("accepts mentions in hashtagIds", () => {
    const input = { ...validInput, mentionIds: ["user1", "user2"] };
    const result = validateKudoInput(input);
    assert.strictEqual(result.ok, true);
  });
});

test("integration: ALLOWED_IMAGE_MIME constant", async (t) => {
  await t.test("ALLOWED_IMAGE_MIME contains exactly 4 types", () => {
    assert.strictEqual(ALLOWED_IMAGE_MIME.length, 4);
  });

  await t.test("all ALLOWED_IMAGE_MIME types pass isAllowedImageType", () => {
    ALLOWED_IMAGE_MIME.forEach((mime) => {
      assert.strictEqual(
        isAllowedImageType(mime),
        true,
        `Expected ${mime} to be allowed`
      );
    });
  });
});

test("integration: validation with HTML sanitization (ID-12, ID-13)", async (t) => {
  await t.test(
    "messageHtml with tags must still contain meaningful text after stripping",
    () => {
      const validWithTags: KudoInput = {
        ...{
          recipientId: "user-123",
          title: "Great work",
          messageHtml: "<p>You are <b>awesome</b>!</p>",
          mentionIds: [],
          hashtagIds: ["tag1"],
          imageUrls: [],
          isAnonymous: false,
          anonymousName: "",
        },
      };
      const result = validateKudoInput(validWithTags);
      assert.strictEqual(result.ok, true);
      assert.deepStrictEqual(result.errors, []);
    }
  );
});
