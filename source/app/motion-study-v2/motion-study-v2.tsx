"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./motion-study-v2.module.css";

const mediaRoot = "/media/ai-pc-build-advisor";

const lifecycle = [
  {
    stage: "Product entry",
    sentence: "Travel through how I build products.",
    until: 0.1,
  },
  {
    stage: "Discover",
    sentence: "I surface budget, use case, performance, and stock before proposing a build.",
    until: 0.24,
  },
  {
    stage: "Define",
    sentence: "I turn those needs into requirements the recommendation must satisfy together.",
    until: 0.38,
  },
  {
    stage: "Build",
    sentence: "I connect the recommendation to a cart an employee can actually execute.",
    until: 0.64,
  },
  {
    stage: "Validate",
    sentence: "I make compatibility, alternatives, and tradeoffs legible before purchase.",
    until: 0.84,
  },
  {
    stage: "Launch / Iterate",
    sentence: "I close the loop with purchase execution, employee handoff, and order evidence.",
    until: 1,
  },
] as const;

const imagePlanes = [
  {
    id: "entry",
    src: `${mediaRoot}/secondary-product-entry.png`,
    alt: "AI PC Build Advisor product entry screen",
    label: "Product entry",
    className: styles.entryPlane,
  },
  {
    id: "cart-build",
    src: `${mediaRoot}/primary-cart-execution.png`,
    alt: "AI PC Build Advisor cart execution screen",
    label: "Build / Cart execution",
    className: styles.cartBuildPlane,
  },
  {
    id: "compatibility",
    src: `${mediaRoot}/secondary-compatibility-detail.png`,
    alt: "Compatibility, stock, price, and alternative component details",
    label: "Validate / Compatibility detail",
    className: styles.compatibilityPlane,
  },
  {
    id: "cart-launch",
    src: `${mediaRoot}/primary-cart-execution.png`,
    alt: "Completed AI PC Build Advisor cart ready for purchase and employee handoff",
    label: "Launch / Purchase execution",
    className: styles.cartLaunchPlane,
  },
] as const;

const artifactPlanes = [
  { id: "need", eyebrow: "User need", title: "Confidence at the counter", detail: "A decision that can be explained.", className: styles.needArtifact },
  { id: "requirements", eyebrow: "Requirements", title: "One build, many constraints", detail: "Resolve the system, not one part.", className: styles.requirementsArtifact },
  { id: "use-case", eyebrow: "Use case", title: "1440p creation + play", detail: "Workload shapes the recommendation.", className: styles.useCaseArtifact },
  { id: "budget", eyebrow: "Budget", title: "$2,800 ceiling", detail: "Protect room for the right tradeoff.", className: styles.budgetArtifact },
  { id: "performance", eyebrow: "Performance", title: "Balanced CPU + GPU", detail: "Spend where the workload benefits.", className: styles.performanceArtifact },
  { id: "stock", eyebrow: "Stock", title: "One low-stock alternative", detail: "The build must survive inventory.", className: styles.stockArtifact },
  { id: "constraint", eyebrow: "Compatibility", title: "All passed", detail: "Every choice remains system-aware.", className: styles.constraintArtifact },
  { id: "selection", eyebrow: "Build logic", title: "Main recommendation", detail: "Alternatives stay actionable.", className: styles.selectionArtifact },
  { id: "evidence", eyebrow: "Validation", title: "$200 saved", detail: "A comparable path stays visible.", className: styles.evidenceArtifact },
  { id: "purchase", eyebrow: "Purchase", title: "Pre-cart checklist", detail: "Execution begins before checkout.", className: styles.purchaseArtifact },
  { id: "handoff", eyebrow: "Employee handoff", title: "Quote + assembly slot", detail: "The next person inherits context.", className: styles.handoffArtifact },
  { id: "order", eyebrow: "Order evidence", title: "#OD-22341", detail: "The recommendation reaches reality.", className: styles.orderArtifact },
] as const;

function phaseIndex(progress: number) {
  const index = lifecycle.findIndex((phase) => progress <= phase.until);
  return index === -1 ? lifecycle.length - 1 : index;
}

function ReducedStudy({ onEnableMotion }: { onEnableMotion: () => void }) {
  return (
    <main className={styles.reducedRoot}>
      <header className={styles.reducedHeader}>
        <Link href="/" aria-label="Return to Carl Shi portfolio">CS</Link>
        <p>Private motion study / Reduced motion</p>
        <button type="button" onClick={onEnableMotion}>Enable motion</button>
      </header>

      <section className={styles.reducedIntro}>
        <p>AI PC Build Advisor</p>
        <h1>Travel through how I build products.</h1>
        <span>The spatial journey is presented as a calm, linear case study.</span>
      </section>

      <section className={styles.reducedChapter}>
        <div>
          <p>Product entry / Discover / Define</p>
          <h2>Start with the decision.</h2>
          <span>Budget, use case, performance, compatibility, and stock become one product brief.</span>
        </div>
        <Image src={`${mediaRoot}/secondary-product-entry.png`} alt="AI PC Build Advisor product entry screen" width={994} height={624} priority unoptimized />
      </section>

      <section className={styles.reducedChapter}>
        <div>
          <p>Build</p>
          <h2>Make the recommendation executable.</h2>
          <span>The selected system becomes a real purchase list, checklist, and employee workflow.</span>
        </div>
        <Image src={`${mediaRoot}/primary-cart-execution.png`} alt="AI PC Build Advisor cart execution screen" width={998} height={769} unoptimized />
      </section>

      <section className={styles.reducedChapter}>
        <div>
          <p>Validate</p>
          <h2>Keep the tradeoffs legible.</h2>
          <span>Compatibility, stock, price, and a meaningful alternative remain visible before purchase.</span>
        </div>
        <Image src={`${mediaRoot}/secondary-compatibility-detail.png`} alt="Compatibility, stock, price, and alternative component details" width={780} height={220} unoptimized />
      </section>

      <section className={styles.reducedChapter}>
        <div>
          <p>Launch / Iterate</p>
          <h2>Close the loop with evidence.</h2>
          <span>Purchase execution, employee handoff, and the order record complete the product journey.</span>
        </div>
        <Image src={`${mediaRoot}/primary-cart-execution.png`} alt="Completed cart ready for purchase and employee handoff" width={998} height={769} unoptimized />
      </section>
    </main>
  );
}

export default function MotionStudyV2() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const currentPhaseRef = useRef(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);
    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const handleKeyboardScroll = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, button, a, [contenteditable='true']")) {
        return;
      }

      const increments: Record<string, number> = {
        ArrowDown: 92,
        ArrowUp: -92,
        PageDown: window.innerHeight * 0.82,
        PageUp: window.innerHeight * -0.82,
        " ": window.innerHeight * (event.shiftKey ? -0.82 : 0.82),
      };
      const increment = increments[event.key];
      if (increment !== undefined) {
        event.preventDefault();
        window.scrollBy({ top: increment, behavior: "auto" });
      }
    };

    window.addEventListener("keydown", handleKeyboardScroll);
    return () => window.removeEventListener("keydown", handleKeyboardScroll);
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !wrapperRef.current || !contentRef.current || !sectionRef.current || !worldRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    const finePointer = window.matchMedia("(pointer: fine) and (min-width: 761px)").matches;
    const smoother = finePointer
      ? ScrollSmoother.create({
          wrapper: wrapperRef.current,
          content: contentRef.current,
          smooth: 1.15,
          effects: true,
          normalizeScroll: true,
        })
      : null;

    const context = gsap.context(() => {
      gsap.set("[data-depth-plane]", {
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        force3D: true,
      });

      const camera = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=900%",
          scrub: 0.35,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const nextPhase = phaseIndex(progress);
            if (nextPhase !== currentPhaseRef.current) {
              currentPhaseRef.current = nextPhase;
              setCurrentPhase(nextPhase);
            }
            indicatorRef.current?.style.setProperty("--indicator-progress", `${progress}`);
            sceneRef.current?.style.setProperty("--study-progress", `${progress}`);
          },
        },
      });

      camera
        .to(worldRef.current, { z: 1750, duration: 0.18 })
        .to(worldRef.current, { z: 6700, duration: 0.18 })
        .to(worldRef.current, { z: 8250, duration: 0.22 })
        .to(worldRef.current, { z: 13000, duration: 0.12 })
        .to(worldRef.current, { z: 14750, duration: 0.14 })
        .to(worldRef.current, { z: 18600, duration: 0.07 })
        .to(worldRef.current, { z: 20850, duration: 0.09 });
    }, sectionRef);

    return () => {
      context.revert();
      smoother?.kill();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return <ReducedStudy onEnableMotion={() => setReducedMotion(false)} />;
  }

  const activePhase = lifecycle[currentPhase];

  return (
    <div className={styles.motionV2Root} ref={wrapperRef}>
      <div className={styles.smoothContent} ref={contentRef}>
        <main className={styles.studyMain}>
          <section className={styles.studySection} ref={sectionRef} aria-labelledby="motion-v2-title">
            <header className={styles.header}>
              <Link className={styles.mark} href="/" aria-label="Return to Carl Shi portfolio">CS</Link>
              <p>AI PC Build Advisor / Private motion study 02</p>
              <button type="button" onClick={() => setReducedMotion(true)}>Reduce motion</button>
            </header>

            <div className={styles.scene} ref={sceneRef}>
              <div className={styles.world} ref={worldRef}>
                {imagePlanes.map((plane) => (
                  <figure
                    className={`${styles.imagePlane} ${plane.className}`}
                    data-depth-plane
                    data-image-plane={plane.id}
                    key={plane.id}
                  >
                    <Image src={plane.src} alt={plane.alt} fill sizes="(max-width: 760px) 92vw, 72vw" priority={plane.id === "entry"} unoptimized />
                    <figcaption>{plane.label} / Real product</figcaption>
                  </figure>
                ))}

                {artifactPlanes.map((artifact) => (
                  <article
                    className={`${styles.artifactPlane} ${artifact.className}`}
                    data-depth-plane
                    data-artifact-plane={artifact.id}
                    key={artifact.id}
                  >
                    <p>{artifact.eyebrow}</p>
                    <h2>{artifact.title}</h2>
                    <span>{artifact.detail}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className={styles.fixedCopy}>
              <p>{activePhase.stage}</p>
              <h1 id="motion-v2-title">{activePhase.sentence}</h1>
            </div>

            <nav className={styles.lifecycle} aria-label="Product lifecycle">
              <span className={styles.lifecycleTrack} ref={indicatorRef} aria-hidden="true"><i /></span>
              <ol>
                {lifecycle.map((phase, index) => (
                  <li className={index === currentPhase ? styles.currentStage : ""} aria-current={index === currentPhase ? "step" : undefined} key={phase.stage}>
                    {phase.stage}
                  </li>
                ))}
              </ol>
            </nav>

            <p className={styles.inputHint}>Scroll · Trackpad · Wheel · Arrow keys</p>
            <p className={styles.srOnly} aria-live="polite">{activePhase.stage}: {activePhase.sentence}</p>
          </section>
        </main>
      </div>
    </div>
  );
}
