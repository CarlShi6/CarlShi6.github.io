"use client";

import Link from "next/link";
import { useState } from "react";
import { DarkMotionE } from "../dark-motion-e/prototype";
import styles from "./study.module.css";

type AssetMode = "current" | "refined";

export function DarkMotionE2() {
  const [mode, setMode] = useState<AssetMode>("refined");
  const [showBounds, setShowBounds] = useState(false);

  return (
    <div
      className={styles.study}
      data-e2-assets={mode}
      data-e2-bounds={showBounds ? "true" : "false"}
    >
      <DarkMotionE />
      <aside className={styles.assetStudy} aria-label="Celestial asset comparison">
        <div className={styles.heading}>
          <div>
            <b>Motion E.2</b>
            <span>Celestial asset A/B</span>
          </div>
          <Link href="/homepage-poc/dark-motion-e/">Motion E</Link>
        </div>
        <div className={styles.modeSwitch} aria-label="Asset version">
          <button
            type="button"
            aria-pressed={mode === "current"}
            onClick={() => setMode("current")}
          >
            A · Current
          </button>
          <button
            type="button"
            aria-pressed={mode === "refined"}
            onClick={() => setMode("refined")}
          >
            B · Refined
          </button>
        </div>
        <p>
          Project 01 + Satellite 01 only. Positions, capture paths, motion, and
          Scanner remain unchanged.
        </p>
        <label>
          <input
            type="checkbox"
            checked={showBounds}
            onChange={(event) => setShowBounds(event.target.checked)}
          />
          Show clipping bounds
        </label>
      </aside>
    </div>
  );
}
