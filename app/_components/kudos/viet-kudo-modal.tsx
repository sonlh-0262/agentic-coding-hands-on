"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import KudoRecipientField, {
  type RecipientOption,
} from "./kudo-recipient-field";
import KudoTitleField from "./kudo-title-field";
import KudoMessageEditor from "./kudo-message-editor";
import KudoHashtagField, { type HashtagChip } from "./kudo-hashtag-field";
import KudoImageField, { type ImageItem } from "./kudo-image-field";
import KudoAnonymousField from "./kudo-anonymous-field";
import type {
  CreateKudoResult,
  Hashtag,
  KudoInput,
  UploadImageResult,
} from "@/lib/kudos/types";
import { isAllowedImageType, validateKudoInput } from "@/lib/kudos/validation";
import { sanitizeKudoHtml } from "@/lib/kudos/sanitize-html";

const MESSAGE_PLACEHOLDER =
  "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!";
const MESSAGE_HINT =
  'Bạn có thể "@ + tên" để nhắc tới đồng nghiệp khác';

export interface VietKudoModalProps {
  open: boolean;
  /** Seeded hashtags for the "+ Hashtag" dropdown. */
  hashtagOptions: Hashtag[];
  onClose: () => void;
  /** Debounced directory search (recipient selector + @mentions). */
  onSearchRecipients: (query: string) => Promise<RecipientOption[]>;
  /** Upload one image; returns a public URL or an error. */
  onUploadImage: (file: File) => Promise<UploadImageResult>;
  /** Persist the kudo. Returns the new id or validation/server errors. */
  onSubmit: (input: KudoInput) => Promise<CreateKudoResult>;
}

const EMPTY = {
  recipient: null as RecipientOption | null,
  title: "",
  messageHtml: "",
  mentionIds: [] as string[],
  hashtags: [] as HashtagChip[],
  images: [] as ImageItem[],
  isAnonymous: false,
  anonymousName: "",
};

/**
 * VietKudoModal — "Gửi lời cám ơn và ghi nhận đến đồng đội" modal, fully wired
 * to Supabase via the handler props. Starts empty; recipient search, hashtag
 * dropdown, image upload, rich-text + @mention, and submit are all live.
 */
export default function VietKudoModal({
  open,
  hashtagOptions,
  onClose,
  onSearchRecipients,
  onUploadImage,
  onSubmit,
}: VietKudoModalProps) {
  const mounted = useSyncExternalStore(
    (cb) => {
      cb();
      return () => {};
    },
    () => true,
    () => false,
  );

  const [recipient, setRecipient] = useState(EMPTY.recipient);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipientOpen, setRecipientOpen] = useState(false);
  const [recipientOptions, setRecipientOptions] = useState<RecipientOption[]>([]);
  const [title, setTitle] = useState(EMPTY.title);
  const [messageHtml, setMessageHtml] = useState(EMPTY.messageHtml);
  const [mentionIds, setMentionIds] = useState<string[]>(EMPTY.mentionIds);
  const [hashtags, setHashtags] = useState<HashtagChip[]>(EMPTY.hashtags);
  const [images, setImages] = useState<ImageItem[]>(EMPTY.images);
  const [isAnonymous, setIsAnonymous] = useState(EMPTY.isAnonymous);
  const [anonymousName, setAnonymousName] = useState(EMPTY.anonymousName);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lock scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Debounced recipient search.
  useEffect(() => {
    if (!recipientOpen) return;
    let cancelled = false;
    const id = setTimeout(async () => {
      const opts = await onSearchRecipients(recipientSearch);
      if (!cancelled) setRecipientOptions(opts);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [recipientSearch, recipientOpen, onSearchRecipients]);

  if (!mounted || !open) return null;

  const availableHashtags = hashtagOptions.filter(
    (opt) => !hashtags.some((h) => h.id === opt.id),
  );

  const buildInput = (): KudoInput => ({
    recipientId: recipient?.id ?? "",
    title,
    messageHtml: sanitizeKudoHtml(messageHtml),
    mentionIds,
    hashtagIds: hashtags.map((h) => h.id),
    imageUrls: images.map((img) => img.previewUrl),
    isAnonymous,
    anonymousName,
  });

  const isValid = validateKudoInput(buildInput()).ok;

  const resetForm = () => {
    setRecipient(EMPTY.recipient);
    setRecipientSearch("");
    setRecipientOpen(false);
    setTitle(EMPTY.title);
    setMessageHtml(EMPTY.messageHtml);
    setMentionIds(EMPTY.mentionIds);
    setHashtags(EMPTY.hashtags);
    setImages(EMPTY.images);
    setIsAnonymous(EMPTY.isAnonymous);
    setAnonymousName(EMPTY.anonymousName);
    setErrors([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePickImage = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (!isAllowedImageType(file.type)) {
      setErrors(["Định dạng tệp không hợp lệ (chỉ chấp nhận ảnh)"]);
      return;
    }
    if (images.length >= 5) return;
    const result = await onUploadImage(file);
    if (result.ok) {
      setImages((prev) => [
        ...prev,
        { id: `img-${result.url}`, previewUrl: result.url, file },
      ]);
      setErrors([]);
    } else {
      setErrors([result.error]);
    }
  };

  const handleSubmit = async () => {
    const input = buildInput();
    const check = validateKudoInput(input);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setSubmitting(true);
    setErrors([]);
    const result = await onSubmit(input);
    setSubmitting(false);
    if (result.ok) {
      resetForm();
      onClose();
    } else {
      setErrors(result.errors);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="viet-kudo-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 16, 26, 0.6)",
        padding: "24px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "752px",
          maxWidth: "100%",
          background: "rgba(255, 248, 225, 1)",
          borderRadius: "24px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <h2
          id="viet-kudo-title"
          style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: "40px",
            color: "rgba(0, 16, 26, 1)",
            textAlign: "center",
            width: "100%",
          }}
        >
          Gửi lời cám ơn và ghi nhận đến đồng đội
        </h2>

        <KudoRecipientField
          value={recipient}
          searchText={recipientSearch}
          isOpen={recipientOpen}
          options={recipientOptions}
          onSearchChange={setRecipientSearch}
          onSelect={(opt) => {
            setRecipient(opt);
            setRecipientOpen(false);
            setRecipientSearch("");
          }}
          onToggleOpen={() => setRecipientOpen((prev) => !prev)}
        />

        <KudoTitleField value={title} onChange={setTitle} />

        <KudoMessageEditor
          placeholder={MESSAGE_PLACEHOLDER}
          hint={MESSAGE_HINT}
          onChange={setMessageHtml}
          onMentionsChange={setMentionIds}
          onSearchRecipients={onSearchRecipients}
        />

        <KudoHashtagField
          chips={hashtags}
          options={availableHashtags}
          onAdd={(opt) =>
            setHashtags((prev) =>
              prev.length >= 5 ? prev : [...prev, opt],
            )
          }
          onRemove={(id) =>
            setHashtags((prev) => prev.filter((h) => h.id !== id))
          }
          maxCount={5}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={handleFileChange}
        />
        <KudoImageField
          images={images}
          onAdd={handlePickImage}
          onRemove={(id) =>
            setImages((prev) => prev.filter((img) => img.id !== id))
          }
          maxCount={5}
        />

        <KudoAnonymousField
          checked={isAnonymous}
          anonymousName={anonymousName}
          onToggle={() => setIsAnonymous((prev) => !prev)}
          onNameChange={setAnonymousName}
        />

        {errors.length > 0 && (
          <ul
            role="alert"
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "rgba(207, 19, 34, 1)",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: "24px",
            width: "100%",
            height: "60px",
          }}
        >
          <button
            type="button"
            aria-label="Hủy"
            onClick={handleClose}
            disabled={submitting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "16px 40px",
              border: "1px solid #998C5F",
              borderRadius: "4px",
              background: "rgba(255, 234, 158, 0.10)",
              cursor: submitting ? "not-allowed" : "pointer",
              height: "60px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "24px",
                color: "rgba(0, 16, 26, 1)",
              }}
            >
              Hủy
            </span>
            <Image
              src="/viet-kudo/Close.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            aria-label="Gửi"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "16px",
              border: "none",
              borderRadius: "8px",
              background: "rgba(255, 234, 158, 1)",
              cursor: !isValid || submitting ? "not-allowed" : "pointer",
              opacity: !isValid || submitting ? 0.5 : 1,
              height: "60px",
              transition: "opacity 150ms ease",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                lineHeight: "28px",
                color: "rgba(0, 16, 26, 1)",
              }}
            >
              {submitting ? "Đang gửi..." : "Gửi"}
            </span>
            {!submitting && (
              <Image
                src="/viet-kudo/Send.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
