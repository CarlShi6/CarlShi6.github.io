"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./motion-study-v5.module.css";

type Project = {
  number: string;
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  alt: string;
  position: string;
};

const projects: Project[] = [
  {
    number: "01",
    slug: "ai-pc-build-advisor",
    shortTitle: "PC Advisor",
    title: "AI PC Build Advisor",
    description:
      "An AI-guided product that turns goals, budget, and compatibility into an executable PC recommendation.",
    tags: ["AI UX", "Product Strategy", "Full-stack"],
    image: "/media/ai-pc-build-advisor/primary-cart-execution.png",
    alt: "AI PC Build Advisor cart execution screen with selected parts, compatibility checks, employee handoff, and order action.",
    position: "topLeft",
  },
  {
    number: "02",
    slug: "dog-behavior-camera",
    shortTitle: "Dog Camera",
    title: "Dog Behavior Camera",
    description:
      "A humane computer-vision concept that helps owners understand meaningful behavior patterns at home.",
    tags: ["Computer Vision", "Research", "Hardware"],
    image: "/media/dog-behavior-camera/primary-home-behavior.png",
    alt: "Dog Behavior Camera interface showing a dog at home with behavior detection.",
    position: "topRight",
  },
  {
    number: "03",
    slug: "ai-travel-assistant",
    shortTitle: "Travel Assistant",
    title: "AI Travel Assistant",
    description:
      "An adaptive planning companion that turns preferences and constraints into a clear, contextual itinerary.",
    tags: ["AI Logic", "Product Flow", "Testing"],
    image: "/media/ai-travel-assistant/primary-itinerary-map.png",
    alt: "AI Travel Assistant interface showing a generated itinerary and route map.",
    position: "bottomLeft",
  },
  {
    number: "04",
    slug: "interactive-music-installation",
    shortTitle: "Music Installation",
    title: "Interactive Music Installation",
    description:
      "A spatial experience where movement becomes responsive sound, light, and shared composition.",
    tags: ["Interaction Design", "Spatial", "Prototyping"],
    image: "/media/interactive-music-installation/primary-installation.png",
    alt: "Participants inside an interactive music and light installation.",
    position: "bottomRight",
  },
];

const stepLabels = [
  "Introduction",
  "AI PC Build Advisor revealed",
  "Dog Behavior Camera revealed",
  "AI Travel Assistant revealed",
  "Interactive Music Installation revealed; final composition complete",
];

const transitionMs = 920;
const wheelThreshold = 34;
const swipeThreshold = 44;

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest("a, button, input, textarea, select, [contenteditable='true']"))
  );
}

export default function MotionStudyV5() {
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const stageRef = useRef<HTMLElement>(null);
  const lockedRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelTotalRef = useRef(0);
  const wheelResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const stageIsActive = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return false;
    const rect = stage.getBoundingClientRect();
    const atStageTop = window.scrollY <= 4;
    return atStageTop || (rect.top <= 2 && rect.bottom >= window.innerHeight * 0.72);
  }, []);

  const moveToStep = useCallback((direction: 1 | -1) => {
    if (lockedRef.current) return false;
    const current = stepRef.current;
    const next = Math.max(0, Math.min(projects.length, current + direction));
    if (next === current) return false;

    lockedRef.current = true;
    stepRef.current = next;
    setStep(next);
    wheelTotalRef.current = 0;

    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(() => {
      lockedRef.current = false;
    }, transitionMs);
    return true;
  }, []);

  const focusProject = useCallback((projectIndex: number) => {
    const next = Math.max(1, Math.min(projects.length, projectIndex + 1));
    if (next === stepRef.current) return;

    lockedRef.current = true;
    stepRef.current = next;
    setStep(next);
    wheelTotalRef.current = 0;

    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(() => {
      lockedRef.current = false;
    }, transitionMs);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const urlRequestsReducedMotion =
      new URLSearchParams(window.location.search).get("motion") === "reduced";

    const syncMotionPreference = () => {
      if (mediaQuery.matches || urlRequestsReducedMotion) {
        stepRef.current = projects.length;
        setStep(projects.length);
        lockedRef.current = false;
      }
    };

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);
    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (!stageIsActive() || isEditableTarget(event.target)) return;
      const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1;
      const current = stepRef.current;
      const shouldControl =
        (direction === 1 && current < projects.length) ||
        (direction === -1 && current > 0);

      if (!shouldControl) return;
      event.preventDefault();
      if (lockedRef.current) return;

      wheelTotalRef.current += event.deltaY;
      if (wheelResetRef.current) clearTimeout(wheelResetRef.current);
      wheelResetRef.current = setTimeout(() => {
        wheelTotalRef.current = 0;
      }, 150);

      if (Math.abs(wheelTotalRef.current) >= wheelThreshold) {
        moveToStep(wheelTotalRef.current > 0 ? 1 : -1);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!stageIsActive() || isEditableTarget(event.target)) return;
      const forwardKeys = ["ArrowDown", "PageDown"];
      const backwardKeys = ["ArrowUp", "PageUp"];
      let direction: 1 | -1 | null = null;
      if (forwardKeys.includes(event.key)) direction = 1;
      if (backwardKeys.includes(event.key)) direction = -1;
      if (!direction) return;

      const current = stepRef.current;
      const shouldControl =
        (direction === 1 && current < projects.length) ||
        (direction === -1 && current > 0);
      if (!shouldControl) return;

      event.preventDefault();
      moveToStep(direction);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [moveToStep, stageIsActive]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.touches[0];
      if (!start || !touch || !stageIsActive()) return;
      const deltaY = touch.clientY - start.y;
      const direction: 1 | -1 = deltaY < 0 ? 1 : -1;
      const current = stepRef.current;
      const shouldControl =
        (direction === 1 && current < projects.length) ||
        (direction === -1 && current > 0 && window.scrollY <= 4);
      if (shouldControl) event.preventDefault();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.changedTouches[0];
      touchStartRef.current = null;
      if (!start || !touch || !stageIsActive()) return;
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (Math.abs(deltaY) < swipeThreshold || Math.abs(deltaY) < Math.abs(deltaX)) return;
      moveToStep(deltaY < 0 ? 1 : -1);
    };

    stage.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage.addEventListener("touchmove", handleTouchMove, { passive: false });
    stage.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      stage.removeEventListener("touchstart", handleTouchStart);
      stage.removeEventListener("touchmove", handleTouchMove);
      stage.removeEventListener("touchend", handleTouchEnd);
    };
  }, [moveToStep, stageIsActive]);

  useEffect(
    () => () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      if (wheelResetRef.current) clearTimeout(wheelResetRef.current);
    },
    [],
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark} aria-label="Return to Carl Shi portfolio">
          CS
        </Link>
        <p>Motion Study V5 / Private prototype</p>
        <nav aria-label="Prototype sections">
          <a href="#about">About</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section
        ref={stageRef}
        className={styles.revealStage}
        data-step={step}
        aria-labelledby="identity-title"
      >
        <div className={styles.stageIntro}>
          <p>Selected work / Four projects</p>
          <h1 id="identity-title">Carl Shi</h1>
          <span>Technical Product Builder</span>
        </div>

        <div className={styles.scene} aria-label="Featured projects reveal">
          {projects.map((project, index) => {
            const isRevealed = index < step;
            const depthStyle = {
              "--depth": `${-920 - index * 150}px`,
              "--mobile-depth": `${-330 - index * 60}px`,
            } as CSSProperties;

            return (
              <article
                key={project.slug}
                className={`${styles.projectCard} ${styles[project.position]}`}
                data-revealed={isRevealed}
                aria-hidden={!isRevealed}
                style={depthStyle}
              >
                <figure className={styles.projectMedia}>
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 760px) 90vw, 30vw"
                    unoptimized
                  />
                  <figcaption>{project.number} / Featured project</figcaption>
                </figure>
                <div className={styles.projectCopy}>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                  <ul aria-label={`${project.title} capabilities`}>
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <Link href={`/#${project.slug}`} tabIndex={isRevealed ? 0 : -1}>
                    View Project <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            );
          })}

          <article className={styles.identityAnchor} aria-label="Carl Shi identity">
            <figure className={styles.portraitSlot}>
              <div aria-hidden="true">CS</div>
              <figcaption>Replaceable portrait media slot</figcaption>
            </figure>
            <div className={styles.identityCopy}>
              <p>Carl Shi</p>
              <span>Technical Product Builder</span>
              <h2>
                I build AI products by connecting software engineering, product
                thinking, and interaction design.
              </h2>
            </div>
          </article>
        </div>

        <div className={styles.revealStatus}>
          <p aria-live="polite">{stepLabels[step]}</p>
          <span>{step === projects.length ? "Scroll to continue" : "Scroll, swipe, or use arrow keys"}</span>
        </div>

        <nav className={styles.projectIndex} aria-label="Featured project navigation">
          {projects.map((project, index) => {
            const isActive = step === index + 1;
            return (
              <button
                type="button"
                key={project.slug}
                className={isActive ? styles.activeProject : undefined}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Focus ${project.title}`}
                onClick={() => focusProject(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    focusProject(index);
                  }
                }}
              >
                <span>{project.number}</span>
                <span>{project.shortTitle}</span>
              </button>
            );
          })}
        </nav>
      </section>

      <section className={styles.afterReveal} aria-label="Portfolio information">
        <section id="about" className={styles.editorialSection}>
          <p>About</p>
          <div>
            <h2>From ambiguous idea to useful product.</h2>
            <p>
              I work where emerging technology meets real human needs—shaping the
              product, building the system, and refining the experience as one
              connected practice.
            </p>
          </div>
        </section>

        <section id="capabilities" className={styles.editorialSection}>
          <p>Capabilities</p>
          <div className={styles.capabilityGrid}>
            <article>
              <span>01</span>
              <h3>Product direction</h3>
              <p>Research, framing, roadmaps, and clear decisions around what to build.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Technical execution</h3>
              <p>AI workflows, full-stack prototypes, system thinking, and launch-ready detail.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Interaction design</h3>
              <p>Flows, interfaces, motion, and testing that make complex products feel legible.</p>
            </article>
          </div>
        </section>

        <section id="contact" className={styles.contact}>
          <p>Have a complex product to make clear?</p>
          <h2>Let&apos;s build something useful.</h2>
          <a href="mailto:?subject=Hello%20Carl">
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </section>
      </section>
    </main>
  );
}
