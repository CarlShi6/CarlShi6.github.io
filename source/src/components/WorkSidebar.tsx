"use client";

import { useEffect, useState } from "react";
import { workProjects } from "@/src/data/work-projects";
import { LineSidebar, type LineSidebarItem } from "./react-bits/LineSidebar";

const projectIds = workProjects.map((project) => project.slug);
const items: LineSidebarItem[] = workProjects.map((project) => ({
  href: `#${project.slug}`,
  label: project.navLabel,
}));

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function WorkSidebar() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sections = projectIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const headerOffset = window.matchMedia("(max-width: 760px)").matches ? 126 : 98;
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (!current?.target.id) return;
        const index = projectIds.indexOf(current.target.id);
        if (index >= 0) setActiveIndex(index);
      },
      {
        rootMargin: `-${headerOffset}px 0px -${Math.max(
          window.innerHeight - headerOffset - 1,
          0,
        )}px 0px`,
        threshold: 0,
      },
    );
    sections.forEach((section) => observer.observe(section));

    const scrollToHash = (behavior: ScrollBehavior) => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const index = projectIds.indexOf(id);
      if (index < 0) return;
      document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
      setActiveIndex(index);
    };
    const frame = window.requestAnimationFrame(() => scrollToHash("auto"));
    const handleHistoryChange = () =>
      scrollToHash(prefersReducedMotion() ? "auto" : "smooth");
    window.addEventListener("hashchange", handleHistoryChange);
    window.addEventListener("popstate", handleHistoryChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", handleHistoryChange);
      window.removeEventListener("popstate", handleHistoryChange);
      observer.disconnect();
    };
  }, []);

  const selectProject = (index: number, item: LineSidebarItem) => {
    window.history.pushState(null, "", item.href);
    document.querySelector(item.href)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    setActiveIndex(index);
  };

  return (
    <>
      <aside className="work-navigation-rail">
        <LineSidebar
          items={items}
          activeIndex={activeIndex}
          accentColor="#7ea47a"
          textColor="#c4c4c4"
          markerColor="#6c6c6c"
          proximityRadius={100}
          maxShift={30}
          falloff="smooth"
          markerLength={60}
          markerGap={0}
          tickScale={0.5}
          scaleTick
          itemGap={20}
          fontSize={1.1}
          smoothing={100}
          showIndex
          showMarker
          onItemClick={selectProject}
        />
      </aside>
      <nav className="work-mobile-project-nav" aria-label="Case study navigation">
        {items.map((item, index) => (
          <a
            href={item.href}
            aria-current={activeIndex === index ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              selectProject(index, item);
            }}
            key={item.href}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </>
  );
}
