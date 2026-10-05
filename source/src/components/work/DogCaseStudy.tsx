import type { WorkProject } from "@/src/data/work-projects";
import { CompactSummary } from "./CompactSummary";
import { EvidenceFigure } from "./EvidenceFigure";
import { WorkIcon, type WorkIconName } from "./WorkIcon";

const factIcons: readonly WorkIconName[] = ["role", "prototype", "scope", "technology"];
const observationIcons: readonly WorkIconName[] = ["research", "decision", "result"];
const capabilityIcons: readonly WorkIconName[] = ["research", "conversation", "result"];
const technicalIcons: readonly WorkIconName[] = ["prototype", "technology", "result"];

export function DogCaseStudy({ project, headingId }: { project: WorkProject; headingId?: string }) {
  const detail = project.dogCaseStudy;
  if (!detail) return null;

  const facts = [
    ["Role", project.role],
    ["Status", detail.status],
    ["Scope", detail.scope],
    ["Technology", detail.technology],
  ] as const;

  const observationSummary = detail.observationSummary.map((item, index) => ({
    ...item,
    icon: observationIcons[index],
  }));

  const technicalSummary = detail.technicalSummary.map((item, index) => ({
    ...item,
    icon: ["constraint", "decision", "result"][index] as WorkIconName,
  }));

  return (
    <article className="project-card project-card--visual-case-study project-card--dog-case-study">
      <section className="case-density-section dog-overview" id={`${project.slug}-overview`}>
        <div className="dog-overview__grid">
          <header className="dog-overview__copy">
            <div className="project-index">
              <span>{project.number} / 03</span>
              <span>{project.category}</span>
            </div>
            <h2 id={headingId}>{project.title}</h2>
            <p className="project-problem">{detail.openingProblem}</p>
          </header>

          <div className="dog-overview__visual" aria-label="Concept and prototype evidence">
            <div className="dog-overview__concept">
              <EvidenceFigure evidence={detail.heroConcept} priority />
            </div>
            <div className="dog-overview__prototype">
              <EvidenceFigure evidence={detail.heroPrototype} priority />
            </div>
          </div>
        </div>

        <dl className="visual-case-study-facts" aria-label={`${project.title} project facts`}>
          {facts.map(([label, value], index) => (
            <div key={label}>
              <dt><WorkIcon name={factIcons[index]} />{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="case-density-section dog-observation"
        id={`${project.slug}-observation`}
        aria-labelledby={`${project.slug}-observation-title`}
      >
        <div className="dog-chapter-heading">
          <p className="case-study-chapter-label">Observation &amp; product framing</p>
          <h3 id={`${project.slug}-observation-title`}>Observe interaction rhythms</h3>
          <p>{detail.observationBody}</p>
        </div>

        <div className="dog-observation__layout">
          <ol className="dog-observed-timeline" aria-label="Moments from one recorded day">
            {detail.timeline.map((moment, index) => (
              <li key={moment.phase}>
                <span className="dog-observed-timeline__index">0{index + 1}</span>
                <h4>{moment.phase}</h4>
                <dl>
                  <div><dt>Owner</dt><dd>{moment.owner}</dd></div>
                  <div><dt>Dog</dt><dd>{moment.dog}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
          <CompactSummary items={observationSummary} label="Observation and product framing summary" />
        </div>
      </section>

      <section
        className="case-density-section dog-concept"
        id={`${project.slug}-concept`}
        aria-labelledby={`${project.slug}-concept-title`}
      >
        <div className="dog-chapter-heading dog-chapter-heading--split">
          <div>
            <p className="case-study-chapter-label">System concept</p>
            <h3 id={`${project.slug}-concept-title`}>Translate needs into modules</h3>
          </div>
          <p>{detail.conceptBody}</p>
        </div>

        <ol className="dog-capabilities" aria-label="Connected product capabilities">
          {detail.capabilities.map((capability, index) => (
            <li key={capability.title}>
              <WorkIcon name={capabilityIcons[index]} size={19} />
              <div>
                <h4>{capability.title}</h4>
                <p>{capability.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="dog-concept-evidence" aria-label="System concept evidence">
          {detail.conceptEvidence.map((evidence, index) => (
            <div className={index === 3 ? "dog-concept-evidence__assembly" : undefined} key={evidence.id}>
              <EvidenceFigure evidence={evidence} />
            </div>
          ))}
        </div>
      </section>

      <section
        className="case-density-section dog-technical"
        id={`${project.slug}-technical`}
        aria-labelledby={`${project.slug}-technical-title`}
      >
        <div className="dog-technical__heading">
          <div>
            <p className="case-study-chapter-label">Technical prototype</p>
            <h3 id={`${project.slug}-technical-title`}>See, interpret, respond</h3>
          </div>
          <div>
            <p className="dog-technical__statement">{detail.technicalStatement}</p>
            <p className="dog-technical__body">{detail.technicalBody}</p>
          </div>
        </div>

        <ol className="dog-technical-sequence" aria-label="Technical prototype sequence">
          {detail.technicalStages.map((stage, index) => (
            <li key={stage.title}>
              <header>
                <span>0{index + 1}</span>
                <WorkIcon name={technicalIcons[index]} size={20} />
                <div>
                  <h4>{stage.title}</h4>
                  <p>{stage.body}</p>
                </div>
              </header>
              <div className={`dog-technical-sequence__evidence${stage.evidence.length > 1 ? " is-paired" : ""}`}>
                {stage.evidence.map((evidence) => <EvidenceFigure evidence={evidence} key={evidence.id} />)}
              </div>
            </li>
          ))}
        </ol>

        <CompactSummary items={technicalSummary} label="Technical prototype decision summary" />
      </section>

      <section
        className="case-density-section dog-outcome"
        id={`${project.slug}-outcome`}
        aria-labelledby={`${project.slug}-outcome-title`}
      >
        <div className="dog-chapter-heading dog-chapter-heading--split">
          <div>
            <p className="case-study-chapter-label">Outcome &amp; next validation</p>
            <h3 id={`${project.slug}-outcome-title`}>Separate the demonstrated system from the product concept</h3>
          </div>
          <p>{detail.outcomeBody}</p>
        </div>

        <div className="dog-render-strip" aria-label="Four concept render views">
          {detail.outcomeViews.map((evidence) => <EvidenceFigure evidence={evidence} key={evidence.id} />)}
        </div>

        <div className="dog-outcome__evidence">
          <EvidenceFigure evidence={detail.outcomeScenario} />
          <EvidenceFigure evidence={detail.outcomePrototype} />
        </div>

        <div className="dog-outcome__summary">
          <article>
            <WorkIcon name="shipped" size={20} />
            <p className="case-study-chapter-label">Functionally demonstrated</p>
            <p>{detail.demonstrated}</p>
          </article>
          <article>
            <WorkIcon name="deferred" size={20} />
            <p className="case-study-chapter-label">Remained concept</p>
            <p>{detail.remainedConcept}</p>
          </article>
          <article>
            <WorkIcon name="validation" size={20} />
            <p className="case-study-chapter-label">Next validation</p>
            <ul>
              {detail.nextValidation.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
      </section>
    </article>
  );
}
