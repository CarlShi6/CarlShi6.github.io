/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./motion-study.module.css";

const CAMERA_STEP = 900;
const FINAL_UNIT = 6;

const media = {
  entry: {
    src: "/media/ai-pc-build-advisor/secondary-product-entry.png",
    alt: "AI PC Build Advisor product-entry screen.",
  },
  cart: {
    src: "/media/ai-pc-build-advisor/primary-cart-execution.png",
    alt: "AI PC Build Advisor Cart Execution screen.",
  },
  detail: {
    src: "/media/ai-pc-build-advisor/secondary-compatibility-detail.png",
    alt: "AI PC Build Advisor compatibility detail showing the CPU, GPU, stock warning, compatibility result, and total price.",
  },
} as const;

type Support = {
  eyebrow: string;
  title: string;
  items?: string[];
  image?: keyof typeof media;
  side: "left" | "right";
  depthOffset: number;
  y: string;
};

type Chapter = {
  id: string;
  index: number;
  stage: string;
  title: string;
  sentence: string;
  image: keyof typeof media;
  depth: number;
  kind: "entry" | "cart" | "detail";
  supports: [Support, Support];
};

const chapters: Chapter[] = [
  {
    id: "intro",
    index: 0,
    stage: "Intro",
    title: "Travel through how I build products.",
    sentence: "Carl Shi — Technical Product Builder.",
    image: "entry",
    depth: -900,
    kind: "entry",
    supports: [
      { eyebrow: "Product entry", title: "A guided starting point", image: "entry", side: "left", depthOffset: -120, y: "-18vh" },
      { eyebrow: "Decision signal", title: "Compatibility stays visible", image: "detail", side: "right", depthOffset: 110, y: "17vh" },
    ],
  },
  {
    id: "discover",
    index: 1,
    stage: "Discover",
    title: "Start with the decision the customer is actually trying to make.",
    sentence: "Budget, performance, use case, stock, and compatibility become the product’s input—not afterthoughts.",
    image: "entry",
    depth: -1150,
    kind: "entry",
    supports: [
      { eyebrow: "Customer intent", title: "What should this PC enable?", items: ["$2,800 budget", "1440p performance", "Gaming + creation"], side: "left", depthOffset: -120, y: "-17vh" },
      { eyebrow: "Purchase reality", title: "What could block confidence?", items: ["Live stock", "Part compatibility", "Upgrade headroom"], side: "right", depthOffset: 100, y: "18vh" },
    ],
  },
  {
    id: "define",
    index: 2,
    stage: "Define",
    title: "Turn an ambiguous request into structured product decisions.",
    sentence: "Requirements, constraints, priorities, and tradeoffs converge toward one buildable recommendation.",
    image: "entry",
    depth: -2050,
    kind: "entry",
    supports: [
      { eyebrow: "Requirements", title: "Prioritize the outcome", items: ["Performance target", "Budget ceiling", "Serviceability"], side: "left", depthOffset: -90, y: "-15vh" },
      { eyebrow: "Tradeoff", title: "Keep alternatives actionable", items: ["RTX 4080 Super", "Low-stock risk", "Comparable 4070 Ti option"], side: "right", depthOffset: 120, y: "16vh" },
    ],
  },
  {
    id: "build",
    index: 3,
    stage: "Build",
    title: "Move deeper into the same product—from recommendation to execution.",
    sentence: "The configuration journey continues into purchasing, inventory, and an employee-ready workflow.",
    image: "cart",
    depth: -2950,
    kind: "cart",
    supports: [
      { eyebrow: "Step 01", title: "Configuration", image: "entry", side: "left", depthOffset: -120, y: "-16vh" },
      { eyebrow: "Step 02", title: "Cart execution", items: ["Selected parts", "Purchase entries", "Pre-cart checklist"], side: "right", depthOffset: 90, y: "17vh" },
    ],
  },
  {
    id: "validate",
    index: 4,
    stage: "Validate",
    title: "Inspect the evidence that makes the recommendation trustworthy.",
    sentence: "Compatibility, availability, selected components, and total price remain inspectable at the decision point.",
    image: "detail",
    depth: -3850,
    kind: "detail",
    supports: [
      { eyebrow: "Compatibility", title: "All passed", items: ["CPU + motherboard", "GPU + power", "Cooling + case"], side: "left", depthOffset: -80, y: "-18vh" },
      { eyebrow: "Decision evidence", title: "$2,783.94", items: ["1 low-stock alternative", "CPU + GPU selected", "Price held in context"], side: "right", depthOffset: 110, y: "17vh" },
    ],
  },
  {
    id: "launch",
    index: 5,
    stage: "Launch / Iterate",
    title: "Close the loop from recommendation to employee handoff.",
    sentence: "Purchase execution, checklist, and order action are ready for testing; saved builds and price monitoring remain roadmap cues.",
    image: "cart",
    depth: -4750,
    kind: "cart",
    supports: [
      { eyebrow: "Launch readiness", title: "Complete the handoff", items: ["Employee summary", "Pre-cart checklist", "Place order action"], side: "left", depthOffset: -100, y: "-17vh" },
      { eyebrow: "Iteration cue", title: "Learn from the next decision", items: ["Saved builds", "Price-watch feedback", "Alternative acceptance"], side: "right", depthOffset: 100, y: "17vh" },
    ],
  },
];

const lifecycle = ["Discover", "Define", "Build", "Validate", "Launch", "Iterate"];

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

function lifecycleStage(unit: number) {
  if (unit < 0.55) return "";
  if (unit < 1.5) return "Discover";
  if (unit < 2.5) return "Define";
  if (unit < 3.5) return "Build";
  if (unit < 4.5) return "Validate";
  if (unit < 5.45) return "Launch";
  return "Iterate";
}

function StaticStudy({ onEnableMotion }: { onEnableMotion: () => void }) {
  return (
    <main className={styles.staticStudy}>
      <header className={styles.staticHeader}>
        <a href="/" aria-label="Return to Carl Shi portfolio">CS</a>
        <div>
          <button type="button" onClick={onEnableMotion}>Use motion</button>
          <a href="/#ai-pc-build-advisor">View projects ↗</a>
        </div>
      </header>

      <div className={styles.staticIntro}>
        <p>Motion study / Reduced motion</p>
        <h1>Travel through how I build products.</h1>
        <span>Carl Shi — Technical Product Builder.</span>
      </div>

      <nav className={styles.staticLifecycle} aria-label="Product lifecycle">
        {lifecycle.map((stage) => <span key={stage}>{stage}</span>)}
      </nav>

      {chapters.map((chapter) => (
        <section className={styles.staticChapter} id={`static-${chapter.id}`} aria-labelledby={`static-${chapter.id}-title`} key={chapter.id}>
          <div className={styles.staticCopy}>
            <p>{chapter.stage}</p>
            <h2 id={`static-${chapter.id}-title`}>{chapter.title}</h2>
            <span>{chapter.sentence}</span>
          </div>
          <figure className={`${styles.staticVisual} ${chapter.kind === "detail" ? styles.staticDetail : ""}`}>
            <Image src={media[chapter.image].src} alt={media[chapter.image].alt} width={chapter.kind === "detail" ? 780 : 998} height={chapter.kind === "detail" ? 220 : 769} unoptimized />
          </figure>
          <div className={styles.staticArtifacts}>
            {chapter.supports.map((support) => (
              <article key={`${chapter.id}-${support.eyebrow}`}>
                <p>{support.eyebrow}</p>
                <h3>{support.title}</h3>
                {support.items && <ul>{support.items.map((item) => <li key={item}>{item}</li>)}</ul>}
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

export default function MotionStudy() {
  const rootRef = useRef<HTMLElement>(null);
  const [unit, setUnit] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [forcedReduced, setForcedReduced] = useState(false);
  const reducedMotion = prefersReduced || forcedReduced;
  const activeIndex = clamp(Math.round(unit), 0, chapters.length - 1);
  const activeChapter = chapters[activeIndex];
  const currentLifecycle = lifecycleStage(unit);
  const cameraZ = unit * CAMERA_STEP;
  const passingThrough = unit > 5.56;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    const frame = window.requestAnimationFrame(() => setPrefersReduced(query.matches));
    query.addEventListener("change", updatePreference);
    return () => {
      window.cancelAnimationFrame(frame);
      query.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;
      const distance = Math.max(root.offsetHeight - window.innerHeight, 1);
      const next = clamp(((window.scrollY - root.offsetTop) / distance) * FINAL_UNIT, 0, FINAL_UNIT);
      setUnit((current) => Math.abs(current - next) > 0.001 ? next : current);
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const scrollToChapter = useCallback((index: number) => {
    const root = rootRef.current;
    if (!root) return;
    const distance = Math.max(root.offsetHeight - window.innerHeight, 1);
    window.scrollTo({
      top: root.offsetTop + (clamp(index, 0, FINAL_UNIT) / FINAL_UNIT) * distance,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select")) return;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        scrollToChapter(Math.min(activeIndex + 1, FINAL_UNIT));
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        scrollToChapter(Math.max(activeIndex - 1, 0));
      }
      if (event.key === "Home") {
        event.preventDefault();
        scrollToChapter(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        scrollToChapter(FINAL_UNIT);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, reducedMotion, scrollToChapter]);

  const visiblePlanes = useMemo(() => chapters.map((chapter) => {
    const relativeDepth = chapter.depth + cameraZ;
    return {
      chapter,
      visible: relativeDepth > -1750 && relativeDepth < -130,
    };
  }), [cameraZ]);

  if (reducedMotion) {
    return <StaticStudy onEnableMotion={() => setForcedReduced(false)} />;
  }

  const sceneStyle = {
    "--camera-z": `${cameraZ}px`,
  } as CSSProperties;

  return (
    <main className={styles.motionRoot} ref={rootRef}>
      <section className={styles.viewport} aria-labelledby="motion-study-title">
        <header className={styles.header}>
          <a className={styles.mark} href="/" aria-label="Return to Carl Shi portfolio">CS</a>
          <p>AI PC Build Advisor / Motion study</p>
          <div className={styles.headerActions}>
            <button type="button" onClick={() => setForcedReduced(true)}>Reduce motion</button>
            <a href="/#ai-pc-build-advisor">Skip motion / View projects ↗</a>
          </div>
        </header>

        <div className={styles.scene} aria-hidden="true">
          <div className={styles.world} style={sceneStyle}>
            {visiblePlanes.map(({ chapter, visible }) => {
              const planeStyle = {
                "--plane-z": `${chapter.depth}px`,
              } as CSSProperties;
              return (
                <div className={`${styles.planeSlot} ${styles.mainSlot} ${styles[chapter.kind]}`} style={{ ...planeStyle, visibility: visible ? "visible" : "hidden" }} key={chapter.id}>
                  <figure className={styles.mainPlane}>
                    <Image
                      src={media[chapter.image].src}
                      alt=""
                      width={chapter.kind === "detail" ? 780 : 998}
                      height={chapter.kind === "detail" ? 220 : 769}
                      priority={chapter.index < 2}
                      unoptimized
                    />
                    <figcaption>{chapter.stage} / Real product</figcaption>
                  </figure>
                </div>
              );
            })}

            {activeChapter.supports.map((support) => {
              const supportStyle = {
                "--plane-z": `${activeChapter.depth + support.depthOffset}px`,
                "--support-y": support.y,
              } as CSSProperties;
              return (
                <div className={`${styles.planeSlot} ${styles.supportSlot} ${support.side === "left" ? styles.supportLeft : styles.supportRight}`} style={supportStyle} key={`${activeChapter.id}-${support.eyebrow}`}>
                  <article className={styles.supportPlane}>
                    <p>{support.eyebrow}</p>
                    <h3>{support.title}</h3>
                    {support.image && (
                      <Image src={media[support.image].src} alt="" width={780} height={440} unoptimized />
                    )}
                    {support.items && <ul>{support.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {!passingThrough ? (
          <div className={`${styles.chapterCopy} ${activeIndex === 0 ? styles.introCopy : ""}`}>
            <p>{activeChapter.stage}</p>
            <h1 id="motion-study-title">{activeChapter.title}</h1>
            <span>{activeChapter.sentence}</span>
          </div>
        ) : (
          <div className={styles.completion}>
            <p>Journey complete</p>
            <h1 id="motion-study-title">Pass through the completed experience.</h1>
            <a href="/#ai-pc-build-advisor">View the portfolio ↗</a>
          </div>
        )}

        <nav className={styles.lifecycle} aria-label="Product lifecycle">
          <span className={styles.lifecycleLine} aria-hidden="true"><i style={{ width: `${clamp((unit - 0.55) / 5.45, 0, 1) * 100}%` }} /></span>
          <ol>
            {lifecycle.map((stage) => (
              <li className={currentLifecycle === stage ? styles.currentStage : ""} aria-current={currentLifecycle === stage ? "step" : undefined} key={stage}>
                {stage}
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.scrollCue} aria-hidden="true">
          <span>Scroll to move camera</span>
          <i />
        </div>
        <p className={styles.srOnly} aria-live="polite">Current chapter: {activeChapter.stage}</p>
      </section>
    </main>
  );
}
