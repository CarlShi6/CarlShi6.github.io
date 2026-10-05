import Image from "next/image";
import type { WorkEvidence } from "@/src/data/work-projects";

export function EvidenceFigure({
  evidence,
  priority = false,
}: {
  evidence: WorkEvidence;
  priority?: boolean;
}) {
  return (
    <figure
      className={`work-evidence${evidence.focus ? ` work-evidence--${evidence.focus}` : ""}`}
      id={`evidence-${evidence.id}`}
    >
      <div className="work-evidence-media">
        <Image
          alt={evidence.alt}
          height={evidence.height}
          priority={priority}
          sizes="(max-width: 760px) 100vw, (max-width: 1240px) 76vw, 980px"
          src={evidence.src}
          unoptimized
          width={evidence.width}
        />
      </div>
      <figcaption>{evidence.caption}</figcaption>
    </figure>
  );
}
