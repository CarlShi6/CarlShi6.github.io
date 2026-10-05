"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "./BorderGlow.css";

type BorderGlowProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "color"
> & {
  children: React.ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: readonly string[];
  fillOpacity?: number;
};

type GlowStyle = CSSProperties &
  Record<`--${string}`, string | number>;

const GRADIENT_POSITIONS = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
] as const;

const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
] as const;

const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1] as const;
const DEFAULT_COLORS = [
  "#7ea47a",
  "#aebd78",
  "#6d7f72",
] as const;

function parseHsl(value: string) {
  const match = value.match(
    /([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/,
  );
  if (!match) return { h: 112, s: 22, l: 58 };
  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  };
}

function buildGlowVariables(
  glowColor: string,
  intensity: number,
) {
  const { h, s, l } = parseHsl(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const suffixes = [
    "",
    "-60",
    "-50",
    "-40",
    "-30",
    "-20",
    "-10",
  ];
  const variables: GlowStyle = {};

  opacities.forEach((opacity, index) => {
    variables[`--glow-color${suffixes[index]}`] =
      `hsl(${base} / ${Math.min(opacity * intensity, 100)}%)`;
  });
  return variables;
}

function buildGradientVariables(colors: readonly string[]) {
  const palette = colors.length ? colors : DEFAULT_COLORS;
  const variables: GlowStyle = {};

  GRADIENT_POSITIONS.forEach((position, index) => {
    const paletteIndex = Math.min(
      COLOR_MAP[index],
      palette.length - 1,
    );
    variables[GRADIENT_KEYS[index]] =
      `radial-gradient(at ${position}, ${palette[paletteIndex]} 0, transparent 50%)`;
  });
  variables["--gradient-base"] =
    `linear-gradient(${palette[0]} 0 100%)`;
  return variables;
}

function edgeProximity(
  element: HTMLElement,
  x: number,
  y: number,
) {
  const { width, height } = element.getBoundingClientRect();
  const centerX = width / 2;
  const centerY = height / 2;
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  const scaleX =
    deltaX === 0 ? Number.POSITIVE_INFINITY : centerX / Math.abs(deltaX);
  const scaleY =
    deltaY === 0 ? Number.POSITIVE_INFINITY : centerY / Math.abs(deltaY);
  return Math.min(
    Math.max(1 / Math.min(scaleX, scaleY), 0),
    1,
  );
}

function cursorAngle(
  element: HTMLElement,
  x: number,
  y: number,
) {
  const { width, height } = element.getBoundingClientRect();
  const deltaX = x - width / 2;
  const deltaY = y - height / 2;
  if (deltaX === 0 && deltaY === 0) return 0;
  const degrees =
    Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
  return degrees < 0 ? degrees + 360 : degrees;
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "112 22 58",
  backgroundColor = "#11140f",
  borderRadius = 4,
  glowRadius = 18,
  glowIntensity = 0.4,
  coneSpread = 18,
  animated = false,
  colors = DEFAULT_COLORS,
  fillOpacity = 0.14,
  onFocus,
  onBlur,
  onPointerLeave,
  ...htmlProps
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const pointerEffectsEnabled = useRef(true);

  useEffect(() => {
    const query = window.matchMedia(
      "(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse)",
    );
    const update = () => {
      pointerEffectsEnabled.current = !query.matches;
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !animated || !pointerEffectsEnabled.current) {
      return;
    }

    const startedAt = performance.now();
    let frame = 0;
    card.classList.add("is-sweeping");

    const update = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / 1600, 1);
      const eased = 1 - (1 - progress) ** 3;
      const proximity =
        progress < 0.25
          ? progress * 400
          : Math.max(0, 100 - (progress - 0.25) * 133.333);
      card.style.setProperty(
        "--edge-proximity",
        proximity.toFixed(3),
      );
      card.style.setProperty(
        "--cursor-angle",
        `${110 + eased * 355}deg`,
      );
      if (progress < 1) {
        frame = requestAnimationFrame(update);
      } else {
        card.classList.remove("is-sweeping");
        card.style.setProperty("--edge-proximity", "0");
      }
    };

    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      card.classList.remove("is-sweeping");
    };
  }, [animated]);

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const card = cardRef.current;
    if (!card || !pointerEffectsEnabled.current) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty(
      "--edge-proximity",
      (edgeProximity(card, x, y) * 100).toFixed(3),
    );
    card.style.setProperty(
      "--cursor-angle",
      `${cursorAngle(card, x, y).toFixed(3)}deg`,
    );
  };

  const handlePointerLeave = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (document.activeElement !== cardRef.current) {
      cardRef.current?.style.setProperty(
        "--edge-proximity",
        "0",
      );
    }
    onPointerLeave?.(event);
  };

  const style: GlowStyle = {
    "--card-bg": backgroundColor,
    "--edge-sensitivity": edgeSensitivity,
    "--border-radius": `${borderRadius}px`,
    "--glow-padding": `${glowRadius}px`,
    "--cone-spread": coneSpread,
    "--fill-opacity": fillOpacity,
    ...buildGlowVariables(glowColor, glowIntensity),
    ...buildGradientVariables(colors),
  };

  return (
    <div
      {...htmlProps}
      ref={cardRef}
      className={`border-glow-card${className ? ` ${className}` : ""}`}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={(event) => {
        event.currentTarget.style.setProperty(
          "--edge-proximity",
          "100",
        );
        event.currentTarget.style.setProperty(
          "--cursor-angle",
          "315deg",
        );
        onFocus?.(event);
      }}
      onBlur={(event) => {
        event.currentTarget.style.setProperty(
          "--edge-proximity",
          "0",
        );
        onBlur?.(event);
      }}
    >
      <span className="border-glow-edge" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
