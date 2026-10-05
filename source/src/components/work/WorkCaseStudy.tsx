import type { WorkProject } from "@/src/data/work-projects";
import { DecisionSplit } from "./DecisionSplit";
import { EvidenceFigure } from "./EvidenceFigure";
import { EvidenceGrid } from "./EvidenceGrid";
import { WorkIcon, type WorkIconName } from "./WorkIcon";

const factIcons: readonly WorkIconName[] = ["role", "prototype", "scope", "technology"];
const executionIcons: readonly WorkIconName[] = ["recommendation", "scope", "compare", "readiness"];
const outcomeIcons: readonly WorkIconName[] = ["shipped", "scope", "technology"];
const validationIcons: readonly WorkIconName[] = ["recommendation", "compare", "validation"];

export function WorkCaseStudy({ project, headingId }: { project: WorkProject; headingId?: string }) {
  const detail = project.workCaseStudy;
  if (!detail) return null;

  const facts = [
    ["Role", project.role],
    ["Status", project.status],
    ["Scope", detail.scope],
    ["Technology", detail.technology],
  ] as const;

  return (
    <article className="project-card project-card--visual-case-study">
      <section className="case-density-section case-overview" id={`${project.slug}-overview`}>
        <div className="case-overview__grid">
          <header className="visual-case-study-opening">
            <div className="project-index">
              <span>{project.number} / 03</span>
              <span>{project.category}</span>
            </div>
            <h2 id={headingId}>{project.title}</h2>
            <p className="project-problem">{project.problem}</p>
          </header>
          <div className="visual-case-study-hero">
            <EvidenceFigure evidence={detail.hero} priority />
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
        className="case-density-section case-strategy"
        id={`${project.slug}-strategy`}
        aria-labelledby={`${project.slug}-thesis`}
      >
        <div className="case-strategy__copy">
          <p className="case-study-chapter-label">Insight &amp; strategy</p>
          <h3 id={`${project.slug}-thesis`}>Keep the decision visible</h3>
          <p className="case-strategy__thesis">{detail.thesis}</p>
          <p className="case-strategy__body">{detail.strategyBody}</p>
        </div>
        <EvidenceFigure evidence={detail.strategyEvidence} />
      </section>

      <section
        className="case-density-section case-system"
        id={`${project.slug}-system`}
        aria-labelledby={`${project.slug}-system-title`}
      >
        <div className="case-section-heading">
          <p className="case-study-chapter-label">System overview</p>
          <h3 id={`${project.slug}-system-title`}>One build context, four visible states</h3>
          <p>{detail.systemBody}</p>
        </div>
        <EvidenceGrid evidence={detail.systemEvidence} />
      </section>

      <section
        className="case-density-section case-decisions"
        id={`${project.slug}-decisions`}
        aria-label={`${project.title} product decisions`}
      >
        <div className="case-decisions__list">
          {detail.decisions.map((decision, index) => (
            <DecisionSplit
              decision={decision}
              index={index}
              key={decision.title}
              projectSlug={project.slug}
            />
          ))}
        </div>
      </section>

      <section
        className="case-density-section case-execution"
        id={`${project.slug}-execution`}
        aria-labelledby={`${project.slug}-technical-execution`}
      >
        <div className="case-execution__copy">
          <p className="case-study-chapter-label">Execution &amp; tradeoffs</p>
          <h3 id={`${project.slug}-technical-execution`}>Keep component actions tied to the build</h3>
          <p>{detail.executionBody}</p>
        </div>
        <ol className="technical-execution-sequence" aria-label="Technical execution sequence">
          {detail.executionSummary.map((stage, index) => (
            <li key={stage.label}>
              <WorkIcon name={executionIcons[index]} size={18} />
              <div>
                <h4>{stage.label}</h4>
                <p>{stage.value}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="case-density-section visual-case-study-conclusion"
        id={`${project.slug}-outcome`}
        aria-labelledby={`${project.slug}-outcome-title`}
      >
        <div className="case-section-heading case-section-heading--compact">
          <p className="case-study-chapter-label">Shipped outcome &amp; next validation</p>
          <h3 id={`${project.slug}-outcome-title`}>What exists now, and what comes next</h3>
        </div>

        <div className="work-conclusion-pair">
          <article className="work-conclusion-card" aria-labelledby={`${project.slug}-current-outcome`}>
            <p className="case-study-chapter-label">Current outcome</p>
            <h4 id={`${project.slug}-current-outcome`}>Working prototype</h4>
            <p className="work-conclusion-card__copy">{detail.outcome}</p>
            <ul className="work-conclusion-signals" aria-label="Current outcome signals">
              {detail.outcomeSignals.map((signal, index) => (
                <li key={signal}>
                  <WorkIcon name={outcomeIcons[index]} size={18} />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="work-conclusion-card" aria-labelledby={`${project.slug}-next-validation`}>
            <p className="case-study-chapter-label">Next validation</p>
            <h4 id={`${project.slug}-next-validation`}>Validate decision confidence</h4>
            <p className="work-conclusion-card__copy">{detail.nextValidation}</p>
            <ul className="work-conclusion-signals" aria-label="Next validation signals">
              {detail.validationSignals.map((signal, index) => (
                <li key={signal}>
                  <WorkIcon name={validationIcons[index]} size={18} />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </article>
  );
}
