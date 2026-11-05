"use client";
import {useEffect,useLayoutEffect,useRef,useState,useSyncExternalStore,type RefObject} from 'react';
import Link from 'next/link';
import {PortfolioIdentity} from '../ivory-home';
import {art,FormationArtwork,FallingLeaves} from '../light-home-v24-formation/artwork';
import {createFormation,type FoliageDriver} from '../light-home-v24-formation/motion';
import {makeSkeleton,attachments,type Branch} from '../light-foliage-attachment-study/model';
import {FoliageRig} from '../light-foliage-attachment-study/rig';
import {createAttachedFoliage} from './attached-foliage';
import base from '../light-home-v23/study.module.css';
import world from '../light-home-v24-formation/world.module.css';
import styles from './scene.module.css';
import {BotanicalPreview} from './botanical-preview';
import {HomepageBotanicalScan} from '../botanical-scan/home-interactions';

export type FormationController=ReturnType<typeof createFormation>;
const subscribe=()=>()=>undefined;
let skeleton:Promise<Branch[]>|undefined;
export function FormationScene({controllerRef,interactive=false,active=true,unifiedScan=false}:{controllerRef:RefObject<FormationController|null>;interactive?:boolean;active?:boolean;unifiedScan?:boolean}){
 const root=useRef<HTMLDivElement>(null);
 const driver=useRef<FoliageDriver|null>(null);
 const [rig,setRig]=useState<{branches:Branch[];leaves:ReturnType<typeof attachments>}|null>(null);
 // Keep the original collection links in server HTML and without JavaScript.
 const hydrated=useSyncExternalStore(subscribe,()=>true,()=>false);
 useLayoutEffect(()=>{
  const element=root.current!,api=createFormation(element,interactive?{getFoliage:()=>driver.current}:{});let disposed=false;
  controllerRef.current=api;
  // Parent controller takes over synchronously for the initial entrance; instant
  // theme switches (mobile/reduced motion) use this complete, accessible state.
  api.finish();
  const image=new Image();image.src=art;
  void image.decode().catch(()=>{}).then(()=>{if(!disposed&&!interactive)element.dataset.artReady='true';});
  return()=>{disposed=true;api.dispose();if(controllerRef.current===api)controllerRef.current=null;};
 },[controllerRef,interactive]);
 useEffect(()=>{
  if(!interactive)return;
  let disposed=false;skeleton??=makeSkeleton();
  void skeleton.then(branches=>{if(!disposed)setRig({branches,leaves:attachments(branches,'both')});});
  return()=>{disposed=true;};
 },[interactive]);
 useLayoutEffect(()=>{
  if(!rig||!interactive)return;
  const api=controllerRef.current!;driver.current=createAttachedFoliage(root.current!,rig.branches,rig.leaves);
  const state=api.snapshot();api.seek(state.progress);if(state.settled)api.finish();else if(!state.paused)api.play();
  root.current!.dataset.artReady='true';
  return()=>{driver.current=null;};
 },[rig,interactive,controllerRef]);
 return <div ref={root} className={`${base.page} ${world.page} ${styles.scene}`} data-formation-scene data-attached-foliage={interactive} data-art-ready="false" aria-label="Ivory Cosmos portfolio">
  <div className={base.note}><span>01 / Personal universe</span><span>AI · Product · Design</span></div>
  <section className={base.scene} data-light-stage aria-label="A watercolor planet grows trees and releases falling leaves">
   <div className={`${base.composition} ${world.composition}`} data-light-composition>
    <div className={base.world}><FormationArtwork/><span className={styles.center} data-light-center aria-hidden="true"/><PortfolioIdentity/></div>
    {interactive&&rig&&<FoliageRig branches={rig.branches} leaves={rig.leaves} mode="both" interactive/>}
    {interactive&&active&&hydrated&&rig?(unifiedScan?<HomepageBotanicalScan sceneRef={root}/>:<BotanicalPreview sceneRef={root} active={active}/>):unifiedScan?<noscript><nav aria-label="Portfolio collections"><Link href="/homepage-poc/projects#projects">Explore my work</Link>{' · '}<Link href="/homepage-poc/projects#skills">Explore my toolbox</Link></nav></noscript>:<div className={`${base.labels} ${world.labels} ${styles.labels}`}>
     <span><Link href="/homepage-poc/projects#projects">Projects<small>Explore my work</small></Link></span>
     <span><Link href="/homepage-poc/projects#skills">Skills<small>Explore my toolbox</small></Link></span>
    </div>}
   </div>
  </section>
  <FallingLeaves/>
  <footer className={base.footer}><span>Page inspired by The Little Prince</span></footer>
 </div>;
}
