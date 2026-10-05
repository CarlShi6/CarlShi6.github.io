import type { WorkEvidence } from "@/src/data/work-projects";
import { EvidenceFigure } from "./EvidenceFigure";

export function EvidenceGrid({ evidence }: { evidence: readonly WorkEvidence[] }) {
  return (
    <div className="system-evidence-grid" aria-label="Connected product flow evidence">
      {evidence.map((item) => (
        <div className="system-evidence-grid__item" key={item.id}>
          <EvidenceFigure evidence={item} />
        </div>
      ))}
    </div>
  );
}
