"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import "./LineSidebar.css";

type Falloff = "linear" | "smooth" | "sharp";

export type LineSidebarItem = {
  href: string;
  label: string;
};

type LineSidebarProps = {
  items: LineSidebarItem[];
  activeIndex: number;
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  showIndex?: boolean;
  showMarker?: boolean;
  onItemClick?: (index: number, item: LineSidebarItem) => void;
};

const falloffCurves: Record<Falloff, (progress: number) => number> = {
  linear: (progress) => progress,
  smooth: (progress) => progress * progress * (3 - 2 * progress),
  sharp: (progress) => progress * progress * progress,
};

export function LineSidebar({
  items,
  activeIndex,
  accentColor = "#7ea47a",
  textColor = "#c4c4c4",
  markerColor = "#6c6c6c",
  proximityRadius = 100,
  maxShift = 30,
  falloff = "smooth",
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  showIndex = true,
  showMarker = true,
  onItemClick,
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const activeRef = useRef(activeIndex);
  const smoothingRef = useRef(smoothing);

  const startLoop = useCallback(() => {
    if (frameRef.current !== null) return;
    lastFrameRef.current = performance.now();
    const tick = (now: number) => {
      const delta = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = now;
      const tau = Math.max(smoothingRef.current, 1) / 1000;
      const interpolation = 1 - Math.exp(-delta / tau);
      let moving = false;

      itemRefs.current.forEach((element, index) => {
        if (!element) return;
        const target = Math.max(
          targetsRef.current[index] ?? 0,
          activeRef.current === index ? 1 : 0,
        );
        const current = currentRef.current[index] ?? 0;
        const next = current + (target - current) * interpolation;
        const settled = Math.abs(target - next) < 0.0015;
        const value = settled ? target : next;
        currentRef.current[index] = value;
        element.style.setProperty("--effect", value.toFixed(4));
        if (!settled) moving = true;
      });

      frameRef.current = moving ? window.requestAnimationFrame(tick) : null;
    };
    frameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const pointerY = event.clientY - list.getBoundingClientRect().top;
      const curve = falloffCurves[falloff];

      itemRefs.current.forEach((element, index) => {
        if (!element) return;
        const center = element.offsetTop + element.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[index] = curve(Math.max(0, 1 - distance / proximityRadius));
      });
      startLoop();
    },
    [falloff, proximityRadius, startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = items.map(() => 0);
    startLoop();
  }, [items, startLoop]);

  useEffect(() => {
    activeRef.current = activeIndex;
    smoothingRef.current = smoothing;
    startLoop();
  }, [activeIndex, smoothing, startLoop]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return (
    <nav
      className={`line-sidebar${showMarker ? " line-sidebar--markers" : ""}${
        scaleTick ? " line-sidebar--scale-tick" : ""
      }`}
      aria-label="Case study navigation"
      style={
        {
          "--accent-color": accentColor,
          "--text-color": textColor,
          "--marker-color": markerColor,
          "--marker-length": `${markerLength}px`,
          "--marker-gap": `${markerGap}px`,
          "--tick-scale": tickScale,
          "--max-shift": `${maxShift}px`,
          "--item-gap": `${itemGap}px`,
          "--font-size": `${fontSize}rem`,
        } as CSSProperties
      }
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((item, index) => (
          <li
            className={`line-sidebar__item${activeIndex === index ? " is-active" : ""}`}
            key={item.href}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
          >
            {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
            <a
              className="line-sidebar__link"
              href={item.href}
              aria-current={activeIndex === index ? "location" : undefined}
              onClick={(event) => {
                if (!onItemClick) return;
                event.preventDefault();
                onItemClick(index, item);
              }}
            >
              {showIndex && (
                <span className="line-sidebar__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
