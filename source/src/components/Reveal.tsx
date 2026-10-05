"use client";

import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./Reveal.css";

export const REVEAL_MOTION = {
  duration: 640,
  distance: 26,
  stagger: 72,
  threshold: 0.16,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

type RevealDirection = "up" | "down" | "left" | "right" | "none";
type RevealElement = "div" | "header" | "section" | "footer" | "article";

type RevealProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  children: ReactNode;
  as?: RevealElement;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  delay?: number;
  staggerIndex?: number;
  stagger?: number;
  once?: boolean;
  animateOnMount?: boolean;
};

const subscriptions = new Map<Element, { once: boolean }>();
let sharedObserver: IntersectionObserver | null = null;

function setRevealState(element: Element, state: "hidden" | "visible") {
  (element as HTMLElement).dataset.revealState = state;
}

function stopObserving(element: Element) {
  sharedObserver?.unobserve(element);
  subscriptions.delete(element);
}

function getSharedObserver() {
  if (sharedObserver || typeof IntersectionObserver === "undefined") return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const subscription = subscriptions.get(entry.target);
        if (!subscription) return;

        if (entry.isIntersecting) {
          setRevealState(entry.target, "visible");
          if (subscription.once) stopObserving(entry.target);
        } else if (!subscription.once) {
          setRevealState(entry.target, "hidden");
        }
      });
    },
    {
      threshold: REVEAL_MOTION.threshold,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  return sharedObserver;
}

function isHashTarget(element: HTMLElement) {
  if (!window.location.hash) return false;

  try {
    const target = document.querySelector(window.location.hash);
    return Boolean(target && (target === element || target.contains(element)));
  } catch {
    return false;
  }
}

function offsets(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "none":
      return { x: 0, y: 0 };
    default:
      return { x: 0, y: distance };
  }
}

export function Reveal({
  children,
  as = "div",
  direction = "up",
  distance = REVEAL_MOTION.distance,
  duration = REVEAL_MOTION.duration,
  delay = 0,
  staggerIndex,
  stagger = REVEAL_MOTION.stagger,
  once = true,
  animateOnMount = false,
  className = "",
  style,
  onFocusCapture,
  ...htmlProps
}: RevealProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const staggerDelay = delay + (staggerIndex ?? 0) * stagger;
  const desktopOffset = offsets(direction, distance);
  const mobileOffset = offsets(direction, Math.min(distance, 16));
  const revealStyle = {
    ...style,
    "--reveal-x": `${desktopOffset.x}px`,
    "--reveal-y": `${desktopOffset.y}px`,
    "--reveal-mobile-x": `${mobileOffset.x}px`,
    "--reveal-mobile-y": `${mobileOffset.y}px`,
    "--reveal-duration": `${duration}ms`,
    "--reveal-mobile-duration": `${Math.min(duration, 500)}ms`,
    "--reveal-delay": `${staggerDelay}ms`,
    "--reveal-mobile-delay": `${Math.min(staggerDelay, 105)}ms`,
    "--reveal-easing": REVEAL_MOTION.easing,
  } as CSSProperties;
  const Component = as;

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const revealNow = () => {
      setRevealState(element, "visible");
      stopObserving(element);
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || isHashTarget(element) || typeof IntersectionObserver === "undefined") {
      revealNow();
      return;
    }

    let frame = 0;
    if (animateOnMount) {
      setRevealState(element, "hidden");
      frame = window.requestAnimationFrame(revealNow);
    } else {
      const rect = element.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight * 0.88 && rect.bottom > 0;

      if (alreadyVisible) {
        revealNow();
      } else {
        setRevealState(element, "hidden");
        subscriptions.set(element, { once });
        getSharedObserver()?.observe(element);
      }
    }

    const handleHashChange = () => {
      if (isHashTarget(element)) revealNow();
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", handleHashChange);
      stopObserving(element);
    };
  }, [animateOnMount, once]);

  return (
    <Component
      {...htmlProps}
      ref={elementRef as never}
      className={`reveal${className ? ` ${className}` : ""}`}
      style={revealStyle}
      data-reveal=""
      onFocusCapture={(event: FocusEvent<HTMLElement>) => {
        const element = elementRef.current;
        if (element) {
          setRevealState(element, "visible");
          stopObserving(element);
        }
        onFocusCapture?.(event);
      }}
    >
      {children}
    </Component>
  );
}
