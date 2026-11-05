"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import gsap from "gsap";
import Link from "next/link";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AdditiveBlending, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2 } from "three";
import { DarkWebglV7Prototype } from "./dark-webgl-v7-prototype";
import styles from "./dark-motion-study.module.css";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uFlowMap;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uProgress;
  uniform float uIntensity;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = uv - vec2(0.5, 0.5);
    p.x *= aspect;
    float radius = max(length(p), 0.035);
    float side = sign(uv.x - 0.5);

    // The texture preserves the approved painted final frame. These offsets add
    // low-amplitude motion inside it instead of replacing its art direction.
    float curl = (0.010 / radius) * sin(uTime * 0.34 + radius * 8.0);
    float cs = cos(curl);
    float sn = sin(curl);
    vec2 curled = vec2(cs * p.x - sn * p.y, sn * p.x + cs * p.y);
    curled.x /= aspect;
    vec2 warpedUv = curled + vec2(0.5);
    warpedUv.y += sin(uv.x * 18.0 - uTime * 0.72 + side * 1.8) * 0.0028;
    warpedUv.x += side * sin(uv.y * 15.0 + uTime * 0.41) * 0.0018;

    vec3 painted = texture2D(uFlowMap, warpedUv).rgb;
    float luminance = dot(painted, vec3(0.2126, 0.7152, 0.0722));
    float path = smoothstep(0.035, 0.58, luminance);
    float distanceToCenter = clamp(abs(uv.x - 0.5) * 2.0, 0.0, 1.0);
    float travel = 0.72 + 0.28 * sin(distanceToCenter * 42.0 + uv.y * 9.0 - uTime * (2.25 + distanceToCenter));
    float fine = 0.86 + 0.14 * sin(distanceToCenter * 92.0 - uTime * 3.6 + hash21(floor(uv * 38.0)) * 3.0);

    float edgeDepth = 1.0 - distanceToCenter;
    float reveal = 1.0 - smoothstep(uProgress, uProgress + 0.20, edgeDepth);
    float centerCurl = smoothstep(0.34, 0.08, radius) * smoothstep(0.03, 0.13, radius);
    vec3 ivory = vec3(1.0, 0.83, 0.58);
    vec3 ice = vec3(0.42, 0.72, 1.0);
    vec3 filament = mix(ice, ivory, smoothstep(0.36, 0.82, painted.r));
    filament *= path * travel * fine * 0.34;
    filament += mix(ice, ivory, 0.62) * centerCurl * (0.08 + 0.04 * sin(uTime * 1.2));

    vec3 color = painted * (0.70 + travel * 0.34) + filament;
    float alpha = clamp((luminance * 1.48 + path * 0.12) * reveal * uIntensity, 0.0, 0.96);
    gl_FragColor = vec4(color, alpha);
  }
`;

type FlowHandle = {
  setProgress: (value: number) => void;
  setIntensity: (value: number) => void;
};

const FlowPlane = forwardRef<FlowHandle, { playing: boolean }>(function FlowPlane({ playing }, ref) {
  const materialRef = useRef<ShaderMaterial>(null);
  const texture = useLoader(TextureLoader, "/homepage-poc/webgl-v6/streams.webp");
  const { size, invalidate } = useThree();
  const elapsedRef = useRef(0);
  const flowTexture = useMemo(() => {
    const clone = texture.clone();
    clone.colorSpace = SRGBColorSpace;
    clone.needsUpdate = true;
    return clone;
  }, [texture]);
  const uniforms = useMemo(() => ({
    uFlowMap: { value: flowTexture },
    uResolution: { value: new Vector2(1, 1) },
    uTime: { value: 0 },
    uProgress: { value: 1 },
    uIntensity: { value: 1 },
  }), [flowTexture]);

  useEffect(() => () => flowTexture.dispose(), [flowTexture]);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
    invalidate();
  }, [invalidate, size.height, size.width, uniforms]);

  useImperativeHandle(ref, () => ({
    setProgress(value) {
      if (materialRef.current) materialRef.current.uniforms.uProgress.value = value;
      invalidate();
    },
    setIntensity(value) {
      if (materialRef.current) materialRef.current.uniforms.uIntensity.value = value;
      invalidate();
    },
  }), [invalidate]);

  useFrame((_, delta) => {
    if (!playing || !materialRef.current) return;
    elapsedRef.current += Math.min(delta, 0.05);
    materialRef.current.uniforms.uTime.value = elapsedRef.current;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
});

function useMotionPreference() {
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

function useMobileFallback() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return mobile;
}

const arrivals = [
  { x: -520, y: -120, rotation: -18 }, { x: -470, y: -45, rotation: -12 },
  { x: -500, y: 72, rotation: 12 }, { x: -460, y: 150, rotation: 17 },
  { x: 520, y: -120, rotation: 18 }, { x: 470, y: -42, rotation: 11 },
  { x: 505, y: 74, rotation: -12 }, { x: 465, y: 150, rotation: -17 },
] as const;

export function DarkMotionStudy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<FlowHandle>(null);
  const entranceRanRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [playing, setPlaying] = useState(true);
  const [flowReady, setFlowReady] = useState(false);
  const [entranceRunning, setEntranceRunning] = useState(false);
  const [stageTarget, setStageTarget] = useState<Element | null>(null);
  const reducedMotion = useMotionPreference();
  const mobileFallback = useMobileFallback();

  const lowPerformance = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    return navigator.hardwareConcurrency <= 4 || (memory !== undefined && memory <= 4);
  }, []);
  const staticFallback = reducedMotion || lowPerformance || mobileFallback;

  useEffect(() => {
    setStageTarget(rootRef.current?.querySelector("section[aria-label='Dark gravitational portfolio system']") ?? null);
  }, []);

  const finish = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    timelineRef.current?.kill();
    timelineRef.current = null;
    gsap.set(root.querySelectorAll<HTMLElement>("[data-object-id]"), { clearProps: "transform,opacity,visibility" });
    const hole = root.querySelector<HTMLElement>("[data-transition-role='dark-hole']");
    const identity = root.querySelector<HTMLElement>("[data-transition-role='dark-identity']");
    if (hole) gsap.set(hole, { clearProps: "transform,opacity,visibility" });
    if (identity) gsap.set(identity, { clearProps: "transform,opacity,visibility" });
    flowRef.current?.setProgress(1);
    flowRef.current?.setIntensity(1);
    setEntranceRunning(false);
  }, []);

  const playEntrance = useCallback(() => {
    const root = rootRef.current;
    const flow = flowRef.current;
    if (!root || !flow) return;
    if (staticFallback) {
      finish();
      return;
    }
    timelineRef.current?.kill();
    const hole = root.querySelector<HTMLElement>("[data-transition-role='dark-hole']");
    const identity = root.querySelector<HTMLElement>("[data-transition-role='dark-identity']");
    const objects = Array.from(root.querySelectorAll<HTMLElement>("[data-object-id]"));
    if (!hole || !identity || objects.length !== 8) return;

    setEntranceRunning(true);
    setPlaying(true);
    flow.setProgress(0.01);
    flow.setIntensity(0.1);
    gsap.set(hole, { scale: 0.12, autoAlpha: 0.18, transformOrigin: "50% 50%" });
    gsap.set(identity, { autoAlpha: 0, scale: 0.94 });
    objects.forEach((object, index) => {
      const start = arrivals[index];
      gsap.set(object, { x: start.x, y: start.y, rotation: start.rotation, scale: 0.54, autoAlpha: 0 });
    });

    const flowState = { progress: 0.01, intensity: 0.1 };
    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: finish,
    });
    timelineRef.current = timeline;
    timeline.addLabel("core", 0)
      .to(hole, { scale: 1, autoAlpha: 1, duration: 2.35, ease: "power4.out" }, "core")
      .addLabel("flow", 0.22)
      .to(flowState, { progress: 1, intensity: 1, duration: 3.15, ease: "power2.inOut", onUpdate: () => {
        flow.setProgress(flowState.progress);
        flow.setIntensity(flowState.intensity);
      } }, "flow")
      .addLabel("objects", 0.82);
    objects.forEach((object, index) => {
      const start = arrivals[index];
      timeline.to(object, {
        keyframes: [
          { x: start.x * 0.48, y: start.y * 0.58, rotation: start.rotation * 0.46, scale: 0.78, autoAlpha: 0.78, duration: 1.05 },
          { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 1.05 },
        ],
        ease: "power3.inOut",
      }, `objects+=${index * 0.16}`);
    });
    timeline.to(identity, { autoAlpha: 1, scale: 1, duration: 0.72, ease: "power3.out" }, 2.6);
  }, [finish, staticFallback]);

  const setFlowHandle = useCallback((handle: FlowHandle | null) => {
    flowRef.current = handle;
    setFlowReady(Boolean(handle));
  }, []);

  useEffect(() => {
    if (!staticFallback && (!flowReady || entranceRanRef.current)) return;
    entranceRanRef.current = true;
    const frame = window.requestAnimationFrame(() => playEntrance());
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
      else if (!staticFallback) setPlaying(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      timelineRef.current?.kill();
    };
  }, [flowReady, playEntrance, staticFallback]);

  return (
    <div ref={rootRef} className={styles.study} data-running={entranceRunning ? "true" : "false"} data-static={staticFallback ? "true" : "false"}>
      <DarkWebglV7Prototype staticMode scannerEnabled previewMode="center" studyVersion="motion B" />
      {stageTarget && !staticFallback ? createPortal(
          <div className={styles.flowCanvas} aria-hidden="true">
            <Canvas
              frameloop={playing ? "always" : "demand"}
              dpr={[1, 1.25]}
              gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            >
              <FlowPlane ref={setFlowHandle} playing={playing} />
            </Canvas>
          </div>,
          stageTarget,
        ) : null}
      <aside className={styles.controls} aria-label="Motion study controls">
        <span>B · Cinematic animated texture</span>
        <button type="button" onClick={playEntrance} disabled={entranceRunning || staticFallback}>Replay entrance</button>
        <button type="button" onClick={() => setPlaying((value) => !value)} disabled={staticFallback}>{playing ? "Pause ambient" : "Resume ambient"}</button>
        <Link href="/homepage-poc/dark-webgl-v8/">Open A · Current flow</Link>
        {staticFallback ? <small>Static fallback active</small> : null}
      </aside>
      {entranceRunning ? <button className={styles.skip} type="button" onClick={finish}>Skip motion study</button> : null}
    </div>
  );
}
