"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import type { HomeUser } from "./home-client";

interface AccountMenuProps {
  user: HomeUser;
}

/**
 * AccountMenu — user icon button + dropdown.
 * Dropdown shows: Profile, Sign out, and Admin Dashboard (isAdmin only).
 * Sign out uses a POST form to /auth/signout (route already exists).
 */
export default function AccountMenu({ user }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
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
    if (e.key === "Escape") close();
  }

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-[4px] transition-[background-color,border-color] duration-200 hover:bg-white/[0.08]"
        style={{
          width: "40px",
          height: "40px",
          padding: "10px",
          border: "1px solid #998C5F",
          background: "rgba(0, 0, 0, 0)",
        }}
      >
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.name}
            width={24}
            height={24}
            className="rounded-full object-cover"
            style={{ width: "24px", height: "24px" }}
          />
        ) : (
          <Image
            src="/home/icon-user.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 z-50 rounded-[8px] overflow-hidden py-2"
          style={{
            minWidth: "180px",
            background: "rgba(16, 20, 23, 0.96)",
            border: "1px solid #2E3940",
          }}
        >
          {/* User info header */}
          <div
            className="px-4 py-2 border-b"
            style={{ borderColor: "#2E3940" }}
          >
            <p
              className="text-white font-bold text-sm truncate"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {user.name}
            </p>
            <p
              className="text-sm truncate"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "12px",
              }}
            >
              {user.email}
            </p>
          </div>

          {/* Profile */}
          <a
            href="/profile"
            role="menuitem"
            className="flex items-center px-4 py-3 text-white text-sm font-bold hover:bg-white/[0.08] transition-colors duration-150"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            onClick={close}
          >
            Hồ sơ
          </a>

          {/* Admin Dashboard — conditional */}
          {user.isAdmin && (
            <a
              href="/admin"
              role="menuitem"
              className="flex items-center px-4 py-3 text-white text-sm font-bold hover:bg-white/[0.08] transition-colors duration-150"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              onClick={close}
            >
              Admin Dashboard
            </a>
          )}

          {/* Sign out — POST form */}
          <form method="post" action="/auth/signout">
            <button
              type="submit"
              role="menuitem"
              className="w-full text-left flex items-center px-4 py-3 text-sm font-bold hover:bg-white/[0.08] transition-colors duration-150"
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                color: "rgba(255, 234, 158, 1)",
              }}
            >
              Đăng xuất
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
