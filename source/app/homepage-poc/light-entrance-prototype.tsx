"use client";

/* eslint-disable @next/next/no-img-element -- the prototype layers existing transparent watercolor assets and authentic project thumbnails */
import gsap from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CsLogo } from "./cs-logo";
import { projectPlanets, skillSpacecraft } from "./space-system.data";
import styles from "./light-entrance-prototype.module.css";

const artwork = "/media/ivory-cosmos/tree-growth";

const projectSlots = [
  { x: 15.75, y: 23.76, anchorY: 14.8 },
  { x: 20.2, y: 17.5, anchorY: 9.6 },
  { x: 27, y: 17.31, anchorY: 9.2 },
  { x: 27.55, y: 31.31, anchorY: 23.5 },
] as const;

const skillSlots = [
  { x: 70.24, y: 18.88, anchorY: 11.1 },
  { x: 83.98, y: 17.86, anchorY: 9.9 },
  { x: 77.83, y: 10.96, anchorY: 4.8 },
  { x: 77.0, y: 23.76, anchorY: 15.4 },
] as const;

const branchPaths = {
  left: [
    "M612 548 C604 470 572 384 528 302 C480 216 414 152 330 92",
    "M553 360 C493 345 427 306 350 238",
    "M520 288 C468 236 405 196 320 171",
    "M478 218 C431 166 376 128 304 112",
  ],
  right: [
    "M836 548 C844 468 878 380 925 296 C976 210 1042 151 1125 91",
    "M894 355 C956 337 1024 299 1104 230",
    "M930 282 C983 229 1047 191 1134 166",
    "M974 215 C1022 164 1078 126 1150 110",
  ],
} as const;

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

export function LightEntrancePrototype({ staticMode = false }: { staticMode?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const branchRefs = useRef<Array<SVGPathElement | null>>([]);
  const leafRefs = useRef<Array<HTMLImageElement | null>>([]);
  const stringRefs = useRef<Array<SVGLineElement | null>>([]);
  const charmRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [entranceDone, setEntranceDone] = useState(false);
  const reducedMotion = useReducedMotion();

  const objects = useMemo(() => [
    ...projectPlanets.map((item, index) => ({ ...item, side: "project" as const, slot: projectSlots[index], image: item.image ?? "" })),
    ...skillSpacecraft.map((item, index) => ({ ...item, side: "skill" as const, slot: skillSlots[index], image: `/media/skill-objects/${["strategy", "ai", "design", "build"][index]}.png` })),
  ], []);

  const finishEntrance = useCallback(() => {
    timelineRef.current?.progress(1).pause();
    setEntranceDone(true);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const planet = planetRef.current;
    const identity = identityRef.current;
    const branches = branchRefs.current.filter(Boolean) as SVGPathElement[];
    const leaves = leafRefs.current.filter(Boolean) as HTMLImageElement[];
    const strings = stringRefs.current.filter(Boolean) as SVGLineElement[];
    const charms = charmRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!root || !planet || !identity || branches.length !== 8 || leaves.length !== 2 || strings.length !== 8 || charms.length !== 8 || labels.length !== 2) return;

    const media = gsap.matchMedia();
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (staticMode || !context.conditions?.motion) {
        gsap.set([planet, identity, ...leaves, ...labels], { clearProps: "transform,opacity,visibility" });
        gsap.set(branches, { clearProps: "strokeDasharray,strokeDashoffset,opacity,visibility" });
        gsap.set(strings, { clearProps: "strokeDasharray,strokeDashoffset,opacity,visibility" });
        gsap.set(charms, { clearProps: "transform,opacity,visibility" });
        setEntranceDone(true);
        return;
      }

      setEntranceDone(false);
      gsap.set(planet, { scale: .34, transformOrigin: "50% 61%" });
      gsap.set(identity, { autoAlpha: 0, y: 12 });
      gsap.set(branches, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(leaves, { autoAlpha: 0, scale: .42 });
      gsap.set(strings, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 });
      gsap.set(charms, { autoAlpha: 0, scale: .38, y: -18 });
      gsap.set(labels, { autoAlpha: 0, y: 8 });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setEntranceDone(true),
      });
      timelineRef.current = timeline;
      timeline.addLabel("planet", 0)
        .to(planet, { scale: 1, duration: 1.05, ease: "expo.out" }, "planet")
        .to(identity, { autoAlpha: 1, y: 0, duration: .58 }, .62)
        .addLabel("branches", .62);

      branches.forEach((path, index) => {
        timeline.to(path, { strokeDashoffset: 0, duration: index % 4 === 0 ? 1.55 : 1.25, ease: "power3.inOut" }, .62 + (index % 4) * .12 + (index > 3 ? .08 : 0));
      });
      leaves.forEach((leaf, index) => {
        timeline.to(leaf, { autoAlpha: .92, scale: 1, duration: 1.0, ease: "expo.out" }, 1.52 + index * .1);
      });
      timeline.to(labels, { autoAlpha: 1, y: 0, duration: .48, stagger: .1 }, 1.72);
      strings.forEach((string, index) => {
        timeline.to(string, { strokeDashoffset: 0, autoAlpha: .58, duration: .54, ease: "power2.inOut" }, 1.94 + index * .075);
      });
      charms.forEach((charm, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        timeline.to(charm, {
          keyframes: [
            { autoAlpha: 1, scale: 1, y: 0, rotation: direction * 7, duration: .52 },
            { rotation: direction * -3.5, duration: .32, ease: "power2.inOut" },
            { rotation: direction * 1.4, duration: .26, ease: "power2.inOut" },
            { rotation: 0, duration: .22, ease: "power2.out" },
          ],
          transformOrigin: "50% -64px",
        }, 2.12 + index * .08);
      });

      return () => {
        timeline.kill();
        timelineRef.current = null;
      };
    }, root);

    const onVisibility = () => { if (document.hidden) finishEntrance(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      media.revert();
    };
  }, [finishEntrance, staticMode]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !entranceDone) finishEntrance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entranceDone, finishEntrance]);

  return (
    <main ref={rootRef} className={styles.page} data-entrance={entranceDone ? "done" : "running"} data-reduced-motion={reducedMotion ? "true" : "false"}>
      <nav className={styles.nav} aria-label="Light entrance prototype navigation">
        <Link className={styles.home} href="/" aria-label="Carl Shi — current homepage"><CsLogo /><span>Home</span></Link>
        <span className={styles.studyLabel}>Light entrance study</span>
        <div className={styles.navLinks}><Link href="/homepage-poc/projects#projects">Projects</Link><Link href="/homepage-poc/projects#about">About</Link></div>
      </nav>

      <section className={styles.stage} aria-label="Growing portfolio knowledge trees">
        <div className={styles.marginNote}><span>Personal universe</span><span>AI · Product · Design</span></div>
        <div className={styles.composition}>
          <div ref={planetRef} className={styles.planetLayer} data-transition-role="light-planet" aria-hidden="true"><img src={`${artwork}/bare-planet.webp`} alt="" /></div>

          <svg className={styles.growthLayer} data-transition-role="light-growth" viewBox="0 0 1448 1086" aria-hidden="true">
            <defs>
              <mask id="light-v1-left-branches" maskUnits="userSpaceOnUse">
                <rect width="1448" height="1086" fill="black" />
                {branchPaths.left.map((path, index) => <path key={path} ref={(node) => { branchRefs.current[index] = node; }} className={styles.branchMask} d={path} pathLength="1" />)}
              </mask>
              <mask id="light-v1-right-branches" maskUnits="userSpaceOnUse">
                <rect width="1448" height="1086" fill="black" />
                {branchPaths.right.map((path, index) => <path key={path} ref={(node) => { branchRefs.current[index + 4] = node; }} className={styles.branchMask} d={path} pathLength="1" />)}
              </mask>
            </defs>
            <image href={`${artwork}/bare-branches-transparent.png`} width="1448" height="1086" mask="url(#light-v1-left-branches)" />
            <image href={`${artwork}/bare-branches-transparent.png`} width="1448" height="1086" mask="url(#light-v1-right-branches)" />
            {objects.map((item, index) => <line key={item.id} ref={(node) => { stringRefs.current[index] = node; }} className={styles.charmString}
              x1={`${item.slot.x}%`} x2={`${item.slot.x}%`} y1={`${item.slot.anchorY}%`} y2={`${item.slot.y}%`} pathLength="1" />)}
          </svg>

          <img ref={(node) => { leafRefs.current[0] = node; }} data-transition-role="light-leaves" className={`${styles.leafLayer} ${styles.leftLeaves}`} src={`${artwork}/leaves-hover-overlay.png`} alt="" aria-hidden="true" />
          <img ref={(node) => { leafRefs.current[1] = node; }} data-transition-role="light-leaves" className={`${styles.leafLayer} ${styles.rightLeaves}`} src={`${artwork}/leaves-hover-overlay.png`} alt="" aria-hidden="true" />

          <div ref={(node) => { labelRefs.current[0] = node; }} className={`${styles.treeLabel} ${styles.projectLabel}`}>Projects</div>
          <div ref={(node) => { labelRefs.current[1] = node; }} className={`${styles.treeLabel} ${styles.skillLabel}`}>Skills</div>

          <div className={styles.objects}>
            {objects.map((item, index) => <Link key={item.id} ref={(node) => { charmRefs.current[index] = node; }} href={item.href}
              className={styles.charm} data-motion-object={item.id} data-side={item.side} data-label={item.title} style={{ "--x": `${item.slot.x}%`, "--y": `${item.slot.y}%` } as CSSProperties}
              aria-label={`${item.title}. ${item.summary}`}>
              <span className={styles.charmVisual}><img src={item.image} alt="" /></span>
            </Link>)}
          </div>

          <div ref={identityRef} className={styles.identity} data-transition-role="light-identity">
            <h1>Carl Shi</h1>
            <p className={styles.positioning}>AI Product · Technical Product · Product Strategy</p>
            <p className={styles.intro}>I build at the intersection of AI, product, design, and technology.</p>
            <Link href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</Link>
          </div>
        </div>

        {!entranceDone ? <button className={styles.skip} type="button" onClick={finishEntrance}>Skip entrance</button> : null}
        <footer className={styles.footer}><span>Page inspired by The Little Prince</span><span>{entranceDone ? "Explore the hanging objects" : "Growing Carl's portfolio universe"}</span></footer>
      </section>
    </main>
  );
}
