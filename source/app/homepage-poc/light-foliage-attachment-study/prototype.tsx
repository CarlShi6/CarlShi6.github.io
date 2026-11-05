"use client";
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {CsLogo} from '../cs-logo';
import {PortfolioIdentity} from '../ivory-home';
import {FormationArtwork,FallingLeaves,art} from '../light-home-v24-formation/artwork';
import {FoliageRig} from './rig';
import {makeSkeleton,attachments,type Branch,type Mode} from './model';
import {createAttachmentStudy} from './controller';
import base from '../light-home-v23/study.module.css';
import world from '../light-home-v24-formation/world.module.css';
import styles from './study.module.css';

type Controller=ReturnType<typeof createAttachmentStudy>;
declare global{interface Window{__foliageStudy?:Controller;}}
function StudyScene({branches,mode}:{branches:Branch[];mode:Mode}){
 const root=useRef<HTMLElement>(null),api=useRef<Controller|null>(null);
 const [snapshot,setSnapshot]=useState<ReturnType<Controller['snapshot']>|null>(null);
 const [debug,setDebug]=useState({ids:false,anchors:false,tangents:false,errors:false});
 const [leaves]=useState(()=>attachments(branches,mode));
 useLayoutEffect(()=>{
  const controller=createAttachmentStudy(root.current!,branches,leaves,mode);api.current=controller;
  let disposed=false;const image=new Image();image.src=art;
  void image.decode().catch(()=>{}).then(()=>{if(!disposed)controller.play();});
  const timer=setInterval(()=>setSnapshot(controller.snapshot()),200);
  window.__foliageStudy=controller;
  return()=>{disposed=true;clearInterval(timer);controller.dispose();api.current=null;delete window.__foliageStudy;};
 },[branches,leaves,mode]);
 return <section ref={root} className={`${base.page} ${world.page} ${styles.study}`} data-study-mode={mode} data-ids={debug.ids} data-anchors={debug.anchors} data-tangents={debug.tangents} data-errors={debug.errors}>
  <div className={styles.caption}><h1>{mode==='single'?'One branch. Ten attached leaves.':'Two trees. One attachment system.'}</h1><p>Original watercolor artwork  /  Parent-driven growth  /  Gentle inherited sway</p></div>
  <div className={styles.stage}>
   <div className={`${base.composition} ${world.composition} ${styles.context}`}>
    <div className={`${base.world} ${styles.planet}`}><FormationArtwork/><PortfolioIdentity/></div>
    {mode==='both'&&<FoliageRig branches={branches} leaves={leaves} mode={mode}/>}
   </div>
   {mode==='single'&&<div className={styles.single}><FoliageRig branches={branches} leaves={leaves} mode={mode}/></div>}
  </div>
  <div className={styles.hidden}><FallingLeaves/></div>
  <section className={styles.controls} aria-label="Foliage attachment inspector">
   <div className={styles.actions}><button onClick={()=>api.current?.replay()}>Replay growth</button><button onClick={()=>snapshot?.paused?api.current?.play():api.current?.pause()}>{snapshot?.paused?'Play':'Pause'}</button><button onClick={()=>api.current?.finish()}>Final state</button></div>
   <label>Entrance progress <input aria-label="Entrance progress" type="range" min="0" max="100" step=".1" value={(snapshot?.progress??0)*100} onChange={e=>{api.current?.seek(Number(e.target.value)/100);setSnapshot(api.current!.snapshot());}}/><output>{((snapshot?.progress??0)*100).toFixed(0)}%</output></label>
   <label>Branch sway <input aria-label="Branch sway" type="range" min="0" max="2" step=".1" defaultValue="1" onChange={e=>api.current?.sway(Number(e.target.value))}/></label>
   <fieldset><legend>Debug overlays</legend>{(['ids','anchors','tangents','errors'] as const).map(k=><label key={k}><input type="checkbox" checked={debug[k]} onChange={e=>setDebug(d=>({...d,[k]:e.target.checked}))}/>{({ids:'Branch IDs',anchors:'Attachment points',tangents:'Tangents',errors:'Attachment errors'})[k]}</label>)}</fieldset>
   <output className={styles.metrics} aria-live="off">{snapshot?.visibleLeaves??0} / {leaves.length} leaves  /  Anchor error {snapshot?.maxAnchorErrorPx.toFixed(3)??'--'} px  /  Petiole error {snapshot?.maxPetioleErrorPx.toFixed(3)??'--'} px  /  Premature leaves {snapshot?.earlyLeaves??0}</output>
   <p>Progress follows the existing six-second entrance. Leaf growth begins only after its parent reaches its attachment. Anchors must also sit on painted bark connected to a trunk. Minimum bark opacity: {((snapshot?.minimumBarkOpacity??0)*100).toFixed(0)}%. Debug errors are measured in screen pixels after SVG transforms.</p>
  </section>
 </section>;
}
export function AttachmentStudy(){
 const [branches,setBranches]=useState<Branch[]|null>(null),[mode,setMode]=useState<Mode>('single');
 useEffect(()=>{let disposed=false;void makeSkeleton().then(value=>{if(!disposed)setBranches(value);});return()=>{disposed=true;};},[]);
 return <main className={styles.page}>
  <nav className={base.nav}><Link className={base.home} href="/"><CsLogo/><span>Home</span></Link><span>Foliage attachment study</span><Link href="/homepage-poc/light-home-v24-formation/">Formation baseline</Link></nav>
  <div className={styles.modes} aria-label="Study scope"><button data-mode="single" aria-pressed={mode==='single'} onClick={()=>setMode('single')}>Single branch · 10 leaves</button><button data-mode="both" aria-pressed={mode==='both'} onClick={()=>setMode('both')}>Both trees</button></div>
  {branches?<StudyScene key={mode} branches={branches} mode={mode}/>:<p>Preparing the original branch geometry...</p>}
 </main>;
}
