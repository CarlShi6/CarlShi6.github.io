import type { WorkEvidence } from "@/src/data/work-projects";
import { EvidenceFigure } from "./EvidenceFigure";

export function EvidenceSequence({
  evidence,
  variant = "split",
}: {
  evidence: readonly WorkEvidence[];
  variant?: "split" | "pair";
}) {
  return (
    <div className={`work-evidence-sequence work-evidence-sequence--${variant}`}>
      {evidence.map((item) => <EvidenceFigure evidence={item} key={item.id} />)}
    </div>
  );
}
