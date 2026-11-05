"use client";
import { useEffect,useRef,useState,type RefObject } from 'react';
import { DarkMotionE6Engine } from './engine';
import { FullTidalField } from './tidal-field';
import { defaults,names,type TidalSettings } from './settings';
import styles from './study.module.css';
import type { CaptureController } from './controller';

export function DarkMotionE6({official=false,controlled=false,dismissOnPointerLeave=false,externalControllerRef}:{official?:boolean;controlled?:boolean;dismissOnPointerLeave?:boolean;externalControllerRef?:RefObject<CaptureController|null>}){
  const root=useRef<HTMLDivElement>(null);
  const internalControllerRef=useRef<CaptureController|null>(null);
  const controllerRef=externalControllerRef??internalControllerRef;
  const [settings,setSettings]=useState<TidalSettings>(()=>structuredClone(defaults));
  useEffect(()=>{window.dispatchEvent(new CustomEvent('motion-e6-settings',{detail:settings}));},[settings]);
  return <div ref={root} className={styles.study} data-e6="">
    <DarkMotionE6Engine dismissOnPointerLeave={dismissOnPointerLeave} official={official} controlled={controlled} controllerRef={controllerRef}/>
    <FullTidalField root={root} settings={settings} controllerRef={controllerRef}/>
    {!official&&process.env.NODE_ENV!=='production'&&<details className={styles.inspector} aria-label="E.6 Tidal Inspector">
      <summary>E.6 · Eight-object Tidal Inspector</summary>
      <div className={styles.panel}>
        <p>Controls crust separation, debris, mechanical tension and light turbulence. The authored erosion silhouettes remain recognizable.</p>
        {([['global','Global Tidal Disruption Intensity',0,2],['density','Debris Density',0,2],['spread','Debris Spread',.3,1.5],['turbulence','Dust / Turbulence Intensity',0,1.5]] as const).map(([key,label,min,max])=><label key={key}>{label}<output>{settings[key].toFixed(2)}</output><input type="range" aria-label={label} min={min} max={max} step=".05" value={settings[key]} onChange={event=>setSettings(s=>({...s,[key]:Number(event.target.value)}))}/></label>)}
        {names.map((name,i)=><fieldset key={name}><legend>{String(i+1).padStart(2,'0')} · {name}</legend>
          <label className={styles.toggle}><input type="checkbox" aria-label={`Object ${i+1} debris enabled`} checked={settings.objects[i].enabled} onChange={event=>setSettings(s=>({...s,objects:s.objects.map((v,j)=>j===i?{...v,enabled:event.target.checked}:v)}))}/> Debris enabled</label>
          <label>Disruption intensity <output>{settings.objects[i].intensity.toFixed(2)}</output><input aria-label={`Object ${i+1} Disruption Intensity`} type="range" min="0" max="2" step=".05" value={settings.objects[i].intensity} onChange={event=>setSettings(s=>({...s,objects:s.objects.map((v,j)=>j===i?{...v,intensity:Number(event.target.value)}:v)}))}/></label>
        </fieldset>)}
        <button onClick={()=>setSettings(structuredClone(defaults))}>Reset tidal controls</button>
        <a href="/homepage-poc/dark-motion-e5/">Unchanged E.5 baseline ↗</a>
      </div>
    </details>}
  </div>;
}
