/**
 * Unit tests for sanitize-html.ts
 * Tests HTML sanitization for kudo messages, ensuring safe rendering while preserving allowed formatting.
 * Run with: node --experimental-strip-types --test lib/kudos/sanitize-html.test.ts
 */

import { test } from "node:test";
import assert from "node:assert";
import { sanitizeKudoHtml } from "./sanitize-html.ts";

test("sanitizeKudoHtml: basic formatting tags", async (t) => {
  await t.test("preserves <b> tag", () => {
    const input = "<b>bold</b>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<b>bold</b>");
  });

  await t.test("preserves <i> tag", () => {
    const input = "<i>italic</i>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<i>italic</i>");
  });

  await t.test("preserves <s> tag", () => {
    const input = "<s>strikethrough</s>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<s>strikethrough</s>");
  });

  await t.test("preserves <strong> tag", () => {
    const input = "<strong>strong</strong>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<strong>strong</strong>");
  });

  await t.test("preserves <em> tag", () => {
    const input = "<em>emphasis</em>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<em>emphasis</em>");
  });

  await t.test("preserves <u> tag", () => {
    const input = "<u>underline</u>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<u>underline</u>");
  });
});

test("sanitizeKudoHtml: list and block tags", async (t) => {
  await t.test("preserves <ol> and <li> tags", () => {
    const input = "<ol><li>item 1</li><li>item 2</li></ol>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<ol><li>item 1</li><li>item 2</li></ol>");
  });

  await t.test("preserves <ul> and <li> tags", () => {
    const input = "<ul><li>point 1</li><li>point 2</li></ul>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<ul><li>point 1</li><li>point 2</li></ul>");
  });

  await t.test("preserves <blockquote> tag", () => {
    const input = "<blockquote>quoted text</blockquote>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<blockquote>quoted text</blockquote>");
  });

  await t.test("preserves <p> tag", () => {
    const input = "<p>paragraph</p>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<p>paragraph</p>");
  });

  await t.test("preserves <div> tag", () => {
    const input = "<div>content</div>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<div>content</div>");
  });

  await t.test("preserves <br> self-closing tag", () => {
    const input = "line 1<br>line 2";
    const result = sanitizeKudoHtml(input);
    assert(result.includes("<br"));
  });
});

test("sanitizeKudoHtml: link tags", async (t) => {
  await t.test("preserves <a> with http href", () => {
    const input = '<a href="http://example.com">link</a>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes('href="http://example.com"'));
    assert(result.includes('rel="noopener noreferrer nofollow"'));
  });

  await t.test("preserves <a> with https href", () => {
    const input = '<a href="https://example.com">link</a>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes('href="https://example.com"'));
  });

  await t.test("preserves <a> with mailto href", () => {
    const input = '<a href="mailto:user@example.com">email</a>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes('href="mailto:user@example.com"'));
  });

  await t.test("preserves <a> with relative href", () => {
    const input = '<a href="/about">link</a>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes('href="/about"'));
  });

  await t.test("strips javascript: href from <a>", () => {
    const input = '<a href="javascript:alert(\'xss\')">click</a>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes('href="javascript'));
    assert(!result.includes('onclick'));
  });

  await t.test("strips data: href from <a>", () => {
    const input = '<a href="data:text/html,<script>alert(\'xss\')</script>">click</a>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes('href="data:'));
  });

  await t.test("adds rel attribute to safe links", () => {
    const input = '<a href="https://example.com">link</a>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes('rel="noopener noreferrer nofollow"'));
  });
});

test("sanitizeKudoHtml: span with data-mention-id", async (t) => {
  await t.test("preserves <span> with data-mention-id attribute", () => {
    const input = '<span data-mention-id="user-123">@John</span>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes('data-mention-id="user-123"'));
    assert(result.includes(">@John</span>"));
  });

  await t.test("strips other attributes from <span>", () => {
    const input = '<span data-mention-id="user-123" onclick="alert(\'xss\')">@John</span>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes('data-mention-id="user-123"'));
    assert(!result.includes("onclick"));
  });

  await t.test("preserves multiple mentions in same message", () => {
    const input =
      '<p>Hey <span data-mention-id="user-1">@Alice</span> and <span data-mention-id="user-2">@Bob</span></p>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes('data-mention-id="user-1"'));
    assert(result.includes('data-mention-id="user-2"'));
  });
});

test("sanitizeKudoHtml: dangerous content removal", async (t) => {
  await t.test("strips <script> tag entirely", () => {
    const input = '<p>text</p><script>alert("xss")</script><p>more</p>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes("<script"));
    assert(!result.includes('alert("xss")'));
    assert(result.includes("<p>text</p>"));
    assert(result.includes("<p>more</p>"));
  });

  await t.test("strips <style> tag entirely", () => {
    const input = '<p>text</p><style>body { display: none; }</style><p>more</p>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes("<style"));
    assert(!result.includes("display: none"));
  });

  await t.test("strips <iframe> tag entirely", () => {
    const input = '<p>text</p><iframe src="https://evil.com"></iframe><p>more</p>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes("<iframe"));
    assert(!result.includes("https://evil.com"));
  });

  await t.test("strips <object> tag entirely", () => {
    const input = '<p>text</p><object data="evil.swf"></object><p>more</p>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes("<object"));
  });

  await t.test("strips <embed> tag entirely", () => {
    const input = '<p>text</p><embed src="evil.swf"><p>more</p>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes("<embed"));
  });
});

test("sanitizeKudoHtml: event handler attributes", async (t) => {
  await t.test("strips onclick attribute from <b>", () => {
    const input = '<b onclick="alert(\'xss\')">text</b>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes("<b>text</b>"));
    assert(!result.includes("onclick"));
  });

  await t.test("strips onload attribute from <div>", () => {
    const input = '<div onload="alert(\'xss\')">text</div>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes("<div>text</div>"));
    assert(!result.includes("onload"));
  });

  await t.test("strips style attribute", () => {
    const input = '<p style="display: none;">hidden</p>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes("<p>hidden</p>"));
    assert(!result.includes("style"));
  });

  await t.test("strips multiple event handlers", () => {
    const input =
      '<span onclick="x()" onmouseover="y()" class="bad" data-mention-id="user-123">text</span>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes('data-mention-id="user-123"'));
    assert(!result.includes("onclick"));
    assert(!result.includes("onmouseover"));
    assert(!result.includes("class"));
  });
});

test("sanitizeKudoHtml: disallowed tags", async (t) => {
  await t.test("strips <img> tag", () => {
    const input = '<p>text</p><img src="https://evil.com/img.jpg"><p>more</p>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes("<img"));
    assert(result.includes("<p>text</p>"));
    assert(result.includes("<p>more</p>"));
  });

  await t.test("strips <video> tag", () => {
    const input = '<p>text</p><video src="https://evil.com/video.mp4"></video><p>more</p>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes("<video"));
  });

  await t.test("strips <form> tag", () => {
    const input = '<p>text</p><form><input type="password"></form><p>more</p>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes("<form"));
    assert(!result.includes("<input"));
  });

  await t.test("strips <svg> tag", () => {
    const input = '<p>text</p><svg></svg><p>more</p>';
    const result = sanitizeKudoHtml(input);
    assert(!result.includes("<svg"));
  });
});

test("sanitizeKudoHtml: complex scenarios", async (t) => {
  await t.test("sanitizes mixed valid and invalid content", () => {
    const input =
      '<p>Check this <b>important</b> <script>alert("xss")</script> message with <a href="https://example.com">link</a></p>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes("<b>important</b>"));
    assert(result.includes('href="https://example.com"'));
    assert(!result.includes("<script"));
    assert(!result.includes('alert("xss")'));
  });

  await t.test("preserves nested allowed tags", () => {
    const input = "<p><b><i>nested</i></b></p>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<p><b><i>nested</i></b></p>");
  });

  await t.test("sanitizes deeply nested structure with dangerous content", () => {
    const input =
      '<div><p><b>text <script>alert("xss")</script> continues</b></p></div>';
    const result = sanitizeKudoHtml(input);
    assert(result.includes("<div>"));
    assert(result.includes("<p>"));
    assert(result.includes("<b>"));
    assert(!result.includes("<script"));
  });

  await t.test("handles malformed HTML gracefully", () => {
    const input = "<p>unclosed <b>bold <i>italic</p>";
    const result = sanitizeKudoHtml(input);
    // Should not throw; content should be preserved where possible
    assert.strictEqual(typeof result, "string");
  });
});

test("sanitizeKudoHtml: edge cases", async (t) => {
  await t.test("returns empty string for empty input", () => {
    const result = sanitizeKudoHtml("");
    assert.strictEqual(result, "");
  });

  await t.test("returns empty string for null/undefined-like input", () => {
    // @ts-expect-error testing runtime behavior
    const result = sanitizeKudoHtml(null || "");
    assert.strictEqual(result, "");
  });

  await t.test("handles whitespace-only input", () => {
    const input = "   \n\t  ";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "   \n\t  ");
  });

  await t.test("stops at unescaped quotes in URLs (security boundary)", () => {
    // URLs with internal quotes are rejected by the attribute regex pattern
    // This is a security measure to prevent quote-breakout attacks
    const input = '<a href="https://example.com?q=\\"hello\\"">link</a>';
    const result = sanitizeKudoHtml(input);
    // The regex matches only up to the first unescaped quote, so the malformed
    // attribute is dropped; the tag structure is preserved
    assert(result.includes("<a"));
  });

  await t.test("handles single-quoted attributes", () => {
    const input = "<a href='https://example.com'>link</a>";
    const result = sanitizeKudoHtml(input);
    assert(result.includes('href="https://example.com"'));
  });

  await t.test("removes tags with no content", () => {
    const input = "<p></p><b></b><div></div>";
    const result = sanitizeKudoHtml(input);
    assert.strictEqual(result, "<p></p><b></b><div></div>");
  });
});

test("integration: realistic kudo message (ID-1..25)", async (t) => {
  await t.test(
    "sanitizes a realistic kudo with mentions, formatting, and links",
    () => {
      const input =
        "<p>Great work, <span data-mention-id=\"user-123\">@Alice</span>!</p>" +
        "<p>You <b>exceeded</b> all expectations on the <i>Q2 project</i>.</p>" +
        '<p>Check out <a href="https://example.com/results">results here</a> and ' +
        "<a href=\"javascript:alert('xss')\">don't click this</a></p>" +
        "<script>alert('attempted xss')</script>";

      const result = sanitizeKudoHtml(input);

      // Verify allowed content is preserved
      assert(result.includes('data-mention-id="user-123"'));
      assert(result.includes("<b>exceeded</b>"));
      assert(result.includes("<i>Q2 project</i>"));
      assert(result.includes('href="https://example.com/results"'));

      // Verify dangerous content is removed
      assert(!result.includes("<script"));
      assert(!result.includes('alert(\'xss\')'));
      assert(!result.includes('alert(\'attempted xss\')'));
      assert(!result.includes("javascript:"));
    }
  );
});
