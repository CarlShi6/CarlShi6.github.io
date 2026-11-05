"use client";
import { useEffect, useRef, useState } from 'react';
import { DarkMotionE5Engine } from './engine';
import { LayeredDebris } from '../dark-motion-e4/layered-debris';
import { TidalDebris } from './tidal-debris';
import styles from './study.module.css';

const settings={density:1,variation:1,speed:.65,spread:1,lighting:.85};
export function DarkMotionE5(){
  const root=useRef<HTMLDivElement>(null);
  const [tidal,setTidal]=useState(true);
  useEffect(()=>{window.dispatchEvent(new CustomEvent('motion-e5-organic',{detail:tidal}));},[tidal]);
  return <div ref={root} className={styles.study} data-e5-mode={tidal?'tidal':'baseline'}>
    <DarkMotionE5Engine />
    {tidal?<TidalDebris root={root} mode="coupled" controls={settings}/>:<LayeredDebris root={root} mode="coupled" controls={settings}/>}
    {process.env.NODE_ENV!=='production'&&<aside className={styles.inspector} aria-label="E.5 tidal study">
      <div className={styles.modes} aria-label="E.5 comparison mode">
        <button aria-pressed={!tidal} onClick={()=>setTidal(false)}>A · Intact / E.4</button>
        <button aria-pressed={tidal} onClick={()=>setTidal(true)}>B · Tidal / E.5</button>
      </div>
      <details><summary>E.5 · One-planet material study</summary>
        <p>Fractured crust → detached rocks → mineral suspension → sheared inward flow. Only the upper-left planet and its stream change.</p>
        <p>Use the unchanged Motion E Inspector to pause, replay or seek. A/B keeps the same scene clock and approved presets.</p>
        <a href="/homepage-poc/dark-motion-e4/">Open unchanged E.4 ↗</a>
      </details>
    </aside>}
  </div>;
}
