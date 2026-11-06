"use client";

import Image from "next/image";
import Link from "next/link";
import { StaticHomeLink } from '../static-home-link';
import { CsLogo } from "../cs-logo";
import { CursorHint } from "../cursor-hint";
import { ThemeSwitch } from "../theme-switch";
import { EditorialMotion } from "../editorial-motion";
import { useEffect, useState } from "react";
import { LineSidebar } from "@/src/components/react-bits/LineSidebar";
import styles from "./project-case-studies.module.css";
import { BuildHopeArtifactGallery, BuildHopeBlueprint, BuildHopeRoadmap, BuildHopeEvidence, BuildHopePlatformEvidence } from "./build-hope-visuals";
import { aiPcCase } from "./ai-pc-content";
import { AiPcCaseContent } from "./ai-pc-case-content";
import { LuggageHelperVisual } from "./luggage-helper-visual";

const projectCases = [
  {
    slug: "build-hope-content-operations",
    navLabel: "Build Hope",
    title: "Build Hope — Content Operations System",
    category: "Content operations · Digital operations system",
    intro: "Designing a scalable workflow that helps a nonprofit turn community impact into consistent storytelling.",
    problem: "Build Hope already had event photos and videos, but limited staff capacity and inconsistent publishing. The challenge was to organize assets, schedule content, and learn from engagement metrics through a repeatable workflow.",
    facts: [
      ["Engagement", "Four-person team · Five-day client sprint · September 2026"],
      ["Role", "Product Strategy & Operations Consultant"],
      ["Context", "Client engagement through USC Iovine and Young Academy"],
      ["Roadmap", "Five phases · 30 days"],
      ["Evaluation", "8 platforms evaluated as a team · 3 personally tested"],
    ],
    system: [
      ["Problem", "A manual content process pulled time away from mission work."],
      ["Insight", "The constraint was not a shortage of stories, but a missing operating system for moving them forward."],
      ["System", "Connect ideation, planning, publishing, and learning in one repeatable loop."],
      ["Implementation", "A proposed five-phase, 30-day roadmap: Set Up, Organize, Plan, Execute, Optimize."],
    ],
    outcome: "Delivered a five-phase, 30-day roadmap and content-management playbook. A later review found more posting activity on the nonprofit's existing social channel; that observation does not establish roadmap adoption or a causal improvement in engagement.",
    heroImage: "/media/build-hope-content-operations/hero-operating-model.webp",
    heroAlt: "Build Hope four-step content operations model from ideation through learning",
    images: [
      ["/media/build-hope-content-operations/platform-evaluation.webp", "Four-platform delivery comparison", "The team researched approximately eight tools; this delivery slide highlights four. I personally tested Buffer, Metricool, and Monday.com and helped recommend Metricool for analytics, workflow fit, and cost."],
      ["/media/build-hope-content-operations/implementation-roadmap.webp", "30-day implementation roadmap", "The roadmap moves from connecting platforms and centralizing assets to publishing, monitoring, and applying insights."],
      ["/media/build-hope-content-operations/content-playbook.webp", "Content playbook", "A repeatable operating guide connects defining the story, gathering inputs, creating, organizing, publishing, and learning."],
      ["/media/build-hope-content-operations/feedback-loop.webp", "Learning feedback loop", "Create, publish, measure, learn, improve, and repeat turns content delivery into an operating rhythm."],
    ],
  },
  aiPcCase,
  {
    slug: "dog-behavior-camera",
    navLabel: "Dog Camera",
    title: "Dog Behavior Camera",
    category: "Computer vision · Physical prototype",
    intro: "Built a Raspberry Pi dog-monitoring prototype using Python, OpenCV, and YOLO, progressing from offline image checks to live-dog trials with visualization and calibration.",
    problem: "Camera-based behavior signals can fluctuate from frame to frame. The challenge was to inspect those signals and decide when a persistent detected state should trigger a physical response, rather than reacting to every transient classification.",
    facts: [
      ["Role", "Independent extracurricular project"],
      ["Tools", "Python · OpenCV · YOLO · Raspberry Pi"],
      ["Scope", "Image checks → live-dog trials · 2025"],
    ],
    system: [
      ["Observe", "Progress from early image-based checks to camera input and trials with a real dog."],
      ["Inspect", "Add visual detection overlays to inspect live output and identify classification issues."],
      ["Calibrate", "Adjust detection thresholds, weighting, and temporal buffering to filter transient behavior signals."],
      ["Respond", "Connect persistent detected states to physical response logic; keep the wider enclosure and remote features labeled as concepts."],
    ],
    outcome: "An observable, physically integrated prototype with a more inspectable testing and debugging workflow. Final live-dog accuracy and precision were not reliably recorded, so no numerical performance improvement is claimed. The complete companion enclosure and remote features remained concepts.",
    heroImage: "/media/dog-behavior-camera/primary-portfolio-overview.png",
    heroAlt: "Robot for Dog project overview from the portfolio",
    images: [
      ["/media/dog-behavior-camera/case-study/detection-standing-frame.png", "Standing-state detection overlay", "Visual overlays make the detected position, directional cues, and current standing-state output inspectable during testing; a screenshot is not an accuracy measurement."],
      ["/media/dog-behavior-camera/case-study/detection-moving-frame.png", "Inspecting changing signals", "The live-dog output exposes changing motion and state labels, helping identify classification issues and calibrate thresholds and temporal buffering."],
      ["/media/dog-behavior-camera/case-study/prototype-servo-hardware.png", "Servo motor hardware study", "A Raspberry Pi, GPIO connection, and external power supply explore how a persistent state could drive the toy-holding arm."],
      ["/media/dog-behavior-camera/case-study/concept-exploded-assembly.png", "Exploded product system", "The camera, food plate, toy arm, wheels, display, and storage modules are organized as one interaction system."],
    ],
  },
  {
    slug: "ai-travel-assistant",
    navLabel: "Travel",
    title: "Luggage Helper",
    category: "AI-powered travel assistant · Mobile product",
    intro: "A tested mobile prototype that brings trip allowance, item analysis, and packing status into one decision flow.",
    problem: "Baggage allowances and item restrictions change across routes, countries, and airlines. Travelers often discover weight limits too late, estimate luggage capacity by hand, or learn at inspection that an item cannot be carried.",
    facts: [
      ["Role", "Product design · Prototype development"],
      ["Status", "Tested mobile prototype · Summer 2025"],
      ["Core flow", "Trip → Item analysis → Packing overview"],
    ],
    system: [
      ["Create", "Start a trip with departure, destination, and the applicable luggage weight limit."],
      ["Capture", "Add an item through a photo, image upload, or text description."],
      ["Analyze", "Send the item context to the model and return an estimated weight and travel-safety classification."],
      ["Guide", "Update the trip total, surface overweight or restricted-item warnings, and maintain a packing checklist."],
    ],
    outcome: "Built and tested the Add Item → Analysis → Add / Discard flow on a phone, along with trip setup, weight totals, potential restriction warnings, and a packing checklist. The new hero is a visual redesign of those existing functions; it has not been separately tested. The prototype is not an authoritative source of airline or customs rules.",
    heroImage: "/media/luggage-helper/app-showcase-flow.png",
    heroAlt: "Luggage Helper app showcase from the portfolio",
    images: [
      ["/media/luggage-helper/app-home-screen.png", "Trip-first setup", "Interviews showed that allowance changes create anxiety before packing. The app begins with the route and weight limit so every later decision has context."],
      ["/media/luggage-helper/app-item-analysis-flow.png", "Add, analyze, decide", "The prototype accepts a photo, upload, or description and displays estimated weight and potential item warnings that travelers should verify."],
      ["/media/luggage-helper/app-trip-summary.png", "One luggage status", "Current weight, remaining allowance, packed items, checklist, and restricted-item guidance stay together instead of being spread across tools."],
      ["/media/luggage-helper/app-testing-photos.png", "Tested on a phone", "Mobile testing checked tap areas, readability, scrolling, repeated add-remove actions, weight totals, and warning classifications."],
    ],
  },
  {
    slug: "interactive-music-installation",
    navLabel: "Music Pulse",
    title: "Music Pulse",
    category: "Interactive installation · Public space design",
    intro: "An installation concept for a Brooklyn park, bringing music, movement, and responsive visuals into everyday public space.",
    problem: "A nearby park is not always a welcoming place. Music Pulse explores how a low-barrier, shared creative activity could invite people to pause, participate, and feel more connected to their neighborhood.",
    facts: [
      ["Context", "Brooklyn · Urban park"],
      ["Interaction", "Music + movement → visuals"],
      ["Stage", "Installation concept · Rhino / KeyShot"],
    ],
    system: [
      ["Choose", "Select music and visualization features, or let the system play a random track."],
      ["Move", "The proposed system captures movement from participants and passersby."],
      ["Visualize", "The display translates music and movement into a responsive particle image."],
      ["Gather", "Sound and a visible shared screen make the interaction part of the park experience."],
    ],
    outcome: "A modeled installation concept connecting music, bodily participation, and public-space design. The portfolio documents the design and intended experience, not a deployed installation or measured community impact.",
    heroImage: "/media/music-pulse/device-front.png",
    heroAlt: "Music Pulse concept render with particle display, speakers, and floor controls",
    images: [
      ["/media/music-pulse/participant-view.png", "Step into the music", "The participant view shows the intended interaction: stand in front of the display and let movement become part of the music visualization."],
      ["/media/music-pulse/device-front.png", "One compact public interface", "A central screen, floor-level controls, and combined speaker/recycling units bring participation and everyday park functions into one object."],
    ],
  },
] as const;

const projectIds = projectCases.map((project) => project.slug);
const readingItems = projectCases.map((project) => ({ href: `#${project.slug}`, label: project.navLabel }));

function BuildHopeCaseContent() {
  return <div className={styles.operationsCase}>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-challenge">
      <span>01–02 · Challenge & reframing</span>
      <h3 id="build-hope-challenge">The bottleneck was the workflow—not the stories.</h3>
      <p>Build Hope needed a sustainable way to turn existing event media into consistent publishing, within limited staff capacity.</p>
      <div className={styles.hopeProblemFlow}>
        <article><span>Existing inputs</span><h4>Stories worth sharing</h4><p>Event photos, videos, program updates, and community impact.</p></article>
        <article><span>Operating constraint</span><h4>Limited team capacity</h4><p>Inconsistent publishing and a need to organize, schedule, and review content.</p></article>
        <article><span>Reframing</span><h4 id="build-hope-reframe">A repeatable operating system</h4><p>Connect assets, planning, publishing, and learning—not simply request more posts.</p></article>
      </div>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-gaps">
      <span>03 · Operational gaps</span>
      <h3 id="build-hope-gaps">Four capabilities the operating system needed to address.</h3>
      <div className={styles.gapGrid}>
        <article><b>01</b><h4>Automated publishing</h4><p>Prepare and schedule content without repeating the same manual steps for every channel.</p></article>
        <article><b>02</b><h4>Social analytics</h4><p>Bring performance signals together so the team can identify useful patterns.</p></article>
        <article><b>03</b><h4>Content ideation</h4><p>Maintain a practical backlog built from programs, events, milestones, and community stories.</p></article>
        <article><b>04</b><h4>Cross-platform management</h4><p>Coordinate multiple social channels from a shared operational view.</p></article>
      </div>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-evaluation">
      <span>04 · Solution evaluation</span>
      <h3 id="build-hope-evaluation">Choose for the operating constraints—not the longest feature list.</h3>
      <p>I helped recommend Metricool based on analytics, workflow fit, and cost. The decision connected the nonprofit’s content needs to a tool the proposed operating model could use.</p>
      <div className={`${styles.hopeDecisionTable} ${styles.hopePlatformMatrix}`}>
        <table><caption>Four platforms shown in the September 2026 delivery · qualitative presence/absence matrix, not a scored ranking</caption><thead><tr><th scope="col">Verified criterion</th><th scope="col" data-recommended="true">Metricool</th><th scope="col">Monday.com</th><th scope="col">Buffer</th><th scope="col">Agorapulse</th></tr></thead><tbody>
          <tr><th scope="row">Engagement reports and actionable insights</th><td data-label="Metricool" data-state="yes">✓</td><td data-label="Monday.com" data-state="no">—</td><td data-label="Buffer" data-state="no">—</td><td data-label="Agorapulse" data-state="yes">✓</td></tr>
          <tr><th scope="row">Scheduling and auto-publishing</th><td data-label="Metricool" data-state="yes">✓</td><td data-label="Monday.com" data-state="no">—</td><td data-label="Buffer" data-state="yes">✓</td><td data-label="Agorapulse" data-state="yes">✓</td></tr>
          <tr><th scope="row">AI content assistant</th><td data-label="Metricool" data-state="yes">✓</td><td data-label="Monday.com" data-state="no">—</td><td data-label="Buffer" data-state="yes">✓</td><td data-label="Agorapulse" data-state="no">—</td></tr>
          <tr><th scope="row">Affordability</th><td data-label="Metricool" data-state="yes">✓</td><td data-label="Monday.com" data-state="yes">✓</td><td data-label="Buffer" data-state="yes">✓</td><td data-label="Agorapulse" data-state="no">—</td></tr>
        </tbody></table>
        <p>The source presentation marked these four criteria as available or unavailable at the time of the engagement. It is preserved as project evidence, not presented as a current market audit.</p>
      </div>
      <BuildHopePlatformEvidence />
      <div className={styles.hopeEvaluation}>
        <div><span>Team evaluation</span><strong>8 platforms</strong><p>Broader exploration of content-management options.</p></div>
        <div><span>My hands-on testing</span><strong>3 tools</strong><p>Buffer · Metricool · Monday.com</p></div>
        <div><span>Shown in final delivery</span><strong>4 platforms</strong><p>Metricool · Monday.com · Buffer · Agorapulse</p></div>
        <aside><span>Decision boundary</span><p>The engagement delivered a tool recommendation and rollout plan. Client adoption and performance after implementation were not validated.</p></aside>
      </div>
      <BuildHopeEvidence src="/media/build-hope-content-operations/platform-evaluation.webp" label="View original platform evaluation" />
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-model">
      <span>05 · Product strategy / operating workflow</span>
      <h3 id="build-hope-model">A seven-stage system connects assets to learning.</h3>
      <p>Content assets → organization → review → scheduling → publishing → analytics → improvement.</p>
      <div className={styles.hopeWide}><BuildHopeBlueprint /><BuildHopeEvidence src="/media/build-hope-content-operations/hero-operating-model.webp" label="View original operating model" note="Original project artifact · includes third-party Metricool interface references · September 2026" /></div>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-roadmap">
      <span>06 · 30-day implementation roadmap</span>
      <h3 id="build-hope-roadmap">Build the foundation before increasing the publishing load.</h3>
      <p>Sequence setup, asset organization, planning, execution, and optimization into a proposed first operating cycle.</p>
      <div className={styles.hopeWide}><BuildHopeRoadmap /><BuildHopeEvidence src="/media/build-hope-content-operations/implementation-roadmap.webp" label="View original 30-day roadmap" /></div>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-playbook">
      <span>07 · Content playbook / feedback loop</span>
      <h3 id="build-hope-playbook">A repeatable playbook connects creation to learning.</h3>
      <p>The playbook turns the workflow into a reusable guide. Performance review feeds the next round of content choices.</p>
      <div className={styles.hopeWide}>
        <ol className={styles.hopePlaybook}>{["Define", "Gather", "Create", "Organize", "Publish", "Learn"].map((step, i) => <li key={step}><span>0{i + 1}</span>{step}</li>)}</ol>
        <p className={styles.hopeFeedback}>Create → Publish → Measure → Learn → Improve → Repeat</p>
        <BuildHopeEvidence src="/media/build-hope-content-operations/content-playbook.webp" label="View original content playbook" />
        <BuildHopeEvidence src="/media/build-hope-content-operations/feedback-loop.webp" label="View original feedback loop" />
      </div>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-artifacts">
      <span>08 · Delivery evidence</span>
      <h3 id="build-hope-artifacts">The handoff, preserved as project artifacts.</h3>
      <p>Open each item to inspect the original presentation material. Labels separate authored deliverables from third-party interface references and reconstructed diagrams.</p>
      <BuildHopeArtifactGallery />
    </section>
    <section className={`${styles.operationsNarrative} ${styles.closingNarrative}`} aria-labelledby="build-hope-impact">
      <span>09 · Deliverables & results</span>
      <div className={styles.closingCopy}>
      <h3 id="build-hope-impact">Separate the handoff, the intended value, and the evidence.</h3>
      <div className={styles.hopeImpact}>
        <article><span>Delivered artifacts</span><h4>A system and a practical handoff</h4><p>A five-phase, 30-day roadmap, CMS concept, content ideas, and content-management playbook.</p></article>
        <article><span>Client feedback</span><h4>No verified quote or adoption record in the available source set.</h4><p>This case study does not infer satisfaction, implementation, or endorsement.</p></article>
        <article><span>Proposed future outcome</span><h4>Less administration. More consistent storytelling.</h4><p>Expected value—not measured changes in engagement, reach, productivity, or revenue.</p></article>
        <article><span>Observed follow-up · October 19, 2026</span><h4>Posting activity changed after the engagement.</h4><p>I counted eight posts during October 1–19, versus six total across July (3), August (1), and September (2) on the existing social channel.</p><p><strong>Unequal observation periods; no causal attribution.</strong> This does not establish full roadmap adoption or prove the engagement caused the change.</p></article>
      </div>
      </div>
    </section>
    <section className={`${styles.operationsNarrative} ${styles.closingNarrative}`} aria-labelledby="build-hope-role">
      <span>10 · My contribution & reflection</span>
      <div className={styles.closingCopy}>
      <h3 id="build-hope-role">Design the operating rhythm before increasing the content load.</h3>
      <div className={styles.hopeContributionGrid}>
        <article><span>01</span><h4>Problem reframing</h4><p>Helped translate a request for more views into an operating-capacity and workflow challenge.</p></article>
        <article><span>02</span><h4>CMS concept</h4><p>Contributed to the structure for organizing content assets, categories, review, and publishing work.</p></article>
        <article><span>03</span><h4>30-day roadmap</h4><p>Developed the phased rollout connecting setup, organization, planning, execution, and optimization.</p></article>
        <article><span>04</span><h4>Stakeholder communication</h4><p>Helped present the recommendation, operating model, roadmap, and playbook as part of the four-person team.</p></article>
      </div>
      <p>My key takeaway was to translate a request for more views into a sustainable workflow, with clear steps and signals the team could review over time.</p>
      <p>I also proposed reusing event photos and videos in recurring short-form content, evaluated through views, engagement, and follower changes. This was a proposed test—not a launched TikTok channel.</p>
      <Link href="#ai-pc-build-advisor">Next · PC Advisor <i aria-hidden="true">→</i></Link>
      </div>
    </section>
  </div>;
}

export function ProjectCaseStudiesPage() {
  const [activeProject, setActiveProject] = useState<string>(projectCases[0].slug);
  const [chapterProgress, setChapterProgress] = useState(0);
  const activeIndex = projectIds.findIndex((id) => id === activeProject);
  const jumpToProject = (index: number) => {
    const id = projectIds[index];
    if (!id) return;
    window.history.pushState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  useEffect(() => {
    const requested = window.location.hash.slice(1);
    let alignFrame = 0;
    let alignTimer = 0;
    const requestedTarget = document.getElementById(requested);
    const requestedProject = projectIds.find((id) => id === requested || (requestedTarget && document.getElementById(id)?.contains(requestedTarget)));
    if (requestedTarget && requestedProject) {
      const alignRequestedProject = () => {
        setActiveProject(requestedProject);
        const scrollingElement = document.documentElement;
        const previousBehavior = scrollingElement.style.scrollBehavior;
        scrollingElement.style.scrollBehavior = "auto";
        document.getElementById(requested)?.scrollIntoView({ block: "start" });
        window.requestAnimationFrame(() => { scrollingElement.style.scrollBehavior = previousBehavior; });
      };
      alignFrame = window.requestAnimationFrame(() => {
        alignRequestedProject();
        alignTimer = window.setTimeout(alignRequestedProject, 420);
      });
    }

    const sections = projectIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    let updateFrame = 0;
    const updateActiveProject = () => {
      window.cancelAnimationFrame(updateFrame);
      updateFrame = window.requestAnimationFrame(() => {
        const anchor = window.innerHeight * 0.18;
        const visible = sections.find((section) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= anchor && bounds.bottom > anchor;
        });
        if (visible) {
          setActiveProject(visible.id);
          const bounds = visible.getBoundingClientRect();
          const distance = Math.max(1, bounds.height - (window.innerHeight - anchor));
          setChapterProgress(Math.round(Math.min(1, Math.max(0, (anchor - bounds.top) / distance)) * 100));
        } else if (sections[0] && sections[0].getBoundingClientRect().top > anchor) {
          setActiveProject(sections[0].id);
          setChapterProgress(0);
        } else if (sections.length) {
          setActiveProject(sections[sections.length - 1].id);
          setChapterProgress(100);
        }
      });
    };
    updateActiveProject();
    window.addEventListener("scroll", updateActiveProject, { passive: true });
    window.addEventListener("resize", updateActiveProject);
    return () => {
      window.cancelAnimationFrame(alignFrame);
      window.cancelAnimationFrame(updateFrame);
      window.clearTimeout(alignTimer);
      window.removeEventListener("scroll", updateActiveProject);
      window.removeEventListener("resize", updateActiveProject);
    };
  }, []);

  return (
    <main className={styles.casesPage}>
      <CursorHint />
      <div className={styles.caseBackdrop} aria-hidden="true" />

      <nav className={styles.caseNav} aria-label="Project case study navigation">
        <StaticHomeLink className={styles.homeLink} aria-label="Carl Shi — Home" data-cursor-hint="Main">
          <span className={styles.homeIcon} aria-hidden="true"><CsLogo /></span>
          <span className={styles.homeLabel}>Home</span>
        </StaticHomeLink>
        <div className={styles.readingContext}><ThemeSwitch transition="circle" /></div>
        <Link className={styles.indexLink} href="/homepage-poc/projects#projects"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M16 10H4m5-5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>All Projects</Link>
      </nav>

      <aside className={styles.readingRail} aria-label="On this page">
        <p className={styles.railEyebrow}>On this page</p>
        <LineSidebar items={readingItems} activeIndex={activeIndex} accentColor="var(--text)" textColor="var(--rail-muted)" markerColor="var(--bright-line)" markerLength={22} markerGap={10} maxShift={4} itemGap={18} fontSize={0.875} proximityRadius={65} smoothing={130} onItemClick={jumpToProject} />
        <div className={styles.readingProgress}>
          <span>This project <b>{chapterProgress}%</b></span>
          <progress max={100} value={chapterProgress} aria-label={`${projectCases[activeIndex]?.navLabel ?? "Project"} reading progress`} />
          <small>{String(activeIndex + 1).padStart(2, "0")} / {String(projectCases.length).padStart(2, "0")}</small>
        </div>
      </aside>
      <div className={styles.mobileReadingNav}>
        <label htmlFor="case-reading-project">On this page</label>
        <select id="case-reading-project" value={activeIndex} onChange={(event) => jumpToProject(Number(event.target.value))}>
          {projectCases.map((project, index) => <option value={index} key={project.slug}>{String(index + 1).padStart(2, "0")} · {project.navLabel}</option>)}
        </select>
        <span>{chapterProgress}%</span>
      </div>

      <header className={styles.caseArchiveHero}>
        <span>Third layer · Project case studies</span>
        <h1>Five projects.<br />Five distinct systems.</h1>
        <p>Each chapter follows one product from its problem and system logic into execution evidence and outcome.</p>
        <div className={styles.heroCounter} aria-hidden="true"><b>01</b><i /><b>05</b></div>
      </header>

      {projectCases.map((project, projectIndex) => {
        const isBuildHopeCase = project.slug === "build-hope-content-operations";
        const isAiPcCase = project.slug === "ai-pc-build-advisor";
        const isLuggageCase = project.slug === "ai-travel-assistant";
        const heroSrc = project.heroImage;
        const heroAlt = project.heroAlt;
        const executionImages = project.images;

        return <section className={styles.caseChapter} data-build-hope={isBuildHopeCase} data-compact-media={project.slug === "interactive-music-installation"} id={project.slug} key={project.slug}>
          <header className={styles.caseOpening}>
            <div className={styles.caseIndex}>
              <span>{String(projectIndex + 1).padStart(2, "0")} / 05</span>
              <i />
            </div>
            <div className={styles.caseTitleBlock}>
              <span>{project.category}</span>
              <h2><EditorialMotion text={project.title} /></h2>
              <p>{project.intro}</p>
            </div>
          </header>

          <div className={styles.caseLead}>
            <div className={styles.caseHeroMedia} data-build-hope={isBuildHopeCase} data-luggage={isLuggageCase}>
              {isBuildHopeCase ? <BuildHopeBlueprint compact /> : isLuggageCase ? <LuggageHelperVisual /> : <Image src={heroSrc} alt={heroAlt} fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 94vw, 72vw" unoptimized />}
            </div>
            <dl className={styles.caseFacts}>
              {project.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </div>

          {isBuildHopeCase && <aside className={styles.hopeContribution}><span>My contribution · Product Strategy & Operations Consultant</span><p>I clarified stakeholder goals and operational constraints, contributed to platform evaluation, and developed and presented the 30-day implementation roadmap and content-management playbook.</p><small>Five-day, four-person client engagement through USC Iovine and Young Academy · September 2026</small></aside>}

          {isBuildHopeCase ? <BuildHopeCaseContent /> : isAiPcCase ? <AiPcCaseContent /> : <>
          <section className={styles.problemSection} aria-labelledby={`${project.slug}-problem`}>
            <span>01 · Problem</span>
            <h3 id={`${project.slug}-problem`}>{isLuggageCase ? "Know the allowance before deciding what to pack." : "What the product needs to make clear."}</h3>
            <div className={styles.problemCopy}>
              <p>{project.problem}</p>

            </div>
          </section>

          <section className={styles.systemSection} aria-labelledby={`${project.slug}-system`}>
            <header>
              <span>02 · Project system</span>
              <h3 id={`${project.slug}-system`}>The logic inside this project.</h3>
            </header>
            <ol>
              {project.system.map(([title, description], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true"><b /><b /><b /></i>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.evidenceSection} aria-labelledby={`${project.slug}-evidence`}>
            <header>
              <span>03 · Evidence</span>
              <h3 id={`${project.slug}-evidence`}>{isLuggageCase ? "The original prototype, from trip setup to phone testing." : "The system made visible."}</h3>
            </header>
            <div className={styles.storySequence}>
              {executionImages.map(([src, alt, caption], index) => (
                <figure data-reverse={index % 2 === 1} key={src}>
                  <div className={styles.storyMedia}><Image src={src} alt={alt} fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 90vw, (max-width: 1028px) 45vw, 458px" unoptimized /></div>
                  <figcaption>
                    <span>{String(index + 1).padStart(2, "0")} · Project evidence</span>
                    <h4>{alt}</h4>
                    <p>{caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className={styles.outcomeSection} aria-labelledby={`${project.slug}-outcome`}>
            <span>04 · Outcome</span>
            <h3 id={`${project.slug}-outcome`}>{project.outcome}</h3>
            <Link href={projectIndex === projectCases.length - 1 ? "#ai-pc-build-advisor" : `#${projectCases[projectIndex + 1].slug}`}>
              {projectIndex === projectCases.length - 1 ? "Back to first project" : `Next · ${projectCases[projectIndex + 1].navLabel}`} <i aria-hidden="true">→</i>
            </Link>
          </section>
          </>}
        </section>;
      })}

      <footer className={styles.caseFooter}>
        <Link href="/homepage-poc/projects#projects">← Projects</Link>
        <Link href="#build-hope-content-operations">Back to the beginning ↑</Link>
      </footer>
    </main>
  );
}
