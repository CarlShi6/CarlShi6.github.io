"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { DarkWebglV7Prototype } from "../dark-webgl-v7-prototype";
import { createLivingObjectController, type LivingObjectController } from "./controller";
import base from "../dark-motion-e/study.module.css";
import styles from "./study.module.css";
import { ranges } from '../dark-motion-d/model';
import { ambientRanges, type AmbientMode } from './model';

declare global { interface Window { __motionE1?: LivingObjectController } }

const modes: Array<[AmbientMode,string,string]> = [
  ['baseline','A · Baseline','Motion E ambient'],
  ['living','B · Living','Object motion only'],
  ['coupled','C · Coupled','Object + gravity light'],
];

export function DarkMotionE1(){
  const root=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),controller=useRef<LivingObjectController|null>(null);
  const [target,setTarget]=useState<Element|null>(null);
  const [status,setStatus]=useState<ReturnType<LivingObjectController["snapshot"]>|null>(null);
  const [failed,setFailed]=useState(false),[copyStatus,setCopyStatus]=useState('');
  useEffect(()=>{setTarget(root.current?.querySelector("section[aria-label='Dark gravitational portfolio system']")??null);},[]);
  useEffect(()=>{
    if(!target||!root.current||!canvas.current||failed)return;
    let active=true;
    try{
      const api=createLivingObjectController(root.current,canvas.current,()=>{if(active&&controller.current)setStatus(controller.current.snapshot());},()=>setFailed(true));
      controller.current=api;setStatus(api.snapshot());
      if(process.env.NODE_ENV!=="production")window.__motionE1=api;
      return()=>{active=false;api.dispose();controller.current=null;delete window.__motionE1;};
    }catch(error){console.error("Motion E.1: using static final scene",error);setFailed(true);}
  },[target,failed]);
  const tuning=status?.tuning;
  return <div ref={root} className={`${base.study} ${styles.study}`} data-c-active={failed?"false":"true"}>
    <DarkWebglV7Prototype staticMode scannerEnabled previewMode="center" studyVersion="motion E.1" />
    {target&&!failed?createPortal(<div className={base.field} aria-hidden="true"><canvas ref={canvas}/></div>,target):null}
    {process.env.NODE_ENV!=="production"?<details className={base.inspector}>
      <summary>Motion E.1 · Living Objects <span>{failed?"Static fallback":status?.fallback?"Static final state":status?.userPaused?"Paused":status?.time&&status.time>=(status?.plan.end??0)?"Ambient":"Capture"}</span></summary>
      <div className={base.panel}>
        <p className={styles.note}>Representative ambient pair: Project 01 + Satellite 01. Motion E capture and its approved preset remain unchanged; six additional ambient behaviors await visual approval.</p>
        <div className={styles.comparison} aria-label="Ambient comparison mode">
          {modes.map(([value,label,description])=><button key={value} aria-pressed={status?.mode===value} title={description} onClick={()=>controller.current?.mode(value)}>{label}</button>)}
        </div>
        <div className={base.actions}>
          <button onClick={()=>controller.current?.replay()} disabled={failed||status?.fallback}>Replay Entrance</button>
          <button onClick={()=>status?.userPaused?controller.current?.resume():controller.current?.pause()} disabled={failed||status?.fallback}>{status?.userPaused?"Resume":"Pause"}</button>
          <button onClick={()=>controller.current?.finish()}>Skip</button>
          <Link href="/homepage-poc/dark-motion-e/">Compare with Motion E</Link>
        </div>
        <label>Timeline <output>{Math.min(status?.time??0,status?.plan.end??1).toFixed(2)}s / {status?.plan.end.toFixed(2)}s</output><input aria-label="Timeline Scrubber" type="range" min="0" max={status?.plan.end??1} step=".01" value={Math.min(status?.time??0,status?.plan.end??1)} disabled={failed||status?.fallback} onChange={e=>controller.current?.seek(Number(e.target.value))}/></label>
        {([['birthDuration','Black Hole Birth Duration'],['accretionDuration','Accretion Formation Duration'],['flowEntryDuration','Gravity Flow Entry Duration'],['captureDuration','Celestial Capture Duration'],['arrivalStagger','Object Arrival Stagger'],['pullStrength','Gravitational Pull Strength'],['orbitalDrift','Ambient Orbital Drift']] as const).map(([key,label])=><label key={key}>{label}<output>{status?.settings[key].toFixed(2)}{key==='orbitalDrift'?'px':key==='pullStrength'?'×':'s'}</output><input aria-label={label} type="range" min={ranges[key][0]} max={ranges[key][1]} step=".01" value={status?.settings[key]??ranges[key][0]} disabled={failed||status?.fallback} onChange={e=>controller.current?.timing(key,Number(e.target.value))}/></label>)}
        {([['driftAmplitude','Orbital Drift Amplitude','px'],['driftPeriod','Orbital Drift Period','s'],['surfaceRotationSpeed','Planet Surface Rotation Speed','×'],['orientationVariation','Object Orientation Variation','°'],['gravityCoupling','Gravity Light Coupling','×']] as const).map(([key,label,unit])=><label key={key}>{label}<output>{status?.ambient[key].toFixed(2)}{unit}</output><input aria-label={label} type="range" min={ambientRanges[key][0]} max={ambientRanges[key][1]} step=".01" value={status?.ambient[key]??ambientRanges[key][0]} disabled={failed||status?.fallback} onChange={e=>controller.current?.ambient(key,Number(e.target.value))}/></label>)}
        <div className={styles.toggles} aria-label="Per-object ambient motion">
          <label><input type="checkbox" checked={status?.enabled[0]??true} onChange={e=>controller.current?.ambientEnabled(0,e.target.checked)}/>Project 01 ambient</label>
          <label><input type="checkbox" checked={status?.enabled[4]??true} onChange={e=>controller.current?.ambientEnabled(4,e.target.checked)}/>Satellite 01 ambient</label>
        </div>
        {([['radius','Event Horizon Radius',.65,1.1],['formation','Accretion Formation',0,1],['rotation','Accretion Rotation Speed',0,2],['flow','Gravitational Flow Speed',0,2],['intensity','Ambient Intensity',.3,1.5]] as const).map(([key,label,min,max])=><label key={key}>{label}<output>{tuning?.[key]?.toFixed(2)}</output><input aria-label={label} type="range" min={min} max={max} step=".01" disabled={failed||status?.fallback} value={tuning?.[key]??min} onChange={e=>controller.current?.set(key,Number(e.target.value))}/></label>)}
        <label className={base.debug}><input type="checkbox" checked={status?.debug??false} onChange={e=>controller.current?.debug(e.target.checked)} disabled={failed}/>Debug Stream Direction</label>
        <div className={base.actions}>
          <button disabled={failed} onClick={async()=>{try{await navigator.clipboard.writeText(controller.current?.exportSettings()??'');setCopyStatus('Settings copied');}catch{setCopyStatus('Clipboard unavailable — use Export Settings');}}}>Copy Settings</button>
          <button disabled={failed} onClick={()=>{const blob=new Blob([controller.current?.exportSettings()??''],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='dark-motion-e1-settings.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setCopyStatus('Settings exported');}}>Export Settings</button>
        </div><p role="status">{copyStatus}</p>
        <p>One clock · {status?.drawCalls??0} draws · render scale {status?.quality??1}. Scanner focus pauses ambient phase so its hit target remains stable.</p>
      </div>
    </details>:null}
    {!failed&&status&&!status.fallback&&status.time<status.plan.end?<button className={base.skip} onClick={()=>controller.current?.finish()}>Skip entrance</button>:null}
    {failed?<p className={base.fallback} role="status">Static final scene — WebGL unavailable.</p>:null}
  </div>;
}
