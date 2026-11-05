/* eslint-disable @next/next/no-img-element -- Project artifacts are pre-compressed WebP files; Vinext's image optimizer does not serve these URLs in local/export builds. */
import styles from "./project-case-studies.module.css";
import { HopeOperationsExplorer, HopeRoadmapExplorer, HopeStageIcon } from "./build-hope-interactive";

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
    <a className={styles.hopeExploreLink} href="#build-hope-model">Explore the workflow <span aria-hidden="true">↓</span></a></> : <HopeOperationsExplorer />}
  </div>;
}

export function BuildHopeRoadmap() {
  return <HopeRoadmapExplorer />;
}

export function BuildHopeEvidence({ src, label, note = "Original project artifact · September 2026" }: { src: string; label: string; note?: string }) {
  return <details className={styles.hopeEvidence}><summary>{label}<span aria-hidden="true">＋</span></summary><figure><img src={src} alt={label} loading="lazy" width="1920" height="1080" /><figcaption>{note}</figcaption></figure></details>;
}

export function BuildHopePlatformEvidence() {
  return <figure className={styles.hopeToolEvidence}>
    <div className={styles.hopeToolEvidenceImage}>
      <img src="/media/build-hope-content-operations/hero-operating-model.webp" alt="Original project slide showing Metricool interface references across ideation, planning, publishing, and learning" loading="lazy" width="1920" height="1080" />
      <span>Third-party interface reference</span>
    </div>
    <figcaption>
      <span>Why Metricool fit the proposed system</span>
      <h4>One loop.</h4>
      <ol>
        <li><b>Ideate</b><small>Assist the content backlog</small></li>
        <li><b>Plan</b><small>Coordinate a shared calendar</small></li>
        <li><b>Publish</b><small>Schedule across channels</small></li>
        <li><b>Learn</b><small>Review performance signals</small></li>
      </ol>
      <p>The interfaces shown are third-party product references preserved inside the original team presentation. They demonstrate the evaluated workflow, not a Build Hope account or completed client implementation.</p>
    </figcaption>
  </figure>;
}

const artifacts = [
  ["/media/build-hope-content-operations/platform-evaluation.webp", "Platform evaluation", "The four-platform comparison used in the final delivery."],
  ["/media/build-hope-content-operations/implementation-roadmap.webp", "30-day roadmap", "The proposed five-phase rollout from setup through optimization."],
  ["/media/build-hope-content-operations/hero-operating-model.webp", "Operating-model presentation", "A presentation excerpt connecting ideation, planning, publishing, and learning."],
  ["/media/build-hope-content-operations/content-playbook.webp", "Content playbook", "The reusable content-management sequence delivered to the client."],
  ["/media/build-hope-content-operations/feedback-loop.webp", "Feedback loop", "The learning rhythm designed to inform the next content cycle."],
] as const;

export function BuildHopeArtifactGallery() {
  return <div className={styles.hopeArtifactGallery}>
    {artifacts.map(([src, title, description], index) => <details key={src} className={styles.hopeArtifact} data-featured={index === 0 || index === 1}>
      <summary>
        <img src={src} alt="" loading="lazy" width="1920" height="1080" />
        <span><small>Original project artifact</small><b>{title}</b><i><em>Open evidence</em><em>Close evidence</em></i></span>
      </summary>
      <figure>
        <img src={src} alt={`${title} from the September 2026 Build Hope client delivery`} loading="lazy" width="1920" height="1080" />
        <figcaption>{description}</figcaption>
      </figure>
    </details>)}
    <aside className={styles.hopeEvidenceGap}>
      <span>Evidence boundary</span>
      <p>The available repository does not include a separate CMS screen or individual content-idea examples. Those deliverables remain described in text rather than reconstructed as fake client artifacts.</p>
    </aside>
  </div>;
}
