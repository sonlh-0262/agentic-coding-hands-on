"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import KudoToolbar, { type ToolbarAction } from "./kudo-toolbar";
import KudoMentionDropdown from "./kudo-mention-dropdown";
import type { RecipientOption } from "./kudo-recipient-field";
import { isSafeUrl } from "@/lib/kudos/sanitize-html";

interface KudoMessageEditorProps {
  placeholder: string;
  hint: string;
  onChange: (html: string) => void;
  onMentionsChange: (ids: string[]) => void;
  onSearchRecipients: (query: string) => Promise<RecipientOption[]>;
}

/**
 * KudoMessageEditor — contentEditable rich-text editor for the kudo message.
 * Toolbar applies real formatting (bold/italic/strike/number-list/link/quote);
 * typing "@name" opens a colleague dropdown that inserts a mention token. The
 * parent receives sanitized HTML on every change plus the mentioned profile ids.
 */
export default function KudoMessageEditor({
  placeholder,
  hint,
  onChange,
  onMentionsChange,
  onSearchRecipients,
}: KudoMessageEditorProps) {
  const t = useTranslations("kudos");
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [active, setActive] = useState<Set<ToolbarAction>>(new Set());
  const [mentionOptions, setMentionOptions] = useState<RecipientOption[]>([]);
  const [mentionPos, setMentionPos] = useState<{ top: number; left: number } | null>(null);

  // Build the execCommand map inside the component so it captures `t`.
  const buildExec = useCallback((): Record<ToolbarAction, () => void> => ({
    bold: () => document.execCommand("bold"),
    italic: () => document.execCommand("italic"),
    strikethrough: () => document.execCommand("strikeThrough"),
    numberList: () => document.execCommand("insertOrderedList"),
    quote: () => document.execCommand("formatBlock", false, "blockquote"),
    link: () => {
      const url = window.prompt(t("message.linkPrompt"));
      if (!url) return;
      // Validate before touching the live DOM — an unchecked javascript: href
      // would be XSS-exploitable even though submit-time sanitization strips it.
      if (!isSafeUrl(url)) {
        window.alert(t("message.invalidUrl"));
        return;
      }
      document.execCommand("createLink", false, url);
    },
  }), [t]);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    setIsEmpty(el.textContent?.trim().length === 0);
    onChange(el.innerHTML);
    const ids = Array.from(el.querySelectorAll("span[data-mention-id]"))
      .map((n) => n.getAttribute("data-mention-id"))
      .filter((v): v is string => Boolean(v));
    onMentionsChange(Array.from(new Set(ids)));
  }, [onChange, onMentionsChange]);

  const syncActive = useCallback(() => {
    const next = new Set<ToolbarAction>();
    if (document.queryCommandState("bold")) next.add("bold");
    if (document.queryCommandState("italic")) next.add("italic");
    if (document.queryCommandState("strikeThrough")) next.add("strikethrough");
    if (document.queryCommandState("insertOrderedList")) next.add("numberList");
    setActive(next);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", syncActive);
    return () => document.removeEventListener("selectionchange", syncActive);
  }, [syncActive]);

  const handleToggle = (action: ToolbarAction) => {
    editorRef.current?.focus();
    buildExec()[action]();
    syncActive();
    emit();
  };

  // Detect an "@token" immediately before the caret and surface suggestions.
  const checkMention = useCallback(async () => {
    const sel = window.getSelection();
    const el = editorRef.current;
    if (!sel || !sel.isCollapsed || !el) return setMentionPos(null);
    const node = sel.anchorNode;
    if (!node || node.nodeType !== Node.TEXT_NODE) return setMentionPos(null);
    const text = (node.textContent ?? "").slice(0, sel.anchorOffset);
    const match = /@([\p{L}\d._]*)$/u.exec(text);
    if (!match) {
      setMentionPos(null);
      return;
    }
    const range = sel.getRangeAt(0).cloneRange();
    const rect = range.getBoundingClientRect();
    const wrap = el.getBoundingClientRect();
    setMentionPos({ top: rect.bottom - wrap.top + 4, left: rect.left - wrap.left });
    setMentionOptions(await onSearchRecipients(match[1]));
  }, [onSearchRecipients]);

  const handleInput = () => {
    emit();
    void checkMention();
  };

  const insertMention = (opt: RecipientOption) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      const before = text.slice(0, range.startOffset);
      const at = before.lastIndexOf("@");
      if (at >= 0) {
        (node as Text).textContent = text.slice(0, at) + text.slice(range.startOffset);
        range.setStart(node, at);
        range.collapse(true);
      }
    }
    const span = document.createElement("span");
    span.setAttribute("data-mention-id", opt.id);
    span.setAttribute("contenteditable", "false");
    span.textContent = `@${opt.name}`;
    span.style.color = "#1d6fb8";
    span.style.fontWeight = "700";
    range.insertNode(span);
    const space = document.createTextNode(" ");
    span.after(space);
    range.setStartAfter(space);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    setMentionPos(null);
    emit();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
      <KudoToolbar activeFormats={active} onToggle={handleToggle} />

      <div
        style={{
          position: "relative",
          border: "1px solid #998C5F",
          borderRadius: "0 0 8px 8px",
          background: "#FFF",
          minHeight: "200px",
        }}
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={t("message.ariaLabel")}
          onInput={handleInput}
          onKeyUp={() => void checkMention()}
          onBlur={() => setTimeout(() => setMentionPos(null), 150)}
          style={{
            minHeight: "200px",
            padding: "16px 24px",
            outline: "none",
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "rgba(0, 16, 26, 1)",
          }}
        />
        {isEmpty && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "16px",
              left: "24px",
              pointerEvents: "none",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "24px",
              color: "rgba(153, 153, 153, 1)",
            }}
          >
            {placeholder}
          </span>
        )}
        {mentionPos && (
          <KudoMentionDropdown
            options={mentionOptions}
            position={mentionPos}
            onSelect={insertMention}
          />
        )}
      </div>

      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          lineHeight: "24px",
          letterSpacing: "0.5px",
          color: "rgba(0, 16, 26, 1)",
          textAlign: "right",
        }}
      >
        {hint}
      </p>
    </div>
  );
}
