"use client";

import { Canvas, useThree } from "@react-three/fiber";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Vector2 } from "three";
import { CsLogo } from "./cs-logo";
import { projectPlanets, skillSpacecraft, type SpaceSystemItem } from "./space-system.data";
import styles from "./dark-webgl-reference-prototype.module.css";

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

  #define PI 3.14159265359

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
    float v = 0.0;
    float a = 0.50;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = mat2(1.58, -1.12, 1.12, 1.58) * p + 0.17;
      a *= 0.46;
    }
    return v;
  }

  vec3 acesTone(vec3 x) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }

  vec3 gravityRibbon(
    vec2 uv,
    float side,
    float outerY,
    float mergeY,
    float bend,
    float seed,
    vec3 ivory,
    vec3 ice,
    vec3 gold
  ) {
    float sx = (uv.x - 0.5) * side;
    float t = clamp((sx - 0.105) / 0.43, 0.0, 1.0);
    float presence = smoothstep(0.095, 0.145, sx) * (1.0 - smoothstep(0.49, 0.535, sx));
    if (presence < 0.001) return vec3(0.0);

    float centerY = mix(mergeY, outerY, t);
    centerY += bend * sin(t * PI);
    centerY += sin(t * PI * 2.0 + seed) * 0.018 * t;
    centerY += sin(t * PI * 3.0 + seed * 1.7) * 0.008 * t * t;

    float width = mix(0.0065, 0.038, pow(t, 0.78));
    float d = abs((uv.y - 0.5) - centerY);
    float core = exp(-pow(d / max(width, 0.0001), 2.0));
    float halo = exp(-pow(d / max(width * 2.4, 0.0001), 2.0));

    float domain = (uv.x * 13.0 + uv.y * 7.0) * side + seed * 3.0;
    float grain = noise(vec2(domain, d * 42.0 - t * 4.0)) * 0.68;
    grain += noise(vec2(domain * 2.13 + seed, d * 81.0 + t * 7.0)) * 0.32;
    float filament = 0.62 + 0.38 * pow(0.5 + 0.5 * sin(d / width * 13.0 + grain * 6.0), 3.0);
    float longitudinal = 0.78 + 0.22 * sin(t * 34.0 + grain * 5.0 + seed);

    vec3 temperature = mix(ivory, ice, smoothstep(0.34, 0.92, t));
    temperature = mix(temperature, gold, (1.0 - t) * 0.16);
    return presence * (temperature * core * filament * longitudinal * 1.10 + temperature * halo * 0.075);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= uResolution.x / max(uResolution.y, 1.0);
    float r = length(p);
    float ang = atan(p.y, p.x);

    vec3 navy = vec3(0.0015, 0.006, 0.012);
    vec3 deepBlue = vec3(0.025, 0.095, 0.17);
    vec3 ice = vec3(0.53, 0.72, 0.91);
    vec3 ivory = vec3(1.0, 0.88, 0.65);
    vec3 gold = vec3(1.0, 0.48, 0.15);
    vec3 color = navy;

    float nebulaA = fbm(p * 2.8 + vec2(1.7, -0.8));
    float nebulaB = fbm(p * 5.5 + vec2(-3.2, 2.4));
    float nebulaMask = smoothstep(0.48, 0.82, nebulaA) * (0.32 + nebulaB * 0.68);
    color += deepBlue * nebulaMask * 0.16;

    float stars = step(0.9984, hash21(floor((p + 1.8) * 96.0)));
    stars *= 1.0 - smoothstep(0.0, 0.095, length(fract((p + 1.8) * 105.0) - 0.5));
    color += mix(ice, ivory, hash21(floor(p * 87.0))) * stars * 0.42;

    vec3 ribbons = vec3(0.0);
    ribbons += gravityRibbon(uv, -1.0,  0.335,  0.145,  0.100, 0.45, ivory, ice, gold);
    ribbons += gravityRibbon(uv, -1.0,  0.105,  0.145, -0.095, 1.75, ivory, ice, gold);
    ribbons += gravityRibbon(uv, -1.0, -0.105, -0.145,  0.090, 3.10, ivory, ice, gold);
    ribbons += gravityRibbon(uv, -1.0, -0.335, -0.145, -0.105, 4.35, ivory, ice, gold);
    ribbons += gravityRibbon(uv,  1.0,  0.320,  0.145,  0.105, 5.15, ivory, ice, gold);
    ribbons += gravityRibbon(uv,  1.0,  0.095,  0.145, -0.100, 2.40, ivory, ice, gold);
    ribbons += gravityRibbon(uv,  1.0, -0.100, -0.145,  0.095, 0.95, ivory, ice, gold);
    ribbons += gravityRibbon(uv,  1.0, -0.325, -0.145, -0.105, 3.75, ivory, ice, gold);
    color += ribbons;

    float polarNoise = fbm(vec2(ang * 1.45, log(max(r, 0.001)) * 6.4));
    float spiralPhase = ang * 2.0 - log(max(r, 0.001)) * 5.6 + polarNoise * 1.35;
    float armA = pow(max(0.0, cos(spiralPhase)), 7.0);
    float armB = pow(max(0.0, cos(spiralPhase + PI)), 7.0);
    float vortexMask = smoothstep(0.228, 0.278, r) * (1.0 - smoothstep(0.43, 0.57, r));
    float vortexGrain = 0.40 + 0.75 * fbm(vec2(ang * 4.0 + polarNoise, r * 31.0));
    color += mix(ivory, ice, smoothstep(0.30, 0.56, r)) * (armA + armB) * vortexMask * vortexGrain * 0.30;

    float ringWarp = 0.004 * sin(ang * 7.0 + polarNoise * 4.0);
    float photon = exp(-abs(r - (0.232 + ringWarp)) * 160.0);
    float halo = exp(-abs(r - 0.252) * 44.0);
    float diskR = length(vec2(p.x, p.y * 2.65));
    float diskWarp = 0.012 * sin(ang * 5.0 + polarNoise * 5.0);
    float disk = exp(-abs(diskR - (0.315 + diskWarp)) * 29.0);
    float diskTexture = 0.26 + 1.05 * fbm(vec2(ang * 5.3 + polarNoise, diskR * 46.0));
    disk *= diskTexture * smoothstep(0.205, 0.30, r);

    float upperLens = exp(-abs(length(vec2(p.x, (p.y - 0.017) * 1.32)) - 0.254) * 78.0);
    float lowerLens = exp(-abs(length(vec2(p.x, (p.y + 0.021) * 1.32)) - 0.254) * 78.0);
    float sideFlares = exp(-pow((abs(p.x) - 0.247) / 0.045, 2.0)) * exp(-pow(p.y / 0.11, 2.0));

    color += ivory * photon * 1.62;
    color += mix(gold, ivory, 0.72) * halo * 0.55;
    color += mix(gold, ivory, 0.78) * disk * 1.12;
    color += ice * (upperLens * 0.24 + lowerLens * 0.17);
    color += ivory * sideFlares * 0.38;

    float horizon = 1.0 - smoothstep(0.208, 0.216, r);
    color = mix(color, vec3(0.0), horizon);
    float vignette = 1.0 - smoothstep(0.68, 1.24, length(p * vec2(0.69, 1.0)));
    color *= 0.62 + 0.38 * vignette;
    color = acesTone(color * 1.12);
    color = pow(color, vec3(0.92));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function ReferenceGravityShader() {
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

function AtlasObject({ side, index }: { side: "projects" | "skills"; index: number }) {
  return <span className={styles.atlasObject} data-side={side} data-atlas={index} aria-hidden="true" />;
}

function CelestialLink({ item, side, index }: {
  item: SpaceSystemItem;
  side: "projects" | "skills";
  index: number;
}) {
  return (
    <Link
      href={item.href}
      className={styles.objectLink}
      data-side={side}
      data-slot={index + 1}
      data-object-id={item.id}
      aria-label={`${item.title}. ${item.summary}`}
    >
      <AtlasObject side={side} index={index} />
      <span className={styles.mobileLabel}>{item.title}</span>
    </Link>
  );
}

export function DarkWebglReferencePrototype() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Prototype navigation">
        <Link className={styles.home} href="/" aria-label="Carl Shi — current homepage"><CsLogo /><span>Home</span></Link>
        <span className={styles.studyLabel}>WebGL study</span>
        <div className={styles.navLinks}>
          <Link href="/homepage-poc/projects#projects">Projects</Link>
          <Link href="/homepage-poc/projects#about">About</Link>
        </div>
      </nav>

      <section className={styles.stage} aria-label="Reference-driven Dark Mode prototype">
        <div className={styles.canvas} aria-hidden="true">
          <Canvas frameloop="demand" dpr={[1, 1.35]} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}>
            <ReferenceGravityShader />
          </Canvas>
        </div>

        <header className={styles.identity}>
          <h1>Carl Shi</h1>
          <p className={styles.positioning}>AI product, technical product,<br />and product strategy</p>
          <Link className={styles.resume} href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</Link>
        </header>

        <section className={`${styles.collection} ${styles.projects}`} aria-label="Projects">
          <h2>Projects</h2>
          {projectPlanets.map((item, index) => <CelestialLink key={item.id} item={item} index={index} side="projects" />)}
        </section>

        <section className={`${styles.collection} ${styles.skills}`} aria-label="Skills">
          <h2>Skills</h2>
          {skillSpacecraft.map((item, index) => <CelestialLink key={item.id} item={item} index={index} side="skills" />)}
        </section>
      </section>
    </main>
  );
}
