"use client";

import Image from "next/image";
import Link from "next/link";
import { CsLogo } from "../cs-logo";
import { CursorHint } from "../cursor-hint";
import { ThemeSwitch } from "../theme-switch";
import { useEffect, useState } from "react";
import { LineSidebar } from "@/src/components/react-bits/LineSidebar";
import styles from "./project-case-studies.module.css";
import { BuildHopeBlueprint, BuildHopeRoadmap, BuildHopeEvidence } from "./build-hope-visuals";

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
      ["Evaluation", "~8 tools researched as a team · 3 personally tested"],
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
  {
    slug: "ai-pc-build-advisor",
    navLabel: "PC Advisor",
    title: "AI PC Build Advisor",
    category: "AI product · Decision support",
    intro: "Defined and tested an AI-assisted PC-building product through five user interviews, three prototype tests, and iterative development across 37 merged pull requests.",
    problem: "Choosing PC parts is still overwhelming for beginners. Specifications are difficult to interpret, similar components are hard to compare, compatibility and price risks are easy to miss, and advice across different sources often conflicts.",
    facts: [
      ["Role", "Technical Product Lead · AI-Assisted Prototype"],
      ["Status", "Functional prototype · Summer 2026 · Not publicly launched"],
      ["Research", "5 user interviews · 3 prototype testers"],
      ["Iteration", "37 merged PRs · June–August 2026"],
      ["Core flow", "Need → Recommendation → Review → Purchase"],
      ["Prototype scope", "Guided advisor · Comparison · Compatibility · Handoff"],
    ],
    system: [
      ["Understand", "A chat-based intake captures budget, games, software, aesthetic preferences, brand preferences, and performance needs."],
      ["Generate", "The advisor converts those needs into a complete component set with budget and performance context."],
      ["Guard", "Compatibility rules check CPU socket, motherboard support, GPU and cooling clearance, PSU wattage, and case fit."],
      ["Handoff", "The selected configuration carries its parts and updated total into a purchase reference list. Retailer integrations were deferred."],
    ],
    keyDecisions: [
      ["Needs before specs", "Start with budget, workload, and style—not hardware terminology."],
      ["Rule-based compatibility", "AI explains; explicit rules check sockets, power, clearance, and fit."],
      ["See the trade-off", "Show price and performance changes before replacing a part."],
      ["Prepare a parts list", "Keep component choices and the updated total visible; retailer integrations remained outside MVP scope."],
    ],
    heroImage: "/media/ai-pc-build-advisor/working-build-needs.png",
    heroAlt: "AI PC Build Advisor needs and recommendation workspace",
    executionImages: [
      ["/media/ai-pc-build-advisor/working-build-needs.png", "Guided needs and recommendation workspace", "The advisor turns a conversational budget and use case into persistent build requirements."],
      ["/media/ai-pc-build-advisor/working-alternatives.png", "Recommended component alternatives", "Alternatives display price, specifications, and compatibility context before replacement."],
      ["/media/ai-pc-build-advisor/working-replacement-drawer.png", "Compatibility-aware replacement drawer", "A flagged motherboard choice is connected directly to compatible replacement options."],
    ],
    finalExperience: "The prototype keeps use-case-based recommendations, comparisons of up to three components, replacement flows, compatibility warnings, and recalculated build totals in one workspace. I directed AI-assisted implementation, reviewed generated code, and manually tested core flows; I did not personally handwrite the full React/TypeScript codebase. Repository history records 37 merged PRs: 16 in June, 17 in July, and 4 in August 2026.",
    finalImages: [
      ["/media/ai-pc-build-advisor/working-recommendation-review.png", "Recommendation review panel", "The review panel explains the build goal, recommendation logic, compatibility issue, and a lower-cost alternative."],
      ["/media/ai-pc-build-advisor/working-comparison.png", "Side-by-side component comparison", "A beginner-readable comparison keeps price, performance, power, and the current baseline visible."],
      ["/media/ai-pc-build-advisor/working-purchase-references.png", "Purchase reference list", "The selected configuration shows parts and prices for purchase planning; it is not an integrated retailer checkout."],
    ],
    outcome: "A functional, testable prototype and a concrete research finding: three testers liked the speed of receiving a complete configuration but questioned why the AI recommended certain components. Explanation clarity and recommendation trust remain priorities for further testing—not validated solutions. The product was not publicly launched; no conversion or adoption improvement is claimed.",
  },
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
    intro: "A mobile prototype for planning a trip, estimating packed weight, reviewing potential item restrictions, and keeping a packing checklist.",
    problem: "Baggage allowances and item restrictions change across routes, countries, and airlines. Travelers often discover weight limits too late, estimate luggage capacity by hand, or learn at inspection that an item cannot be carried.",
    facts: [
      ["Focus", "Smart luggage management"],
      ["Journey", "Before · During · After travel"],
      ["Output", "Weight · Warnings · Checklist"],
    ],
    system: [
      ["Create", "Start a trip with departure, destination, and the applicable luggage weight limit."],
      ["Capture", "Add an item through a photo, image upload, or text description."],
      ["Analyze", "Send the item context to the model and return an estimated weight and travel-safety classification."],
      ["Guide", "Update the trip total, surface overweight or restricted-item warnings, and maintain a packing checklist."],
    ],
    outcome: "The mobile prototype connects trip setup, item input, estimated weight, potential restriction warnings, and a checklist. It is not a released travel service or an authoritative source of airline and customs rules.",
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
      <div className={styles.hopeDecisionTable}>
        <table><caption>Recommendation logic · Qualitative assessment from the September 2026 engagement</caption><thead><tr><th scope="col">Operational need</th><th scope="col">Evaluation focus</th><th scope="col">Why it mattered to the recommendation</th></tr></thead><tbody>
          <tr><th scope="row">Learn from publishing</th><td data-label="Evaluation focus">Analytics</td><td data-label="Decision rationale">Engagement reporting and actionable insights supported the proposed Learn stage.</td></tr>
          <tr><th scope="row">Make the workflow repeatable</th><td data-label="Evaluation focus">Workflow fit</td><td data-label="Decision rationale">Scheduling and cross-platform publishing connected the calendar to execution.</td></tr>
          <tr><th scope="row">Keep the system practical</th><td data-label="Evaluation focus">Cost</td><td data-label="Decision rationale">Affordability was considered alongside analytics and workflow fit, rather than features alone.</td></tr>
        </tbody></table>
        <p>This explains our recommendation, not a scored ranking or a claim that other tools lack these capabilities today.</p>
      </div>
      <div className={styles.hopeEvaluation}>
        <div><span>Team research</span><strong>~8 tools</strong><p>Broader exploration of content-management options.</p></div>
        <div><span>My hands-on testing</span><strong>3 tools</strong><p>Buffer · Metricool · Monday.com</p></div>
        <div><span>Shown in final delivery</span><strong>4 platforms</strong><p>Metricool · Monday.com · Buffer · Agorapulse</p></div>
        <aside><span>Decision boundary</span><p>The engagement delivered a tool recommendation and rollout plan. Client adoption and performance after implementation were not validated.</p></aside>
      </div>
      <BuildHopeEvidence src="/media/build-hope-content-operations/platform-evaluation.webp" label="View original platform evaluation" />
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-model">
      <span>05 · Operating model</span>
      <h3 id="build-hope-model">Ideate → Plan → Publish → Learn</h3>
      <div className={styles.hopeWide}><BuildHopeBlueprint /><BuildHopeEvidence src="/media/build-hope-content-operations/hero-operating-model.webp" label="View original operating model" /></div>
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
    <section className={`${styles.operationsNarrative} ${styles.closingNarrative}`} aria-labelledby="build-hope-impact">
      <span>08 · Proposed impact / observed follow-up</span>
      <div className={styles.closingCopy}>
      <h3 id="build-hope-impact">Separate the handoff, the intended value, and the evidence.</h3>
      <div className={styles.hopeImpact}>
        <article><span>Delivered</span><h4>A system and a practical handoff</h4><p>A five-phase, 30-day roadmap and content-management playbook.</p></article>
        <article><span>Proposed impact</span><h4>Less administration. More consistent storytelling.</h4><p>Expected value—not measured changes in engagement, reach, productivity, or revenue.</p></article>
        <article><span>Observed follow-up · October 19, 2026</span><h4>Posting activity changed after the engagement.</h4><p>I counted eight posts during October 1–19, versus six total across July (3), August (1), and September (2) on the existing social channel.</p><p><strong>Unequal observation periods; no causal attribution.</strong> This does not establish full roadmap adoption or prove the engagement caused the change.</p></article>
      </div>
      </div>
    </section>
    <section className={`${styles.operationsNarrative} ${styles.closingNarrative}`} aria-labelledby="build-hope-role">
      <span>09 · Reflection</span>
      <div className={styles.closingCopy}>
      <h3 id="build-hope-role">Design the operating rhythm before increasing the content load.</h3>
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
    if (projectIds.includes(requested as (typeof projectIds)[number])) {
      const alignRequestedProject = () => {
        setActiveProject(requested);
        const scrollingElement = document.documentElement;
        const previousBehavior = scrollingElement.style.scrollBehavior;
        scrollingElement.style.scrollBehavior = "auto";
        document.getElementById(requested)?.scrollIntoView({ block: "start" });
        window.requestAnimationFrame(() => { scrollingElement.style.scrollBehavior = previousBehavior; });
      };
      alignFrame = window.requestAnimationFrame(() => {
        alignRequestedProject();
        alignTimer = window.setTimeout(alignRequestedProject, 180);
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
        <Link className={styles.homeLink} href="/" aria-label="Carl Shi — Home" data-cursor-hint="Main">
          <span className={styles.homeIcon} aria-hidden="true"><CsLogo /></span>
        </Link>
        <div className={styles.readingContext}><ThemeSwitch /></div>
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
        const isAiPcCase = "keyDecisions" in project;
        const heroSrc = "heroImage" in project ? project.heroImage : project.images[0][0];
        const heroAlt = "heroAlt" in project ? project.heroAlt : project.images[0][1];
        const executionImages = "executionImages" in project ? project.executionImages : project.images;

        return <section className={styles.caseChapter} data-build-hope={isBuildHopeCase} data-compact-media={project.slug === "interactive-music-installation"} id={project.slug} key={project.slug}>
          <header className={styles.caseOpening}>
            <div className={styles.caseIndex}>
              <span>{String(projectIndex + 1).padStart(2, "0")} / 05</span>
              <i />
            </div>
            <div className={styles.caseTitleBlock}>
              <span>{project.category}</span>
              <h2>{project.title}</h2>
              <p>{project.intro}</p>
              {isBuildHopeCase && <aside className={styles.hopeContribution}><span>My contribution · Product Strategy & Operations Consultant</span><p>I clarified stakeholder goals and operational constraints, contributed to platform evaluation, and developed and presented the 30-day implementation roadmap and content-management playbook.</p><small>Five-day, four-person client engagement through USC Iovine and Young Academy · September 2026</small></aside>}
            </div>
          </header>

          <div className={styles.caseLead}>
            <div className={styles.caseHeroMedia} data-build-hope={isBuildHopeCase}>
              {isBuildHopeCase ? <BuildHopeBlueprint compact /> : <Image src={heroSrc} alt={heroAlt} fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 94vw, 72vw" unoptimized />}
            </div>
            <dl className={styles.caseFacts}>
              {project.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </div>

          {isBuildHopeCase ? <BuildHopeCaseContent /> : <>
          <section className={styles.problemSection} aria-labelledby={`${project.slug}-problem`}>
            <span>01 · Problem</span>
            <h3 id={`${project.slug}-problem`}>What the product needs to make clear.</h3>
            <div className={styles.problemCopy}>
              <p>{project.problem}</p>
              {isAiPcCase && <p>I interviewed five prospective users and reviewed competing PC shopping and configuration experiences to identify pain points and establish MVP priorities. I prioritized use-case-based recommendations, comparisons of up to three components, replacement flows, compatibility warnings, and recalculated totals; retailer integrations stayed outside the MVP.</p>}
            </div>
          </section>

          <section className={styles.systemSection} aria-labelledby={`${project.slug}-system`}>
            <header>
              <span>02 · {isAiPcCase ? "System" : "Project system"}</span>
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

          {isAiPcCase && (
            <section className={styles.decisionSection} aria-labelledby={`${project.slug}-decisions`}>
              <header>
                <span>03 · Key decisions</span>
                <h3 id={`${project.slug}-decisions`}>Make expert logic understandable to beginners.</h3>
              </header>
              <div className={styles.decisionLayout}>
              <figure className={styles.decisionVisual}>
                <div className={styles.decisionMedia}>
                  <Image src="/media/ai-pc-build-advisor/working-recommendation-review.png" alt="Build review showing recommendation reasoning, compatibility checks, and an alternative" fill style={{ objectFit: "contain" }} sizes="(max-width: 980px) 94vw, 62vw" unoptimized />
                </div>
                <figcaption>Build review · Recommendation, compatibility, and alternatives in one workspace.</figcaption>
              </figure>
              <ol>
                {project.keyDecisions.map(([title, description], index) => (
                  <li key={title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><h4>{title}</h4><p>{description}</p></div>
                  </li>
                ))}
              </ol>
              </div>
            </section>
          )}

          <section className={styles.evidenceSection} aria-labelledby={`${project.slug}-evidence`}>
            <header>
              <span>{isAiPcCase ? "04 · Execution" : "03 · Evidence"}</span>
              <h3 id={`${project.slug}-evidence`}>{isAiPcCase ? "From guided intake to component replacement." : "The system made visible."}</h3>
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

          {isAiPcCase && (
            <section className={styles.finalExperienceSection} aria-labelledby={`${project.slug}-final-experience`}>
              <header>
                <span>05 · Final experience</span>
                <h3 id={`${project.slug}-final-experience`}>One workspace from recommendations to purchase planning.</h3>
                <p>{project.finalExperience}</p>
              </header>
              <div className={styles.storySequence}>
                {project.finalImages.map(([src, alt, caption], index) => (
                  <figure data-reverse={index % 2 === 1} key={src}>
                    <div className={styles.storyMedia}><Image src={src} alt={alt} fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 90vw, (max-width: 1028px) 45vw, 458px" unoptimized /></div>
                    <figcaption>
                      <span>{String(index + 1).padStart(2, "0")} · Final state</span>
                      <h4>{alt}</h4>
                      <p>{caption}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          <section className={styles.outcomeSection} aria-labelledby={`${project.slug}-outcome`}>
            <span>{isAiPcCase ? "06 · Outcome" : "04 · Outcome"}</span>
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
