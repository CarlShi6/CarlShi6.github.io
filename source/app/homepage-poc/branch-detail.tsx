"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent, WheelEvent } from "react";
import { AccordionGallery } from "./accordion-gallery";
import { CursorHint } from "./cursor-hint";
import { CsLogo } from "./cs-logo";
import { LivingNetworkScene, type SpatialBranch } from "./spatial-scenes";
import styles from "./unified-detail.module.css";

gsap.registerPlugin(ScrollTrigger);

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
        description: "A real nonprofit client engagement connecting content ideation, planning, publishing, and learning through a sustainable operating model.",
        signal: "Client engagement · Content operations · Implementation roadmap",
        image: "/media/build-hope-content-operations/hero-operating-model.webp",
        compactMedia: true,
      },
      {
        title: "AI PC Build Advisor",
        description: "An AI-powered advisor that translates budget, workload, performance, and aesthetic preferences into clear, compatible part recommendations.",
        signal: "Natural-language guidance · Compatibility · Comparison",
        image: "/media/ai-pc-build-advisor/working-build-needs.png",
      },
      {
        title: "Dog Behavior Camera",
        description: "A physical AI prototype connecting visual detection, behavior interpretation, and a responsive hardware output.",
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
        description: "A five-day nonprofit client sprint with Build Hope, software engineering work at Xfanatical, and independent AI-assisted product prototyping.",
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
const skillIcons = ["</>", "AI", "↗", "✎", "⚙"] as const;
const aboutIcons = ["product", "technical", "experience", "location"] as const;

function AboutGlyph({ name }: { name: (typeof aboutIcons)[number] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...common}>
      {name === "product" && <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="m14.5 9.5 4-4M16 5.5h2.5V8" /></>}
      {name === "technical" && <><path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M14 5l-4 14" /></>}
      {name === "experience" && <><rect x="3.5" y="7.5" width="17" height="11" rx="1.5" /><path d="M9 7.5V5h6v2.5M3.5 12h17M10 12v2h4v-2" /></>}
      {name === "location" && <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.25" /></>}
    </svg>
  );
}

function startSkillDrag(event: ReactPointerEvent<HTMLUListElement>) {
  if (event.pointerType !== "mouse" || event.button !== 0) return;
  const rail = event.currentTarget;
  rail.dataset.dragging = "true";
  rail.dataset.dragStartX = String(event.clientX);
  rail.dataset.dragStartScroll = String(rail.scrollLeft);
  rail.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function moveSkillDrag(event: ReactPointerEvent<HTMLUListElement>) {
  const rail = event.currentTarget;
  if (rail.dataset.dragging !== "true") return;
  const startX = Number(rail.dataset.dragStartX ?? event.clientX);
  const startScroll = Number(rail.dataset.dragStartScroll ?? rail.scrollLeft);
  rail.scrollLeft = startScroll - (event.clientX - startX);
  event.preventDefault();
}

function stopSkillDrag(event: ReactPointerEvent<HTMLUListElement>) {
  const rail = event.currentTarget;
  delete rail.dataset.dragging;
  delete rail.dataset.dragStartX;
  delete rail.dataset.dragStartScroll;
  if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
}

function scrollSkillRailByWheel(event: WheelEvent<HTMLUListElement>) {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  event.currentTarget.scrollLeft += event.deltaY;
  event.preventDefault();
}

function scrollSkillRailByKey(event: KeyboardEvent<HTMLUListElement>) {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.currentTarget.scrollBy({ left: event.key === "ArrowRight" ? 120 : -120, behavior: "smooth" });
  event.preventDefault();
}
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
        const visible = sections.find((section) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= anchor && bounds.bottom > anchor;
        });
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
      gsap.from(`.${styles.archiveHeroCopy} > *`, {
        opacity: 0,
        y: 28,
        duration: reducedMotion ? 0.01 : 0.9,
        stagger: reducedMotion ? 0 : 0.08,
        ease: "power3.out",
      });

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
        <LivingNetworkScene
          hovered={activeBranch}
          reducedMotion={reducedMotion}
          cursor={cursor}
          onAnchorChange={() => undefined}
        />
      </div>

      <nav className={styles.detailNav} aria-label="Neural portfolio navigation">
        <Link className={styles.homePageLink} href="/" aria-label="Carl Shi — Home">
          <span className={styles.navBrandMark} aria-hidden="true"><CsLogo /></span>
        </Link>
        <div className={styles.branchNav}>
          {branchOrder.map((item) => (
            <Link href={`#${item}`} data-active={item === activeBranch} aria-current={item === activeBranch ? "location" : undefined} key={item}>
              {item}
            </Link>
          ))}
        </div>
        <span className={styles.navBalance} aria-hidden="true" />
      </nav>

      <header className={styles.archiveHero}>
        <div className={styles.archiveHeroSignal} aria-hidden="true"><i /><i /><i /></div>
        <div className={styles.archiveHeroCopy}>
          <span>Carl Shi · Product Archive</span>
          <h1>One practice.<br />Three connected views.</h1>
          <p>Projects, capabilities, and identity live in one continuous field. Each project opens into a deeper case-study layer.</p>
        </div>
        <div className={styles.archiveIndex} aria-hidden="true">
          <span>01</span>
          <i />
          <span>03</span>
        </div>
      </header>

      {branchOrder.map((chapter, chapterIndex) => {
        const detail = details[chapter];
        return (
          <Fragment key={chapter}>
          {chapter === "about" && (
            <section className={styles.designExtension} aria-labelledby="design-experiments-title">
              <header className={styles.designExtensionIntro} data-reveal>
                <small>Beyond the case studies</small>
                <h2 id="design-experiments-title">Design experiments</h2>
                <p>Two explorations in interactive and rendered media.</p>
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
          <section className={styles.chapter} id={chapter} data-chapter={chapter}>
            <header className={styles.chapterHeader} data-reveal>
              <div className={styles.chapterMarker} aria-hidden="true">
                <span>{String(chapterIndex + 1).padStart(2, "0")}</span>
                <i />
              </div>
              <div>
                <span>{detail.eyebrow}</span>
                <h2>{chapter}</h2>
                <h3>{detail.title}</h3>
                <p>{detail.intro}</p>
              </div>
            </header>

            {chapter === "projects" && (
              <>
                <AccordionGallery
                  items={detail.items.map((item, index) => ({
                    title: item.title,
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
              <div className={styles.skillConstellation} aria-label="Skill categories; hover or focus each category to reveal details">
                <div className={styles.skillConnections} aria-hidden="true"><i /><i /><i /><i /></div>
                {detail.items.map((item, index) => (
                  <article className={styles.skillNode} data-node={index} data-reveal key={item.title} tabIndex={0}>
                    <span className={styles.skillNodeIcon} data-node={index} aria-hidden="true">{skillIcons[index]}</span>
                    <small>{item.signal}</small>
                    <h4>{item.title}</h4>
                    <div className={styles.skillReveal}>
                      <p>{item.description}</p>
                      <ul
                        aria-label={`${item.title} skills. Drag horizontally or use the arrow keys to scroll.`}
                        tabIndex={0}
                        onPointerDown={startSkillDrag}
                        onPointerMove={moveSkillDrag}
                        onPointerUp={stopSkillDrag}
                        onPointerCancel={stopSkillDrag}
                        onWheel={scrollSkillRailByWheel}
                        onKeyDown={scrollSkillRailByKey}
                      >
                        {item.skills?.map((skill) => <li key={skill}>{skill}</li>)}
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
                <div className={styles.aboutGrid}>
                  {detail.items.map((item, index) => (
                    <article data-reveal key={item.title} tabIndex={0} aria-label={`${item.title}: ${item.description}`}>
                      <span className={styles.aboutGlyph} data-icon={index} aria-hidden="true">
                        <AboutGlyph name={aboutIcons[index] ?? "product"} />
                      </span>
                      <small>{item.signal}</small>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
                <div className={styles.aboutEducation}>
                  <h4>Education</h4>
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
        <Link className={styles.homePageLink} href="/">
          <span className={styles.navBrandMark} aria-hidden="true"><CsLogo /></span>
          Return to Home Page
        </Link>
        <a href="#projects">Back to the beginning <span aria-hidden="true">↑</span></a>
      </footer>
    </main>
  );
}
