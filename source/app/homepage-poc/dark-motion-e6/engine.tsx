"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { DarkWebglV7Prototype } from "../dark-webgl-v7-prototype";
import { createCaptureController, type CaptureController } from "./controller";
import styles from "../dark-motion-e/study.module.css";
import tidalStyles from './study.module.css';
import { ranges } from '../dark-motion-d/model';



export function DarkMotionE6Engine({official=false,controlled=false,dismissOnPointerLeave=false,controllerRef}:{official?:boolean;controlled?:boolean;dismissOnPointerLeave?:boolean;controllerRef:RefObject<CaptureController|null>}){
  const root=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
  const [target,setTarget]=useState<Element|null>(null);
  const [status,setStatus]=useState<ReturnType<CaptureController["snapshot"]>|null>(null);
  const [failed,setFailed]=useState(false);
  const [copyStatus,setCopyStatus]=useState('');
  useEffect(()=>{setTarget(root.current?.querySelector("section[aria-label='Dark gravitational portfolio system']")??null);},[]);
  useEffect(()=>{
    if(!target||!root.current||!canvas.current||failed)return;
    let active=true;
    try{
      const api=createCaptureController(root.current,canvas.current,()=>{if(active&&controllerRef.current)setStatus(controllerRef.current.snapshot());},()=>setFailed(true),{controlled});
      controllerRef.current=api;setStatus(api.snapshot());
      // A theme return resumes a complete world; a full page visit gets one entrance.
      if(official&&!controlled){try{if(sessionStorage.getItem('dark-motion-e6-visited')==='true')api.finish();sessionStorage.setItem('dark-motion-e6-visited','true');}catch{/* Storage is optional. */}}
      if(process.env.NODE_ENV!=="production")window.__motionE=api;
      return()=>{active=false;api.dispose();controllerRef.current=null;delete window.__motionE;};
    }catch(error){console.error("Motion E: using static final scene",error);setFailed(true);}
  },[target,failed,controllerRef,official,controlled]);
  const tuning=status?.tuning;
  return <div ref={root} className={styles.study} data-c-active={failed&&!official?"false":"true"}>
    <DarkWebglV7Prototype dismissOnPointerLeave={dismissOnPointerLeave} staticMode scannerEnabled previewMode="center" studyVersion="motion E" official={official}/>
    {target&&!failed?createPortal(<div className={styles.field} aria-hidden="true"><canvas ref={canvas}/></div>,target):null}
    {target&&failed&&official?createPortal(<picture className={`${styles.field} ${tidalStyles.staticField}`}>
      <source media="(max-width:560px)" srcSet="/homepage-poc/motion-e6/approved-field-390.png"/>
      <source media="(max-width:900px)" srcSet="/homepage-poc/motion-e6/approved-field-768.png"/>
      <source media="(min-width:1560px)" srcSet="/homepage-poc/motion-e6/approved-field-1680.png"/>
      <img src="/homepage-poc/motion-e6/approved-field-1440.png" alt=""/>
    </picture>,target):null}
    {!official&&process.env.NODE_ENV!=="production"?<details className={styles.inspector} data-e6-motion-inspector="">
      <summary>Motion E · Inspector v2 <span>{failed?"Static fallback":status?.fallback?"Static final state":status?.userPaused?"Paused":status?.time&&status.time>=(status?.plan.end??0)?"Ambient":"Capture"}</span></summary>
      <div className={styles.panel}>
        <p>All eight objects retain the approved Motion E capture. E.6 integrates eight independently controlled tidal systems.</p>
        <div className={styles.actions}>
          <button onClick={()=>controllerRef.current?.replay()} disabled={failed||status?.fallback}>Replay Entrance</button>
          <button onClick={()=>status?.userPaused?controllerRef.current?.resume():controllerRef.current?.pause()} disabled={failed||status?.fallback}>{status?.userPaused?"Resume":"Pause"}</button>
          <button onClick={()=>controllerRef.current?.finish()}>Skip</button>
          <Link href="/homepage-poc/dark-motion-d/">Compare with Motion D</Link>
        </div>
        <label>Timeline <output>{Math.min(status?.time??0,status?.plan.end??1).toFixed(2)}s / {status?.plan.end.toFixed(2)}s</output><input aria-label="Timeline Scrubber" type="range" min="0" max={status?.plan.end??1} step=".01" value={Math.min(status?.time??0,status?.plan.end??1)} disabled={failed||status?.fallback} onChange={e=>controllerRef.current?.seek(Number(e.target.value))}/></label>
        {([['birthDuration','Black Hole Birth Duration'],['accretionDuration','Accretion Formation Duration'],['flowEntryDuration','Gravity Flow Entry Duration'],['captureDuration','Celestial Capture Duration'],['arrivalStagger','Object Arrival Stagger'],['pullStrength','Gravitational Pull Strength'],['orbitalDrift','Ambient Orbital Drift']] as const).map(([key,label])=><label key={key}>{label}<output>{status?.settings[key].toFixed(2)}{key==='orbitalDrift'?'px':key==='pullStrength'?'×':'s'}</output><input aria-label={label} type="range" min={ranges[key][0]} max={ranges[key][1]} step=".01" value={status?.settings[key]??ranges[key][0]} disabled={failed||status?.fallback} onChange={e=>controllerRef.current?.timing(key,Number(e.target.value))}/></label>)}
        {([['radius','Event Horizon Radius',.65,1.1],['formation','Accretion Formation',0,1],['rotation','Accretion Rotation Speed',0,2],['flow','Gravitational Flow Speed',0,2],['intensity','Ambient Intensity',.3,1.5]] as const).map(([key,label,min,max])=><label key={key}>{label}<output>{(key==='formation'&&tuning?.formation===-1?status?.state.formation:tuning?.[key])?.toFixed(2)}</output><input aria-label={label} type="range" min={min} max={max} step=".01" disabled={failed||status?.fallback} value={key==='formation'&&tuning?.formation===-1?status?.state.formation??0:tuning?.[key]??min} onChange={e=>controllerRef.current?.set(key,Number(e.target.value))}/></label>)}
        <label className={styles.debug}><input type="checkbox" checked={status?.debug??false} onChange={e=>controllerRef.current?.debug(e.target.checked)} disabled={failed}/>Debug Stream Direction</label>
        <div className={styles.actions}>
          <button disabled={failed} onClick={async()=>{try{await navigator.clipboard.writeText(controllerRef.current?.exportSettings()??'');setCopyStatus('Settings copied');}catch{setCopyStatus('Clipboard unavailable — use Export Settings');}}}>Copy Settings</button>
          <button disabled={failed} onClick={()=>{const blob=new Blob([controllerRef.current?.exportSettings()??''],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='dark-motion-e-settings.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setCopyStatus('Settings exported');}}>Export Settings</button>
        </div><p role="status">{copyStatus}</p>
        {status?.debug?<p>Stream 01 · inward arc progress {(status.pulseProgress*100).toFixed(1)}% · arrows point toward the horizon. A new pulse begins after each traversal.</p>:null}
        <p>One clock · {status?.drawCalls??0} draws · DPR {status?.quality??1}. Timing changes keep the playhead and other settings; Replay uses your current preset. Escape completes entrance.</p>
      </div>
    </details>:null}
    {!controlled&&!failed&&status&&!status.fallback&&status.time<status.plan.end?<button className={styles.skip} onClick={()=>controllerRef.current?.finish()}>Skip entrance</button>:null}
    {failed?<p className={styles.fallback} role="status">Static final scene — WebGL unavailable.</p>:null}
  </div>;
}
