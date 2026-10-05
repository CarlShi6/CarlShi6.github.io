"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./motion-study-v4.module.css";

type Plane = {
  src: string;
  alt: string;
  x: number;
  y: number;
  z: number;
  width: number;
};

type Cluster = {
  id: string;
  eyebrow: string;
  title: string;
  statement: string;
  tags: string[];
  focusWidth: number;
  focusHoldDuration: number;
  approachDepth: number;
  departureDepth: number;
  supportingMediaScale: number;
  textPlacement: "left" | "right";
  focusCameraX: string;
  hero?: { src: string; alt: string };
  planes: Plane[];
  optional?: boolean;
};

const media = {
  pc: "/media/ai-pc-build-advisor",
  dog: "/media/dog-behavior-camera",
  travel: "/media/ai-travel-assistant",
  music: "/media/interactive-music-installation",
};

const clusters: Cluster[] = [
  {
    id: "introduction",
    eyebrow: "Carl Shi / Introduction",
    title: "Technical Product Builder",
    statement:
      "I combine software engineering, AI product development, product thinking, and interaction design to turn complex systems into useful experiences.",
    tags: ["AI", "Product", "Engineering", "Interaction Design"],
    focusWidth: 48,
    focusHoldDuration: 1.1,
    approachDepth: 1800,
    departureDepth: 1300,
    supportingMediaScale: 0.5,
    textPlacement: "left",
    focusCameraX: "9vw",
    planes: [],
  },
  {
    id: "ai-pc-build-advisor",
    eyebrow: "01 / Featured project",
    title: "AI PC Build Advisor",
    statement:
      "An AI-guided product that translates user needs into compatible PC recommendations and supports the journey from consultation to purchase.",
    tags: ["Product Strategy", "AI UX", "Full-stack Engineering", "Launch Readiness"],
    focusWidth: 62,
    focusHoldDuration: 1.35,
    approachDepth: 2200,
    departureDepth: 1300,
    supportingMediaScale: 0.55,
    textPlacement: "left",
    focusCameraX: "10vw",
    hero: {
      src: `${media.pc}/primary-cart-execution.png`,
      alt: "AI PC Build Advisor Cart Execution screen with selected parts, checklist, employee handoff, and order action.",
    },
    planes: [
      { src: `${media.pc}/secondary-product-entry.png`, alt: "AI PC Build Advisor product-entry screen", x: -48, y: -27, z: -180, width: 22 },
      { src: `${media.pc}/secondary-compatibility-detail.png`, alt: "AI PC compatibility and stock detail", x: 47, y: -25, z: 90, width: 21 },
      { src: `${media.pc}/secondary-components.png`, alt: "AI PC component comparison", x: -47, y: 29, z: 180, width: 21 },
      { src: `${media.pc}/secondary-compatibility.png`, alt: "AI PC configuration compatibility state", x: 47, y: 30, z: -80, width: 20 },
    ],
  },
  {
    id: "dog-behavior-camera",
    eyebrow: "02 / Featured project",
    title: "Dog Behavior Camera",
    statement: "A humane computer-vision prototype that helps owners understand behavior patterns instead of merely watching footage.",
    tags: ["Research", "Computer Vision", "Hardware Prototyping"],
    focusWidth: 56,
    focusHoldDuration: 1.25,
    approachDepth: 2200,
    departureDepth: 1300,
    supportingMediaScale: 0.54,
    textPlacement: "right",
    focusCameraX: "-11vw",
    hero: {
      src: `${media.dog}/primary-home-behavior.png`,
      alt: "Dog Behavior Camera concept showing a dog at home with behavior detection.",
    },
    planes: [
      { src: `${media.dog}/secondary-behavior-states.png`, alt: "Dog behavior state timeline", x: -48, y: -26, z: -150, width: 22 },
      { src: `${media.dog}/secondary-detection-detail.png`, alt: "Computer-vision detection detail", x: 47, y: -23, z: 120, width: 21 },
      { src: `${media.dog}/primary-home-behavior.png`, alt: "Dog camera interaction scenario crop", x: -47, y: 29, z: 190, width: 20 },
    ],
  },
  {
    id: "ai-travel-assistant",
    eyebrow: "03 / Featured project",
    title: "AI Travel Assistant",
    statement: "An adaptive planning companion that turns interviews, preferences, and constraints into a clear, context-aware itinerary.",
    tags: ["User Research", "Product Flow", "AI Logic", "Testing"],
    focusWidth: 58,
    focusHoldDuration: 1.3,
    approachDepth: 2200,
    departureDepth: 1300,
    supportingMediaScale: 0.54,
    textPlacement: "left",
    focusCameraX: "9vw",
    hero: {
      src: `${media.travel}/primary-itinerary-map.png`,
      alt: "AI Travel Assistant itinerary and route map.",
    },
    planes: [
      { src: `${media.travel}/secondary-destinations.png`, alt: "Travel destination research cards", x: -48, y: -27, z: -140, width: 21 },
      { src: `${media.travel}/secondary-constraints.png`, alt: "Travel planning constraints and journey detail", x: 47, y: -23, z: 120, width: 21 },
      { src: `${media.travel}/primary-itinerary-map.png`, alt: "Mobile travel flow crop", x: -47, y: 30, z: 210, width: 19 },
    ],
  },
  {
    id: "interactive-music-installation",
    eyebrow: "04 / Featured project",
    title: "Interactive Music Installation",
    statement: "A responsive spatial experience where movement becomes sound, light, and a shared participant-facing composition.",
    tags: ["Interaction Design", "Spatial Experience", "Prototyping"],
    focusWidth: 66,
    focusHoldDuration: 1.4,
    approachDepth: 2200,
    departureDepth: 1300,
    supportingMediaScale: 0.52,
    textPlacement: "right",
    focusCameraX: "-15vw",
    hero: {
      src: `${media.music}/primary-installation.png`,
      alt: "Participants inside an interactive music and light installation.",
    },
    planes: [
      { src: `${media.music}/secondary-waveform.png`, alt: "Particle and waveform interaction study", x: -48, y: -25, z: -120, width: 22 },
      { src: `${media.music}/secondary-participant-light.png`, alt: "Participant-facing spatial light result", x: 47, y: -24, z: 100, width: 21 },
      { src: `${media.music}/primary-installation.png`, alt: "Installation spatial plan crop", x: -47, y: 30, z: 180, width: 19 },
    ],
  },
  {
    id: "games-and-experiments",
    eyebrow: "Optional portal",
    title: "Games & Experiments",
    statement: "Smaller worlds, playful systems, and interaction sketches. A side path for curious visitors—not a required stop.",
    tags: ["Unity", "Creative Code", "Prototypes"],
    focusWidth: 44,
    focusHoldDuration: 1.05,
    approachDepth: 2200,
    departureDepth: 1300,
    supportingMediaScale: 0.5,
    textPlacement: "left",
    focusCameraX: "8vw",
    optional: true,
    planes: [],
  },
];

const clusterDepths = clusters.map((_, index) =>
  -clusters.slice(1, index + 1).reduce((depth, cluster) => depth + cluster.approachDepth, 0),
);

const lifecycle = ["Discover", "Define", "Build", "Validate", "Launch", "Iterate"];

const journeyLayers = [
  {
    id: "project-introduction",
    stage: "Introduction",
    title: "AI PC Build Advisor",
    text: "A guided retail decision system that turns goals, budget, stock, and compatibility into an executable recommendation.",
    meta: "Product strategy · AI UX · Full-stack prototype · Launch readiness",
    image: `${media.pc}/secondary-product-entry.png`,
    alt: "AI PC Build Advisor product-entry interface.",
    aperture: "Discover",
  },
  {
    id: "discover",
    stage: "Discover",
    title: "Start with the decision—not the parts.",
    text: "Beginners arrive with an intended use and a budget, but must reconcile performance goals, availability, and compatibility.",
    meta: "Budget · Intended use · Performance · Stock · Compatibility",
    image: `${media.pc}/secondary-product-entry.png`,
    alt: "Product entry screen used to frame a beginner PC buyer’s needs.",
    aperture: "Define",
  },
  {
    id: "define",
    stage: "Define",
    title: "Turn ambiguity into product constraints.",
    text: "The system structures requirements, priorities, and tradeoffs so every recommendation can be explained as a coherent build.",
    meta: "Requirements → Constraints → Priorities → Recommendation",
    image: `${media.pc}/secondary-components.png`,
    alt: "AI PC component recommendations structured around requirements and tradeoffs.",
    aperture: "Build",
  },
  {
    id: "build",
    stage: "Build",
    title: "Make the recommendation executable.",
    text: "The configured experience connects the recommendation to a real cart, meaningful alternatives, and an employee-ready workflow.",
    meta: "Configured product experience",
    image: `${media.pc}/primary-cart-execution.png`,
    alt: "Configured AI PC Build Advisor Cart Execution interface.",
    aperture: "Validate",
  },
  {
    id: "validate",
    stage: "Validate",
    title: "Keep the important tradeoffs legible.",
    text: "Selected CPU and GPU, compatibility, stock warning, total price, and reasoning remain visible before purchase.",
    meta: "Compatibility passed · Low-stock alternative · $2,783.94 total",
    image: `${media.pc}/secondary-compatibility-detail.png`,
    alt: "Compatibility detail showing selected CPU and GPU, stock warning, and total price.",
    aperture: "Launch / Iterate",
  },
  {
    id: "launch",
    stage: "Launch / Iterate",
    title: "Close the loop with purchase evidence.",
    text: "Cart execution, a pre-cart checklist, employee handoff, and the order action carry the recommendation into launch readiness.",
    meta: "Next: connect live inventory signals and learn from employee handoffs",
    image: `${media.pc}/primary-cart-execution.png`,
    alt: "Complete Cart Execution view with purchase list, checklist, employee handoff, and Place Order action.",
    aperture: "View all projects",
  },
];

function ReducedMotionView() {
  return (
    <main className={styles.reduced}>
      <header className={styles.reducedHeader}>
        <Link href="/">CS</Link>
        <span>Motion Study V4 / Reduced motion</span>
      </header>
      <section className={styles.reducedIntro}>
        <p>Carl Shi / Technical Product Builder</p>
        <h1>Travel through my work, then enter a project to see how I built it.</h1>
      </section>
      <section className={styles.reducedProjects} aria-labelledby="reduced-projects-title">
        <h2 id="reduced-projects-title">Selected projects</h2>
        {clusters.slice(1).map((cluster) => (
          <article key={cluster.id}>
            {cluster.hero ? <Image src={cluster.hero.src} alt={cluster.hero.alt} width={1200} height={760} unoptimized /> : <div className={styles.reducedExperiment}>Play / test / learn</div>}
            <div>
              <p>{cluster.eyebrow}</p>
              <h3>{cluster.title}</h3>
              <span>{cluster.statement}</span>
              <ul>{cluster.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </div>
          </article>
        ))}
      </section>
      <section className={styles.reducedJourney} aria-labelledby="reduced-journey-title">
        <h2 id="reduced-journey-title">AI PC Build Advisor / Product journey</h2>
        {journeyLayers.map((layer) => (
          <article key={layer.id}>
            <div>
              <p>{layer.stage}</p>
              <h3>{layer.title}</h3>
              <span>{layer.text}</span>
              <small>{layer.meta}</small>
            </div>
            <Image src={layer.image} alt={layer.alt} width={1200} height={760} unoptimized />
          </article>
        ))}
      </section>
    </main>
  );
}

export default function MotionStudyV4() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLElement>(null);
  const overviewWorldRef = useRef<HTMLDivElement>(null);
  const nestedRef = useRef<HTMLElement>(null);
  const nestedWorldRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const focusPointsRef = useRef<number[]>([]);
  const scrollToOverviewPointRef = useRef<((ratio: number, duration?: number) => void) | null>(null);
  const overviewSnapTweenRef = useRef<gsap.core.Tween | null>(null);
  const directFocusTargetRef = useRef<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeCluster, setActiveCluster] = useState(0);
  const [focusedCluster, setFocusedCluster] = useState<number | null>(null);
  const [activeLayer, setActiveLayer] = useState(0);
  const [portalActive, setPortalActive] = useState(false);
  const [journeyActive, setJourneyActive] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedByQuery = new URLSearchParams(window.location.search).get("motion") === "reduced";
    const sync = () => setReducedMotion(reducedByQuery || query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select, [contenteditable='true']")) return;
      const amount: Record<string, number> = {
        ArrowDown: 110,
        ArrowUp: -110,
        PageDown: window.innerHeight * 0.82,
        PageUp: window.innerHeight * -0.82,
        " ": window.innerHeight * (event.shiftKey ? -0.82 : 0.82),
      };
      if (amount[event.key] !== undefined) {
        event.preventDefault();
        window.scrollBy({ top: amount[event.key], behavior: "auto" });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (
      reducedMotion ||
      !wrapperRef.current ||
      !contentRef.current ||
      !overviewRef.current ||
      !overviewWorldRef.current ||
      !nestedRef.current ||
      !nestedWorldRef.current
    ) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    const finePointer = window.matchMedia("(pointer: fine) and (min-width: 761px)").matches;
    smootherRef.current = finePointer
      ? ScrollSmoother.create({
          wrapper: wrapperRef.current,
          content: contentRef.current,
          smooth: 1.05,
          smoothTouch: 0.1,
          effects: true,
          normalizeScroll: true,
        })
      : null;

    let cleanupOverviewSnap = () => {};
    const context = gsap.context(() => {
      const compactDepth = window.matchMedia("(max-width: 760px)").matches;
      const depthFactor = compactDepth ? 0.72 : 1;
      const perspective = 1200;
      const focusWindows: Array<{ start: number; end: number; midpoint: number }> = [];
      gsap.set("[data-cluster]", {
        z: (index) => clusterDepths[index] * depthFactor,
      });
      gsap.set("[data-focus-media]", {
        scale: 1,
      });
      gsap.set(overviewWorldRef.current, {
        z: -clusters[0].approachDepth * depthFactor,
        transformPerspective: perspective,
        transformOrigin: "50% 50%",
      });
      const overviewTimeline = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        scrollTrigger: {
          id: "overview-v4",
          trigger: overviewRef.current,
          start: "top top",
          end: "+=960%",
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const cameraZ = Number(gsap.getProperty(overviewWorldRef.current, "z")) || 0;
            const timelineTime = overviewTimeline.time();
            let closest = 0;
            let distance = Number.POSITIVE_INFINITY;
            clusters.forEach((cluster, index) => {
              const nextDistance = Math.abs(clusterDepths[index] * depthFactor + cameraZ);
              if (nextDistance < distance) {
                distance = nextDistance;
                closest = index;
              }
            });
            const focused = focusWindows.findIndex((window) =>
              timelineTime >= window.start && timelineTime <= window.end,
            );
            setActiveCluster((current) => current === closest ? current : closest);
            const nextFocused = directFocusTargetRef.current ?? (focused >= 0 ? focused : null);
            setFocusedCluster((current) => current === nextFocused ? current : nextFocused);
            overviewRef.current?.style.setProperty("--overview-progress", `${self.progress * 100}%`);
          },
        },
      });

      clusters.forEach((cluster, index) => {
        const focusZ = -clusterDepths[index] * depthFactor;
        const focusMedia = `[data-cluster="${cluster.id}"] [data-focus-media]`;
        const holdTravel = 18 * depthFactor;
        const apparentSizeCompensation = (perspective - holdTravel) / perspective;
        overviewTimeline.to(
          overviewWorldRef.current,
          {
            z: focusZ,
            x: cluster.focusCameraX,
            y: index % 3 === 0 ? "0.8vh" : "-0.6vh",
            duration: 0.9,
          },
        );
        const focusStart = overviewTimeline.duration();
        overviewTimeline.to(
          overviewWorldRef.current,
          { z: focusZ + holdTravel, duration: cluster.focusHoldDuration, ease: "none" },
        );
        overviewTimeline.to(
          focusMedia,
          { scale: apparentSizeCompensation, duration: cluster.focusHoldDuration, ease: "none" },
          "<",
        );
        const focusEnd = overviewTimeline.duration();
        focusWindows.push({
          start: focusStart,
          end: focusEnd,
          midpoint: (focusStart + focusEnd) / 2,
        });
        overviewTimeline.to(
          overviewWorldRef.current,
          {
            z: focusZ + cluster.departureDepth * depthFactor,
            duration: 0.9,
            ease: "power2.in",
          },
        );
        overviewTimeline.to(focusMedia, { scale: 1, duration: 0.9, ease: "power1.in" }, "<");
      });
      focusPointsRef.current = focusWindows.map((window) => window.midpoint / overviewTimeline.duration());

      let snapTimer = 0;
      let snapUnlockTimer = 0;
      let snapInProgress = false;
      const moveToOverviewPoint = (ratio: number, duration = 0.32) => {
        const trigger = ScrollTrigger.getById("overview-v4");
        if (!trigger) return;
        window.clearTimeout(snapTimer);
        window.clearTimeout(snapUnlockTimer);
        overviewSnapTweenRef.current?.kill();
        const position = { y: window.scrollY };
        const target = trigger.start + (trigger.end - trigger.start) * ratio;
        snapInProgress = true;
        if (duration === 0) {
          smootherRef.current?.scrollTo(target, false);
          if (!smootherRef.current) window.scrollTo({ top: target, behavior: "auto" });
          overviewTimeline.progress(ratio);
          ScrollTrigger.update();
          snapUnlockTimer = window.setTimeout(() => {
            snapInProgress = false;
          }, 500);
          return;
        }
        overviewSnapTweenRef.current = gsap.to(position, {
          y: target,
          duration,
          ease: "power1.inOut",
          overwrite: true,
          onUpdate: () => {
            smootherRef.current?.scrollTo(position.y, false);
            if (!smootherRef.current) window.scrollTo({ top: position.y, behavior: "auto" });
            ScrollTrigger.update();
          },
          onComplete: () => {
            overviewSnapTweenRef.current = null;
            snapUnlockTimer = window.setTimeout(() => {
              snapInProgress = false;
            }, 1600);
          },
        });
      };
      scrollToOverviewPointRef.current = moveToOverviewPoint;
      const scheduleOverviewSnap = () => {
        if (!finePointer || compactDepth || snapInProgress) return;
        window.clearTimeout(snapTimer);
        window.clearTimeout(snapUnlockTimer);
        snapTimer = window.setTimeout(() => {
          const trigger = ScrollTrigger.getById("overview-v4");
          const points = focusPointsRef.current;
          if (!trigger || !points.length || window.scrollY < trigger.start || window.scrollY > trigger.end) return;
          const nearest = points.reduce((closest, point) =>
            Math.abs(point - trigger.progress) < Math.abs(closest - trigger.progress) ? point : closest,
          points[0]);
          if (Math.abs(nearest - trigger.progress) > 0.002) moveToOverviewPoint(nearest);
        }, 300);
      };
      window.addEventListener("scroll", scheduleOverviewSnap, { passive: true });

      const layers = gsap.utils.toArray<HTMLElement>("[data-journey-layer]", nestedWorldRef.current);
      const updateLayers = (progress: number) => {
        const travel = progress * journeyLayers.length;
        let nextActive = 0;
        layers.forEach((layer, index) => {
          const relative = index - travel;
          const scale = Math.min(8.4, Math.pow(5.45, -relative));
          const passed = scale >= 7.9;
          gsap.set(layer, {
            scale,
            z: -index * 4,
            visibility: passed ? "hidden" : "visible",
            pointerEvents: Math.abs(relative) < 0.42 ? "auto" : "none",
          });
          if (Math.abs(relative) < 0.5) nextActive = Math.min(index, journeyLayers.length - 1);
        });
        setActiveLayer((current) => current === nextActive ? current : nextActive);
        nestedRef.current?.style.setProperty("--journey-progress", `${progress * 100}%`);
      };
      updateLayers(0);

      gsap.timeline({
        scrollTrigger: {
          id: "nested-v4",
          trigger: nestedRef.current,
          start: "top top",
          end: "+=700%",
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateLayers(self.progress),
        },
      });

      cleanupOverviewSnap = () => {
        window.clearTimeout(snapTimer);
        window.removeEventListener("scroll", scheduleOverviewSnap);
        scrollToOverviewPointRef.current = null;
        overviewSnapTweenRef.current?.kill();
        overviewSnapTweenRef.current = null;
      };
    }, contentRef);

    ScrollTrigger.refresh();
    return () => {
      cleanupOverviewSnap();
      context.revert();
      smootherRef.current?.kill();
      smootherRef.current = null;
    };
  }, [reducedMotion]);

  const jumpToCluster = useCallback((index: number) => {
    const trigger = ScrollTrigger.getById("overview-v4");
    if (!trigger) return;
    const ratio = focusPointsRef.current[index] ?? (index + 0.55) / (clusters.length + 0.5);
    directFocusTargetRef.current = index;
    setActiveCluster(index);
    setFocusedCluster(index);
    window.setTimeout(() => {
      if (directFocusTargetRef.current === index) directFocusTargetRef.current = null;
    }, 900);
    if (scrollToOverviewPointRef.current) {
      scrollToOverviewPointRef.current(ratio, 0);
      return;
    }
    const target = trigger.start + (trigger.end - trigger.start) * ratio;
    smootherRef.current?.scrollTo(target, true);
    if (!smootherRef.current) window.scrollTo({ top: target, behavior: "smooth" });
    ScrollTrigger.update();
  }, []);

  const enterProject = useCallback(() => {
    if (portalActive) return;
    setPortalActive(true);
    const portal = portalRef.current;
    if (!portal) return;
    const fragments = portal.querySelectorAll("[data-portal-fragment]");
    const reveal = portal.querySelector("[data-portal-reveal]");
    const hero = portal.querySelector("[data-portal-hero]");
    gsap.set(portal, { display: "grid" });
    gsap.set(fragments, { x: 0, y: 0, scale: 1 });
    gsap.set(reveal, { clipPath: "circle(8% at 50% 50%)" });
    gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        setJourneyActive(true);
        const trigger = ScrollTrigger.getById("nested-v4");
        const target = (trigger?.start ?? nestedRef.current?.offsetTop ?? window.scrollY) + 2;
        smootherRef.current?.scrollTo(target, false);
        if (!smootherRef.current) window.scrollTo({ top: target, behavior: "auto" });
        gsap.set(portal, { display: "none" });
        setPortalActive(false);
      },
    })
      .to(fragments, {
        x: (index) => (index % 2 === 0 ? -1 : 1) * window.innerWidth * (0.7 + index * 0.08),
        y: (index) => (index < 2 ? -1 : 1) * window.innerHeight * 0.58,
        scale: 2.2,
        duration: 1.15,
        stagger: 0.04,
      }, 0)
      .to(hero, { scale: 1.78, duration: 1.25 }, 0)
      .to(reveal, { clipPath: "circle(76% at 50% 50%)", duration: 1.2 }, 0.12);
  }, [portalActive]);

  const backToProjects = useCallback(() => {
    setJourneyActive(false);
    jumpToCluster(1);
  }, [jumpToCluster]);

  const skipJourney = useCallback(() => {
    setJourneyActive(false);
    jumpToCluster(clusters.length - 1);
  }, [jumpToCluster]);

  if (reducedMotion) return <ReducedMotionView />;

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={contentRef} className={styles.content}>
        <header className={styles.header}>
          <Link href="/" aria-label="Return to Carl Shi portfolio" className={styles.mark}>CS</Link>
          <p>Motion Study V4 <span>Owner-only prototype</span></p>
          <button type="button" onClick={() => jumpToCluster(clusters.length - 1)}>View all projects</button>
        </header>

        <section ref={overviewRef} className={styles.overview} aria-label="Portfolio camera journey">
          <div className={styles.scene}>
            <div ref={overviewWorldRef} className={styles.world}>
              {clusters.map((cluster, index) => (
                <article
                  className={`${styles.cluster} ${index === activeCluster ? styles.activeCluster : ""} ${cluster.optional ? styles.optionalCluster : ""}`}
                  id={`v4-${cluster.id}`}
                  data-cluster={cluster.id}
                  style={{
                    "--focus-width": `${cluster.focusWidth}vw`,
                  } as CSSProperties}
                  key={cluster.id}
                >
                  {cluster.hero && cluster.id === "ai-pc-build-advisor" ? (
                    <button
                      className={styles.hero}
                      data-focus-media
                      type="button"
                      aria-label="Enter AI PC Build Advisor project"
                      onClick={enterProject}
                    >
                      <Image src={cluster.hero.src} alt={cluster.hero.alt} fill sizes="(max-width: 760px) 88vw, 52vw" priority={index === 1} unoptimized />
                    </button>
                  ) : cluster.hero ? (
                    <figure className={styles.hero} data-focus-media>
                      <Image src={cluster.hero.src} alt={cluster.hero.alt} fill sizes="(max-width: 760px) 88vw, 52vw" unoptimized />
                    </figure>
                  ) : (
                    <div className={styles.identity} data-focus-media>
                      {index === 0 ? (
                        <>
                          <span>Carl Shi</span>
                          <strong>CS</strong>
                        </>
                      ) : (
                        <>
                          <span>Optional route</span>
                          <strong>Play</strong>
                        </>
                      )}
                    </div>
                  )}

                  <div className={styles.supporting} aria-hidden="true">
                    {cluster.planes.map((plane, planeIndex) => (
                      <figure
                        style={{
                          "--plane-x": `${plane.x}vw`,
                          "--plane-y": `${plane.y}vh`,
                          "--plane-z": `${plane.z}px`,
                          "--plane-width": `${plane.width * cluster.supportingMediaScale}vw`,
                        } as CSSProperties}
                        key={`${cluster.id}-${planeIndex}`}
                      >
                        <Image src={plane.src} alt="" fill sizes="26vw" unoptimized />
                      </figure>
                    ))}
                  </div>

                </article>
              ))}
            </div>
          </div>

          <div className={styles.focusOverlays}>
            {clusters.map((cluster, index) => (
              <article
                className={`${styles.focusOverlay} ${cluster.textPlacement === "right" ? styles.focusOverlayRight : ""} ${index === focusedCluster ? styles.activeFocusOverlay : ""}`}
                aria-hidden={index !== focusedCluster}
                key={cluster.id}
              >
                <p>{cluster.eyebrow}</p>
                <h1>{index === 0 ? "Carl Shi" : cluster.title}</h1>
                {index === 0 && <h2>{cluster.title}</h2>}
                <span>{cluster.statement}</span>
                <ul>{cluster.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={cluster.id === "ai-pc-build-advisor" ? enterProject : () => jumpToCluster(index < clusters.length - 1 ? index + 1 : 1)}
                    aria-label={cluster.id === "ai-pc-build-advisor" ? "Enter AI PC Build Advisor project" : cluster.optional ? "Return to featured work" : `Continue past ${cluster.title}`}
                  >
                    {cluster.id === "ai-pc-build-advisor" ? "Enter Project" : cluster.optional ? "Return to featured work" : "Existing Project Preview"}
                    <span aria-hidden="true">↗</span>
                  </button>
                )}
              </article>
            ))}
          </div>

          <nav className={styles.clusterNav} aria-label="Project journey">
            {clusters.map((cluster, index) => (
              <button
                type="button"
                className={index === activeCluster ? styles.activeNav : ""}
                onClick={() => jumpToCluster(index)}
                aria-label={`Go to ${cluster.title}`}
                key={cluster.id}
              >
                <span>{String(index).padStart(2, "0")}</span>
                <i />
                <b>{cluster.title}</b>
              </button>
            ))}
          </nav>
          <div className={styles.overviewProgress} aria-hidden="true"><span /></div>
          <p className={styles.scrollCue}>Scroll to travel <span>↓</span></p>
        </section>

        <section
          ref={nestedRef}
          className={`${styles.nested} ${journeyActive ? styles.journeyActive : ""}`}
          aria-label="AI PC Build Advisor nested project journey"
        >
          <div className={styles.nestedScene}>
            <div ref={nestedWorldRef} className={styles.nestedWorld}>
              {journeyLayers.map((layer, index) => (
                <article
                  className={`${styles.journeyLayer} ${index === activeLayer ? styles.activeJourneyLayer : ""}`}
                  data-journey-layer
                  key={layer.id}
                >
                  <div className={styles.layerFrame}>
                    <div className={styles.layerCopy}>
                      <p>{layer.stage}</p>
                      <h2>{layer.title}</h2>
                      <span>{layer.text}</span>
                      <small>{layer.meta}</small>
                    </div>
                    <figure className={styles.layerMedia}>
                      <Image src={layer.image} alt={layer.alt} fill sizes="72vw" unoptimized />
                      <figcaption>{layer.stage} / Product evidence</figcaption>
                    </figure>
                    <div className={styles.aperture} aria-hidden="true">
                      <span>{layer.aperture}</span>
                      <i />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.journeyControls}>
            <button type="button" onClick={backToProjects}>← Back to Projects</button>
            <button type="button" onClick={skipJourney}>Skip Journey / View All Projects</button>
          </div>
          <ol className={styles.lifecycle} aria-label="Product lifecycle">
            {lifecycle.map((stage, index) => (
              <li className={index === Math.min(activeLayer, lifecycle.length - 1) ? styles.activeLifecycle : ""} key={stage}>
                <span>{stage}</span>
              </li>
            ))}
          </ol>
          <div className={styles.journeyProgress} aria-hidden="true"><span /></div>
        </section>

        <footer className={styles.footer}>
          <p>End of motion study</p>
          <button type="button" onClick={backToProjects}>Return to AI PC Build Advisor</button>
        </footer>
      </div>

      <div ref={portalRef} className={styles.portal} role="status" aria-live="polite" aria-label="Entering AI PC Build Advisor">
        <div className={styles.portalReveal} data-portal-reveal>
          <Image src={`${media.pc}/secondary-product-entry.png`} alt="" fill sizes="100vw" unoptimized />
        </div>
        <figure className={styles.portalHero} data-portal-hero>
          <Image src={`${media.pc}/primary-cart-execution.png`} alt="" fill sizes="70vw" unoptimized />
        </figure>
        {[
          `${media.pc}/secondary-product-entry.png`,
          `${media.pc}/secondary-compatibility-detail.png`,
          `${media.pc}/secondary-components.png`,
          `${media.pc}/secondary-compatibility.png`,
        ].map((src, index) => (
          <figure className={`${styles.portalFragment} ${styles[`portalFragment${index + 1}`]}`} data-portal-fragment key={src}>
            <Image src={src} alt="" fill sizes="24vw" unoptimized />
          </figure>
        ))}
        <p>Entering the product journey</p>
      </div>
    </div>
  );
}
