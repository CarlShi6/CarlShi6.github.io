import Link from 'next/link';
import { dentureMedia, denturePreviewCase } from './denture-preview-content';
import styles from './denture-preview.module.css';

export function DenturePreviewVideo() {
  return <figure className={styles.walkthrough}>
    <video controls playsInline preload="none" poster={dentureMedia.poster} aria-label="Denture Preview: 45-second synthetic 3D model walkthrough" aria-describedby="denture-video-caption">
      <source src={dentureMedia.video} type="video/mp4" />
      <track kind="captions" src={dentureMedia.captions} srcLang="en" label="English" />
      <a href={dentureMedia.video}>Download the Denture Preview walkthrough</a>
    </video>
    <figcaption id="denture-video-caption">45-second walkthrough · Original synthetic 3D model · English captions. Illustrates editing states; not patient data or clinical validation.</figcaption>
  </figure>;
}

export function DenturePreviewContent() {
  return <div className={styles.case}>
    <section className={styles.section} aria-labelledby="denture-opportunity">
      <span className={styles.eyebrow}>01 · The review decision</span>
      <h3 id="denture-opportunity">Keep the draft. Try a different finish.</h3>
      <p>{denturePreviewCase.problem}</p>
      <ol className={styles.flow} aria-label="Proposed editing workflow">
        {['Review the models', 'Choose a part or area and its tool', 'Adjust and compare', 'Review the draft'].map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}
      </ol>
      <p>Showing a reference model does not select it for editing. The active object and highlighted surface tell the dentist where the next adjustment will land.</p>
    </section>
    <section className={styles.section} aria-labelledby="denture-stippling">
      <span className={styles.eyebrow}>02 · A focused tool</span>
      <h3 id="denture-stippling">Why I started with stippling.</h3>
      <p>Stippling adds a pattern of small dimples to the gum-colored denture base. I chose it because the dentist can make three concrete decisions: where the pattern belongs, how pronounced it should be, and whether the result looks right. A repeating pattern also gives a slider a clear job. It changes the depth of the dimples across the selected surface. The dentist can inspect the effect without placing each dimple by hand.</p>
    </section>
    <section className={styles.section} aria-labelledby="denture-before">
      <span className={styles.eyebrow}>03 · The comparison baseline</span>
      <h3 id="denture-before">What counts as “Before”?</h3>
      <p>Imagine the dentist has already smoothed the base. If Before goes back to the original file, switching to After shows two changes at once. The dentist has to guess which differences came from smoothing and which came from stippling.</p>
      <p>I made Before the <strong>current adopted draft</strong>. In this example, both views include Smooth. After adds the proposed dimples, and the camera stays in the same position. The dentist can try a different depth or discard the candidate. Only <strong>Apply to draft</strong> adds the finish to the draft.</p>
      <dl className={styles.comparison} aria-label="Before and After use the same adopted draft">
        <div><dt>Before</dt><dd>Current draft<br /><strong>Smooth retained</strong></dd></div>
        <div><dt>After</dt><dd>Current draft + candidate<br /><strong>Smooth + proposed Stippling</strong></dd></div>
      </dl>
    </section>
    <section className={styles.section} aria-labelledby="denture-apply">
      <span className={styles.eyebrow}>04 · Reversible decisions</span>
      <h3 id="denture-apply">What happens after Apply?</h3>
      <p>Each adopted adjustment keeps its object, region, tool, and parameters. When the dentist reopens Stippling, the previous depth is still there. Before now shows the adopted texture. After shows the proposed replacement. Updating edits that same record, so the texture never gets stamped onto itself a second time.</p>
      <p>Withdrawal is a separate decision. Withdrawing Stippling removes the adopted texture and returns this example to the smoothed base. The original model remains available throughout.</p>
    </section>
    <section className={styles.section} aria-labelledby="denture-verified">
      <span className={styles.eyebrow}>05 · Evidence & next questions</span>
      <h3 id="denture-verified">What I could verify.</h3>
      <p>The local prototype performs surface edits on a 3D mesh. I checked that a saved record could be reopened and adjusted, that discarding a trial preserved the adopted finish, and that an adopted edit survived a browser refresh. For the public video, I recreated the edit sequence on an original synthetic 3D denture.</p>
      <p>The next question is whether dentists reach the right review decision with less effort. I would compare matched tasks in the existing review workflow and this prototype, measuring unaided completion and hands-on time. I would also ask dentists to predict what will change before moving the slider. That would reveal whether the control makes sense even when the task ends successfully. Clinical suitability and printed texture remain open questions.</p>
      <Link className={styles.back} href="/homepage-poc/projects#projects">Back to all projects →</Link>
    </section>
  </div>;
}
