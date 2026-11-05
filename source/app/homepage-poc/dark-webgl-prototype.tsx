"use client";

/* eslint-disable @next/next/no-img-element -- project evidence is rendered as a shader-toned planet texture */

import { Canvas, useThree } from "@react-three/fiber";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Vector2 } from "three";
import { CsLogo } from "./cs-logo";
import { projectPlanets, skillSpacecraft, type SpaceSystemItem } from "./space-system.data";
import styles from "./dark-webgl-prototype.module.css";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + 1.0), f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = mat2(1.58, -1.18, 1.18, 1.58) * p + 0.17;
      amplitude *= 0.48;
    }
    return value;
  }

  float band(float distanceToLine, float width) {
    return 1.0 - smoothstep(width * 0.35, width, distanceToLine);
  }

  void main() {
    vec2 p = vUv - 0.5;
    p.x *= uResolution.x / max(uResolution.y, 1.0);
    float r = length(p);
    float angle = atan(p.y, p.x);
    float ax = abs(p.x);
    float side = sign(p.x + 0.0001);
    float outer = smoothstep(0.12, 0.95, ax);
    float centerGuard = smoothstep(0.245, 0.37, r);
    float grain = fbm(vec2(ax * 9.0 - angle * 0.8, p.y * 12.0));

    vec3 background = vec3(0.0025, 0.006, 0.0095);
    float distant = hash21(floor((p + 1.4) * 82.0));
    float starCell = step(0.994, distant) * (1.0 - smoothstep(0.0, 0.12, length(fract((p + 1.4) * 82.0) - 0.5)));
    background += vec3(0.34, 0.62, 0.78) * starCell * 0.32;

    float taper = mix(0.009, 0.040, outer);
    float lift = 0.13 + 0.17 * sin((ax - 0.1) * 2.55 + side * 0.28);
    float sweep = 0.020 * sin(ax * 11.0 + grain * 2.5);
    float upper = band(abs(p.y - lift - sweep), taper);
    float lower = band(abs(p.y + lift * 0.92 + sweep * 0.7), taper * 0.82);
    float merge = band(abs(p.y - side * (0.065 + 0.10 * smoothstep(0.28, 0.8, ax))), taper * 0.32);
    float wingMask = smoothstep(0.21, 0.39, r) * (1.0 - smoothstep(1.02, 1.24, ax));

    float spiralPhaseA = angle * 2.0 - log(max(r, 0.001)) * 5.7;
    float spiralPhaseB = angle * 2.0 - log(max(r, 0.001)) * 5.7 + 3.14159;
    float spiralA = pow(max(0.0, cos(spiralPhaseA)), 20.0);
    float spiralB = pow(max(0.0, cos(spiralPhaseB)), 20.0);
    float spiralMask = smoothstep(0.225, 0.275, r) * (1.0 - smoothstep(0.38, 0.49, r));

    float leftSide = step(p.x, 0.0);
    float upperWeight = mix(0.44, 0.86, leftSide);
    float lowerWeight = mix(0.78, 0.38, leftSide);
    float ribbons = (upper * upperWeight + lower * lowerWeight + merge * 0.30) * wingMask;
    float filaments = 0.50 + 0.50 * pow(abs(sin((p.y + grain * 0.018) * 210.0)), 8.0);
    ribbons *= mix(0.62, 0.96, grain) * filaments;
    ribbons += (spiralA + spiralB) * spiralMask * 0.22;

    float innerNoise = fbm(vec2(angle * 2.8, r * 38.0));
    float photonRing = exp(-abs(r - 0.244) * 110.0);
    float halo = exp(-abs(r - 0.276) * 32.0) * 0.28;
    float diskRadius = length(vec2(p.x, p.y * 2.55));
    float disk = exp(-abs(diskRadius - 0.305) * 27.0);
    disk *= smoothstep(0.19, 0.27, r) * mix(0.48, 1.0, innerNoise);
    float lensTop = exp(-abs(length(vec2(p.x, (p.y - 0.018) * 1.18)) - 0.264) * 82.0);
    float lensBottom = exp(-abs(length(vec2(p.x, (p.y + 0.018) * 1.18)) - 0.264) * 82.0) * 0.68;

    vec3 ice = vec3(0.47, 0.73, 0.86);
    vec3 silver = vec3(0.88, 0.95, 0.98);
    vec3 color = background;
    color += mix(ice, silver, grain) * ribbons * 0.57 * centerGuard;
    color += ice * ribbons * ribbons * 0.20;
    color += mix(ice, silver, 0.72) * (photonRing * 0.72 + halo * 0.82 + disk * 0.88 + lensTop * 0.42 + lensBottom * 0.24);

    float horizon = 1.0 - smoothstep(0.217, 0.224, r);
    color *= 1.0 - horizon;
    color += vec3(0.0, 0.001, 0.002) * horizon;

    float vignette = 1.0 - smoothstep(0.72, 1.28, length(p * vec2(0.72, 1.0)));
    color *= 0.54 + 0.46 * vignette;
    color = pow(color, vec3(0.86));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function StaticGravityShader() {
  const { size, invalidate } = useThree();
  const uniforms = useMemo(() => ({ uResolution: { value: new Vector2(1, 1) } }), []);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
    invalidate();
  }, [invalidate, size.height, size.width, uniforms]);

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

function ProjectPlanet({ item, index }: { item: SpaceSystemItem; index: number }) {
  return (
    <span className={styles.projectVisual} data-tone={index} aria-hidden="true">
      <span className={styles.projectRing} />
      <span className={styles.projectSphere}><img src={item.image} alt="" width="160" height="160" /></span>
    </span>
  );
}

function TechObject({ item }: { item: SpaceSystemItem }) {
  return (
    <span className={styles.techVisual} data-visual={item.visual} aria-hidden="true">
      <i /><i /><i /><i /><b /><em />
    </span>
  );
}

function ObjectLink({ item, side, index, active, setActive }: {
  item: SpaceSystemItem;
  side: "projects" | "skills";
  index: number;
  active: string | null;
  setActive: (id: string | null) => void;
}) {
  return (
    <Link
      href={item.href}
      className={styles.objectLink}
      data-side={side}
      data-slot={index + 1}
      data-active={active === item.id}
      aria-label={`${item.title}. ${item.summary}`}
      onPointerEnter={() => setActive(item.id)}
      onPointerLeave={() => setActive(null)}
      onFocus={() => setActive(item.id)}
      onBlur={() => setActive(null)}
    >
      {side === "projects" ? <ProjectPlanet item={item} index={index} /> : <TechObject item={item} />}
      <span className={styles.objectCopy}>
        <strong>{item.title}</strong>
        <small>{item.summary}</small>
      </span>
    </Link>
  );
}

export function DarkWebglPrototype() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <main className={styles.page} data-active={active ?? ""}>
      <nav className={styles.nav} aria-label="Prototype navigation">
        <Link className={styles.home} href="/" aria-label="Carl Shi — current homepage"><CsLogo /><span>Home</span></Link>
        <span className={styles.studyLabel}>WebGL study</span>
        <div className={styles.navLinks}>
          <Link href="/homepage-poc/projects#projects">Projects</Link>
          <Link href="/homepage-poc/projects#about">About</Link>
        </div>
      </nav>

      <section className={styles.stage} aria-label="Static WebGL dark homepage prototype">
        <div className={styles.canvas} aria-hidden="true">
          <Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}>
            <StaticGravityShader />
          </Canvas>
        </div>

        <header className={styles.identity}>
          <h1>Carl Shi</h1>
          <p className={styles.positioning}>AI product, technical product, and product strategy</p>
          <p className={styles.intro}>I build at the intersection of AI, product, design, and technology—turning ambiguous opportunities into testable systems.</p>
          <Link className={styles.resume} href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</Link>
        </header>

        <section className={`${styles.collection} ${styles.projects}`} aria-labelledby="webgl-projects-title">
          <h2 id="webgl-projects-title">Projects</h2>
          {projectPlanets.map((item, index) => <ObjectLink key={item.id} item={item} index={index} side="projects" active={active} setActive={setActive} />)}
        </section>

        <section className={`${styles.collection} ${styles.skills}`} aria-labelledby="webgl-skills-title">
          <h2 id="webgl-skills-title">Skills</h2>
          {skillSpacecraft.map((item, index) => <ObjectLink key={item.id} item={item} index={index} side="skills" active={active} setActive={setActive} />)}
        </section>

        <p className={styles.note}>Static shader prototype · no entrance motion</p>
      </section>
    </main>
  );
}
