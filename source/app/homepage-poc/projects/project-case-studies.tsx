"use client";

import Image from "next/image";
import Link from "next/link";
import { CsLogo } from "../cs-logo";
import { useEffect, useState } from "react";
import styles from "./project-case-studies.module.css";

const projectCases = [
  {
    slug: "build-hope-content-operations",
    navLabel: "Build Hope",
    title: "Build Hope — Content Operations System",
    category: "Content operations · Digital operations system",
    intro: "A five-day client sprint to help a nonprofit turn existing event media into a repeatable content workflow.",
    problem: "Build Hope's small team was managing social content through a largely manual process. The work competed with mission delivery for time, while valuable community stories could remain unseen.",
    facts: [
      ["Engagement", "Four-person team · Five-day client sprint · September 2026"],
      ["Role", "Product Strategy & Operations Consultant"],
      ["Context", "Client engagement through USC Iovine and Young Academy"],
    ],
    system: [
      ["Problem", "A manual content process pulled time away from mission work."],
      ["Insight", "The constraint was not a shortage of stories, but a missing operating system for moving them forward."],
      ["System", "Connect ideation, planning, publishing, and learning in one repeatable loop."],
      ["Implementation", "A proposed five-phase, 30-day roadmap: Set Up, Organize, Plan, Execute, Optimize."],
    ],
    outcome: "Proposed impact: less administrative work, more consistent storytelling, and greater visibility. These are expected outcomes from the delivery—not measured post-launch results.",
    heroImage: "/media/build-hope-content-operations/hero-operating-model.webp",
    heroAlt: "Build Hope four-step content operations model from ideation through learning",
    images: [
      ["/media/build-hope-content-operations/platform-evaluation.webp", "Four-platform evaluation", "Metricool, monday.com, Buffer, and Agorapulse were compared against actionable insights, publishing support, AI assistance, and affordability."],
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
    intro: "An AI-assisted prototype that turns a beginner's needs into part recommendations, comparisons, compatibility guidance, and a price-aware build list.",
    problem: "Choosing PC parts is still overwhelming for beginners. Specifications are difficult to interpret, similar components are hard to compare, compatibility and price risks are easy to miss, and advice across different sources often conflicts.",
    facts: [
      ["Role", "Technical Product Lead · AI-assisted product prototype"],
      ["Status", "Paused prototype · Not publicly deployed"],
      ["Research", "3–5 user interviews · Competitor research"],
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
      ["/media/ai-pc-build-advisor/working-replacement-drawer.png", "Compatibility-safe replacement drawer", "A flagged motherboard choice is connected directly to compatible replacement options."],
    ],
    finalExperience: "The prototype keeps recommendations, compatibility warnings, comparison of up to three parts, replacement, and the updated build total in one workspace. I reviewed AI-generated code, diagnosed issues, and tested incompatible configurations and key flows myself. The chatbot explains products and components; real-time price-value judgment remains a limitation.",
    finalImages: [
      ["/media/ai-pc-build-advisor/working-recommendation-review.png", "Recommendation review panel", "The review panel explains the build goal, recommendation logic, compatibility issue, and a lower-cost alternative."],
      ["/media/ai-pc-build-advisor/working-comparison.png", "Side-by-side component comparison", "A beginner-readable comparison keeps price, performance, power, and the current baseline visible."],
      ["/media/ai-pc-build-advisor/working-purchase-references.png", "Purchase reference list", "The selected configuration shows parts and prices for purchase planning; it is not an integrated retailer checkout."],
    ],
    outcome: "The paused prototype demonstrates a decision path from guided needs to part recommendations, compatibility review, comparison, replacement, and an updated build list. It was not publicly deployed and has no post-launch adoption results.",
  },
  {
    slug: "dog-behavior-camera",
    navLabel: "Dog Camera",
    title: "Dog Behavior Camera",
    category: "Computer vision · Physical prototype",
    intro: "An independent Raspberry Pi computer vision prototype showing real-time dog detection and basic behavioral-state feedback, with state-to-actuator response logic.",
    problem: "Daily interactions such as feeding, playing, resting, and standing contain behavioral signals that are difficult for an owner to interpret consistently. The project explores how vision and motion detection can make those signals visible and support a more responsive relationship.",
    facts: [
      ["Role", "Independent extracurricular project"],
      ["Tools", "Python · OpenCV · YOLO · Raspberry Pi"],
      ["Scope", "Adapted existing framework and labeled dataset · Summer 2025"],
    ],
    system: [
      ["Observe", "Use camera input to establish the dog’s current position, movement, and activity context."],
      ["Interpret", "Adjust detection parameters, weighting, temporal buffering, and post-processing to show basic behavioral-state feedback on screen."],
      ["Respond", "Design the logic connecting a persistent detected state to a physical actuator response."],
      ["Validate", "Test with a real dog; keep the broader enclosure, communication, and food modules labeled as concepts."],
    ],
    outcome: "Testing with a real dog demonstrated on-screen detection and basic behavioral-state feedback. The model weights were not fine-tuned; the larger companion device and remote features remained concepts.",
    heroImage: "/media/dog-behavior-camera/primary-portfolio-overview.png",
    heroAlt: "Robot for Dog project overview from the portfolio",
    images: [
      ["/media/dog-behavior-camera/case-study/detection-standing-frame.png", "Standing-state detection", "The first PDF-sourced frame identifies the dog, maps directional motion cues, and classifies the current standing state."],
      ["/media/dog-behavior-camera/case-study/detection-moving-frame.png", "Moving-state detection", "The second frame exposes the transition to a moving action while retaining the standing atomic state and normal behavior classification."],
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

function BuildHopeCaseContent() {
  const operatingModel = [
    ["Ideate", "Turn programs, events, milestones, and community stories into a usable content backlog."],
    ["Plan", "Choose priorities, owners, channels, and publishing dates in a shared calendar."],
    ["Publish", "Prepare and schedule channel-ready content through a centralized workflow."],
    ["Learn", "Review performance, identify useful patterns, and feed those insights into the next cycle."],
  ] as const;
  const roadmap = [
    ["Days 1–2", "Connect platforms, review recent performance, and establish a baseline."],
    ["Days 3–5", "Centralize assets and tag them by program, audience, and content category."],
    ["Days 6–7", "Select content, build the calendar, and establish a review rhythm."],
    ["Days 8–21", "Schedule, publish, and monitor the first operating cycle."],
    ["Days 22–30", "Review top content, compare formats, and apply insights to the next cycle."],
  ] as const;

  return <div className={styles.operationsCase}>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-challenge">
      <span>01 · Challenge</span>
      <h3 id="build-hope-challenge">Mission work generated meaningful stories, but the content process was difficult to sustain.</h3>
      <p>Build Hope’s small team was coordinating social content manually while also delivering programs and supporting its community. The engagement focused on making that work more repeatable without replacing the human judgment and lived experience behind each story.</p>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-reframe">
      <span>02 · Reframing the problem</span>
      <h3 id="build-hope-reframe">The core need was an operating system—not simply more posts.</h3>
      <p>The team already had programs, events, updates, and community impact worth sharing. The missing layer was a reliable path for turning those inputs into planned, approved, published, and learnable content.</p>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-gaps">
      <span>03 · Operational gaps</span>
      <h3 id="build-hope-gaps">Four capabilities were not covered by the existing workflow.</h3>
      <div className={styles.gapGrid}>
        <article><b>01</b><h4>Automated publishing</h4><p>Prepare and schedule content without repeating the same manual steps for every channel.</p></article>
        <article><b>02</b><h4>Social analytics</h4><p>Bring performance signals together so the team can identify useful patterns.</p></article>
        <article><b>03</b><h4>Content ideation</h4><p>Maintain a practical backlog built from programs, events, milestones, and community stories.</p></article>
        <article><b>04</b><h4>Cross-platform management</h4><p>Coordinate multiple social channels from a shared operational view.</p></article>
      </div>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-evaluation">
      <span>04 · Solution evaluation</span>
      <h3 id="build-hope-evaluation">Four platforms were compared against the team’s operating needs.</h3>
      <p>Our team researched roughly eight options and highlighted Metricool, monday.com, Buffer, and Agorapulse in the presentation. I personally tested Buffer, Metricool, and monday.com. The recommendation moved from Buffer to Metricool after considering analytics, engagement insights, automation, usability, and cost; this was a qualitative comparison, not a formal scoring matrix.</p>
      <figure className={styles.operationsFigure}><Image src="/media/build-hope-content-operations/platform-evaluation.webp" alt="Comparison of four social media management platforms" fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 94vw, 980px" unoptimized /></figure>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-model">
      <span>05 · Operating model</span>
      <h3 id="build-hope-model">Ideate → Plan → Publish → Learn</h3>
      <div className={styles.operatingFlow}>
        {operatingModel.map(([title, description], index) => <article key={title}><b>{String(index + 1).padStart(2, "0")}</b><h4>{title}</h4><p>{description}</p></article>)}
      </div>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-roadmap">
      <span>06 · 30-day implementation roadmap</span>
      <h3 id="build-hope-roadmap">Adoption is sequenced as a manageable first operating cycle.</h3>
      <div className={styles.roadmapGrid}>{roadmap.map(([period, description]) => <article key={period}><b>{period}</b><p>{description}</p></article>)}</div>
      <figure className={styles.operationsFigure}><Image src="/media/build-hope-content-operations/implementation-roadmap.webp" alt="Build Hope 30-day content operations implementation roadmap" fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 94vw, 980px" unoptimized /></figure>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-playbook">
      <span>07 · Content playbook / feedback loop</span>
      <h3 id="build-hope-playbook">A repeatable playbook connects creation to learning.</h3>
      <p>The playbook moves through Define, Gather, Create, Organize, Publish, and Learn. Its feedback loop—Create → Publish → Measure → Learn → Improve → Repeat—helps each cycle inform the next one.</p>
      <div className={styles.operationsImagePair}>
        <figure><Image src="/media/build-hope-content-operations/content-playbook.webp" alt="Build Hope content playbook" fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 94vw, 48vw" unoptimized /></figure>
        <figure><Image src="/media/build-hope-content-operations/feedback-loop.webp" alt="Build Hope content learning feedback loop" fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 94vw, 48vw" unoptimized /></figure>
      </div>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-impact">
      <span>08 · Proposed impact</span>
      <h3 id="build-hope-impact">Less administrative work. More consistent storytelling. Greater visibility.</h3>
      <p><strong>These are proposed outcomes, not measured post-launch results.</strong> The final delivery defines the workflow and expected value; it does not document validated changes in engagement, reach, productivity, or revenue.</p>
    </section>
    <section className={styles.operationsNarrative} aria-labelledby="build-hope-role">
      <span>09 · My role / reflection</span>
      <h3 id="build-hope-role">Product Strategy & Operations Consultant — Build Hope</h3>
      <p>In this four-person team, I pushed our discovery beyond views and posting frequency by asking the stakeholder about funding, engagement, priorities, and staff constraints. I designed the five-phase, 30-day roadmap, contributed the content playbook and handoff material, and proposed testing TikTok with existing event media under a standardized workflow. I presented the roadmap and Metricool features. Stakeholders responded positively, expressed interest in trying Metricool, and specifically liked the roadmap as a clear reference. Adoption and performance changes were not measured.</p>
      <Link href="#ai-pc-build-advisor">Next · PC Advisor <i aria-hidden="true">→</i></Link>
    </section>
  </div>;
}

export function ProjectCaseStudiesPage() {
  const [activeProject, setActiveProject] = useState<string>(projectCases[0].slug);

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
        if (visible) setActiveProject(visible.id);
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
      <div className={styles.caseBackdrop} aria-hidden="true" />

      <nav className={styles.caseNav} aria-label="Project case study navigation">
        <Link className={styles.homeLink} href="/" aria-label="Carl Shi — Home">
          <span className={styles.homeIcon} aria-hidden="true"><CsLogo /></span>
        </Link>
        <div className={styles.projectNavLinks}>
          {projectCases.map((project) => (
            <Link href={`#${project.slug}`} data-active={activeProject === project.slug} aria-current={activeProject === project.slug ? "location" : undefined} key={project.slug}>
              {project.navLabel}
            </Link>
          ))}
        </div>
        <Link className={styles.indexLink} href="/homepage-poc/projects#projects">Projects <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M16 4v6a3 3 0 0 1-3 3H4m4-4-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
      </nav>

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

        return <section className={styles.caseChapter} data-compact-media={project.slug === "interactive-music-installation"} id={project.slug} key={project.slug}>
          <header className={styles.caseOpening}>
            <div className={styles.caseIndex}>
              <span>{String(projectIndex + 1).padStart(2, "0")} / 05</span>
              <i />
            </div>
            <div className={styles.caseTitleBlock}>
              <span>{project.category}</span>
              <h2>{project.title}</h2>
              <p>{project.intro}</p>
            </div>
          </header>

          <div className={styles.caseLead}>
            <div className={styles.caseHeroMedia}>
              <Image src={heroSrc} alt={heroAlt} fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 94vw, 72vw" unoptimized />
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
              {isAiPcCase && <p>I interviewed 3–5 potential users and reviewed PCPartPicker, Newegg, Micro Center, Best Buy, and other PC-building resources before development and during iteration. I defined the MVP, prioritized the core decision flows, and deferred retailer integrations to keep the prototype focused.</p>}
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
              <h3 id={`${project.slug}-evidence`}>{isAiPcCase ? "From guided intake to compatibility-safe replacement." : "The system made visible."}</h3>
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
                <h3 id={`${project.slug}-final-experience`}>One continuous workspace from recommendation to purchase.</h3>
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
