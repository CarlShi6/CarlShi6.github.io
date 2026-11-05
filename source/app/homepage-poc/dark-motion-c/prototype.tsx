"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { DarkWebglV7Prototype } from "../dark-webgl-v7-prototype";
import { createMotionController, type MotionController } from "./controller";
import styles from "./study.module.css";

declare global { interface Window { __motionC?: MotionController } }

export function DarkMotionC(){
  const root=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),controller=useRef<MotionController|null>(null);
  const [target,setTarget]=useState<Element|null>(null);
  const [status,setStatus]=useState<ReturnType<MotionController["snapshot"]>|null>(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{setTarget(root.current?.querySelector("section[aria-label='Dark gravitational portfolio system']")??null);},[]);
  useEffect(()=>{
    if(!target||!root.current||!canvas.current||failed)return;
    let active=true;
    try{
      const api=createMotionController(root.current,canvas.current,()=>{if(active&&controller.current)setStatus(controller.current.snapshot());},()=>setFailed(true));
      controller.current=api;setStatus(api.snapshot());
      if(process.env.NODE_ENV!=="production")window.__motionC=api;
      return()=>{active=false;api.dispose();controller.current=null;delete window.__motionC;};
    }catch(error){console.error("Motion C: using static final scene",error);setFailed(true);}
  },[target,failed]);
  const tuning=status?.tuning;
  return <div ref={root} className={styles.study} data-c-active={failed?"false":"true"}>
    <DarkWebglV7Prototype staticMode scannerEnabled previewMode="center" studyVersion="motion C" />
    {target&&!failed?createPortal(<div className={styles.field} aria-hidden="true"><canvas ref={canvas}/></div>,target):null}
    {process.env.NODE_ENV!=="production"?<details className={styles.inspector}>
      <summary>Motion C · Inspector <span>{failed?"Static fallback":status?.fallback?"Reduced / mobile · final state":status?.userPaused?"Paused":status?.time&&status.time>=4.2?"Ambient":"Formation"}</span></summary>
      <div className={styles.panel}>
        <div className={styles.actions}>
          <button onClick={()=>controller.current?.replay()} disabled={failed||status?.fallback}>Replay Entrance</button>
          <button onClick={()=>status?.userPaused?controller.current?.resume():controller.current?.pause()} disabled={failed||status?.fallback}>{status?.userPaused?"Resume":"Pause"}</button>
          <button onClick={()=>controller.current?.finish()}>Skip</button>
          <Link href="/homepage-poc/dark-motion-study/">Compare with Motion B</Link>
        </div>
        <label>Timeline <output>{Math.min(status?.time??0,4.2).toFixed(2)}s / 4.20s</output><input aria-label="Timeline Scrubber" type="range" min="0" max="4.2" step=".01" value={Math.min(status?.time??0,4.2)} disabled={failed||status?.fallback} onChange={e=>controller.current?.seek(Number(e.target.value))}/></label>
        {([['radius','Event Horizon Radius',.65,1.1],['formation','Accretion Formation',0,1],['rotation','Accretion Rotation Speed',0,2],['flow','Gravitational Flow Speed',0,2],['intensity','Ambient Intensity',.3,1.5]] as const).map(([key,label,min,max])=><label key={key}>{label}<output>{(key==='formation'&&tuning?.formation===-1?status?.state.formation:tuning?.[key])?.toFixed(2)}</output><input aria-label={label} type="range" min={min} max={max} step=".01" disabled={failed||status?.fallback} value={key==='formation'&&tuning?.formation===-1?status?.state.formation??0:tuning?.[key]??min} onChange={e=>controller.current?.set(key,Number(e.target.value))}/></label>)}
        <label className={styles.debug}><input type="checkbox" checked={status?.debug??false} onChange={e=>controller.current?.debug(e.target.checked)} disabled={failed}/>Debug Stream Direction</label>
        {status?.debug?<p>Stream 01 · inward arc progress {(status.pulseProgress*100).toFixed(1)}% · arrows point toward the horizon. A new pulse begins after each traversal.</p>:null}
        <p>One clock · {status?.drawCalls??0} draws · DPR {status?.quality??1}. Scrubbing pauses playback. Escape completes entrance.</p>
      </div>
    </details>:null}
    {!failed&&status&&!status.fallback&&status.time<4.2?<button className={styles.skip} onClick={()=>controller.current?.finish()}>Skip entrance</button>:null}
    {failed?<p className={styles.fallback} role="status">Static final scene — WebGL unavailable.</p>:null}
  </div>;
}
