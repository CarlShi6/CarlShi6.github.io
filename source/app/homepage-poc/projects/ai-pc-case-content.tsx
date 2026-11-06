import Image from 'next/image';
import Link from 'next/link';
import { aiPcCase, aiPcTour } from './ai-pc-content';
import styles from './ai-pc-case-content.module.css';

const modelComparison = [
  ['Case type', 'Mesh mid-tower', 'Dual-chamber', 'Dual-chamber'],
  ['Glass panels', 'Side', 'Front + side', 'Front + side'],
  ['GPU fan count', '3 · guessed', 'Unknown', 'Not visible'],
  ['Top case fans', '3 · radiator fans', '0', '0'],
];
const feedback = [
  { label: 'Single read, streamed', seconds: 10.8 },
  { label: '+ Fast appearance read', seconds: 5.6 },
  { label: '+ PC check in parallel', seconds: 2.5 },
];

export function AiPcCaseContent() {
  return <div className={styles.case}>
    <p className={styles.note}>Local beta screenshots · Showcase sample · Illustrative 3D model; proportions estimated.</p>

    <section className={styles.section} aria-labelledby="aipc-opportunity">
      <span className={styles.eyebrow}>01 · Product framing</span>
      <h3 id="aipc-opportunity">Start with the PC someone wants to build.</h3>
      <p>{aiPcCase.problem}</p>
      <ol className={styles.flow} aria-label="Photo-to-build experience">
        {['Photo', 'Appearance', '3D draft', 'Candidates', 'User confirms', 'Studio + plan'].map((step, index) => <li key={step}><small>{String(index + 1).padStart(2, '0')}</small>{step}</li>)}
      </ol>
    </section>

    <section className={styles.section} aria-labelledby="aipc-tour">
      <span className={styles.eyebrow}>02 · Four experience moments</span>
      <h3 id="aipc-tour">From inspiration to a plan you can check.</h3>
      <div className={styles.tour}>
        {aiPcTour.map((item, index) => <figure key={item.image}>
          <a className={styles.imageLink} href={item.image} target="_blank" rel="noreferrer" aria-label={`Open original screenshot: ${item.title} (new tab)`}>
            <Image src={item.image} alt={`AIPC local beta showcase sample — ${item.title}`} width={800} height={500} unoptimized />
            <span aria-hidden="true">View original ↗</span>
          </a>
          <figcaption><span className={styles.eyebrow}>0{index + 1}</span><h4>{item.title}</h4><p>{item.description}</p></figcaption>
        </figure>)}
      </div>
    </section>

    <section className={styles.section} aria-labelledby="aipc-decisions">
      <span className={styles.eyebrow}>03 · Three product decisions</span>
      <h3 id="aipc-decisions">Make uncertainty useful, not invisible.</h3>

      <article className={styles.decision}>
        <header><span className={styles.eyebrow}>Decision 01 · Trust</span><h4>Separate appearance from identity.</h4></header>
        <div className={styles.decisionBody}>
          <p>On a real photo, only the case found a match. The model saw other components, but the catalog lacked the information to identify them. Adding more parts alone would not cover every possible photo.</p>
          <p>I made appearance drive the 3D draft, while exact model identity stayed optional and user-confirmed. Adding 21 manufacturer-sourced parts and appearance-aware matching improved the available candidates.</p>
          <dl className={styles.trust}>
            <div><dt>What the photo shows</dt><dd>Case shape, glass, colors and visible component layout → an editable visual draft.</dd></div>
            <div><dt>What the user confirms</dt><dd>Candidate model, hidden parts and final choices → the build and shopping plan.</dd></div>
          </dl>
          <p className={styles.note}>In the same-photo replay, the motherboard went from no close match to 2 candidates, and the cooler to 3 screen-pump AIOs. Ties were shown, never automatically selected. Unknown prices stay blank; incomplete checks remain “not checked”.</p>
        </div>
      </article>

      <article className={styles.decision}>
        <header><span className={styles.eyebrow}>Decision 02 · Evaluation</span><h4>Compare models before rewriting another prompt.</h4></header>
        <div className={styles.decisionBody}>
          <p>Prompt changes fixed only one of four misreads. I compared two models on the same real photo, then paired the stronger result with contradiction rules and an editable appearance panel.</p>
          <div className={styles.tableWrap} role="region" aria-label="Single-photo model comparison" tabIndex={0}>
            <table><caption>Four inspected fields · One real photo · Local evaluation, November 2026</caption><thead><tr><th scope="col">Field</th><th scope="col">GPT-4.1-mini</th><th scope="col">GPT-5.4</th><th scope="col">Observed</th></tr></thead><tbody>{modelComparison.map(([field, ...values]) => <tr key={field}><th scope="row">{field}</th>{values.map((value, i) => <td key={i}>{value}</td>)}</tr>)}</tbody></table>
          </div>
          <p className={styles.note}>Four incorrect appearance fields became zero in this one comparison. Cost per read rose from approximately $0.005 to $0.04. This is an early evaluation, not a general accuracy benchmark.</p>
        </div>
      </article>

      <article className={styles.decision}>
        <header><span className={styles.eyebrow}>Decision 03 · Responsiveness</span><h4>Make the wait part of the Studio experience.</h4></header>
        <div className={styles.decisionBody}>
          <p>A 20–35 second spinner kept people outside the product. I moved reading into the Studio: an empty case and “Reading…” outlines become parts as the photo is interpreted.</p>
          <p>A fast appearance read now runs alongside the full read, with the PC check in parallel. This brings the first useful visual feedback forward without pretending the analysis is complete.</p>
          <figure className={styles.timing}><figcaption>Seconds until the first 3D part appears · Same real-photo test</figcaption><ol>{feedback.map(item => <li key={item.label}><span>{item.label}</span><div><i style={{ width: `${item.seconds / 10.8 * 100}%` }} aria-hidden="true" /><b>{item.seconds} s</b></div></li>)}</ol></figure>
          <p className={styles.note}>The full read still finishes at approximately 16 seconds in the background. Disagreements are labeled “Adjusted after full read”. Cost rose from about $0.033 to $0.041 per photo in exchange for earlier feedback.</p>
        </div>
      </article>
    </section>

    <section className={styles.section} aria-labelledby="aipc-current-state">
      <span className={styles.eyebrow}>04 · Current state</span>
      <h3 id="aipc-current-state">A local beta, ready for broader learning.</h3>
      <p>{aiPcCase.outcome}</p>
      <p>I owned the product scope, specifications, model and cost decisions, acceptance criteria, and review of AI-assisted implementation. The next step is public beta feedback on the path from photo upload to saving or exporting a build.</p>
      <details className={styles.history}><summary>Earlier prototype · June–August 2026</summary><p>The earlier guided-advisor version included five user interviews, three prototype testers and 37 merged pull requests. Testers valued the speed of receiving a configuration but questioned the recommendation rationale. These are earlier-version findings, not validation of the new photo-to-build flow.</p><a href="/media/ai-pc-build-advisor/working-recommendation-review.png" target="_blank" rel="noreferrer">View the earlier recommendation workspace ↗</a></details>
      <p className={styles.note}>Source: AIPC case study supplied by Carl · November 2026. Product status and evaluation figures reflect that local development snapshot.</p>
      <Link className={styles.next} href="#dog-behavior-camera">Next · Dog Camera <span aria-hidden="true">→</span></Link>
    </section>
  </div>;
}
