"use client";

import { useState } from "react";
import { DarkMotionE } from "../dark-motion-e/prototype";
import { DebrisField } from "./debris-field";
import styles from "./study.module.css";

export type E3Mode = "current" | "reference" | "coupled";

const modes: Array<[E3Mode, string]> = [
  ["current", "A · Current"],
  ["reference", "B · Reference"],
  ["coupled", "C · Coupled"],
];

export function DarkMotionE3() {
  const [mode, setMode] = useState<E3Mode>("coupled");
  const [density, setDensity] = useState(0.7);
  const [motion, setMotion] = useState(0.65);
  const [showBounds, setShowBounds] = useState(false);

  return (
    <div
      className={styles.study}
      data-e3-mode={mode}
      data-e3-bounds={showBounds ? "true" : "false"}
    >
      <DarkMotionE />
      <DebrisField
        active={mode === "coupled"}
        density={density}
        motionIntensity={motion}
      />
      <aside className={styles.inspector} aria-label="Motion E.3 asset and debris inspector">
        <header>
          <div>
            <b>Motion E.3</b>
            <span>Reference assets + coupled debris</span>
          </div>
          <label className={styles.boundsToggle} title="Show clipping bounds">
            <input
              type="checkbox"
              checked={showBounds}
              onChange={(event) => setShowBounds(event.target.checked)}
            />
            Bounds
          </label>
        </header>
        <div className={styles.modeSwitch} aria-label="E.3 comparison mode">
          {modes.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.debrisControls}>
          <label>
            <span>Debris Density</span>
            <output>{density.toFixed(2)}</output>
            <input
              aria-label="Debris Density"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={density}
              disabled={mode !== "coupled"}
              onChange={(event) => setDensity(Number(event.target.value))}
            />
          </label>
          <label>
            <span>Debris Motion Intensity</span>
            <output>{motion.toFixed(2)}</output>
            <input
              aria-label="Debris Motion Intensity"
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={motion}
              disabled={mode !== "coupled"}
              onChange={(event) => setMotion(Number(event.target.value))}
            />
          </label>
        </div>
      </aside>
    </div>
  );
}
