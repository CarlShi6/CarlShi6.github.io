"use client";

/* eslint-disable @next/next/no-img-element -- local Vinext image optimization returns 404 for these project artifacts */

import Link from "next/link";
import { useState } from "react";
import { projectPlanets, skillSpacecraft, type SpaceSystemItem } from "./space-system.data";
import styles from "./dark-dual-system.module.css";

type ActiveSystem = "projects" | "skills" | null;

export function DarkGravityField() {
  return (
    <div className={styles.staticField} aria-hidden="true">
      <svg viewBox="0 0 1440 824" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gravity-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#345d75" stopOpacity="0" />
            <stop offset="0.62" stopColor="#79b8d5" stopOpacity=".48" />
            <stop offset="1" stopColor="#e5f8ff" stopOpacity=".78" />
          </linearGradient>
          <linearGradient id="gravity-right" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#345d75" stopOpacity="0" />
            <stop offset="0.62" stopColor="#79b8d5" stopOpacity=".48" />
            <stop offset="1" stopColor="#e5f8ff" stopOpacity=".78" />
          </linearGradient>
          <filter id="gravity-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="star" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f4fbff" /><stop offset="1" stopColor="#8ec8df" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className={styles.streamGlow} filter="url(#gravity-glow)">
          <path data-weight="primary" stroke="url(#gravity-left)" d="M-40 150C220 88 410 92 548 234C610 298 570 350 638 385" />
          <path data-weight="primary" stroke="url(#gravity-left)" d="M-55 675C224 735 414 690 550 568C612 512 574 458 640 425" />
          <path data-weight="primary" stroke="url(#gravity-right)" d="M1480 158C1210 92 1028 94 892 236C832 300 870 350 802 386" />
          <path data-weight="primary" stroke="url(#gravity-right)" d="M1490 670C1212 730 1028 688 892 568C830 512 866 459 800 426" />
        </g>
        <g className={styles.streamLines}>
          <path stroke="url(#gravity-left)" d="M-30 205C238 142 430 150 560 270C605 312 592 350 642 389" />
          <path stroke="url(#gravity-left)" d="M-20 610C242 676 426 640 558 544C608 508 592 466 643 423" />
          <path stroke="url(#gravity-right)" d="M1470 212C1205 144 1015 150 884 270C838 312 850 350 798 389" />
          <path stroke="url(#gravity-right)" d="M1470 608C1200 674 1016 638 884 544C836 508 850 466 797 423" />
          <path className={styles.innerArc} d="M516 245C617 171 754 165 837 246C893 302 866 358 812 388" />
          <path className={styles.innerArc} d="M922 573C823 647 688 653 602 575C546 523 572 465 630 431" />
        </g>
        <g className={styles.sparseStars} fill="url(#star)">
          <circle cx="126" cy="128" r="3" /><circle cx="338" cy="704" r="4" /><circle cx="472" cy="112" r="2.5" />
          <circle cx="968" cy="108" r="3" /><circle cx="1124" cy="718" r="3.5" /><circle cx="1320" cy="302" r="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Satellite() {
  return (
    <svg className={styles.satellite} viewBox="0 0 240 180" role="img" aria-label="Product Strategy satellite">
      <defs>
        <linearGradient id="satellite-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9edf3" />
          <stop offset="0.55" stopColor="#5d7d89" />
          <stop offset="1" stopColor="#17252d" />
        </linearGradient>
        <linearGradient id="solar-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#80b8cf" />
          <stop offset="1" stopColor="#16394a" />
        </linearGradient>
      </defs>
      <g className={styles.satelliteOrbit}>
        <path className={styles.orbitLine} d="M18 93c42-70 160-86 205-19 31 46-36 94-106 91-62-2-116-38-99-72Z" />
        <circle className={styles.signalDot} cx="22" cy="88" r="3" />
      </g>
      <g className={styles.satelliteBody}>
        <path d="m93 74 27-19 29 18-2 38-28 16-29-19Z" fill="url(#satellite-body)" />
        <circle cx="119" cy="91" r="12" fill="#d8eef4" opacity=".88" />
        <circle cx="119" cy="91" r="5" fill="#2a647b" />
        <path d="m91 84-45-18-7 30 51 6m59-17 47-14 6 31-55 1" fill="url(#solar-panel)" stroke="#9ac2d1" strokeWidth="2" />
        <path d="m49 69-6 24m18-20-6 24m112-20 5 22m12-25 5 22M98 118l-13 27m38-18 3 30m14-40 19 24" fill="none" stroke="#9fb8c2" strokeWidth="3" />
        <path d="M109 59 99 34m20 21V28m11 32 11-25" fill="none" stroke="#c3dce5" strokeWidth="2" />
      </g>
    </svg>
  );
}

function MiniCraft({ item }: { item: SpaceSystemItem }) {
  return (
    <span className={styles.miniCraft} data-visual={item.visual} aria-hidden="true">
      <OrbitalTitle id={item.id} title={item.title} compact />
      <i /><i /><i /><i /><b />
    </span>
  );
}

function OrbitalTitle({ id, title, compact = false }: { id: string; title: string; compact?: boolean }) {
  const pathId = `orbit-title-${id}`;
  return (
    <svg className={`${styles.orbitalTitle}${compact ? ` ${styles.compactOrbitalTitle}` : ""}`} viewBox="0 0 200 200" aria-hidden="true">
      <defs><path id={pathId} d="M25 105 A77 77 0 0 1 175 105" /></defs>
      <text><textPath href={`#${pathId}`} startOffset="50%">{title}</textPath></text>
    </svg>
  );
}

function SystemCopy({ item, side }: { item: SpaceSystemItem; side: "left" | "right" }) {
  return (
    <span className={styles.copy} data-side={side}>
      <span className={styles.eyebrow}>{item.eyebrow}</span>
      <strong>{item.title}</strong>
      <span className={styles.summary}>{item.summary}</span>
      <span className={styles.detail}>{item.detail}</span>
      <span className={styles.action}>Open {side === "left" ? "case study" : "skills"} <i aria-hidden="true">↗</i></span>
    </span>
  );
}

export function DarkDualSystem({ onActiveChange }: { onActiveChange?: (active: ActiveSystem) => void }) {
  const project = projectPlanets.find((item) => item.phase === "mvp")!;
  const skill = skillSpacecraft.find((item) => item.phase === "mvp")!;
  const [active, setActive] = useState<ActiveSystem>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activate = (next: ActiveSystem, id: string | null = null) => {
    setActive(next);
    setActiveId(id);
    onActiveChange?.(next);
  };

  return (
    <div className={styles.system} data-active={active ?? ""} data-active-id={activeId ?? ""}>
      <div className={styles.mobileIdentity}>
        <span>Design × Business × Technology</span>
        <strong>Carl Shi</strong>
        <p>I build at the intersection of AI, product, design, and technology. Currently exploring Product, Technical PM, and AI Product opportunities.</p>
        <div className={styles.mobileActions}>
          <Link className={styles.mobileResume} href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</Link>
        </div>
        <span className={styles.mobileGuidance}>Tap an object to explore</span>
      </div>

      <div className={styles.axis} aria-hidden="true"><span>PROJECT ORBIT</span><i /><span>SKILL CONSTELLATION</span></div>
      <h2 className={`${styles.systemLabel} ${styles.projectSystemLabel}`}>Projects</h2>

      <Link
        href={project.href}
        className={`${styles.node} ${styles.projectNode}`}
        data-selected={activeId === project.id}
        aria-label={`${project.title}: ${project.summary}. Open case study.`}
        data-cursor-hint="Open AI PC case study"
        onPointerEnter={() => activate("projects", project.id)}
        onPointerLeave={() => activate(null)}
        onFocus={() => activate("projects", project.id)}
        onBlur={() => activate(null)}
      >
        <span className={styles.nodeLabel}><small>01 / Projects</small><b>{project.title}</b></span>
        <span className={styles.planetStage} aria-hidden="true">
          <OrbitalTitle id={project.id} title={project.title} />
          <span className={styles.planetOrbit}><i /></span>
          <span className={styles.planet}>
            <img src={project.image!} alt="" width="256" height="256" fetchPriority="high" />
          </span>
        </span>
        <SystemCopy item={project} side="left" />
      </Link>

      <div className={`${styles.orbitCollection} ${styles.projectCollection}`} aria-label="More featured projects">
        {projectPlanets.filter((item) => item.id !== project.id).map((item, index) => (
          <Link key={item.id} href={item.href} className={`${styles.orbitNode} ${styles.projectOrbiter}`}
            data-slot={index + 1} data-selected={activeId === item.id}
            aria-label={`${item.title}: ${item.summary}. Open case study.`} data-cursor-hint={`Open ${item.title}`}
            onPointerEnter={() => activate("projects", item.id)} onPointerLeave={() => activate(null)}
            onFocus={() => activate("projects", item.id)} onBlur={() => activate(null)}>
            <span className={styles.orbiterVisual} aria-hidden="true">
              <OrbitalTitle id={item.id} title={item.title} compact />
              <span className={styles.orbiterPlanet}><img src={item.image!} alt="" width="160" height="160" loading="lazy" /></span>
            </span>
            <span className={styles.orbiterLabel}><small>0{index + 2}</small><strong>{item.title}</strong></span>
            <span className={styles.orbiterSummary}>{item.summary}<i>Open case study ↗</i></span>
            {activeId === item.id && <SystemCopy item={item} side="left" />}
          </Link>
        ))}
      </div>

      <h2 className={`${styles.systemLabel} ${styles.skillSystemLabel}`}>Skills</h2>
      <Link
        href={skill.href}
        className={`${styles.node} ${styles.skillNode}`}
        data-selected={activeId === skill.id}
        aria-label={`${skill.title}: ${skill.summary}. Open skills.`}
        data-cursor-hint="Explore product strategy"
        onPointerEnter={() => activate("skills", skill.id)}
        onPointerLeave={() => activate(null)}
        onFocus={() => activate("skills", skill.id)}
        onBlur={() => activate(null)}
      >
        <span className={styles.nodeLabel}><small>01 / Skills</small><b>{skill.title}</b></span>
        <span className={styles.spacecraftStage} aria-hidden="true">
          <OrbitalTitle id={skill.id} title={skill.title} />
          <Satellite />
        </span>
        <SystemCopy item={skill} side="right" />
      </Link>

      <div className={`${styles.orbitCollection} ${styles.skillCollection}`} aria-label="More core skills">
        {skillSpacecraft.filter((item) => item.id !== skill.id).map((item, index) => (
          <Link key={item.id} href={item.href} className={`${styles.orbitNode} ${styles.skillOrbiter}`}
            data-slot={index + 1} data-selected={activeId === item.id}
            aria-label={`${item.title}: ${item.summary}. Open skills.`} data-cursor-hint={`Explore ${item.title}`}
            onPointerEnter={() => activate("skills", item.id)} onPointerLeave={() => activate(null)}
            onFocus={() => activate("skills", item.id)} onBlur={() => activate(null)}>
            <MiniCraft item={item} />
            <span className={styles.orbiterLabel}><small>0{index + 2}</small><strong>{item.title}</strong></span>
            <span className={styles.orbiterSummary}>{item.summary}<i>Explore skills ↗</i></span>
            {activeId === item.id && <SystemCopy item={item} side="right" />}
          </Link>
        ))}
      </div>

    </div>
  );
}
