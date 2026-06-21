"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import AwardsNav from "./awards-nav";
import AwardDetailSection from "./award-detail-section";
import { AWARDS_LIST } from "./awards-data";
import type { AwardSlug } from "./awards-data";

/**
 * AwardsBody — Two-column layout:
 *   Left: sticky nav (scroll-spy active state)
 *   Right: scrollable detail sections for each of the 6 awards
 *
 * Scroll-spy: uses IntersectionObserver to track which section is in view
 * and update the active nav item accordingly.
 * Nav click: smooth-scrolls to the target section anchor.
 *
 * Translates all display copy via `useTranslations('awards')` and threads
 * it down to child components as props.
 */
export default function AwardsBody() {
  const t = useTranslations("awards");
  const [activeSlug, setActiveSlug] = useState<string>(AWARDS_LIST[0].slug);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Suppresses scroll-spy updates while a nav-click smooth-scroll is animating,
  // so the active indicator doesn't flicker through intermediate sections.
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Set up intersection observer for scroll-spy
  useEffect(() => {
    const slugs = AWARDS_LIST.map((a) => a.slug);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Ignore observer churn during a programmatic smooth-scroll.
        if (isScrollingRef.current) return;

        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const slug = visible[0].target.id;
          if (slugs.includes(slug)) {
            setActiveSlug(slug);
          }
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      }
    );

    // Observe all section elements
    slugs.forEach((slug) => {
      const el = document.getElementById(slug);
      if (el) {
        sectionRefs.current.set(slug, el);
        observerRef.current?.observe(el);
      }
    });

    return () => {
      observerRef.current?.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleNavClick = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      // Lock the active slug to the clicked target until the smooth-scroll
      // settles, then re-enable scroll-spy.
      isScrollingRef.current = true;
      setActiveSlug(slug);
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 700);
    }
  }, []);

  const quantityLabel = t("quantity.label");
  const valueLabel = t("value.label");
  const orLabel = t("value.or");

  return (
    <div
      className="w-full"
      style={{ padding: "0 144px" }}
    >
      <div
        className="flex"
        style={{
          gap: "80px",
          maxWidth: "1152px",
          margin: "0 auto",
          alignItems: "flex-start",
        }}
      >
        {/* Left: sticky nav */}
        <AwardsNav activeSlug={activeSlug} onNavClick={handleNavClick} />

        {/* Right: detail sections */}
        <div
          className="flex flex-col flex-1 min-w-0"
          style={{ gap: "80px" }}
        >
          {AWARDS_LIST.map((award) => {
            const slug = award.slug as AwardSlug;
            const itemValues = award.values.map((v, idx) => ({
              amount: v.amount,
              note: t(`items.${slug}.values.${idx}.note`),
            }));

            return (
              <AwardDetailSection
                key={slug}
                award={award}
                title={t(`items.${slug}.title`)}
                description={t(`items.${slug}.description`)}
                quantityUnit={t(`items.${slug}.quantityUnit`)}
                quantityLabel={quantityLabel}
                valueLabel={valueLabel}
                orLabel={orLabel}
                values={itemValues}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
