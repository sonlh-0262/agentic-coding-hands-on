"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * WidgetButton — fixed bottom-right yellow pill.
 * Contains: pen icon + "/" + SAA icon.
 * Clicking opens a quick-action menu (placeholder options).
 */
export default function WidgetButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div
      className="fixed z-50"
      style={{ bottom: "32px", right: "19px" }}
      ref={containerRef}
    >
      {/* Quick action menu */}
      {open && (
        <div
          className="absolute bottom-full right-0 mb-3 rounded-[8px] overflow-hidden py-2"
          style={{
            minWidth: "160px",
            background: "rgba(16, 20, 23, 0.96)",
            border: "1px solid #2E3940",
          }}
          role="menu"
          aria-label="Quick actions"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full text-left px-4 py-3 text-white text-sm font-bold hover:bg-white/[0.08] transition-colors duration-150"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            onClick={() => setOpen(false)}
          >
            Viết Kudos
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full text-left px-4 py-3 text-white text-sm font-bold hover:bg-white/[0.08] transition-colors duration-150"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            onClick={() => setOpen(false)}
          >
            Xem thể lệ SAA
          </button>
        </div>
      )}

      {/* Pill button */}
      <button
        type="button"
        aria-label="Quick actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex flex-row items-center gap-2 rounded-full transition-all duration-200 hover:opacity-90"
        style={{
          width: "106px",
          height: "64px",
          padding: "16px",
          backgroundColor: "rgba(255, 234, 158, 1)",
          boxShadow:
            "0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 0 6px 0 #FAE287",
        }}
      >
        {/* Pen icon + divider */}
        <span className="flex items-center gap-2">
          <Image
            src="/home/icon-pen.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
          <span
            className="text-[#00101A] font-bold"
            style={{ fontSize: "16px" }}
            aria-hidden="true"
          >
            /
          </span>
        </span>

        {/* SAA icon */}
        <Image
          src="/home/icon-saa.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
