import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/src/data/portfolio";

export function ProjectPreviewCard({ project }: { project: Project }) {
  return (
    <article className="project-entry">
      <Link
        className="project-entry-link"
        href={`/work#${project.slug}`}
        aria-label={`View ${project.title} case study`}
      >
        <div className={`project-entry-visual${project.imageFit === "contain" ? " is-contain" : ""}`}>
          <span className="project-entry-number">{project.number}</span>
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1600}
            height={1100}
            sizes="(max-width: 760px) 100vw, 70vw"
            unoptimized
          />
        </div>
        <div className="project-entry-content">
          <p>{project.category}</p>
          <h3>{project.title}</h3>
          <p className="project-entry-summary">{project.summary}</p>
          <span className="project-entry-action">
            View project <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
