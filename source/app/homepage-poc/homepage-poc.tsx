"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { CursorHint } from "./cursor-hint";
import { CsLogo } from "./cs-logo";
import { IvoryHome } from "./ivory-home";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LivingNetworkScene, type SpatialBranch } from "./spatial-scenes";
import styles from "./homepage-poc.module.css";

type Branch = SpatialBranch;

const branches: Array<{
  id: Branch;
  label: string;
  note: string;
  reveal: string;
  href: string;
}> = [
  { id: "projects", label: "Projects", note: "Selected work", reveal: "AI products · connected prototypes · product systems", href: "/homepage-poc/projects#projects" },
  { id: "skills", label: "Skills", note: "How I build", reveal: "Strategy · AI product · interaction · prototyping", href: "/homepage-poc/projects#skills" },
];

const projectPreviews = [
  {
    title: "Build Hope",
    image: "/media/build-hope-content-operations/hero-operating-model.webp",
  },
  {
    title: "AI PC Build Advisor",
    image: "/media/ai-pc-build-advisor/working-recommendation-review.png",
  },
  {
    title: "Dog Behavior Camera",
    image: "/media/dog-behavior-camera/case-study/detection-moving-frame.png",
  },
  {
    title: "Luggage Helper",
    image: "/media/luggage-helper/app-showcase-flow.png",
  },
  {
    title: "Music Pulse",
    image: "/media/music-pulse/device-front.png",
  },
] as const;

const skillPreviews = [
  { title: "Strategy", icon: "strategy" },
  { title: "AI", icon: "ai" },
  { title: "Design", icon: "design" },
  { title: "Build", icon: "build" },
] as const;

function PreviewOrbit({ active, kind }: { active: boolean; kind: "projects" | "skills" }) {
  const orbitRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planetsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const elapsedRef = useRef(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const items = kind === "projects" ? projectPreviews : skillPreviews;

  useLayoutEffect(() => {
    const element = orbitRef.current;
    if (!element) return;
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The SVG line and every planet share this exact motion path.
  const { width, height } = size;
  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.595; // 75% wider along the long axis.
  const ry = height * 0.299; // 30% taller along the short axis.
  const path = width && height
    ? `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`
    : "";

  useLayoutEffect(() => {
    const line = pathRef.current;
    if (!line || !path) return;
    const length = line.getTotalLength();
    const duration = 30000;
    const base = elapsedRef.current;
    const startedAt = performance.now();
    let frame = 0;

    const positionPlanets = (now: number) => {
      const progress = ((base + (active ? now - startedAt : 0)) % duration) / duration;
      planetsRef.current.forEach((planet, index) => {
        if (!planet) return;
        const point = line.getPointAtLength(length * ((progress + index / items.length) % 1));
        // The motion point stays at the center of each circular cover.
        const coverCenterY = kind === "projects" ? 46 : 43;
        const counterRotation = kind === "projects" ? 18 : -18;
        planet.style.transform = `translate3d(${point.x - 66}px, ${point.y - coverCenterY}px, 0) rotate(${counterRotation}deg)`;
      });
      if (active) frame = requestAnimationFrame(positionPlanets);
    };

    positionPlanets(startedAt);
    return () => {
      cancelAnimationFrame(frame);
      if (active) elapsedRef.current = (base + performance.now() - startedAt) % duration;
    };
  }, [path, active, kind, items.length]);

  return (
    <span className={styles.projectOrbit} ref={orbitRef}>
      {path && (
        <svg className={styles.projectOrbitLine} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <path ref={pathRef} d={path} />
        </svg>
      )}
      {items.map((item, index) => (
        <span
          className={`${styles.projectFragment} ${kind === "skills" ? styles.skillOrbitFragment : ""}`}
          key={item.title}
          ref={(element) => { planetsRef.current[index] = element; }}
          style={{ visibility: path ? "visible" : "hidden" }}
        >
          <span className={`${styles.projectFragmentMedia} ${kind === "skills" ? styles.skillOrbitMedia : ""}`}>
            {"image" in item ? <Image src={item.image} alt="" fill sizes="120px" unoptimized /> : <Glyph name={item.icon} />}
          </span>
          <span className={styles.projectFragmentCopy}>
            <strong>{item.title}</strong>
          </span>
        </span>
      ))}
    </span>
  );
}

type GlyphName = "projects" | "skills" | "about" | "strategy" | "ai" | "design" | "build" | "systems" | "experience" | "location" | "education";

function Glyph({ name }: { name: GlyphName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...common}>
      {name === "projects" && <><rect x="3.5" y="4" width="7" height="7" /><rect x="13.5" y="4" width="7" height="7" /><rect x="3.5" y="14" width="7" height="6" /><path d="M14 17h6M17 14v6" /></>}
      {name === "skills" && <><path d="m14.5 6.5 3-3 3 3-3 3M4 20l7.7-7.7" /><path d="M13.3 4.7a5 5 0 0 0 6 6L10 20H4v-6l9.3-9.3Z" /></>}
      {name === "about" && <><circle cx="12" cy="8" r="3.25" /><path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" /><circle cx="12" cy="12" r="9" opacity=".32" /></>}
      {name === "strategy" && <><circle cx="12" cy="12" r="8" /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" /></>}
      {name === "ai" && <><path d="M8 8h8v8H8zM12 3v3M12 18v3M3 12h3M18 12h3" /><circle cx="12" cy="12" r="1.7" /></>}
      {name === "design" && <><path d="m4 20 4.2-1 10.9-10.9a2.2 2.2 0 0 0-3.2-3.2L5 15.8 4 20Z" /><path d="m14.5 6.5 3 3" /></>}
      {name === "build" && <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9" /></>}
      {name === "systems" && <><circle cx="5" cy="12" r="2" /><circle cx="17" cy="6" r="2" /><circle cx="19" cy="17" r="2" /><path d="m7 11 8.2-4M7 13l10 3.2M17.7 8l.9 7" /></>}
      {name === "experience" && <><path d="M4 18c2.5-7 6-11 11-12" /><path d="m12 4 3 2-2 3" /><circle cx="5" cy="18" r="1.5" /><circle cx="18" cy="5" r="1.5" /></>}
      {name === "location" && <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></>}
      {name === "education" && <><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M7 12v4c2.8 2 7.2 2 10 0v-4M20 10v5" /></>}
    </svg>
  );
}

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

export function HomepagePoc() {
  const root = useRef<HTMLElement>(null);
  const cursor = useRef({ x: 0.5, y: 0.5, active: false });
  const previewActive = useRef<Branch | null>(null);
  const [hoveredBranch, setHoveredBranch] = useState<Branch | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("carl-portfolio-home-theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.dataset.portfolioTheme = saved;
      }
    } catch { /* The switch also works when storage is unavailable. */ }
  }, []);

  const switchTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setHoveredBranch(null);
    previewActive.current = null;
    setTheme(next);
    document.documentElement.dataset.portfolioTheme = next;
    try { localStorage.setItem("carl-portfolio-home-theme", next); } catch { /* Optional preference. */ }
  };

  useLayoutEffect(() => {
    if (!root.current) return;
    const context = gsap.context(() => {
      gsap.from(`.${styles.archiveCanvas}`, {
        opacity: 0,
        scale: 1.035,
        duration: reducedMotion ? 0.01 : 1.5,
        ease: "power3.out",
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <main ref={root} className={styles.poc} data-active={hoveredBranch ?? ""} data-theme={theme}>
      <CursorHint theme={theme} />
      <h1 className={styles.srOnly}>Carl Shi — Technical Product, Technical Program, and AI Product</h1>
      <nav className={styles.pocNav} aria-label="Primary navigation">
        <Link className={styles.identity} href="/" aria-label="Carl Shi — Home">
          <span className={styles.identityMark}><CsLogo /></span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/homepage-poc/projects#projects">Projects</Link>
          <Link href="/homepage-poc/projects#about">About</Link>
          <button className={styles.cosmosSwitch} onClick={switchTheme} aria-label={theme === "light" ? "Visit another world — switch to dark theme" : "Visit another world — switch to Ivory Cosmos"} aria-pressed={theme === "light"} title="Visit another world">
            <svg viewBox="0 0 48 26" aria-hidden="true" fill="none"><ellipse cx="24" cy="13" rx="21" ry="8" /><circle className={styles.switchPlanet} cx="12" cy="13" r="4" /><circle cx="39" cy="8" r="1" /></svg>
            <span className={styles.switchCaption}>Visit another world</span>
          </button>
        </div>
      </nav>

      <section
        className={styles.archiveState}
        aria-hidden={theme === "light"}
        inert={theme === "light"}
        aria-label="Carl Shi neural portfolio archive"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          cursor.current.x = (event.clientX - bounds.left) / bounds.width;
          cursor.current.y = (event.clientY - bounds.top) / bounds.height;
          cursor.current.active = true;
        }}
        onPointerLeave={() => {
          cursor.current.active = false;
          previewActive.current = null;
          setHoveredBranch(null);
        }}
      >
        <div className={styles.archiveCanvas} aria-hidden="true">
          <LivingNetworkScene
            enabled={theme === "dark"}
            hovered={hoveredBranch}
            reducedMotion={reducedMotion}
            cursor={cursor}
            onAnchorChange={(branch) => {
              if (theme !== "dark") return;
              if (!branch && previewActive.current) return;
              setHoveredBranch(branch);
            }}
          />
        </div>

        <div className={styles.archiveHeader}>
          <span>Neural portfolio system</span>
          <span>AI · Product · Design</span>
        </div>

        <div className={styles.identityCore}>
          <strong>Carl Shi</strong>
          <p className={styles.identityIntro}>I build at the intersection of AI, product, design, and technology. Currently exploring Product, Technical PM, and AI Product opportunities.</p>
          <div className={styles.identityActions}>
            <a href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className={styles.archiveNodes}>
          {branches.map((branch) => (
            <Link
              key={branch.id}
              href={branch.href}
              className={`${styles.archiveNode} ${styles[branch.id]} ${hoveredBranch === branch.id ? styles.discovered : ""}`}
              data-branch={branch.id}
              data-cursor-hint={hoveredBranch === branch.id ? (branch.id === "projects" ? "Explore projects" : "Explore skills") : undefined}
              aria-label={branch.id === "projects" ? "Explore all projects" : `Explore ${branch.label}`}
              onFocus={() => setHoveredBranch(branch.id)}
              onBlur={() => {
                previewActive.current = null;
                setHoveredBranch(null);
              }}
              onPointerEnter={() => {
                if (hoveredBranch !== branch.id) return;
                previewActive.current = branch.id;
              }}
              onPointerMove={() => {
                if (hoveredBranch === branch.id) {
                  previewActive.current = branch.id;
                }
              }}
              onPointerLeave={() => {
                previewActive.current = null;
                setHoveredBranch(null);
              }}
            >
              <span className={styles.archiveAnchor} aria-hidden="true"><Glyph name={branch.id === "projects" ? "projects" : "skills"} /></span>
              <span className={styles.archiveLabel}>
                <strong>{branch.label}</strong>
                <small>{branch.note}</small>
              </span>
              <span className={styles.archiveReveal}>{branch.reveal}</span>
              <span className={styles.archiveArrow} aria-hidden="true">↗</span>
              {branch.id === "projects" && (
                <span className={styles.projectPreviewField} aria-hidden="true">
                  <span className={styles.projectPreviewAura} />
                  <span className={styles.projectPreviewCore}>
                    <strong>Projects</strong>
                  </span>
                  <PreviewOrbit kind="projects" active={hoveredBranch === "projects" && !reducedMotion} />
                </span>
              )}
              {branch.id === "skills" && (
                <span className={`${styles.projectPreviewField} ${styles.skillsOrbitField}`} aria-hidden="true">
                  <span className={styles.projectPreviewAura} />
                  <span className={styles.projectPreviewCore}>
                    <strong>Skills</strong>
                  </span>
                  <PreviewOrbit kind="skills" active={hoveredBranch === "skills" && !reducedMotion} />
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className={styles.archiveFooter}>
          <span>Move through the system</span>
          <span>Hover to reveal · Click to navigate</span>
        </div>
      </section>
      {theme === "light" && <IvoryHome />}
    </main>
  );
}
