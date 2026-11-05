"use client";

import { useRef, useState } from 'react';
import { DarkMotionE } from '../dark-motion-e/prototype';
import { DebrisField } from '../dark-motion-e3/debris-field';
import { LayeredDebris, type DebrisControls, type StudyMode } from './layered-debris';
import styles from './study.module.css';

const controls = [
  ['density', 'Hero Debris Density', 0, 1.5],
  ['variation', 'Fragment Size Variation', 0, 1.5],
  ['speed', 'Fragment Motion Speed', 0, 2],
  ['spread', 'Debris Spread', .35, 1.5],
  ['lighting', 'Debris Lighting Intensity', .3, 1.5],
] as const;

export function DarkMotionE4() {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<StudyMode>('coupled');
  const [settings, setSettings] = useState<DebrisControls>({ density: 1, variation: 1, speed: .65, spread: 1, lighting: .85 });
  return <div ref={root} className={styles.study} data-e4-mode={mode}>
    <DarkMotionE />
    <DebrisField active={mode === 'legacy'} density={.7} motionIntensity={.65} />
    <LayeredDebris root={root} mode={mode} controls={settings} />
    {process.env.NODE_ENV !== 'production' && <aside className={styles.inspector} aria-label="Motion E.4 debris study">
      <div className={styles.modes} aria-label="E.4 comparison mode">
        {([['legacy', 'A · E.3'], ['sculpted', 'B · Sculpted'], ['coupled', 'C · Coupled']] as const).map(([value, label]) =>
          <button key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>)}
      </div>
      <details>
        <summary>E.4 · Debris Inspector</summary>
        <p>One planet · six mineral silhouettes · foreground / background rocks, inward fragments and dust. B freezes local debris motion; C follows the shared capture path.</p>
        {controls.map(([key, label, min, max]) => <label key={key}>
          <span>{label}</span><output>{settings[key].toFixed(2)}</output>
          <input aria-label={label} type="range" min={min} max={max} step=".05" value={settings[key]} disabled={mode === 'legacy'} onChange={event => setSettings(previous => ({ ...previous, [key]: Number(event.target.value) }))} />
        </label>)}
        <p>Motion E controls remain at lower left. Pause, Replay and reduced motion also control the new debris.</p>
        <a href="/homepage-poc/dark-motion-e3/">Open unchanged E.3 baseline ↗</a>
      </details>
    </aside>}
  </div>;
}
