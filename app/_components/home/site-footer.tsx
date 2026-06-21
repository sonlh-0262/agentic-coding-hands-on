"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FOOTER_NAV_LINKS } from "./home-data";

/**
 * SiteFooter — homepage footer.
 * Left: SAA logo. Center: nav links. Right: copyright text.
 */
export default function SiteFooter() {
  const pathname = usePathname();
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  return (
    <footer
      className="w-full flex flex-row items-center justify-between"
      style={{
        padding: "40px 90px",
        borderTop: "1px solid #2E3940",
        height: "144px",
      }}
      aria-label={t("footer.ariaLabel")}
    >
      {/* Left: Logo + nav links */}
      <div
        className="flex flex-row items-center"
        style={{ gap: "80px" }}
      >
        {/* Logo */}
        <Link href="/" aria-label={t("footer.logoAriaLabel")}>
          <Image
            src="/home/footer-logo.png"
            alt={t("footer.logoAlt")}
            width={69}
            height={64}
            className="object-contain"
          />
        </Link>

        {/* Nav links */}
        <nav className="flex flex-row items-center" style={{ gap: "48px" }}>
          {FOOTER_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href + link.labelKey}
                href={link.href}
                className="font-bold transition-colors duration-200 hover:text-[#FFEA9E]"
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "0.15px",
                  padding: "16px",
                  color: "#fff",
                  textShadow: isActive
                    ? "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"
                    : "none",
                  backgroundColor: isActive
                    ? "rgba(255, 234, 158, 0.10)"
                    : "transparent",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {t(`footer.nav.${link.labelKey}`)}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: Copyright */}
      <p
        className="text-white text-center font-bold"
        style={{
          fontFamily: "var(--font-montserrat-alt), sans-serif",
          fontSize: "16px",
          lineHeight: "24px",
          margin: 0,
        }}
      >
        {tCommon("copyright")}
      </p>
    </footer>
  );
}
