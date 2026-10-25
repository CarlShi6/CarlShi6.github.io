import styles from "./project-case-studies.module.css";
import { HopeWorkflowExplorer, HopeRoadmapExplorer, HopeStageIcon } from "./build-hope-interactive";

export function BuildHopeBlueprint({ compact = false }: { compact?: boolean }) {
  return <div className={styles.hopeBlueprint} data-compact={compact}>
    <span className={styles.hopeEyebrow}>Proposed content operations system</span>
    {compact && <h3>From community impact<br />to consistent storytelling.</h3>}
    {compact ? <><ol className={styles.hopePipeline}>
      {[
        ["Ideate", "Story backlog", "Identify stories worth sharing."],
        ["Plan", "Shared calendar", "Organize assets, dates, and review."],
        ["Publish", "Scheduled content", "Coordinate publishing across channels."],
        ["Learn", "Next-cycle insights", "Review signals and inform the next plan."],
      ].map(([title], i) => <li key={title}><HopeStageIcon stage={i}/><h4>{title}</h4></li>)}
    </ol>
    <a className={styles.hopeExploreLink} href="#build-hope-model">Explore the workflow <span aria-hidden="true">↓</span></a></> : <HopeWorkflowExplorer />}
  </div>;
}

export function BuildHopeRoadmap() {
  return <HopeRoadmapExplorer />;
}

export function BuildHopeEvidence({ src, label }: { src: string; label: string }) {
  return <details className={styles.hopeEvidence}><summary>{label}<span aria-hidden="true">＋</span></summary><figure><img src={src} alt={label} loading="lazy" width="1920" height="1080" /><figcaption>Original client delivery slide · September 2026</figcaption></figure></details>;
}
