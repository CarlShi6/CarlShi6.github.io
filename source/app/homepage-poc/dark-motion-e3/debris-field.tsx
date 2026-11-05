"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./study.module.css";

type Snapshot = {
  time: number;
  hidden: boolean;
  fallback: boolean;
  plan: { end: number };
  phases: Array<{ capture: number }>;
  poses: Array<{ velocity: number }>;
};

type MotionEApi = { snapshot(): Snapshot };

type DebrisFieldProps = {
  active: boolean;
  density: number;
  motionIntensity: number;
};

type TrailTarget = {
  element: HTMLElement;
  index: 0 | 4;
  material: "rock" | "metal";
};

type FragmentSeed = {
  phase: number;
  speed: number;
  curve: number;
  size: number;
  rotation: number;
};

const seeded = (seed: number) => {
  const value = Math.sin(seed * 9283.17) * 43758.5453;
  return value - Math.floor(value);
};

const seedsFor = (index: number): FragmentSeed[] =>
  Array.from({ length: 18 }, (_, fragment) => ({
    phase: seeded(index * 41 + fragment * 7 + 1),
    speed: 0.72 + seeded(index * 19 + fragment * 11 + 2) * 0.58,
    curve: (seeded(index * 17 + fragment * 13 + 3) - 0.5) * 70,
    size: 0.58 + seeded(index * 23 + fragment * 5 + 4) * 0.78,
    rotation: seeded(index * 31 + fragment * 3 + 5) * 360,
  }));

function readApi(): MotionEApi | undefined {
  return (window as unknown as { __motionE?: MotionEApi }).__motionE;
}

function DebrisTrail({
  target,
  density,
  motionIntensity,
}: {
  target: TrailTarget;
  density: number;
  motionIntensity: number;
}) {
  const trail = useRef<HTMLSpanElement>(null);
  const count = Math.max(2, Math.round(3 + density * 13));
  const seeds = useMemo(() => seedsFor(target.index).slice(0, count), [count, target.index]);

  useEffect(() => {
    const root = trail.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastX = Number.NaN;
    let lastY = Number.NaN;
    let smoothedAngle = target.index === 0 ? Math.PI : 0;

    const paint = () => {
      frame = window.requestAnimationFrame(paint);
      const api = readApi();
      const stage = target.element.closest<HTMLElement>(
        "section[aria-label='Dark gravitational portfolio system']",
      );
      const hole = stage?.querySelector<HTMLElement>("[data-transition-role='dark-hole']");
      if (!api || !stage || !hole || reduce.matches || document.hidden) {
        root.style.opacity = "0";
        return;
      }

      const snapshot = api.snapshot();
      const objectRect = target.element.getBoundingClientRect();
      const holeRect = hole.getBoundingClientRect();
      const objectX = objectRect.left + objectRect.width / 2;
      const objectY = objectRect.top + objectRect.height / 2;
      const holeX = holeRect.left + holeRect.width / 2;
      const holeY = holeRect.top + holeRect.height / 2;
      const dx = Number.isFinite(lastX) ? objectX - lastX : 0;
      const dy = Number.isFinite(lastY) ? objectY - lastY : 0;
      const observedSpeed = Math.hypot(dx, dy);
      const inwardAngle = Math.atan2(holeY - objectY, holeX - objectX);
      const trailingAngle = observedSpeed > 0.18 ? Math.atan2(-dy, -dx) : inwardAngle;
      let delta = trailingAngle - smoothedAngle;
      delta = Math.atan2(Math.sin(delta), Math.cos(delta));
      smoothedAngle += delta * Math.min(0.32, 0.08 + observedSpeed * 0.035);
      lastX = objectX;
      lastY = objectY;

      const capture = snapshot.phases[target.index]?.capture ?? 0;
      const velocity = snapshot.poses[target.index]?.velocity ?? 0;
      const entrance = snapshot.time < snapshot.plan.end;
      const reveal = Math.min(1, capture * 4) * (entrance ? 0.9 : 1);
      const mobile = window.innerWidth <= 900;
      const trailLength = (mobile ? 82 : target.index === 0 ? 148 : 126) * (0.72 + density * 0.38);
      const lag = Math.min(74, velocity * 0.035) * motionIntensity;
      root.style.opacity = String(reveal);
      root.style.transform = `rotate(${smoothedAngle}rad)`;

      const fragments = root.querySelectorAll<HTMLElement>("[data-debris-fragment]");
      fragments.forEach((fragment, fragmentIndex) => {
        const seed = seeds[fragmentIndex];
        if (!seed) return;
        const speed = (0.07 + seed.speed * 0.035) * Math.max(0.12, motionIntensity);
        const progress = (snapshot.time * speed + seed.phase) % 1;
        const entranceLag = entrance && observedSpeed > 0.18 ? lag : 0;
        const distance = 18 + progress * trailLength + entranceLag;
        const curve = Math.sin(progress * Math.PI) * seed.curve * (0.45 + motionIntensity * 0.55);
        const closeScale = 1.08 - progress * 0.5;
        const captureScale = entrance ? 1 + (1 - capture) * 0.28 : 1;
        const alpha = Math.sin(progress * Math.PI) * (0.4 + density * 0.55) * reveal;
        const rotation = seed.rotation + snapshot.time * (18 + seed.speed * 16) * motionIntensity;
        fragment.style.opacity = String(Math.max(0, alpha));
        fragment.style.transform = `translate3d(${distance}px,${curve}px,0) rotate(${rotation}deg) scale(${seed.size * closeScale * captureScale})`;
      });
    };

    paint();
    return () => window.cancelAnimationFrame(frame);
  }, [density, motionIntensity, seeds, target]);

  return (
    <span
      ref={trail}
      className={styles.debrisTrail}
      data-debris-material={target.material}
      data-debris-object={target.index}
      aria-hidden="true"
    >
      {seeds.map((seed, index) => (
        <i
          // Deterministic seeds make Inspector comparisons repeatable.
          key={`${target.index}-${index}-${seed.phase}`}
          data-debris-fragment=""
        />
      ))}
    </span>
  );
}

export function DebrisField({ active, density, motionIntensity }: DebrisFieldProps) {
  const [targets, setTargets] = useState<TrailTarget[]>([]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let attempt = 0;
    const locate = () => {
      if (cancelled) return;
      const objects = Array.from(document.querySelectorAll<HTMLElement>("[data-object-id]"));
      if (objects.length >= 8) {
        setTargets([
          { element: objects[0], index: 0, material: "rock" },
          { element: objects[4], index: 4, material: "metal" },
        ]);
        return;
      }
      attempt += 1;
      if (attempt < 80) window.setTimeout(locate, 50);
    };
    locate();
    return () => {
      cancelled = true;
    };
  }, [active]);

  if (!active) return null;
  return targets.map((target) =>
    createPortal(
      <DebrisTrail
        key={target.index}
        target={target}
        density={density}
        motionIntensity={motionIntensity}
      />,
      target.element,
    ),
  );
}
