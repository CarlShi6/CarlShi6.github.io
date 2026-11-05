"use client";

import { Canvas, useThree } from "@react-three/fiber";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Vector2 } from "three";
import { CsLogo } from "./cs-logo";
import { projectPlanets, skillSpacecraft, type SpaceSystemItem } from "./space-system.data";
import styles from "./dark-webgl-v5-prototype.module.css";

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
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
      f.y
    );
  }

  float fbm4(vec2 p) {
    float value = 0.0;
    float amplitude = 0.52;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = mat2(1.58, -1.12, 1.12, 1.58) * p + 0.17;
      amplitude *= 0.47;
    }
    return value;
  }

  vec2 cubicBezier(vec2 a, vec2 b, vec2 c, vec2 d, float t) {
    float s = 1.0 - t;
    return s * s * s * a + 3.0 * s * s * t * b + 3.0 * s * t * t * c + t * t * t * d;
  }

  vec3 filmic(vec3 x) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }

  vec3 ribbon(
    vec2 q,
    vec2 p0,
    vec2 p1,
    vec2 p2,
    vec2 p3,
    float seed,
    vec3 ivory,
    vec3 silver,
    vec3 blue
  ) {
    if ((p0.x < 0.0 && q.x > 0.03) || (p0.x > 0.0 && q.x < -0.03)) return vec3(0.0);

    vec2 domain = q + vec2(
      noise(q * 3.1 + seed * 1.7) - 0.5,
      noise(q * 3.6 - seed * 2.3) - 0.5
    ) * 0.012;

    float minimumDistance = 9.0;
    float closestT = 0.0;
    vec2 previousPoint = p0;
    for (int i = 1; i <= 18; i++) {
      float t = float(i) / 18.0;
      vec2 currentPoint = cubicBezier(p0, p1, p2, p3, t);
      vec2 segment = currentPoint - previousPoint;
      vec2 relative = domain - previousPoint;
      float segmentT = clamp(dot(relative, segment) / max(dot(segment, segment), 0.000001), 0.0, 1.0);
      float distanceToCurve = length(relative - segment * segmentT);
      if (distanceToCurve < minimumDistance) {
        minimumDistance = distanceToCurve;
        closestT = (float(i - 1) + segmentT) / 18.0;
      }
      previousPoint = currentPoint;
    }

    float width = mix(0.056, 0.0060, pow(closestT, 0.74));
    float softCore = exp(-pow(minimumDistance / max(width, 0.0001), 2.0));
    float atmosphere = exp(-pow(minimumDistance / max(width * 2.3, 0.0001), 2.0));
    float surface = noise(vec2(closestT * 31.0 + seed, minimumDistance * 93.0));
    surface = surface * 0.66 + noise(vec2(closestT * 73.0, seed * 9.0)) * 0.34;
    float filaments = pow(0.5 + 0.5 * sin(minimumDistance / width * 7.0 + surface * 6.0), 10.0);
    float brokenLight = 0.58 + 0.42 * noise(vec2(closestT * 38.0 + seed, seed));

    vec3 temperature = mix(blue * 0.42, silver, smoothstep(0.08, 0.62, closestT));
    temperature = mix(temperature, ivory, smoothstep(0.48, 1.0, closestT));
    float warmBias = smoothstep(0.42, 0.86, fract(seed * 0.618));
    temperature = mix(temperature, ivory, warmBias * (1.0 - closestT) * 0.42);
    return temperature * softCore * (0.42 + filaments * 0.20 + surface * 0.48) * brokenLight
      + temperature * atmosphere * 0.10;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 q = vUv - 0.5;
    q.x *= aspect;

    float radius = length(q);
    float angle = atan(q.y, q.x);

    vec3 midnight = vec3(0.0012, 0.0048, 0.0105);
    vec3 navy = vec3(0.018, 0.070, 0.128);
    vec3 blue = vec3(0.27, 0.47, 0.70);
    vec3 silver = vec3(0.76, 0.84, 0.88);
    vec3 ivory = vec3(1.0, 0.87, 0.64);
    vec3 gold = vec3(1.0, 0.48, 0.13);
    vec3 color = midnight;

    float atmosphereA = fbm4(q * 2.1 + vec2(1.4, -0.8));
    float atmosphereB = fbm4(q * 4.6 + vec2(-2.2, 1.6));
    float cloudMask = smoothstep(0.52, 0.91, atmosphereA) * (0.28 + atmosphereB * 0.72);
    color += navy * cloudMask * 0.17;

    float stars = step(0.9987, hash21(floor((q + 2.0) * 92.0)));
    stars *= 1.0 - smoothstep(0.02, 0.13, length(fract((q + 2.0) * 92.0) - 0.5));
    color += mix(silver, ivory, hash21(floor(q * 81.0))) * stars * 0.34;

    vec3 flows = vec3(0.0);
    flows += ribbon(q, vec2(-0.77,  0.34), vec2(-0.59,  0.35), vec2(-0.39,  0.09), vec2(-0.185,  0.153), 0.7, ivory, silver, blue);
    flows += ribbon(q, vec2(-0.80,  0.105), vec2(-0.61,  0.08), vec2(-0.42,  0.225), vec2(-0.185,  0.153), 1.9, ivory, silver, blue);
    flows += ribbon(q, vec2(-0.76, -0.10), vec2(-0.58, -0.07), vec2(-0.41, -0.225), vec2(-0.185, -0.153), 3.1, ivory, silver, blue);
    flows += ribbon(q, vec2(-0.72, -0.34), vec2(-0.55, -0.36), vec2(-0.37, -0.09), vec2(-0.185, -0.153), 4.3, ivory, silver, blue);
    flows += ribbon(q, vec2( 0.77,  0.33), vec2( 0.58,  0.36), vec2( 0.38,  0.08), vec2( 0.185,  0.153), 5.2, ivory, silver, blue);
    flows += ribbon(q, vec2( 0.80,  0.10), vec2( 0.61,  0.07), vec2( 0.42,  0.22), vec2( 0.185,  0.153), 2.6, ivory, silver, blue);
    flows += ribbon(q, vec2( 0.76, -0.10), vec2( 0.59, -0.06), vec2( 0.42, -0.22), vec2( 0.185, -0.153), 1.2, ivory, silver, blue);
    flows += ribbon(q, vec2( 0.72, -0.33), vec2( 0.54, -0.36), vec2( 0.37, -0.08), vec2( 0.185, -0.153), 3.8, ivory, silver, blue);
    color += flows;

    float polarTexture = fbm4(vec2(angle * 1.55, log(max(radius, 0.001)) * 6.2));
    float spiralPhase = angle * 2.0 - log(max(radius, 0.001)) * 5.9 + polarTexture * 1.2;
    float armOne = pow(max(0.0, cos(spiralPhase)), 12.0);
    float armTwo = pow(max(0.0, cos(spiralPhase + PI)), 12.0);
    float vortexMask = smoothstep(0.218, 0.252, radius) * (1.0 - smoothstep(0.38, 0.52, radius));
    float vortexSurface = 0.28 + 0.88 * fbm4(vec2(angle * 3.7 + polarTexture, radius * 34.0));
    float vortexFilaments = 0.48 + 0.52 * pow(0.5 + 0.5 * sin(spiralPhase * 5.0 + polarTexture * 8.0), 5.0);
    vec3 vortexColor = mix(ivory, silver, smoothstep(0.25, 0.54, radius));
    color += vortexColor * (armOne + armTwo) * vortexMask * vortexSurface * vortexFilaments * 0.48;

    float ringWarp = 0.0035 * sin(angle * 8.0 + polarTexture * 4.0);
    float photonRing = exp(-abs(radius - (0.218 + ringWarp)) * 185.0);
    float warmHalo = exp(-abs(radius - 0.239) * 52.0);

    float diskRadius = length(vec2(q.x, q.y * 2.72));
    float diskWarp = 0.014 * sin(angle * 4.0 + polarTexture * 4.5);
    float diskCore = exp(-abs(diskRadius - (0.302 + diskWarp)) * 34.0);
    float diskSurface = 0.22 + 1.08 * fbm4(vec2(angle * 5.7 + polarTexture, diskRadius * 49.0));
    float diskOcclusion = smoothstep(0.198, 0.245, radius);
    float frontBias = 0.58 + 0.42 * smoothstep(-0.22, 0.18, q.y);

    float upperLens = exp(-abs(length(vec2(q.x, (q.y - 0.012) * 1.56)) - 0.231) * 108.0);
    float lowerLens = exp(-abs(length(vec2(q.x, (q.y + 0.018) * 1.56)) - 0.231) * 108.0);
    float tangentGlow = exp(-pow((abs(q.x) - 0.224) / 0.040, 2.0)) * exp(-pow(q.y / 0.115, 2.0));

    color += ivory * photonRing * 1.82;
    color += mix(gold, ivory, 0.72) * warmHalo * 0.30;
    color += mix(gold, ivory, 0.80) * diskCore * diskSurface * diskOcclusion * frontBias * 1.20;
    color += silver * upperLens * 0.20 + blue * lowerLens * 0.12;
    color += ivory * tangentGlow * 0.34;

    float horizon = 1.0 - smoothstep(0.196, 0.204, radius);
    color = mix(color, vec3(0.0), horizon);

    float vignette = 1.0 - smoothstep(0.70, 1.34, length(q * vec2(0.70, 1.0)));
    color *= 0.64 + 0.36 * vignette;
    color = filmic(color * 1.10);
    color = pow(color, vec3(0.94));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function GravityField() {
  const { size, invalidate } = useThree();
  const uniforms = useMemo(() => ({
    uResolution: { value: new Vector2(1, 1) },
  }), []);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
    invalidate();
  }, [invalidate, size.height, size.width, uniforms]);

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function CelestialObject({ item, side, index }: {
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
      <span className={styles.objectArt} data-side={side} data-art={index} aria-hidden="true" />
      <span className={styles.mobileLabel}>{item.title}</span>
    </Link>
  );
}

export function DarkWebglV5Prototype() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Prototype navigation">
        <Link className={styles.home} href="/" aria-label="Carl Shi — current homepage"><CsLogo /><span>Home</span></Link>
        <span className={styles.studyLabel}>WebGL v5 study</span>
        <div className={styles.navLinks}>
          <Link href="/homepage-poc/projects#projects">Projects</Link>
          <Link href="/homepage-poc/projects#about">About</Link>
        </div>
      </nav>

      <section className={styles.stage} aria-label="Dark WebGL v5 visual fidelity prototype">
        <div className={styles.canvas} aria-hidden="true">
          <Canvas frameloop="demand" dpr={[1, 1.25]} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}>
            <GravityField />
          </Canvas>
        </div>

        <header className={styles.identity}>
          <h1>Carl Shi</h1>
          <p className={styles.positioning}>AI product, technical product,<br />and product strategy</p>
          <Link className={styles.resume} href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</Link>
        </header>

        <section className={`${styles.collection} ${styles.projects}`} aria-label="Projects">
          <h2>Projects</h2>
          {projectPlanets.map((item, index) => <CelestialObject key={item.id} item={item} side="projects" index={index} />)}
        </section>

        <section className={`${styles.collection} ${styles.skills}`} aria-label="Skills">
          <h2>Skills</h2>
          {skillSpacecraft.map((item, index) => <CelestialObject key={item.id} item={item} side="skills" index={index} />)}
        </section>
      </section>
    </main>
  );
}
