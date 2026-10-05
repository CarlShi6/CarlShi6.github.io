"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import styles from "./accordion-gallery.module.css";

export type AccordionGalleryItem = {
  title: string;
  category: string;
  description: string;
  image: string;
  href: string;
  alt?: string;
  compactMedia?: boolean;
};

type AccordionGalleryProps = {
  items: readonly AccordionGalleryItem[];
  defaultIndex?: number;
};

const EXPANDED_SHARE = 0.48;

export function AccordionGallery({ items, defaultIndex = 0 }: AccordionGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const panelRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreferences = () => {
      setIsMobile(mobileQuery.matches);
      setPrefersReducedMotion(motionQuery.matches);
    };

    syncPreferences();
    mobileQuery.addEventListener("change", syncPreferences);
    motionQuery.addEventListener("change", syncPreferences);

    return () => {
      mobileQuery.removeEventListener("change", syncPreferences);
      motionQuery.removeEventListener("change", syncPreferences);
    };
  }, []);

  useLayoutEffect(() => {
    const panels = panelRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const media = mediaRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!panels.length) return;

    if (isMobile) {
      gsap.set(panels, { clearProps: "flexGrow" });
      gsap.set(media, { clearProps: "transform" });
      return;
    }

    const collapsedCount = Math.max(items.length - 1, 1);
    const activeGrow = (EXPANDED_SHARE * collapsedCount) / (1 - EXPANDED_SHARE);
    const duration = prefersReducedMotion || !hasAnimatedRef.current ? 0 : 0.46;
    const timeline = gsap.timeline({ defaults: { duration, ease: "power3.out" } });

    panels.forEach((panel, index) => {
      timeline.to(panel, { flexGrow: index === activeIndex ? activeGrow : 1 }, 0);
    });

    media.forEach((element, index) => {
      const distance = Math.max(-2, Math.min(2, activeIndex - index));
      timeline.to(
        element,
        {
          xPercent: index === activeIndex ? 0 : distance * 0.75,
          scale: index === activeIndex ? 1.01 : 1.035,
        },
        0,
      );
    });

    hasAnimatedRef.current = true;
    return () => timeline.kill();
  }, [activeIndex, isMobile, items.length, prefersReducedMotion]);

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (isMobile || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + items.length) % items.length;
    setActiveIndex(nextIndex);
    panelRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.gallery} role="list" aria-label="Selected project case studies" data-reveal>
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <Link
            key={item.href}
            ref={(node) => {
              panelRefs.current[index] = node;
            }}
            className={styles.panel}
            href={item.href}
            role="listitem"
            aria-expanded={isMobile || isActive}
            data-active={isActive}
            data-cursor-hint="Dive in"
            onMouseEnter={() => {
              if (!isMobile) setActiveIndex(index);
            }}
            onFocus={() => {
              if (!isMobile) setActiveIndex(index);
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={(event) => {
              if (!isMobile && !isActive) {
                event.preventDefault();
                setActiveIndex(index);
              }
            }}
          >
            <div
              ref={(node) => {
                mediaRefs.current[index] = node;
              }}
              className={styles.media}
              data-compact={item.compactMedia || undefined}
            >
              <Image
                src={item.image}
                alt={item.alt ?? `${item.title} project preview`}
                fill
                sizes="(max-width: 760px) 100vw, (max-width: 1200px) 48vw, 600px"
                unoptimized
              />
            </div>

            <div className={styles.caption}>
              <h4>{item.title}</h4>
              <div className={styles.details} aria-hidden={!isMobile && !isActive}>
                <small>{item.category}</small>
                <p>{item.description}</p>
                <span className={styles.cta}>
                  View Case Study <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
