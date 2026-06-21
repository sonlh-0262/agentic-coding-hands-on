"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface NotificationButtonProps {
  unreadCount?: number;
}

/**
 * NotificationButton — bell icon 40×40.
 * Shows a red badge dot only when unreadCount > 0.
 * Clicking opens an empty notification panel overlay.
 */
export default function NotificationButton({
  unreadCount = 0,
}: NotificationButtonProps) {
  const [open, setOpen] = useState(false);
  const hasUnread = unreadCount > 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("home");

  // Close on Escape or click outside.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label={hasUnread ? t("notifications.buttonLabelUnread", { count: unreadCount }) : t("notifications.buttonLabel")}
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center rounded-[4px] transition-[background-color] duration-200 hover:bg-white/[0.08]"
        style={{ width: "40px", height: "40px", padding: "10px" }}
      >
        <Image
          src="/home/icon-notification.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
        />
        {/* Unread badge */}
        {hasUnread && (
          <span
            className="absolute top-[5px] right-[5px] rounded-full"
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "rgba(212, 39, 29, 1)",
            }}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Empty notification panel */}
      {open && (
        <div
          className="absolute top-full right-0 mt-2 z-50 rounded-[8px] p-4"
          style={{
            width: "320px",
            background: "rgba(16, 20, 23, 0.96)",
            border: "1px solid #2E3940",
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "14px",
            textAlign: "center",
          }}
          role="dialog"
          aria-label={t("notifications.panelAriaLabel")}
        >
          {t("notifications.empty")}
        </div>
      )}
    </div>
  );
}
