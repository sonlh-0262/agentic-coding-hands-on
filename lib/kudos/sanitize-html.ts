/**
 * Minimal allowlist HTML sanitizer for kudo messages. Runs on BOTH the client
 * (before submit) and the server (before persist) — so it must not depend on
 * the DOM. A tight tag/attribute allowlist is safer than trying to blocklist
 * every dangerous construct.
 *
 * Allowed: basic rich-text tags produced by the editor toolbar + mention spans.
 * Everything else (script/style/event handlers/javascript: URLs) is stripped.
 */

const ALLOWED_TAGS = new Set([
  "b",
  "strong",
  "i",
  "em",
  "s",
  "strike",
  "del",
  "u",
  "ol",
  "ul",
  "li",
  "a",
  "blockquote",
  "br",
  "p",
  "div",
  "span",
]);

export function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("/")
  );
}

/** Build the sanitized attribute string for an allowed tag. */
function sanitizeAttributes(tag: string, raw: string): string {
  const attrs: string[] = [];
  const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(raw)) !== null) {
    const name = m[1].toLowerCase();
    const value = m[3] ?? m[4] ?? "";
    if (tag === "a" && name === "href" && isSafeUrl(value)) {
      attrs.push(`href="${value.replace(/"/g, "&quot;")}"`);
    } else if (tag === "span" && name === "data-mention-id") {
      attrs.push(`data-mention-id="${value.replace(/"/g, "&quot;")}"`);
    }
    // All other attributes (onclick, style, etc.) are dropped.
  }
  if (tag === "a" && attrs.some((a) => a.startsWith("href"))) {
    attrs.push('rel="noopener noreferrer nofollow"');
  }
  return attrs.length ? " " + attrs.join(" ") : "";
}

export function sanitizeKudoHtml(html: string): string {
  if (!html) return "";

  // Drop entire dangerous element blocks (content included).
  let out = html.replace(
    /<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi,
    "",
  );

  // Walk every tag; keep allowlisted ones (attributes scrubbed), drop the rest.
  out = out.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)\/?>/g,
    (match, rawTag: string, rawAttrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      const isClosing = match.startsWith("</");
      if (isClosing) return `</${tag}>`;
      const selfClose = tag === "br" ? " /" : "";
      return `<${tag}${sanitizeAttributes(tag, rawAttrs)}${selfClose}>`;
    },
  );

  return out;
}
