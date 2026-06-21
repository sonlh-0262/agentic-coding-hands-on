"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import NotificationButton from "./notification-button";
import AccountMenu from "./account-menu";
import type { HomeUser } from "./home-client";
import { NAV_LINKS } from "./home-data";

interface SiteHeaderProps {
  user: HomeUser | null;
}

/**
 * SiteHeader — sticky/fixed top navigation bar.
 * Left: SAA logo. Center: nav links. Right: language + notification + account (or login).
 * Semi-transparent dark background: rgba(16, 20, 23, 0.80).
 */
export default function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();
  const t = useTranslations("home");
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex flex-row items-center justify-between"
      style={{
        height: "80px",
        padding: "12px 144px",
        backgroundColor: "rgba(16, 20, 23, 0.80)",
        gap: "238px",
      }}
    >
      {/* Left + center group */}
      <div className="flex items-center" style={{ gap: "64px" }}>
        {/* Logo */}
        <Link
          href="/"
          aria-label={t("header.logoAriaLabel")}
          className="flex items-center"
        >
          <div
            className="flex items-center justify-start"
            style={{ width: "52px", height: "48px" }}
          >
            <Image
              src="/home/logo.png"
              alt={t("header.logoAlt")}
              width={52}
              height={48}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Navigation links */}
        <nav
          className="flex flex-row items-center"
          style={{ gap: "24px" }}
          aria-label={t("header.mainNavAriaLabel")}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center rounded-[4px] text-sm font-bold leading-5 tracking-[0.1px] transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  padding: "16px",
                  color: isActive ? "rgba(255, 234, 158, 1)" : "#fff",
                  borderBottom: isActive
                    ? "1px solid rgba(255, 234, 158, 1)"
                    : "none",
                  textShadow: isActive
                    ? "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"
                    : "none",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {t(`header.nav.${link.labelKey}`)}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: controls */}
      <div className="flex flex-row items-center" style={{ gap: "16px" }}>
        <LanguageSwitcher />

        {user ? (
          <>
            <NotificationButton unreadCount={0} />
            <AccountMenu user={user} />
          </>
        ) : (
          /* Logged-out: login affordance */
          <Link
            href="/login"
            aria-label={t("header.loginAriaLabel")}
            className="flex items-center justify-center rounded-[4px] transition-[background-color,border-color] duration-200 hover:bg-white/[0.08]"
            style={{
              width: "40px",
              height: "40px",
              padding: "10px",
              border: "1px solid #998C5F",
            }}
          >
            <Image
              src="/home/icon-user.svg"
              alt={t("header.loginAlt")}
              width={24}
              height={24}
            />
          </Link>
        )}
      </div>
    </header>
  );
}
