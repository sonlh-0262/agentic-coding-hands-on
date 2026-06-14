"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

const LANGUAGES = [
  { code: "VN", label: "Tiếng Việt" },
  { code: "EN", label: "English" },
];

/**
 * LanguageSwitcher — "VN" + Vietnamese flag + chevron.
 * Opens a dropdown with VN/EN options (presentational only — no real i18n).
 * Keyboard accessible: Enter/Space open, Escape close, click-outside close.
 */
export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("VN");
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Click-outside close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    } else if (e.key === "Escape") {
      close();
    }
  }

  function selectLanguage(code: string) {
    setSelected(code);
    close();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${selected}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        className="flex items-center justify-between gap-[2px] rounded-[4px] cursor-pointer transition-[background-color] duration-200 ease-[ease] hover:bg-white/[0.08]"
        style={{ width: "108px", height: "56px", padding: "16px" }}
      >
        {/* Flag + label */}
        <span className="flex items-center gap-1">
          <Image
            src="/home/flag-vn.svg"
            alt="Vietnamese flag"
            width={20}
            height={15}
          />
          <span
            className="text-white text-base font-bold leading-6 tracking-[0.15px]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {selected}
          </span>
        </span>
        {/* Chevron — rotates when open */}
        <Image
          src="/home/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className="absolute top-full left-0 mt-1 z-50 rounded-[4px] overflow-hidden"
          style={{
            width: "108px",
            background: "rgba(16, 20, 23, 0.96)",
            border: "1px solid #2E3940",
          }}
        >
          {LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={selected === lang.code}
              tabIndex={0}
              className="flex items-center px-4 py-3 cursor-pointer text-white text-sm font-bold hover:bg-white/[0.08] focus:bg-white/[0.08] outline-none"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              onClick={() => selectLanguage(lang.code)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectLanguage(lang.code);
                } else if (e.key === "Escape") {
                  close();
                }
              }}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
