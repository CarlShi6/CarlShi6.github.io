"use client";

import Link from "next/link";
import type { CSSProperties, PointerEvent } from "react";
import styles from "./skill-objects.module.css";

export const skillObjects = [
  { id: "strategy", name: "Strategy", detail: "Find the direction", image: "strategy.png" },
  { id: "ai", name: "AI & Data", detail: "Connect the signals", image: "ai.png" },
  { id: "design", name: "Design", detail: "Give ideas a shape", image: "design.png" },
  { id: "build", name: "Build", detail: "Make it work", image: "build.png" },
] as const;

export function SkillObject({ index, compact = false, style }: { index: number; compact?: boolean; style?: CSSProperties }) {
  const item = skillObjects[index];
  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch") return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - (event.clientY - box.top) / box.height) * 18}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${((event.clientX - box.left) / box.width - 0.5) * 22}deg`);
  };
  return <Link href="/homepage-poc/projects#skills" className={`${styles.object} ${compact ? styles.compact : ""}`} data-tool={item.id}
    data-cursor-hint={`Explore ${item.name}`} aria-label={`${item.name} — explore skills`} style={style} onPointerMove={move}
    onPointerLeave={(event) => { event.currentTarget.style.setProperty("--tilt-x", "0deg"); event.currentTarget.style.setProperty("--tilt-y", "0deg"); }}>
    {compact && <span className={styles.stem} aria-hidden="true" />}
    <span className={styles.visual} aria-hidden="true">
      <span className={styles.halo} />
      {item.id === "design" ? <span className={styles.paperStage}><span className={styles.paper}>
        <span className={styles.paperCenter} />
        <span className={`${styles.paperWing} ${styles.paperNorth}`} />
        <span className={`${styles.paperWing} ${styles.paperEast}`} />
        <span className={`${styles.paperWing} ${styles.paperSouth}`} />
        <span className={`${styles.paperWing} ${styles.paperWest}`} />
      </span></span> : <img className={styles.artwork} src={`/media/skill-objects/${item.image}`} width="256" height="256" alt="" loading="lazy" decoding="async" />}
      <span className={styles.activation}><i /><i /><i /><i /><i /><i /></span>
      {item.id === "ai" && <span className={styles.coreScan} />}
    </span>
    <span className={styles.label}><strong>{item.name}</strong><small>{item.detail}</small></span>
  </Link>;
}

export function SkillWorkshop({ active, onEnter, onLeave }: { active: boolean; onEnter: () => void; onLeave: () => void }) {
  return <div className={styles.workshop} data-skill-workshop data-open={active} aria-hidden={!active} inert={!active}
    onPointerEnter={onEnter} onPointerLeave={onLeave} onFocus={onEnter}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) onLeave(); }}>
    <div className={styles.heading}><span>How I build</span><strong>Skills</strong><small>Wake a tool. Explore a practice.</small></div>
    <div className={styles.tools}>{skillObjects.map((item, index) => <SkillObject key={item.id} index={index} />)}</div>
  </div>;
}
