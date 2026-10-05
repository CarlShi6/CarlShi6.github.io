import { ProjectGallery } from "./ProjectGallery";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function SelectedProjects() {
  return (
    <section className="section projects" id="work" aria-labelledby="projects-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Selected work"
            title="Products shaped around consequential decisions."
            description="Selected case studies in AI products, connected systems, and experience design."
            headingId="projects-title"
          />
        </Reveal>
        <ProjectGallery />
      </div>
    </section>
  );
}
