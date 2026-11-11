"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aiPcPreview } from './projects/ai-pc-content';
import Image from "next/image";
import { StaticHomeLink } from './static-home-link';
import { Fragment, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AccordionGallery } from "./accordion-gallery";
import { EditorialMotion } from "./editorial-motion";
import { CursorHint } from "./cursor-hint";
import { CsLogo } from "./cs-logo";
import { ThemeSwitch, usePortfolioTheme } from "./theme-switch";
import { LineSidebar } from "@/src/components/react-bits/LineSidebar";
import type { SpatialBranch } from "./spatial-scenes";
import styles from "./unified-detail.module.css";

gsap.registerPlugin(ScrollTrigger);
const LivingNetworkScene = lazy(() => import('./spatial-scenes').then(module => ({ default: module.LivingNetworkScene })));

type DetailItem = {
  title: string;
  description: string;
  signal: string;
  skills?: readonly string[];
  image?: string;
  compactMedia?: boolean;
  evidence?: { title: string; href: string; image: string };
};

type BranchDetail = {
  eyebrow: string;
  title: string;
  intro: string;
  items: readonly DetailItem[];
  closing: string;
};

const details: Record<SpatialBranch, BranchDetail> = {
  projects: {
    eyebrow: "Project archive",
    title: "Five systems. One product practice.",
    intro: "A visual index of client work, working prototypes, and design concepts that make complex decisions easier to understand.",
    items: [
      {
        title: "Build Hope — Content Operations System",
        description: "Designed a five-phase, 30-day content operations roadmap for a nonprofit, turning limited team capacity and inconsistent publishing into a practical content-management workflow.",
        signal: "Client engagement · Content operations · Implementation roadmap",
        image: "/media/build-hope-content-operations/hero-operating-model.webp",
        compactMedia: true,
      },
      {
        title: "AI PC Build Advisor",
        description: aiPcPreview.summary,
        signal: "Photo-to-build · 3D editing · Early access",
        image: aiPcPreview.image,
      },
      {
        title: "Dog Behavior Camera",
        description: "Built a Raspberry Pi dog-monitoring prototype with Python, OpenCV, and YOLO, progressing from image checks to live-dog trials with visual overlays and calibration.",
        signal: "Computer vision · Physical prototype",
        image: "/media/dog-behavior-camera/case-study/detection-moving-frame.png",
      },
      {
        title: "Luggage Helper",
        description: "A mobile travel assistant that tracks luggage weight, analyzes items, flags restrictions, and keeps a trip-specific packing checklist.",
        signal: "AI-assisted travel · Smart luggage management",
        image: "/media/luggage-helper/app-showcase-flow.png",
      },
      {
        title: "Music Pulse",
        description: "An interactive park installation concept that turns music and movement into a shared visual experience in Brooklyn.",
        signal: "Interactive installation · Public space · Music",
        image: "/media/music-pulse/device-front.png",
        compactMedia: true,
      },
    ],
    closing: "The projects differ in medium, but share the same intent: make complex systems understandable, testable, and useful.",
  },
  skills: {
    eyebrow: "Skill field",
    title: "Skills, organized by practice.",
    intro: "Methods and tools I have used to shape products, build software, and test prototypes.",
    items: [
      {
        title: "Technical",
        description: "Hands-on software work across frontend, APIs, and data workflows.",
        signal: "Code · Systems",
        skills: ["Python", "C++", "JavaScript", "Vue 3", "REST APIs", "MongoDB", "Postman", "Git / GitHub", "Linux"],
      },
      {
        title: "AI & Data",
        description: "Computer vision prototyping and selected prior ML framework experience.",
        signal: "Model · Evidence",
        skills: ["OpenCV", "YOLO", "Raspberry Pi", "Prior exposure: PyTorch, TensorFlow / Keras, scikit-learn, TensorRT"],
      },
      {
        title: "Product",
        description: "Turning ambiguous needs into a focused scope, roadmap, and decision framework.",
        signal: "Need · Direction",
        skills: ["Product strategy", "Requirements", "User needs analysis", "Feature prioritization", "MVP scoping", "Roadmapping", "Metrics", "Technical evaluation"],
      },
      {
        title: "Design & Research",
        description: "Making system logic understandable through flows, prototypes, and testing.",
        signal: "Insight · Experience",
        skills: ["User flows", "Wireframing", "Usability testing", "Product prototyping", "Interaction design", "Information architecture", "Figma"],
      },
      {
        title: "Hardware & Delivery",
        description: "Connecting software decisions to physical prototypes and deployable outputs.",
        signal: "Prototype · Reality",
        skills: ["Raspberry Pi", "Computer vision", "Physical prototyping", "Prototype testing"],
      },
    ],
    closing: "The strongest product work happens between these categories—not inside only one of them.",
  },
  systems: {
    eyebrow: "System logic",
    title: "From uncertain signal to working system.",
    intro: "A repeatable way to turn complexity into structure without forcing every problem into the same template.",
    items: [
      {
        title: "Frame",
        description: "Find the real user decision beneath the visible request, then define the outcome the system must support.",
        signal: "Signal → problem",
      },
      {
        title: "Model",
        description: "Expose constraints, dependencies, failure modes, and the decision logic connecting inputs to outcomes.",
        signal: "Constraints → logic",
      },
      {
        title: "Build",
        description: "Create the smallest credible product surface that makes the system tangible enough to evaluate.",
        signal: "Logic → prototype",
      },
      {
        title: "Learn",
        description: "Use product behavior and evidence to refine both the experience and the system behind it.",
        signal: "Evidence → iteration",
      },
    ],
    closing: "Good systems do not display their complexity. They use it to give people a clearer next decision.",
  },
  education: {
    eyebrow: "Learning trajectory",
    title: "Computer science, design, and business in one practice.",
    intro: "A technical foundation expanded through interdisciplinary graduate work and applied product building.",
    items: [
      {
        title: "NYU",
        description: "B.S. Computer Science; Minor in Integrated Media Design. Graduated May 2026.",
        signal: "NYU · 05/2026",
      },
      {
        title: "USC",
        description: "M.S. Integrated Design, Business and Technology. Expected graduation May 2028.",
        signal: "USC · Expected 05/2028",
      },
    ],
    closing: "My approach connects computer science, design, and business to make technical products useful to people.",
  },
  about: {
    eyebrow: "Identity signal",
    title: "Technical by training. Product-minded by practice.",
    intro: "I connect technical possibility with the decisions people actually need to make.",
    items: [
      {
        title: "Product focus",
        description: "AI products and decision-support systems where capability is complex but the experience must remain clear.",
        signal: "AI product · Technical PM",
      },
      {
        title: "Technical practice",
        description: "Python, JavaScript, Vue 3, APIs, and product decisions informed by testing and user needs. My AI PC prototype uses React and TypeScript through AI-assisted implementation.",
        signal: "Product surface ↔ system",
      },
      {
        title: "Experience",
        description: "Build Hope client consultant through USC; Assistant Software Engineer Intern at Xfanatical. Internal-app features merged through reviewed pull requests.",
        signal: "Consult · build · evaluate",
      },
      {
        title: "Based",
        description: "Los Angeles & San Francisco Bay Area, California\nOpen to opportunities in both regions across AI Product, Technical Product, and Program Management.",
        signal: "LA · Bay Area · Available",
      },
    ],
    closing: "I am most useful when the technology is complex, the direction is still forming, and a team needs a clear path from capability to value.",
  },
};

const branchOrder: SpatialBranch[] = ["projects", "skills", "about"];
const sectionLinks = branchOrder.map((item) => ({ href: `#${item}`, label: item.charAt(0).toUpperCase() + item.slice(1) }));
const projectSlugs = [
  "build-hope-content-operations",
  "ai-pc-build-advisor",
  "dog-behavior-camera",
  "ai-travel-assistant",
  "interactive-music-installation",
] as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function BranchDetailPage({ branch }: { branch: SpatialBranch }) {
  const [theme] = usePortfolioTheme();
  const root = useRef<HTMLElement>(null);
  const motionVideos = useRef<HTMLDivElement>(null);
  const cursor = useRef({ x: 0.5, y: 0.5, active: false });
  const reducedMotion = useReducedMotion();
  const [activeBranch, setActiveBranch] = useState<SpatialBranch>(branchOrder.includes(branch) ? branch : "projects");

  useEffect(() => {
    const videos = Array.from(motionVideos.current?.querySelectorAll("video") ?? []);
    if (reducedMotion) {
      videos.forEach((video) => video.pause());
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      });
    }, { threshold: 0.1 });
    videos.forEach((video) => observer.observe(video));
    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    };
  }, [reducedMotion]);

  useEffect(() => {
    const requested = window.location.hash.slice(1) as SpatialBranch;
    const target = branchOrder.includes(requested) ? requested : branchOrder.includes(branch) ? branch : "projects";
    window.requestAnimationFrame(() => {
      setActiveBranch(target);
      if (target !== "projects" || window.location.hash) {
        const scrollingElement = document.documentElement;
        const previousBehavior = scrollingElement.style.scrollBehavior;
        scrollingElement.style.scrollBehavior = "auto";
        document.getElementById(target)?.scrollIntoView({ block: "start" });
        window.requestAnimationFrame(() => { scrollingElement.style.scrollBehavior = previousBehavior; });
      }
    });
  }, [branch]);

  useEffect(() => {
    const sections = branchOrder
      .map((item) => document.getElementById(item))
      .filter((item): item is HTMLElement => Boolean(item));
    let updateFrame = 0;
    const updateActiveBranch = () => {
      window.cancelAnimationFrame(updateFrame);
      updateFrame = window.requestAnimationFrame(() => {
        const anchor = window.innerHeight * 0.2;
        const visible = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= anchor) ?? sections[0];
        if (visible) setActiveBranch(visible.id as SpatialBranch);
      });
    };
    updateActiveBranch();
    window.addEventListener("scroll", updateActiveBranch, { passive: true });
    window.addEventListener("resize", updateActiveBranch);
    return () => {
      window.cancelAnimationFrame(updateFrame);
      window.removeEventListener("scroll", updateActiveBranch);
      window.removeEventListener("resize", updateActiveBranch);
    };
  }, []);

  useLayoutEffect(() => {
    if (!root.current) return;
    const context = gsap.context(() => {
      if (!reducedMotion) {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((item) => {
          gsap.fromTo(item, { opacity: 0.2, y: 46, scale: 0.94 }, {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 92%",
              end: "top 58%",
              scrub: 0.7,
            },
          });
        });
      }
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  const jumpToSection = (index: number) => {
    const target = branchOrder[index];
    if (!target) return;
    setActiveBranch(target);
    window.history.replaceState(null, "", `#${target}`);
    document.getElementById(target)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <main
      ref={root}
      className={styles.detailPage}
      data-branch={activeBranch}
      onPointerMove={(event) => {
        cursor.current.x = event.clientX / window.innerWidth;
        cursor.current.y = event.clientY / window.innerHeight;
        cursor.current.active = true;
      }}
      onPointerLeave={() => { cursor.current.active = false; }}
    >
      <CursorHint />
      <div className={styles.networkBackdrop} aria-hidden="true">
        {theme === 'dark' && <Suspense fallback={null}><LivingNetworkScene
          hovered={activeBranch}
          reducedMotion={reducedMotion}
          cursor={cursor}
          onAnchorChange={() => undefined}
        /></Suspense>}
      </div>

      <nav className={styles.detailNav} aria-label="Neural portfolio navigation">
        <StaticHomeLink className={styles.homePageLink} aria-label="Carl Shi — Home" data-cursor-hint="Main">
          <span className={styles.navBrandMark} aria-hidden="true"><CsLogo /></span>
          <span className={styles.homeLabel}>Home</span>
        </StaticHomeLink>
        <div className={styles.navBalance}><ThemeSwitch transition="circle" /></div>
      </nav>

      <aside className={styles.sectionRail}>
        <p className={styles.railEyebrow}>On this page</p>
        <LineSidebar ariaLabel="Portfolio section navigation" items={sectionLinks} activeIndex={branchOrder.indexOf(activeBranch)} accentColor="var(--text)" textColor="var(--rail-muted)" markerColor="var(--line-bright)" markerLength={22} markerGap={10} maxShift={4} itemGap={18} fontSize={0.875} proximityRadius={65} smoothing={130} onItemClick={jumpToSection} />
      </aside>
      <nav className={styles.mobileSectionNav} aria-label="Portfolio section navigation">
        <label htmlFor="portfolio-section">On this page</label>
        <select id="portfolio-section" value={activeBranch} onChange={(event) => jumpToSection(branchOrder.indexOf(event.target.value as SpatialBranch))}>
          {sectionLinks.map((item, index) => <option key={item.href} value={branchOrder[index]}>{String(index + 1).padStart(2, "0")} · {item.label}</option>)}
        </select>
      </nav>

      {branchOrder.map((chapter, chapterIndex) => {
        const detail = details[chapter];
        return (
          <Fragment key={chapter}>
          {chapter === "about" && (
            <section className={styles.designExtension} aria-labelledby="design-experiments-title">
              <header className={styles.designExtensionIntro} data-reveal>
                <small>Beyond the case studies</small>
                <h2 id="design-experiments-title">Other Work</h2>
                <p>Explorations in game development, 3D animation, and visual storytelling.</p>
              </header>
              <div className={styles.designExtensionGrid} ref={motionVideos}>
                <figure data-reveal>
                  <video autoPlay muted loop playsInline preload="metadata" poster="/media/design-experiments/unity-game-poster.jpg" aria-hidden="true">
                    <source src="/media/design-experiments/unity-game.mp4" type="video/mp4" />
                  </video>
                  <figcaption>
                    <h3>Unity game scene</h3>
                    <p>A short top-down combat scene from a game I built in Unity.</p>
                  </figcaption>
                </figure>
                <figure data-reveal>
                  <video autoPlay muted loop playsInline preload="metadata" poster="/media/design-experiments/blender-animation-poster.jpg" aria-hidden="true">
                    <source src="/media/design-experiments/blender-animation.mp4" type="video/mp4" />
                  </video>
                  <figcaption>
                    <h3>Blender animation</h3>
                    <p>A rendered sci-fi sequence exploring composition, lighting, and motion.</p>
                  </figcaption>
                </figure>
              </div>
            </section>
          )}
          <section className={`${styles.chapter} ${chapter === "projects" ? styles.projectsChapter : ""} ${chapter === "skills" || chapter === "about" ? styles.editorialChapter : ""}`} id={chapter} data-chapter={chapter}>
            <header className={styles.chapterHeader} data-reveal={chapter === "projects" ? undefined : true}>
              <div className={styles.chapterMarker} aria-hidden="true">
                <span>{String(chapterIndex + 1).padStart(2, "0")}</span>
                <i />
              </div>
              <div>
                {chapter !== "skills" && chapter !== "about" && <span>{detail.eyebrow}</span>}
                {chapter === "projects" ? <h1><EditorialMotion text="Projects" /></h1> : <h2>{chapter}</h2>}
                {chapter !== "skills" && chapter !== "about" && <h3>{detail.title}</h3>}
                <p>{detail.intro}</p>
              </div>
            </header>

            {chapter === "projects" && (
              <>
                <AccordionGallery
                  typographyMotion
                  items={detail.items.map((item, index) => ({
                    title: projectSlugs[index] === "build-hope-content-operations" ? "Build Hope" : item.title,
                    category: item.signal,
                    description: item.description,
                    image: item.image!,
                    compactMedia: item.compactMedia,
                    href: `/homepage-poc/projects/case-studies#${projectSlugs[index]}`,
                  }))}
                />

                <section className={styles.projectMap} data-reveal aria-labelledby="project-map-title">
                  <header>
                    <small>PROJECT SYSTEM MAP</small>
                    <h4 id="project-map-title">One practice across different product contexts.</h4>
                    <p>The projects move between digital and physical environments, and between decision support and experiential interaction.</p>
                  </header>
                  <div className={styles.quadrantMap}>
                    <span className={styles.axisTop}>Decision support</span>
                    <span className={styles.axisBottom}>Experiential interaction</span>
                    <span className={styles.axisLeft}>Digital interface</span>
                    <span className={styles.axisRight}>Physical environment</span>
                    {detail.items.map((item, index) => (
                      <div className={styles.mapNode} data-project={index} key={`map-${item.title}`}>
                        <div className={styles.mapThumb}>
                          <Image src={item.image!} alt="" fill sizes="120px" unoptimized />
                        </div>
                        <strong>{item.title}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {chapter === "skills" && (
              <div className={styles.skillsOverview} data-skills-overview>
                {detail.items.map((item, index) => (
                  <article className={styles.skillEntry} key={item.title} aria-labelledby={`skill-category-${index}`}>
                    <h3 id={`skill-category-${index}`}>{item.title}</h3>
                    <div className={styles.skillBody}>
                      <p>{item.description}</p>
                      <ul className={styles.skillList} aria-label={`${item.title} skills`}>
                        {item.skills?.map((skill) => <li className={skill.startsWith('Prior exposure:') ? styles.skillQualification : undefined} key={skill}>{skill}</li>)}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {chapter === "systems" && (
              <ol className={styles.systemFlow}>
                {detail.items.map((item, index) => (
                  <li data-reveal key={item.title}>
                    <div className={styles.systemGlyph} data-step={index} aria-hidden="true"><i /><i /><i /></div>
                    <span>{item.signal}</span>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ol>
            )}

            {chapter === "education" && (
              <div className={styles.educationTimeline}>
                {detail.items.map((item, index) => (
                  <article
                    data-reveal
                    key={item.title}
                    tabIndex={0}
                    aria-label={`${item.title}: ${item.description}`}
                  >
                      <div className={styles.schoolLogoPanel}>
                        {index === 0
                          ? <Image src="/education/nyu-logo.svg" alt="New York University" width={210} height={36} unoptimized />
                          : <Image src="/education/usc-primary-official.png" alt="University of Southern California" width={1024} height={219} unoptimized />}
                      </div>
                    <div>
                      <small>{item.signal}</small>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {chapter === "about" && (
              <div className={styles.aboutField}>
                <div className={styles.aboutEducation}>
                  <h3>Education</h3>
                  <div>
                    <p><strong>USC Iovine and Young Academy</strong><span>M.S. Integrated Design, Business and Technology · Expected May 2028</span></p>
                    <p><strong>New York University</strong><span>B.S. Computer Science · May 2026</span></p>
                  </div>
                </div>
              </div>
            )}

            <p className={styles.chapterClosing} data-reveal>{detail.closing}</p>
            {chapter === "about" && <div className={styles.contactActions}>
              <a href="mailto:carlshi617@gmail.com?subject=Portfolio%20conversation">carlshi617@gmail.com <span aria-hidden="true">↗</span></a>
              <a href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">View résumé <span>PDF ↗</span></a>
            </div>}
          </section>
          </Fragment>
        );
      })}

      <footer className={styles.detailFooter}>
        <StaticHomeLink className={styles.homePageLink}>
          <span className={styles.navBrandMark} aria-hidden="true"><CsLogo /></span>
          Return to Home Page
        </StaticHomeLink>
        <a href="#projects">Back to the beginning <span aria-hidden="true">↑</span></a>
      </footer>
    </main>
  );
}
