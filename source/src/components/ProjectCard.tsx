import Image from "next/image";
import type { WorkProject } from "@/src/data/work-projects";
import { Reveal } from "./Reveal";
import { DogCaseStudy } from "./work/DogCaseStudy";
import { WorkCaseStudy } from "./work/WorkCaseStudy";

export function ProjectCard({ project, headingId }: { project: WorkProject; headingId?: string }) {
  if (project.workCaseStudy) {
    return <WorkCaseStudy project={project} headingId={headingId} />;
  }

  if (project.dogCaseStudy) {
    return <DogCaseStudy project={project} headingId={headingId} />;
  }

  return (
    <article className={`project-card${project.reversed ? " is-reversed" : ""}`}>
      <Reveal>
        <div className={`project-visual${project.imageFit === "contain" ? " is-contain" : ""}`}>
          <span className="project-label">{project.imageLabel}</span>
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1600}
            height={1100}
            sizes="(max-width: 760px) 100vw, 65vw"
            unoptimized
          />
        </div>
      </Reveal>
      <div className="project-content">
        <Reveal staggerIndex={0} stagger={60}>
          <div className="project-index">
            <span>{project.number} / 03</span>
            <span>{project.category}</span>
          </div>
        </Reveal>
        <Reveal staggerIndex={1} stagger={60}>
          <h2 id={headingId}>{project.title}</h2>
        </Reveal>
        <Reveal staggerIndex={2} stagger={60}>
          <p className="project-problem">{project.problem}</p>
        </Reveal>
        <Reveal staggerIndex={3} stagger={60}>
          <dl className="project-facts">
            <div><dt>My role</dt><dd>{project.role}</dd></div>
            <div><dt>Contribution</dt><dd>{project.contribution}</dd></div>
            <div><dt>Status</dt><dd>{project.status}</dd></div>
          </dl>
        </Reveal>
        <Reveal staggerIndex={4} stagger={60}>
          <ul className="tag-list" aria-label={`${project.title} disciplines`}>
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        </Reveal>
      </div>
    </article>
  );
}
