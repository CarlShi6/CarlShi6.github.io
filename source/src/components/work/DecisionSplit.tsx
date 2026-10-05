import type { WorkDecision } from "@/src/data/work-projects";
import { CompactSummary } from "./CompactSummary";
import { EvidenceSequence } from "./EvidenceSequence";

export function DecisionSplit({
  decision,
  index,
  projectSlug,
}: {
  decision: WorkDecision;
  index: number;
  projectSlug: string;
}) {
  const summary = [
    { label: "Constraint", value: decision.summary.constraint, icon: "constraint" as const },
    { label: "Decision", value: decision.summary.decision, icon: "decision" as const },
    { label: "Result", value: decision.summary.result, icon: "result" as const },
  ];

  return (
    <section
      className={`decision-split${decision.evidence.length > 1 ? " decision-split--pair" : ""}`}
      aria-labelledby={`${projectSlug}-decision-${index + 1}`}
    >
      <div className="decision-split__copy">
        <p className="case-study-chapter-label">Decision {String(index + 1).padStart(2, "0")}</p>
        <h4 id={`${projectSlug}-decision-${index + 1}`}>{decision.title}</h4>
        <p className="decision-split__statement">{decision.statement}</p>
        <p className="decision-split__body">{decision.body}</p>
        <CompactSummary items={summary} label={`${decision.title} decision summary`} />
      </div>
      <EvidenceSequence
        evidence={decision.evidence}
        variant={decision.evidence.length > 1 ? "pair" : "split"}
      />
    </section>
  );
}
