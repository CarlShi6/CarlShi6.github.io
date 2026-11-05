import Image from "next/image";
import styles from "./ai-pc-decision-model.module.css";

const stages = [
  ["01", "Needs", "Budget · workload · style", "Begin with the decision the person is trying to make—not hardware terminology."],
  ["02", "Recommendation", "Complete component set", "Translate the stated needs into a build with visible budget and performance context."],
  ["03", "Compatibility", "Socket · power · clearance · fit", "Use explicit rules for the checks that should not depend on a generated explanation."],
  ["04", "Handoff", "Parts and updated total", "Carry the selected configuration into a purchase reference list; retailer checkout remains outside MVP scope."],
] as const;

export function AiPcDecisionModel() {
  return (
    <div className={styles.model}>
      <div className={styles.modelHeader}>
        <span>Decision model · Current working prototype</span>
        <strong>Explain the recommendation. Guard the configuration.</strong>
      </div>
      <ol className={styles.flow}>
        {stages.map(([index, title, signal, description]) => (
          <li key={title}>
            <span>{index}</span>
            <div><small>{signal}</small><h4>{title}</h4><p>{description}</p></div>
            <i aria-hidden="true">→</i>
          </li>
        ))}
      </ol>
      <div className={styles.boundary}>
        <span>Truth boundary</span>
        <p>This diagram reconstructs the verified prototype logic. It does not claim a public launch, integrated retailer checkout, or validated recommendation accuracy.</p>
      </div>
      <details className={styles.evidence}>
        <summary>View original prototype screen <span aria-hidden="true">＋</span></summary>
        <figure>
          <div><Image src="/media/ai-pc-build-advisor/working-recommendation-review.png" alt="Build review showing recommendation reasoning, compatibility checks, and an alternative" fill sizes="(max-width: 980px) 92vw, 58vw" unoptimized /></div>
          <figcaption>Original working prototype · Recommendation, compatibility, and alternatives in one workspace.</figcaption>
        </figure>
      </details>
    </div>
  );
}
