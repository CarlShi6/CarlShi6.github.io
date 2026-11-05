"use client";

/* eslint-disable @next/next/no-img-element -- scanner previews use verified local project artifacts and transparent scene assets */

import gsap from "gsap";
import Link from "next/link";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CsLogo } from "./cs-logo";
import { projectPlanets, skillSpacecraft, type SpaceSystemItem } from "./space-system.data";
import styles from "./dark-webgl-v7-prototype.module.css";

const StandaloneAtmosphere=lazy(()=>import("./standalone-atmosphere"));

const streamPaths = [
  "M 40 120 C 320 42 520 245 705 345",
  "M 28 335 C 300 245 515 370 700 390",
  "M 45 555 C 315 475 535 475 700 485",
  "M 70 775 C 330 720 540 565 710 515",
  "M 1640 125 C 1370 44 1150 250 975 345",
  "M 1655 340 C 1388 245 1170 375 980 390",
  "M 1635 560 C 1370 485 1160 475 980 485",
  "M 1605 775 C 1340 720 1145 570 970 515",
] as const;

const objectStartOffsets = [
  { x: -420, y: -130, rotation: -16 },
  { x: -390, y: -38, rotation: -10 },
  { x: -410, y: 52, rotation: 11 },
  { x: -380, y: 145, rotation: 15 },
  { x: 420, y: -125, rotation: 18 },
  { x: 390, y: -38, rotation: 12 },
  { x: 420, y: 58, rotation: -12 },
  { x: 390, y: 145, rotation: -16 },
] as const;

const projectFacts: Record<string, { what: string; role: string; deliverable: string }> = {
  "ai-pc-build-advisor": {
    what: "Explainable PC configuration decisions from ambiguous build goals.",
    role: "AI product strategy · interaction prototyping",
    deliverable: "Working recommendation and review prototype",
  },
  "dog-behavior-camera": {
    what: "A camera-to-actuation concept calibrated through real-dog trials.",
    role: "Product design · computer-vision prototyping",
    deliverable: "Detection overlays and live calibration evidence",
  },
  "ai-travel-assistant": {
    what: "Trip-aware packing decisions across weight limits and item rules.",
    role: "AI product · mobile experience design",
    deliverable: "Interactive packing and luggage flow",
  },
  "build-hope-content-operations": {
    what: "A repeatable system for turning event media into learning.",
    role: "Product strategy consultant",
    deliverable: "Platform evaluation, operating model, and 30-day roadmap",
  },
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useTypedSupportingCopy(text: string, enabled: boolean, reduced: boolean) {
  const [visible, setVisible] = useState("");
  useEffect(() => {
    if (!enabled || reduced) return;
    let index = 0;
    let timer = 0;
    const frame = window.requestAnimationFrame(() => {
      setVisible("");
      timer = window.setInterval(() => {
        index += 1;
        setVisible(text.slice(0, index));
        if (index >= text.length) window.clearInterval(timer);
      }, 12);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, [enabled, reduced, text]);
  return enabled && !reduced ? visible : text;
}

function StreamLayer({ pathRefs }: { pathRefs: React.MutableRefObject<Array<SVGPathElement | null>> }) {
  return (
    <svg className={styles.streamLayer} data-transition-role="dark-streams" viewBox="0 0 1680 869" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {streamPaths.map((path, index) => (
          <mask key={path} id={`v7-stream-mask-${index}`} maskUnits="userSpaceOnUse">
            <rect width="1680" height="869" fill="black" />
            <path
              ref={(node) => { pathRefs.current[index] = node; }}
              className={styles.streamRevealPath}
              d={path}
              pathLength="1"
              fill="none"
              stroke="white"
              strokeWidth={index % 4 === 0 || index % 4 === 3 ? 172 : 146}
              strokeLinecap="round"
            />
          </mask>
        ))}
      </defs>
      {streamPaths.map((path, index) => (
        <g className={styles.streamGroup} data-stream={index} key={path} mask={`url(#v7-stream-mask-${index})`}>
          <image href="/homepage-poc/webgl-v6/streams.webp" x="0" y="-38" width="1680" height="945" preserveAspectRatio="xMidYMid slice" style={{ mixBlendMode: "screen" }} />
        </g>
      ))}
    </svg>
  );
}

function PreviewPanel({ item, pinned, reduced, onClose }: { item: SpaceSystemItem; pinned: boolean; reduced: boolean; onClose: () => void }) {
  const project = projectFacts[item.id];
  const supporting = project
    ? `${project.what} ${project.role}. ${project.deliverable}.`
    : `${item.summary} ${item.detail}.`;
  const typed = useTypedSupportingCopy(supporting, true, reduced);
  return (
    <aside className={styles.previewPanel} id="v7-scanner-preview" data-side={project ? "project" : "skill"}>
      <div className={styles.previewMedia} aria-hidden="true">
        <img src={project ? item.image : `/homepage-poc/webgl-v4/skill-${skillSpacecraft.findIndex((skill) => skill.id === item.id) + 1}.webp`} alt="" />
      </div>
      <div className={styles.previewCopy}>
        <div className={styles.previewHeading}>
          <h2>{item.title}</h2>
          {pinned ? <button type="button" className={styles.closePreview} onClick={onClose} aria-label="Close pinned preview">Close</button> : null}
        </div>
        <p className={styles.previewSummary}>{item.summary}</p>
        <div className={styles.previewFacts} aria-hidden="true">
          {project ? <>
            <p><b>What</b><span>{typed.slice(0, project.what.length)}</span></p>
            <p><b>Role</b><span>{typed.slice(project.what.length + 1, project.what.length + project.role.length + 2)}</span></p>
            <p><b>Verified deliverable</b><span>{typed.slice(project.what.length + project.role.length + 3)}</span></p>
          </> : <p><b>Verified capabilities</b><span>{typed}</span></p>}
        </div>
        <span className={styles.srOnly}>{supporting}</span>
        <Link className={styles.lookCloser} href={item.href}>Look Closer.</Link>
      </div>
    </aside>
  );
}

type ObjectButtonProps = {
  item: SpaceSystemItem;
  side: "projects" | "skills";
  index: number;
  objectRef: (node: HTMLElement | null) => void;
  expanded: boolean;
  scannerEnabled: boolean;
  onInspect: (item: SpaceSystemItem, target: HTMLElement, source: "pointer" | "focus" | "click" | "touch") => void;
  onLeave: () => void;
};

function CelestialObjectButton({ item, side, index, objectRef, expanded, scannerEnabled, onInspect, onLeave }: ObjectButtonProps) {
  const visual = <><span className={styles.objectArt} data-side={side} data-art={index} aria-hidden="true" /><span className={styles.mobileLabel}>{item.title}</span></>;
  if (!scannerEnabled) {
    return (
      <Link ref={objectRef} href={item.href} className={styles.objectButton} data-side={side} data-slot={index + 1} data-object-id={item.id} aria-label={`${item.title}. ${item.summary}`}>
        {visual}
      </Link>
    );
  }
  return (
    <button
      ref={objectRef}
      type="button"
      className={styles.objectButton}
      data-side={side}
      data-slot={index + 1}
      data-object-id={item.id}
      aria-label={`${item.title}. ${item.summary}`}
      aria-expanded={expanded}
      aria-controls={scannerEnabled ? "v7-scanner-preview" : undefined}
      onPointerEnter={(event) => { if(event.pointerType !== "touch") onInspect(item, event.currentTarget, "pointer"); }}
      onPointerLeave={onLeave}
      onFocus={(event) => onInspect(item, event.currentTarget, "focus")}
      onBlur={onLeave}
      onClick={(event) => onInspect(item, event.currentTarget, (event.nativeEvent as PointerEvent).pointerType === "touch" ? "touch" : "click")}
    >
      {visual}
    </button>
  );
}

export function DarkWebglV7Prototype({
  scannerEnabled = true,
  previewMode = "dock",
  studyVersion,
  staticMode = false,
  official = false,
  dismissOnPointerLeave = false,
}: {
  scannerEnabled?: boolean;
  previewMode?: "dock" | "center";
  studyVersion?: string;
  staticMode?: boolean;
  official?: boolean;
  dismissOnPointerLeave?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const holeRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const objectRefs = useRef<Array<HTMLElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [entranceDone, setEntranceDone] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const dismissFocusRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const allItems = useMemo(() => [...projectPlanets, ...skillSpacecraft], []);
  const previewItem = allItems.find((item) => item.id === (pinnedId ?? activeId)) ?? null;

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  }, []);

  const finishEntrance = useCallback(() => {
    timelineRef.current?.progress(1).pause();
    setEntranceDone(true);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const hole = holeRef.current;
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    const objects = objectRefs.current.filter(Boolean) as HTMLElement[];
    if (!root || !hole || paths.length !== 8 || objects.length !== 8) return;

    const media = gsap.matchMedia();
    media.add({
      desktopMotion: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
      mobile: "(max-width: 900px)",
    }, (context) => {
      const animate = !staticMode && Boolean(context.conditions?.desktopMotion);
      if (!animate) {
        gsap.set(hole, { clearProps: "transform,opacity,visibility" });
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 0 });
        gsap.set(objects, { clearProps: "transform,opacity,visibility" });
        setEntranceDone(true);
        return;
      }

      setEntranceDone(false);
      gsap.set(hole, { scale: 0.16, autoAlpha: 0.28, transformOrigin: "50% 50%" });
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      objects.forEach((object, index) => {
        const start = objectStartOffsets[index];
        gsap.set(object, { x: start.x, y: start.y, rotation: start.rotation, scale: 0.62, autoAlpha: 0 });
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => setEntranceDone(true),
      });
      timelineRef.current = timeline;
      timeline.to(hole, { scale: 1, autoAlpha: 1, duration: 2.25, ease: "power4.out" }, 0);
      paths.forEach((path, index) => {
        timeline.to(path, { strokeDashoffset: 0, duration: 1.72, ease: "power2.inOut" }, 0.12 + index * 0.095);
      });
      objects.forEach((object, index) => {
        const start = objectStartOffsets[index];
        timeline.to(object, {
          keyframes: [
            { x: start.x * 0.42, y: start.y * 0.52, rotation: start.rotation * 0.45, scale: 0.82, autoAlpha: 0.82, duration: 0.9 },
            { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 1.05 },
          ],
          ease: "power3.inOut",
        }, 0.38 + index * 0.105);
      });
      return () => { timeline.kill(); timelineRef.current = null; };
    }, root);

    const onVisibility = () => { if (document.hidden) finishEntrance(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      media.revert();
    };
  }, [finishEntrance, staticMode]);

  useEffect(() => {
    if (!scannerEnabled || !entranceDone || !scannerRef.current) return;
    const scanner = scannerRef.current;
    const xTo = gsap.quickTo(scanner, "x", { duration: 0.28, ease: "power3.out" });
    const yTo = gsap.quickTo(scanner, "y", { duration: 0.28, ease: "power3.out" });
    const stage = stageRef.current;
    if (!stage) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || activeIdRef.current || pinnedId) return;
      const rect = stage.getBoundingClientRect();
      xTo(event.clientX - rect.left - 21);
      yTo(event.clientY - rect.top - 21);
      gsap.to(scanner, { width: 42, height: 42, autoAlpha: 0.72, duration: 0.18, overwrite: "auto" });
    };
    const leave = () => { if (!pinnedId) gsap.to(scanner, { autoAlpha: 0, duration: 0.16 }); };
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    return () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(scanner);
    };
  }, [entranceDone, pinnedId, scannerEnabled]);

  const lockScanner = useCallback((target: HTMLElement) => {
    if (!scannerEnabled || !scannerRef.current || !stageRef.current) return;
    const targetRect = target.getBoundingClientRect();
    const stageRect = stageRef.current.getBoundingClientRect();
    gsap.to(scannerRef.current, {
      x: targetRect.left - stageRect.left - 12,
      y: targetRect.top - stageRect.top - 12,
      width: targetRect.width + 24,
      height: targetRect.height + 24,
      autoAlpha: 1,
      duration: reducedMotion ? 0 : 0.34,
      ease: "power3.out",
      overwrite: "auto",
    });
    if (!reducedMotion && sweepRef.current) {
      gsap.fromTo(sweepRef.current, { rotation: -55, autoAlpha: 0 }, { rotation: 305, autoAlpha: 0.72, duration: 0.62, ease: "power2.out", overwrite: true });
    }
  }, [reducedMotion, scannerEnabled]);

  const inspectItem = useCallback((item: SpaceSystemItem, target: HTMLElement, source: "pointer" | "focus" | "click" | "touch") => {
    if(source==='focus'&&dismissFocusRef.current){dismissFocusRef.current=false;return;}
    clearHideTimer();
    activeIdRef.current = item.id;
    setActiveId(item.id);
    if (source === "touch" || (source === "click" && !dismissOnPointerLeave)) setPinnedId((current) => current === item.id ? null : item.id);
    else if (dismissOnPointerLeave && source !== "focus") setPinnedId(null);
    lockScanner(target);
  }, [clearHideTimer, lockScanner, dismissOnPointerLeave]);

  const scheduleLeave = useCallback(() => {
    clearHideTimer();
    // The centered reading state stays reachable across the gap between object and CTA.
    if(official&&!dismissOnPointerLeave)return;
    if (pinnedId) return;
    hideTimerRef.current = window.setTimeout(() => {
      // Keyboard readers keep the preview while focus is on its target or contents.
      const focused=document.activeElement;
      if(dismissOnPointerLeave && focused?.matches(":focus-visible") && focused.closest("[data-object-id], #v7-scanner-preview")) return;
      activeIdRef.current = null;
      setActiveId(null);
      if(dismissOnPointerLeave && scannerRef.current) gsap.to(scannerRef.current,{autoAlpha:0,duration:reducedMotion?0:.16,overwrite:true});
    }, previewMode === "center" ? 420 : 180);
  }, [clearHideTimer, pinnedId, previewMode,official,dismissOnPointerLeave,reducedMotion]);

  const closePreview = useCallback(() => {
    clearHideTimer();
    if(official&&document.activeElement?.closest('#v7-scanner-preview')){
      const target=objectRefs.current.find(el=>el?.dataset.objectId===activeIdRef.current);
      if(target){dismissFocusRef.current=true;target.focus();}
    }
    setPinnedId(null);
    setActiveId(null);
    activeIdRef.current = null;
    if (scannerRef.current) gsap.to(scannerRef.current, { autoAlpha: 0, duration: reducedMotion ? 0 : 0.16 });
  }, [clearHideTimer, reducedMotion,official]);

  useEffect(()=>{
    if(!official||!previewItem)return;
    const target=objectRefs.current.find(el=>el?.dataset.objectId===previewItem.id);
    const scanner=scannerRef.current,stage=stageRef.current;
    if(!target||!scanner||!stage)return;
    const start=performance.now();
    const follow=()=>{
      if(document.hidden||performance.now()-start<350)return;
      const r=target.getBoundingClientRect(),s=stage.getBoundingClientRect();
      gsap.set(scanner,{x:r.left-s.left-12,y:r.top-s.top-12,width:r.width+24,height:r.height+24});
    };
    gsap.ticker.add(follow);
    return()=>gsap.ticker.remove(follow);
  },[official,previewItem]);
  useEffect(()=>()=>{clearHideTimer();if(sweepRef.current)gsap.killTweensOf(sweepRef.current);},[clearHideTimer]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!entranceDone) finishEntrance();
      else closePreview();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePreview, entranceDone, finishEntrance]);

  const Root=official?'div':'main';
  return (
    <Root ref={rootRef as React.RefObject<HTMLDivElement & HTMLElement>} className={styles.page} data-official={official||undefined} data-scanner={scannerEnabled ? "on" : "off"} data-entrance={entranceDone ? "done" : "running"}
      data-preview-mode={previewMode} data-preview-open={previewItem ? "true" : "false"}>
      {!official&&<nav className={styles.nav} aria-label="Prototype navigation">
        <Link className={styles.home} href="/" aria-label="Carl Shi — current homepage"><CsLogo /><span>Home</span></Link>
        <span className={styles.studyLabel}>WebGL {studyVersion ?? (scannerEnabled ? "v7" : "v6")} study</span>
        <div className={styles.navLinks}><Link href="/homepage-poc/projects#projects">Projects</Link><Link href="/homepage-poc/projects#about">About</Link></div>
      </nav>}

      <section ref={stageRef} className={styles.stage} aria-label="Dark gravitational portfolio system" onPointerDown={(event) => {
        const target = event.target as Element;
        if (pinnedId && !target.closest("[data-object-id], #v7-scanner-preview")) closePreview();
      }}>
        <div className={styles.atmosphereLayer} aria-hidden="true">
          {!official&&<Suspense fallback={null}><StandaloneAtmosphere/></Suspense>}
        </div>
        <StreamLayer pathRefs={pathRefs} />
        <div ref={holeRef} className={styles.blackHoleLayer} data-transition-role="dark-hole" aria-hidden="true" />

        <header className={styles.identity} data-transition-role="dark-identity" inert={official&&!!previewItem} aria-hidden={official&&!!previewItem}>
          {official&&<span className={styles.officialEyebrow}>Design × Business × Technology</span>}
          <h1>Carl Shi</h1>
          <p>{official?'I build at the intersection of AI, product, design, and technology. Currently exploring Product, Technical PM, and AI Product opportunities.':<>AI product, technical product,<br />and product strategy</>}</p>
          <div className={official?styles.officialActions:undefined}>
            {official&&<Link className={styles.selectedWork} href="/homepage-poc/projects#projects">View Selected Work</Link>}
            <Link className={styles.resume} href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</Link>
          </div>
        </header>

        <section className={`${styles.collection} ${styles.projects}`} aria-label="Projects">
          <h2>Projects</h2>
          {projectPlanets.map((item, index) => <CelestialObjectButton key={item.id} item={item} side="projects" index={index} objectRef={(node) => { objectRefs.current[index] = node; }} expanded={(pinnedId ?? activeId) === item.id} scannerEnabled={scannerEnabled} onInspect={inspectItem} onLeave={scheduleLeave} />)}
        </section>
        <section className={`${styles.collection} ${styles.skills}`} aria-label="Skills">
          <h2>Skills</h2>
          {skillSpacecraft.map((item, index) => <CelestialObjectButton key={item.id} item={item} side="skills" index={index} objectRef={(node) => { objectRefs.current[index + 4] = node; }} expanded={(pinnedId ?? activeId) === item.id} scannerEnabled={scannerEnabled} onInspect={inspectItem} onLeave={scheduleLeave} />)}
        </section>

        {!entranceDone ? <button type="button" className={styles.skipEntrance} onClick={finishEntrance}>Skip entrance</button> : null}

        {scannerEnabled ? <>
          <div ref={scannerRef} className={styles.scannerCursor} aria-hidden="true"><i /><i /><i /><i /><span ref={sweepRef} className={styles.scannerSweep} /></div>
          {previewItem ? <div className={styles.previewDock} onPointerEnter={clearHideTimer} onPointerLeave={scheduleLeave} onFocusCapture={clearHideTimer} onBlurCapture={scheduleLeave}><PreviewPanel key={previewItem.id} item={previewItem} pinned={(official&&!dismissOnPointerLeave)||Boolean(pinnedId)} reduced={reducedMotion} onClose={closePreview} /></div> : null}
        </> : null}
      </section>
    </Root>
  );
}
