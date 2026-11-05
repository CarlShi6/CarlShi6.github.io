"use client";

import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Color, ShaderMaterial, Vector2 } from "three";
import { DarkWebglV7Prototype } from "./dark-webgl-v7-prototype";
import { LightEntrancePrototype } from "./light-entrance-prototype";
import styles from "./theme-spiral-prototype.module.css";

type Theme = "light" | "dark";
type MaskState = { progress: number; reveal: number; time: number; alpha: number };
type SpiralHandle = { render: (state: MaskState, target: Theme) => void };

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Concept and field structure adapted from Codrops Interlude's MIT-licensed
// spiral transition (Copyright (c) 2026 Codrops). See docs/third-party/interlude-spiral-license.md.
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uProgress;
  uniform float uReveal;
  uniform float uTime;
  uniform float uAlpha;
  uniform vec3 uCover;
  uniform vec3 uRing;
  uniform vec3 uHot;

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
    float amplitude = 0.54;
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(1.7, -1.2);
      amplitude *= 0.48;
    }
    return value;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 origin = vec2(0.5, 0.455);
    vec2 p = vUv - origin;
    p.x *= aspect;
    float reach = length(vec2(0.5 * aspect, 0.55));
    float distance = length(p) / max(reach, 0.001);
    float angle = atan(p.y, p.x);
    float turned = angle + uTime * 0.31 + 1.28 / (distance + 0.21);
    vec2 smokeUv = vec2(cos(turned), sin(turned)) * distance * 3.25 + vec2(uTime * 0.035);
    float smoke = fbm(smokeUv);
    float field = distance + (smoke - 0.48) * 0.07 + sin(turned * 3.0) * 0.13;

    float coverLevel = mix(-0.28, 1.32, uProgress);
    float revealLevel = mix(1.32, -0.28, uProgress);
    float level = mix(coverLevel, revealLevel, uReveal);
    float inside = 1.0 - smoothstep(level - 0.012, level + 0.012, field);
    float covered = mix(inside, 1.0 - inside, uReveal);
    float outside = max(mix(field - level, level - field, uReveal), 0.0);

    float envelope = smoothstep(0.0, 0.1, uProgress) * smoothstep(0.0, 0.12, 1.0 - uProgress);
    float side = cos(angle - 0.55 + uTime * 0.22) * 0.18 + 0.82;
    float streaks = sin(turned * 6.0 - outside * 34.0) * 0.16 + 0.84;
    float ring = exp(-outside / 0.042) + exp(-outside / 0.18) * 0.12;
    float light = clamp(ring * side * streaks * envelope * 0.72, 0.0, 1.0);
    float hotLine = exp(-outside / 0.010);
    vec3 edge = mix(uRing, uHot, hotLine);
    vec3 color = mix(uCover, edge, light * (1.0 - covered));
    float alpha = clamp((covered + light * (1.0 - covered)) * uAlpha, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
  }
`;

const SpiralPlane = forwardRef<SpiralHandle>(function SpiralPlane(_, ref) {
  const materialRef = useRef<ShaderMaterial>(null);
  const { size, invalidate } = useThree();
  const uniforms = useMemo(() => ({
    uResolution: { value: new Vector2(1, 1) },
    uProgress: { value: 0 },
    uReveal: { value: 0 },
    uTime: { value: 0 },
    uAlpha: { value: 0 },
    uCover: { value: new Color("#01050b") },
    uRing: { value: new Color("#b8d9ef") },
    uHot: { value: new Color("#fff0c9") },
  }), []);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
    invalidate();
  }, [invalidate, size.height, size.width, uniforms]);

  useImperativeHandle(ref, () => ({
    render(state, target) {
      const live = materialRef.current?.uniforms ?? uniforms;
      live.uProgress.value = state.progress;
      live.uReveal.value = state.reveal;
      live.uTime.value = state.time;
      live.uAlpha.value = state.alpha;
      live.uCover.value.set(target === "dark" ? "#01050b" : "#f6f2e8");
      live.uRing.value.set(target === "dark" ? "#b7d9ee" : "#d5aa68");
      live.uHot.value.set(target === "dark" ? "#fff0c9" : "#fff8e9");
      invalidate();
    },
  }), [invalidate, uniforms]);

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={materialRef} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader}
        transparent depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
});

function SpiralMask({ maskRef }: { maskRef: React.RefObject<SpiralHandle | null> }) {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.25]} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}>
      <SpiralPlane ref={maskRef} />
    </Canvas>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function ThemeSpiralPrototype() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SpiralHandle>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const themeRef = useRef<Theme>("light");
  const targetRef = useRef<Theme>("light");
  const [theme, setTheme] = useState<Theme>("light");
  const [transitioning, setTransitioning] = useState(false);
  const [announcement, setAnnouncement] = useState("Light portfolio ready");
  const reducedMotion = useReducedMotion();

  const resetLayers = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.set(root.querySelectorAll("[data-object-id], [data-motion-object], [data-transition-role]"), { clearProps: "transform,opacity,visibility" });
    maskRef.current?.render({ progress: 0, reveal: 0, time: 0, alpha: 0 }, themeRef.current);
  }, []);

  const finishTransition = useCallback(() => {
    timelineRef.current?.progress(1).kill();
    timelineRef.current = null;
    themeRef.current = targetRef.current;
    setTheme(targetRef.current);
    setTransitioning(false);
    resetLayers();
    setAnnouncement(`${targetRef.current === "dark" ? "Dark" : "Light"} portfolio ready`);
  }, [resetLayers]);

  const runTransition = useCallback((target: Theme) => {
    if (transitioning) {
      finishTransition();
      return;
    }
    if (target === themeRef.current) return;
    targetRef.current = target;

    if (reducedMotion) {
      themeRef.current = target;
      setTheme(target);
      resetLayers();
      setAnnouncement(`${target === "dark" ? "Dark" : "Light"} portfolio ready`);
      return;
    }

    const light = lightRef.current;
    const dark = darkRef.current;
    if (!light || !dark || !maskRef.current) return;
    const current = themeRef.current;
    const outgoing = current === "light" ? light : dark;
    const incoming = target === "light" ? light : dark;
    const outgoingObjects = [...outgoing.querySelectorAll<HTMLElement>(current === "light" ? "[data-motion-object]" : "[data-object-id]")];
    const incomingObjects = [...incoming.querySelectorAll<HTMLElement>(target === "light" ? "[data-motion-object]" : "[data-object-id]")];
    const lightPlanet = light.querySelector<HTMLElement>("[data-transition-role='light-planet']");
    const lightGrowth = light.querySelector<SVGElement>("[data-transition-role='light-growth']");
    const lightLeaves = [...light.querySelectorAll<HTMLElement>("[data-transition-role='light-leaves']")];
    const lightIdentity = light.querySelector<HTMLElement>("[data-transition-role='light-identity']");
    const darkHole = dark.querySelector<HTMLElement>("[data-transition-role='dark-hole']");
    const darkStreams = dark.querySelector<SVGElement>("[data-transition-role='dark-streams']");
    const darkIdentity = dark.querySelector<HTMLElement>("[data-transition-role='dark-identity']");
    const mask: MaskState = { progress: 0, reveal: 0, time: 0, alpha: 1 };
    const drawMask = () => maskRef.current?.render(mask, target);

    resetLayers();
    setTransitioning(true);
    setAnnouncement(`Transitioning to ${target} portfolio`);

    if (target === "dark") {
      gsap.set(darkHole, { scale: 0.12, autoAlpha: 0.22 });
      gsap.set(darkStreams, { autoAlpha: 0, scale: 0.86, transformOrigin: "50% 50%" });
      gsap.set(darkIdentity, { autoAlpha: 0, scale: 0.9 });
      incomingObjects.forEach((object) => gsap.set(object, {
        x: object.dataset.side === "projects" ? -190 : 190,
        y: (Number(object.dataset.slot ?? 2.5) - 2.5) * 24,
        scale: 0.5,
        autoAlpha: 0,
      }));
    } else {
      gsap.set(lightPlanet, { scale: 0.28, autoAlpha: 0.45, transformOrigin: "50% 61%" });
      gsap.set(lightGrowth, { scale: 0.58, autoAlpha: 0, transformOrigin: "50% 61%" });
      gsap.set(lightLeaves, { scale: 0.42, autoAlpha: 0 });
      gsap.set(lightIdentity, { autoAlpha: 0, y: 12 });
      gsap.set(incomingObjects, { scale: 0.35, y: -52, autoAlpha: 0 });
    }

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        timelineRef.current = null;
        themeRef.current = target;
        setTransitioning(false);
        resetLayers();
        setAnnouncement(`${target === "dark" ? "Dark" : "Light"} portfolio ready`);
      },
    });
    timelineRef.current = timeline;

    timeline.to(mask, { progress: 1, time: 1.6, duration: 1.55, ease: "power3.inOut", onUpdate: drawMask }, 0);
    if (current === "light") {
      timeline.to(outgoingObjects, { x: (_i, element: HTMLElement) => window.innerWidth / 2 - (element.getBoundingClientRect().left + element.offsetWidth / 2),
        y: (_i, element: HTMLElement) => window.innerHeight * .54 - (element.getBoundingClientRect().top + element.offsetHeight / 2),
        scale: 0.12, autoAlpha: 0, rotation: (index) => index % 2 ? -16 : 16, stagger: 0.035, duration: 1.12 }, 0);
      timeline.to([lightGrowth, ...lightLeaves], { scale: 0.42, autoAlpha: 0, rotation: -7, duration: 1.08 }, 0.04);
      timeline.to(lightPlanet, { scale: 0.18, autoAlpha: 0.16, duration: 1.2 }, 0.02);
      timeline.to(lightIdentity, { autoAlpha: 0, scale: 0.86, duration: 0.72 }, 0.12);
    } else {
      timeline.to(outgoingObjects, { x: (_i, element: HTMLElement) => element.dataset.side === "projects" ? -230 : 230,
        y: (index) => (index % 4 - 1.5) * 54, scale: 0.54, autoAlpha: 0, stagger: 0.025, duration: 1.12 }, 0);
      timeline.to(darkStreams, { autoAlpha: 0, scale: 1.08, duration: 1.02 }, 0.08);
      timeline.to(darkHole, { scale: 0.13, autoAlpha: 0.18, rotation: -8, duration: 1.2 }, 0);
      timeline.to(darkIdentity, { autoAlpha: 0, scale: 0.88, duration: 0.72 }, 0.1);
    }

    timeline.call(() => {
      themeRef.current = target;
      setTheme(target);
      mask.reveal = 1;
      mask.progress = 1;
      drawMask();
    }, [], 1.55);
    timeline.to(mask, { progress: 0, time: 3.0, duration: 1.5, ease: "power3.out", onUpdate: drawMask }, 1.62);

    if (target === "dark") {
      timeline.to(darkHole, { scale: 1, autoAlpha: 1, duration: 1.18, ease: "expo.out" }, 1.58);
      timeline.to(darkStreams, { autoAlpha: 1, scale: 1, duration: 1.18 }, 1.66);
      timeline.to(darkIdentity, { autoAlpha: 1, scale: 1, duration: .72 }, 1.95);
      timeline.to(incomingObjects, { x: 0, y: 0, scale: 1, autoAlpha: 1, rotation: 0, stagger: 0.055, duration: .96, ease: "power3.out" }, 1.68);
    } else {
      timeline.to(lightPlanet, { scale: 1, autoAlpha: 1, duration: 1.08, ease: "expo.out" }, 1.58);
      timeline.to(lightGrowth, { scale: 1, autoAlpha: 1, duration: 1.12, ease: "power3.out" }, 1.74);
      timeline.to(lightLeaves, { scale: 1, autoAlpha: .92, duration: .92, stagger: .08, ease: "expo.out" }, 1.87);
      timeline.to(lightIdentity, { autoAlpha: 1, y: 0, duration: .72 }, 1.92);
      timeline.to(incomingObjects, { scale: 1, y: 0, autoAlpha: 1, rotation: 0, stagger: .055, duration: .82, ease: "power3.out" }, 2.0);
    }
  }, [finishTransition, reducedMotion, resetLayers, transitioning]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && timelineRef.current) finishTransition();
    };
    const onVisibility = () => { if (document.hidden && timelineRef.current) finishTransition(); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      timelineRef.current?.kill();
    };
  }, [finishTransition]);

  return (
    <div ref={rootRef} className={styles.prototype} data-theme={theme} data-transitioning={transitioning ? "true" : "false"}>
      <div ref={lightRef} className={styles.scene} data-scene="light" data-active={theme === "light" ? "true" : "false"}
        aria-hidden={theme !== "light"} inert={theme !== "light"}>
        <LightEntrancePrototype staticMode />
      </div>
      <div ref={darkRef} className={styles.scene} data-scene="dark" data-active={theme === "dark" ? "true" : "false"}
        aria-hidden={theme !== "dark"} inert={theme !== "dark"}>
        <DarkWebglV7Prototype staticMode scannerEnabled previewMode="center" studyVersion="v8" />
      </div>

      <div className={styles.mask} aria-hidden="true"><SpiralMask maskRef={maskRef} /></div>
      <button className={styles.toggle} type="button" aria-pressed={theme === "dark"} aria-busy={transitioning}
        onClick={() => runTransition(themeRef.current === "light" ? "dark" : "light")}>
        <span>Light</span><i aria-hidden="true"><b /></i><span>Dark</span>
      </button>
      <p className={styles.live} aria-live="polite">{announcement}</p>
      {transitioning ? <button className={styles.skip} type="button" onClick={finishTransition}>Skip transition</button> : null}
    </div>
  );
}
