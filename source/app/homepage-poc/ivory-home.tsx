"use client";

import Link from "next/link";
import { useState, type CSSProperties, type PointerEvent, type FocusEvent } from "react";
import styles from "./ivory-home.module.css";

const layerRoot = "/media/ivory-cosmos/tree-growth";
const worlds = [
  { title: "Build Hope", image: "/media/build-hope-content-operations/hero-operating-model.webp", slug: "build-hope-content-operations" },
  { title: "AI PC Build Advisor", image: "/media/ai-pc-build-advisor/working-build-needs.png", slug: "ai-pc-build-advisor" },
  { title: "Dog Behavior Camera", image: "/media/dog-behavior-camera/case-study/detection-moving-frame.png", slug: "dog-behavior-camera" },
  { title: "Luggage Helper", image: "/media/luggage-helper/app-home-screen.png", slug: "ai-travel-assistant" },
  { title: "Music Pulse", image: "/media/music-pulse/participant-view.png", slug: "interactive-music-installation" },
];
const skills = ["Strategy", "Design", "AI", "Build"];

const projectSlots = [[15.75, 23.76], [20.2, 17.5], [27, 17.31], [17.68, 33.52], [27.55, 31.31]];
const skillSlots = [[74.10, 25.78], [80.59, 21.55], [86.39, 23.76], [78.38, 31.22]];
const fruitLayers = ["p1", "p2", "p3", "p5", "p6", "s1", "s2", "s3", "s4"];
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

function GrowthArtwork() {
  return <>
    <img className={styles.baseArtwork} src={`${layerRoot}/bare-planet.webp`} width="1448" height="1086" alt="" fetchPriority="high" />
    {leafClusters.map((cluster, index) => <img key={index} className={styles.leafLayer} data-leaf-tree={cluster.tree}
      style={{ clipPath: cluster.clip, transformOrigin: cluster.origin, "--leaf-x": `${cluster.x}%`, "--leaf-y": `${cluster.y}%`, "--leaf-delay": `${index % 5 * .035}s` } as CSSProperties}
      src={`${layerRoot}/leaves-hover-overlay.png`} width="1448" height="1086" alt="" />)}
    {fruitLayers.map((name, index) => <img key={name} className={styles.fruitLayer} data-fruit-tree={name.startsWith("p") ? "projects" : "skills"}
      style={{ "--growth-delay": `${.28 + (index < 5 ? index : index - 5) * .055}s`, "--origin-x": name.startsWith("p") ? "28%" : "78%", "--fruit-shift": name === "p2" ? "-1.28%" : name === "p3" ? "1.03%" : "0%" } as CSSProperties}
      src={`${layerRoot}/fruit-${name}.webp`} width="1448" height="1086" alt="" />)}
  </>;
}

export function IvoryHome() {
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
    <section className={styles.page} aria-label="Ivory Cosmos portfolio"
      onPointerDown={(event) => { if (event.pointerType === "touch" && !(event.target as Element).closest("[data-tree]")) setTouched(null); }}>
      <div className={styles.marginNote} aria-hidden="true"><span>01 / Personal universe</span><span>AI · Product · Design</span></div>
      <div className={styles.scene}>
        <div className={styles.composition} data-active-tree={active ?? ""}>
          <GrowthArtwork />

          <div className={`${styles.treeZone} ${styles.projectZone}`} data-tree="projects" {...treeEvents("projects")}>
            <button className={styles.treeTrigger} type="button" aria-label="Explore project tree" aria-expanded={active === "projects"} aria-controls="project-tree-fruits" />
            <div id="project-tree-fruits" className={styles.fruits} aria-label="Project fruits">
            {worlds.map((project, index) => {
              const [x, y] = projectSlots[index];
              return <Link key={project.slug} className={`${styles.fruit} ${styles.projectFruit}`}
                style={{ ...fruitPosition("projects", x, y), "--growth-delay": `${.28 + index * .055}s` } as CSSProperties}
                href={`/homepage-poc/projects/case-studies#${project.slug}`} aria-label={`${project.title} — view project`}>
                <span className={styles.fruitInterior}><img src={project.image} alt="" loading="lazy" width="56" height="56" /></span>
                <span className={styles.fruitName}>{project.title}</span>
              </Link>;
            })}
            </div>
          </div>
          <div className={`${styles.treeZone} ${styles.skillZone}`} data-tree="skills" {...treeEvents("skills")}>
            <button className={styles.treeTrigger} type="button" aria-label="Explore skill tree" aria-expanded={active === "skills"} aria-controls="skill-tree-fruits" />
            <div id="skill-tree-fruits" className={styles.fruits} aria-label="Skill fruits">
            {skills.map((skill, index) => {
              const [x, y] = skillSlots[index];
              return <Link key={skill} className={`${styles.fruit} ${styles.skillFruit}`}
                style={{ ...fruitPosition("skills", x, y), "--growth-delay": `${.28 + index * .055}s` } as CSSProperties}
                href="/homepage-poc/projects#skills" aria-label={`${skill} — explore skill`}>
                <span className={styles.fruitInterior}><span>{skill}</span></span>
                <span className={styles.fruitName}>{skill}</span>
              </Link>;
            })}
            </div>
          </div>

          <div className={styles.hero}>
            <span className={styles.eyebrow}>Design × Business × Technology</span>
            <strong className={styles.name}>Carl Shi</strong>
            <p>I build at the intersection of AI, product, design, and technology. Currently exploring Product, Technical PM, and AI Product opportunities.</p>
            <Link className={styles.resume} href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</Link>
          </div>
        </div>
      </div>
      <footer className={styles.footer}><span>Page inspired by The Little Prince</span><span>Hover to reveal · Click to navigate</span></footer>
    </section>
  );
}
