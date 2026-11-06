"use client";

import Link from "next/link";
import Image from "next/image";
import { useId, useState, type CSSProperties, type PointerEvent, type FocusEvent, type ReactNode } from "react";
import styles from "./ivory-home.module.css";
import transitionStyles from "./homepage-rc2/light-transition.module.css";
import { SkillObject, skillObjects } from "./skill-objects";

const layerRoot = "/media/ivory-cosmos/tree-growth";
const worlds = [
  { title: "Build Hope", image: "/media/build-hope-content-operations/hero-operating-model.webp", slug: "build-hope-content-operations" },
  { title: "AI PC Build Advisor", image: "/media/ai-pc-build-advisor/v3/studio-overview.jpg", slug: "ai-pc-build-advisor" },
  { title: "Dog Behavior Camera", image: "/media/dog-behavior-camera/case-study/detection-moving-frame.png", slug: "dog-behavior-camera" },
  { title: "Luggage Helper", image: "/media/luggage-helper/app-home-screen.png", slug: "ai-travel-assistant" },
  { title: "Music Pulse", image: "/media/music-pulse/participant-view.png", slug: "interactive-music-installation" },
];

const projectSlots = [[15.75, 23.76], [20.2, 17.5], [27, 17.31], [17.68, 33.52], [27.55, 31.31]];
// Attachment points measured on the 1448 × 1086 tree artwork, not object centers.
const skillSlots = [[1017 / 1448 * 100, 205 / 1086 * 100], [1216 / 1448 * 100, 194 / 1086 * 100], [1127 / 1448 * 100, 119 / 1086 * 100], [1115 / 1448 * 100, 258 / 1086 * 100]];
const fruitLayers = ["p1", "p2", "p3", "p5", "p6"];
type Tree = "projects" | "skills";
// Position each leaf cluster against its own branch instead of moving a whole canopy.
const leafClusters: Array<{ tree: Tree; clip: string; x: number; y: number; origin: string }> = [
  { tree: "projects", clip: "inset(0 77% 78% 8%)", x: 2, y: 0, origin: "21% 15%" },
  { tree: "projects", clip: "inset(0 62% 82% 23%)", x: 0, y: -.5, origin: "29% 13%" },
  { tree: "projects", clip: "inset(13% 54% 76% 38%)", x: -1, y: -1, origin: "39% 18%" },
  { tree: "projects", clip: "inset(22% 70% 60% 8%)", x: 3, y: -4, origin: "23% 26%" },
  { tree: "projects", clip: "inset(22% 64% 67% 30%)", x: 0, y: -2, origin: "32% 27%" },
  { tree: "skills", clip: "inset(4% 14% 80% 76%)", x: -2.2, y: 0, origin: "80% 15%" },
  { tree: "skills", clip: "inset(18% 2% 71% 83%)", x: -2, y: -1, origin: "86% 23%" },
  { tree: "skills", clip: "inset(14% 23% 74% 67%)", x: -1, y: -1, origin: "72% 22%" },
  { tree: "skills", clip: "inset(23% 32% 68% 60%)", x: 1.8, y: -2, origin: "65% 28%" },
  { tree: "skills", clip: "inset(26% 13% 59% 71%)", x: 0, y: -4, origin: "78% 30%" },
];
const treeRegions = {
  projects: { x: 10, y: 1, width: 34, height: 40 },
  skills: { x: 61, y: 5, width: 31, height: 36 },
};

function fruitPosition(tree: Tree, x: number, y: number): CSSProperties {
  const region = treeRegions[tree];
  return { "--x": `${(x - region.x) / region.width * 100}%`, "--y": `${(y - region.y) / region.height * 100}%` } as CSSProperties;
}

// The source artwork contains the final bare branches. During RC2 only, these
// masks reuse the standalone entrance's method and timing, with the paths
// aligned to RC1's actual trunks. The original image is restored at rest.
const entranceBranches = [
  "M540 426 C559 390 527 364 516 323 C508 292 501 270 495 242 C499 216 480 170 447 150 C404 123 335 107 277 111",
  "M515 320 C476 308 421 309 377 294 C319 279 278 264 218 270",
  "M499 264 C461 243 442 222 405 202 C366 186 333 172 285 165",
  "M473 175 C469 130 491 107 505 77 C518 54 539 42 558 35",
  "M948 452 C945 404 990 367 977 326 C962 286 996 244 1036 214 C1090 181 1154 151 1275 119",
  "M977 341 C1010 315 1051 299 1096 302 C1131 306 1161 329 1178 344",
  "M986 279 C1001 237 1014 196 1020 163 C1017 137 1016 114 1012 94",
  "M1080 192 C1086 163 1109 145 1133 127 C1154 105 1169 85 1172 62",
];

function GrowthArtwork({ transitionLayers = false, growthLayers, primaryProjectsOnly=false }: { transitionLayers?: boolean; growthLayers?:ReactNode; primaryProjectsOnly?:boolean }) {
  const maskId = useId().replace(/:/g, "");
  return <>
    <Image unoptimized className={styles.baseArtwork} data-light-base src={`${layerRoot}/bare-planet.webp`} width="1448" height="1086" alt="" loading="eager" fetchPriority="high" />
    {transitionLayers && (growthLayers ?? <>
      <span className={transitionStyles.center} data-light-center aria-hidden="true" />
      <Image unoptimized className={`${styles.baseArtwork} ${transitionStyles.planet}`} data-light-planet src={`${layerRoot}/bare-planet.webp`} width="1448" height="1086" alt="" loading="eager" aria-hidden="true" />
      <svg className={transitionStyles.branches} data-light-branches viewBox="0 0 1448 1086" aria-hidden="true">
        <defs>
          {[0, 1].map(side => <mask key={side} id={`${maskId}-branch-${side}`} maskUnits="userSpaceOnUse">
            <rect width="1448" height="1086" fill="black" />
            {entranceBranches.slice(side * 4, side * 4 + 4).map((path, index) => <path key={path} data-light-branch d={path} pathLength="1" fill="none" stroke="white" strokeWidth={index === 0 ? 156 : 120} strokeLinecap="round" strokeLinejoin="round" />)}
          </mask>)}
        </defs>
        <g data-light-branch-art>{[0, 1].map(side => <image key={side} href={`${layerRoot}/bare-branches-transparent.png`} width="1448" height="1086" mask={`url(#${maskId}-branch-${side})`} />)}</g>
        {[...projectSlots, ...skillSlots].map(([x, y], index) => <line key={index} data-light-string x1={`${x}%`} x2={`${x}%`} y1={`${[14.8, 9.6, 9.2, 25.7, 23.5, 11.1, 9.9, 4.8, 15.4][index]}%`} y2={`${y}%`} pathLength="1" stroke="#7d684a" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />)}
      </svg>
    </>)}
    <svg className={styles.energyConnection} data-light-energy viewBox="0 0 1448 1086" aria-hidden="true">
      <path d="M706 555C590 474 472 411 327 326" />
      <path d="M742 555C860 470 958 404 1120 310" />
    </svg>
    {leafClusters.map((cluster, index) => <Image unoptimized loading="eager" key={index} className={styles.leafLayer} data-leaf-tree={cluster.tree}
      style={{ clipPath: cluster.clip, transformOrigin: cluster.origin, "--leaf-x": `${cluster.x}%`, "--leaf-y": `${cluster.y}%`, "--leaf-delay": `${index % 5 * .035}s` } as CSSProperties}
      src={`${layerRoot}/leaves-hover-overlay.png`} width="1448" height="1086" alt="" />)}
    {(primaryProjectsOnly?fruitLayers.slice(0,4):fruitLayers).map((name, index) => <Image unoptimized loading="eager" key={name} className={styles.fruitLayer} data-fruit-tree={name.startsWith("p") ? "projects" : "skills"}
      style={{ "--growth-delay": `${.28 + (index < 5 ? index : index - 5) * .055}s`, "--origin-x": name.startsWith("p") ? "28%" : "78%", "--fruit-shift": name === "p2" ? "-1.28%" : name === "p3" ? "1.03%" : "0%" } as CSSProperties}
      src={`${layerRoot}/fruit-${name}.webp`} width="1448" height="1086" alt="" />)}
  </>;
}

export function PortfolioIdentity({ dark = false }: { dark?: boolean }) {
  return <div className={`${styles.hero}${dark ? ` ${styles.darkHero}` : ""}`} data-light-identity={!dark ? "" : undefined}>
    <span className={styles.eyebrow}>Design × Business × Technology</span>
    <h1 className={styles.name} aria-label="Carl Shi — Technical Product, Technical Program, and AI Product">Carl Shi</h1>
    <p>I build at the intersection of AI, product, design, and technology. Currently exploring Product, Technical PM, and AI Product opportunities.</p>
    <div className={styles.identityActions}>
      <Link className={styles.resume} href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</Link>
    </div>
  </div>;
}

export function DarkPortfolioIdentity({ hidden = false }: { hidden?: boolean }) {
  return <div className={`${styles.scene} ${styles.darkScene}`} data-hidden={hidden} aria-hidden={hidden} inert={hidden}>
    <div className={styles.composition}>
      <span className={styles.gravityWell} aria-hidden="true"><i /><i /></span>
      <PortfolioIdentity dark />
    </div>
  </div>;
}

export function IvoryHome({ transitionLayers = false, growthLayers, primaryProjectsOnly=false }: { transitionLayers?: boolean; growthLayers?:ReactNode; primaryProjectsOnly?:boolean }) {
  const [hovered, setHovered] = useState<Tree | null>(null);
  const [focused, setFocused] = useState<Tree | null>(null);
  const [touched, setTouched] = useState<Tree | null>(null);
  const active = hovered ?? focused ?? touched;

  const treeEvents = (tree: Tree) => ({
    onPointerEnter: (event: PointerEvent<HTMLDivElement>) => { if (event.pointerType !== "touch") setHovered(tree); },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => { if (event.pointerType !== "touch") setHovered(tree); },
    onPointerLeave: (event: PointerEvent<HTMLDivElement>) => { if (event.pointerType !== "touch") setHovered(null); },
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => { if (event.pointerType === "touch") setTouched(tree); else setHovered(tree); },
    onFocus: (event: FocusEvent<HTMLDivElement>) => { if ((event.target as HTMLElement).matches(":focus-visible")) setFocused(tree); },
    onBlur: (event: FocusEvent<HTMLDivElement>) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); },
  });

  return (
    <section className={`${styles.page}${transitionLayers ? ` ${transitionStyles.controlled}` : ""}`} aria-label="Ivory Cosmos portfolio"
      onPointerDown={(event) => { if (event.pointerType === "touch" && !(event.target as Element).closest("[data-tree]")) setTouched(null); }}>
      <div className={styles.marginNote} aria-hidden="true"><span>01 / Personal universe</span><span>AI · Product · Design</span></div>
      <div className={styles.scene}>
        <div className={styles.composition} data-light-composition data-active-tree={active ?? ""}>
          <GrowthArtwork transitionLayers={transitionLayers} growthLayers={growthLayers} primaryProjectsOnly={primaryProjectsOnly} />

          <div className={`${styles.treeZone} ${styles.projectZone}`} data-tree="projects" {...treeEvents("projects")}>
            <button className={styles.treeTrigger} type="button" aria-label="Explore projects" aria-expanded={active === "projects"} aria-controls="project-tree-fruits">
              <span className={styles.treeLabel} data-light-label>Projects<small>Explore the project tree</small></span>
            </button>
            <div id="project-tree-fruits" className={styles.fruits} aria-label="Project fruits">
            {(primaryProjectsOnly?worlds.slice(0,4):worlds).map((project, index) => {
              const [x, y] = projectSlots[index];
              return <Link key={project.slug} className={`${styles.fruit} ${styles.projectFruit}`}
                style={{ ...fruitPosition("projects", x, y), "--growth-delay": `${.28 + index * .055}s` } as CSSProperties}
                href={`/homepage-poc/projects/case-studies#${project.slug}`} aria-label={`${project.title} — view project`}>
                <span className={styles.fruitInterior}><Image unoptimized src={project.image} alt="" loading="lazy" width="56" height="56" /></span>
                <span className={styles.fruitName}>{project.title}</span>
              </Link>;
            })}
            </div>
          </div>
          <div className={`${styles.treeZone} ${styles.skillZone}`} data-tree="skills" {...treeEvents("skills")}>
            <button className={styles.treeTrigger} type="button" aria-label="Explore skills" aria-expanded={active === "skills"} aria-controls="skill-tree-fruits">
              <span className={styles.treeLabel} data-light-label>Skills<small>Explore the skill tree</small></span>
            </button>
            <div id="skill-tree-fruits" className={styles.fruits} aria-label="Skill fruits">
            {skillObjects.map((skill, index) => {
              const [x, y] = skillSlots[index];
              return <SkillObject key={skill.id} index={index} compact
                style={{ ...fruitPosition("skills", x, y), "--growth-delay": `${.28 + index * .055}s` } as CSSProperties}
              />;
            })}
            </div>
          </div>

          <PortfolioIdentity />
        </div>
      </div>
      <footer className={styles.footer}><span>Page inspired by The Little Prince</span><span className={styles.hoverGuidance}>Hover or focus to explore · Click to navigate</span><span className={styles.touchGuidance}>Tap a tree to explore</span></footer>
    </section>
  );
}
