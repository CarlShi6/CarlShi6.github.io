"use client";

/* eslint-disable @next/next/no-img-element -- these verified project artifacts are already optimized local WebP exports */
import Link from "next/link";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CsLogo } from "../cs-logo";
import styles from "./build-hope-v2.module.css";

const workflow = [
  ["Content assets", "Collect photos, videos, updates, and quotes."],
  ["Organization", "Tag and store material in a shared library."],
  ["Review", "Select and approve content for each channel."],
  ["Scheduling", "Plan dates across a shared calendar."],
  ["Publishing", "Coordinate the selected social channels."],
  ["Analytics", "Review reach and engagement signals."],
  ["Improvement", "Apply learning to the next content cycle."],
] as const;

const phases = [
  ["Set up", "Days 1–2", 1, 2, "Connect platforms, review recent performance, and establish a baseline."],
  ["Organize", "Days 3–5", 3, 5, "Centralize media, create categories, and tag existing assets."],
  ["Plan", "Days 6–7", 6, 7, "Select content, build the calendar, and review before publishing."],
  ["Execute", "Days 8–21", 8, 21, "Schedule, publish across channels, and monitor reach and engagement."],
  ["Optimize", "Days 22–30", 22, 30, "Compare topics and formats, then apply insights to the next cycle."],
] as const;

const artifacts = [
  ["/media/build-hope-content-operations/platform-evaluation.webp", "Platform evaluation"],
  ["/media/build-hope-content-operations/implementation-roadmap.webp", "30-day roadmap"],
  ["/media/build-hope-content-operations/hero-operating-model.webp", "Operating model"],
  ["/media/build-hope-content-operations/content-playbook.webp", "Content playbook"],
  ["/media/build-hope-content-operations/feedback-loop.webp", "Feedback loop"],
] as const;

const criteria = [
  ["Engagement reports & insights", "Included", "—", "—", "Included"],
  ["Scheduling & auto-publishing", "Included", "—", "Included", "Included"],
  ["AI content assistant", "Included", "—", "Included", "—"],
  ["Affordability", "Included", "Included", "Included", "—"],
] as const;

function SectionLabel({ children }: { children: ReactNode }) {
  return <span className={styles.sectionLabel}>{children}</span>;
}

export function BuildHopeV2Preview() {
  const [stage, setStage] = useState(0);
  const [phase, setPhase] = useState(0);

  return <main className={styles.page}>
    <header className={styles.nav}>
      <Link href="/" className={styles.home} aria-label="Carl Shi — Home"><CsLogo /><span>Home</span></Link>
      <span className={styles.previewFlag}>Local design preview · v2</span>
      <Link href="/homepage-poc/projects/case-studies#build-hope-content-operations" className={styles.allProjects}>← Current case study</Link>
    </header>

    <aside className={styles.rail} aria-label="Build Hope preview sections">
      <p>Content operations system</p>
      <nav>
        <a href="#overview">Overview</a><a href="#challenge">Challenge</a><a href="#evaluation">Tool evaluation</a>
        <a href="#workflow">Operating system</a><a href="#roadmap">30-day roadmap</a><a href="#deliverables">Deliverables</a>
      </nav>
      <small>This prototype preserves the current case study as-is.</small>
    </aside>

    <div className={styles.content}>
      <section id="overview" className={styles.hero}>
        <div className={styles.heroCopy}>
          <SectionLabel>Case study · Product strategy</SectionLabel>
          <h1>Build Hope —<br />Content Operations System</h1>
          <p>Designing a scalable workflow that helps a nonprofit turn community impact into consistent storytelling.</p>
          <ul><li>Content strategy</li><li>Operations design</li><li>Workflow systems</li><li>Nonprofit</li></ul>
          <div className={styles.context}><span>My contribution</span><strong>Product Strategy & Operations Consultant</strong><p>Five-day, four-person client engagement · September 2026</p></div>
        </div>
        <figure className={styles.heroArtifact}>
          <img src="/media/build-hope-content-operations/hero-operating-model.webp" alt="Original Build Hope operating-model presentation artifact" width="1920" height="1080" />
          <figcaption><span>Original project artifact</span><p>Includes third-party Metricool interface references. It is not a Build Hope account or evidence of implementation.</p></figcaption>
        </figure>
      </section>

      <section id="challenge" className={`${styles.section} ${styles.challenge}`}>
        <header><SectionLabel>01 · From challenge to system</SectionLabel><h2>The bottleneck was the workflow—not the stories.</h2><p>Build Hope already had meaningful source material. The constraint was turning it into a sustainable publishing rhythm with limited staff capacity.</p></header>
        <div className={styles.problemFlow}>
          <article><i>01</i><strong>Stories worth sharing</strong><p>Event photos, videos, and community impact.</p></article>
          <article><i>02</i><strong>Limited team capacity</strong><p>Inconsistent publishing and review.</p></article>
          <article><i>03</i><strong>Disconnected tools</strong><p>Assets, planning, and analytics lived apart.</p></article>
          <span aria-hidden="true">→</span>
          <article data-solution><i>04</i><strong>A repeatable operating system</strong><p>Connect content, people, and performance.</p></article>
        </div>
      </section>

      <section id="evaluation" className={`${styles.section} ${styles.evaluation}`}>
        <header><SectionLabel>02 · Tool evaluation</SectionLabel><h2>Choose for the operating constraints—not the longest feature list.</h2><p>The team explored eight platforms; the final delivery compared four. I personally tested Buffer, Metricool, and Monday.com.</p></header>
        <div className={styles.evaluationGrid}>
          <div className={styles.matrixWrap}>
            <table><caption>Qualitative presence / absence matrix from the final delivery</caption><thead><tr><th>Verified criterion</th><th data-choice>Metricool</th><th>Monday.com</th><th>Buffer</th><th>Agorapulse</th></tr></thead><tbody>{criteria.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell}>{cell}</th> : <td key={`${row[0]}-${index}`} data-choice={index === 1}>{cell}</td>)}</tr>)}</tbody></table>
            <p className={styles.recommendation}><strong>Recommendation:</strong> Metricool, based on analytics, workflow fit, and cost.</p>
          </div>
          <figure className={styles.largeArtifact}><img src="/media/build-hope-content-operations/platform-evaluation.webp" alt="Original four-platform evaluation artifact" width="1920" height="1080" /><figcaption>Original project artifact · September 2026</figcaption></figure>
        </div>
      </section>

      <section id="workflow" className={`${styles.section} ${styles.workflow}`}>
        <header><SectionLabel>03 · The operating system</SectionLabel><h2>A seven-stage system connects assets to learning.</h2><p>Every stage remains visible. Select one to inspect its role without losing the full flow.</p></header>
        <div className={styles.workflowRail} role="tablist" aria-label="Seven-stage proposed operating workflow">
          {workflow.map((item, index) => <button key={item[0]} type="button" role="tab" aria-selected={stage === index} aria-controls="workflow-detail" onClick={() => setStage(index)} onKeyDown={(event) => { if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? workflow.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + workflow.length) % workflow.length; setStage(next); event.currentTarget.parentElement?.querySelectorAll('button')[next]?.focus(); }}><span>{String(index + 1).padStart(2,"0")}</span><i aria-hidden="true">{["A","O","R","S","P","L","I"][index]}</i><strong>{item[0]}</strong></button>)}
        </div>
        <div id="workflow-detail" className={styles.workflowDetail} role="tabpanel"><span>{String(stage + 1).padStart(2,"0")} / 07 · Proposed workflow</span><strong>{workflow[stage][0]}</strong><p>{workflow[stage][1]}</p><small>Recommendation—not evidence of client implementation.</small></div>
      </section>

      <section id="roadmap" className={`${styles.section} ${styles.roadmap}`}>
        <header><SectionLabel>04 · 30-day roadmap</SectionLabel><h2>Build the foundation before increasing the publishing load.</h2><p>A phased implementation plan moves from setup to a first learning cycle.</p></header>
        <div className={styles.roadmapGrid}>
          <div className={styles.gantt} role="list" aria-label="Proposed 30-day implementation phases">
            <div className={styles.weekAxis} aria-hidden="true"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div>
            {phases.map((item, index) => <button key={item[0]} type="button" data-active={phase === index} aria-pressed={phase === index} onClick={() => setPhase(index)}><span><b>0{index + 1} · {item[0]}</b><small>{item[1]}</small></span><i style={{ "--start": item[2], "--span": item[3] - item[2] + 1 } as CSSProperties} /></button>)}
          </div>
          <aside className={styles.phaseDetail}><span>{phases[phase][1]} · Proposed</span><h3>{phases[phase][0]}</h3><p>{phases[phase][4]}</p><figure><img src="/media/build-hope-content-operations/implementation-roadmap.webp" alt="Original 30-day implementation roadmap artifact" width="1920" height="1080" /><figcaption>Original project artifact</figcaption></figure></aside>
        </div>
      </section>

      <section id="deliverables" className={`${styles.section} ${styles.deliverables}`}>
        <header><SectionLabel>05 · Deliverables</SectionLabel><h2>The handoff, preserved as project artifacts.</h2><p>Open any artifact to inspect the original source. No missing CMS screens or sample posts have been reconstructed.</p></header>
        <div className={styles.gallery}>{artifacts.map(([src,title]) => <details key={src}><summary><img src={src} alt="" width="640" height="360" /><span><small>Original project artifact</small><strong>{title}</strong></span></summary><figure><img src={src} alt={`${title} original project artifact`} width="1920" height="1080" /><figcaption>Preserved evidence from the September 2026 delivery.</figcaption></figure></details>)}</div>
      </section>

      <footer className={styles.boundary}><strong>Evidence boundary</strong><p>The engagement delivered a recommendation, roadmap, and playbook. The available evidence does not establish full implementation, causal engagement improvement, or the fictional analytics shown in the supplied visual reference.</p><Link href="/homepage-poc/projects/case-studies#build-hope-content-operations">Compare with the current case study →</Link></footer>
    </div>
  </main>;
}
