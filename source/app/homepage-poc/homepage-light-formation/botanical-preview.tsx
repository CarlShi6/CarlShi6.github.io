"use client";

import {useEffect,useLayoutEffect,useRef,useState,type RefObject} from 'react';
import {createPortal} from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import {projectPlanets,skillSpacecraft} from '../space-system.data';
import base from '../light-home-v23/study.module.css';
import world from '../light-home-v24-formation/world.module.css';
import styles from './botanical-preview.module.css';
import {CanopyPreviewLeaf,selectCanopyLeaf} from './canopy-preview-leaf';

type Kind='projects'|'skills';
type Opening=NonNullable<ReturnType<typeof selectCanopyLeaf>>&{kind:Kind;immediate:boolean};

/** A botanical reading state. Animation is scoped to this overlay, never the world timeline. */
export function BotanicalPreview({sceneRef,active}:{sceneRef:RefObject<HTMLDivElement|null>;active:boolean}){
 const root=useRef<HTMLDivElement>(null),panel=useRef<HTMLElement>(null),flight=useRef<HTMLDivElement>(null);
 const art=useRef<HTMLDivElement>(null),sheet=useRef<HTMLDivElement>(null),timeline=useRef<gsap.core.Timeline|null>(null);
 const shoot=useRef<SVGPathElement>(null);
 const triggers=useRef<Partial<Record<Kind,HTMLButtonElement|null>>>({});
 const closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null),hoverTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const modality=useRef<'pointer'|'keyboard'|'touch'>('pointer'),pointerInside=useRef(false),suppressed=useRef(false);
 const [opening,setOpening]=useState<Opening|null>(null),[ready,setReady]=useState(false);
 const cancelClose=()=>{if(closeTimer.current)clearTimeout(closeTimer.current);closeTimer.current=null;};
 const cancelHover=()=>{if(hoverTimer.current)clearTimeout(hoverTimer.current);hoverTimer.current=null;};
 const dismiss=(restore=false)=>{
  cancelClose();cancelHover();suppressed.current=true;
  if(restore&&opening){triggers.current[opening.kind]?.focus({preventScroll:true});}
  setOpening(null);setReady(false);suppressed.current=false;
 };
 const open=(kind:Kind,immediate=false)=>{
  if(!active||suppressed.current)return;
  cancelClose();cancelHover();
  if(opening?.kind===kind)return;
  const point=selectCanopyLeaf(sceneRef.current!,kind);
  if(!point)return;
  setReady(false);setOpening({kind,...point,immediate});
 };
 const enter=(kind:Kind)=>{
  pointerInside.current=true;suppressed.current=false;cancelClose();cancelHover();
  if(modality.current==='touch')return;
  hoverTimer.current=setTimeout(()=>open(kind),120);
 };
 const leave=()=>{
  pointerInside.current=false;cancelHover();cancelClose();
  // A traversable gap between the branch and its enlarged reading state.
  closeTimer.current=setTimeout(()=>{
   const focus=document.activeElement;
   if(modality.current==='touch'||pointerInside.current)return;
   if(modality.current==='keyboard'&&(panel.current?.contains(focus)||root.current?.contains(focus)))return;
   setOpening(null);setReady(false);
  },Math.max(800,((timeline.current?.totalDuration()??0)-(timeline.current?.time()??0))*1000+600));
 };
 const focus=(kind:Kind)=>{if(!suppressed.current&&modality.current==='keyboard')open(kind,true);};
 const activate=(kind:Kind)=>{
  suppressed.current=false;
  if(opening?.kind===kind){timeline.current?.progress(1);if(modality.current==='keyboard')panel.current?.querySelector<HTMLAnchorElement>('a')?.focus();}
  else open(kind,modality.current==='keyboard');
 };

 useEffect(()=>{
  const node=sceneRef.current;if(!node||!active)return;
  node.dataset.watering='true';
  const pointer=(event:PointerEvent)=>{modality.current=event.pointerType==='touch'?'touch':'pointer';};
  const keyboard=(event:KeyboardEvent)=>{if(event.key==='Tab')modality.current='keyboard';};
  document.addEventListener('pointerdown',pointer,true);document.addEventListener('keydown',keyboard,true);
  return()=>{delete node.dataset.watering;document.removeEventListener('pointerdown',pointer,true);document.removeEventListener('keydown',keyboard,true);cancelClose();cancelHover();};
 },[active,sceneRef]);

 useEffect(()=>{
  if(!opening)return;
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();dismiss(modality.current==='keyboard');}};
  const outside=(event:PointerEvent)=>{if(!panel.current?.contains(event.target as Node)&&!root.current?.contains(event.target as Node))dismiss();};
  const focusOut=(event:FocusEvent)=>{if(modality.current==='keyboard'&&!panel.current?.contains(event.target as Node)&&!root.current?.contains(event.target as Node))dismiss();};
  const visibility=()=>{if(document.hidden)timeline.current?.pause();else timeline.current?.resume();};
  const resize=()=>{timeline.current?.progress(1);};
  document.addEventListener('keydown',escape);document.addEventListener('pointerdown',outside);
  document.addEventListener('focusin',focusOut);document.addEventListener('visibilitychange',visibility);window.addEventListener('resize',resize);
  return()=>{document.removeEventListener('keydown',escape);document.removeEventListener('pointerdown',outside);document.removeEventListener('focusin',focusOut);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',resize);};
 // Event handlers read the current opening; listeners are removed on each state change.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[opening]);

 useLayoutEffect(()=>{
  if(!opening||!panel.current||!flight.current||!art.current||!active)return;
  const scene=sceneRef.current!;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const context=gsap.context(()=>{
   const destination=art.current!.getBoundingClientRect();
   const fly=flight.current!,reading=sheet.current!;
   const source=scene.querySelector<SVGGElement>(`[data-leaf-carrier="${opening.index}"]`)!;
   const sourceBlade=source.querySelector<SVGGElement>('[data-leaf-blade]')!;
   source.dataset.previewLeaf='true';
   gsap.set(sourceBlade,{opacity:0});
   // Start with the exact existing leaf transform. Grow from its petiole before
   // moving the same leaf into the reading composition; never swap to a fruit.
   const state={x:opening.x,y:opening.y,w:44*opening.scale,h:54*opening.scale,angle:opening.angle};
   const twig=shoot.current!;
   gsap.set(fly,{transformOrigin:'50% 88.888889%',autoAlpha:1});
   gsap.set(twig,{opacity:1,strokeWidth:Math.max(.7,opening.scale*1.7)});
   const render=()=>{
    gsap.set(fly,{x:state.x-state.w/2,y:state.y-state.h*48/54,width:state.w,height:state.h,rotation:state.angle});
    const dx=state.x-opening.anchorX,dy=state.y-opening.anchorY;
    twig.setAttribute('d',`M${opening.anchorX} ${opening.anchorY} C${opening.anchorX+dx*.3} ${opening.anchorY+dy*.55} ${state.x-dx*.12} ${state.y-dy*.22} ${state.x} ${state.y}`);
   };
   render();gsap.set(art.current,{opacity:0});gsap.set(reading,{opacity:0});
   const tl=gsap.timeline({defaults:{ease:'power2.inOut'},onUpdate:render,onComplete:()=>setReady(true)});
   timeline.current=tl;
   const grownHeight=Math.max(85,state.h*4.5);
   tl.addLabel('leaf-extension',0)
    .to(state,{h:grownHeight,w:grownHeight*.48,duration:.9},'leaf-extension')
    .to(state,{w:grownHeight*44/54,angle:opening.angle*.65,duration:.5},'leaf-extension+=.5')
    .addLabel('open-reading',1)
    .to(state,{x:destination.left+destination.width/2,y:destination.top+destination.height*48/54,w:destination.width,h:destination.height,angle:0,duration:.9},'open-reading')
    .to(reading,{opacity:1,duration:.55},'open-reading+=.25')
    .to(twig,{opacity:0,duration:.4},'open-reading+=.5')
    .set(art.current,{opacity:1}).set(fly,{autoAlpha:0});
   if(reduced.matches||opening.immediate)tl.progress(1);
  },panel);
  const stopMotion=()=>timeline.current?.progress(1);
  reduced.addEventListener('change',stopMotion);
  return()=>{reduced.removeEventListener('change',stopMotion);context.revert();const source=scene.querySelector<SVGGElement>(`[data-leaf-carrier="${opening.index}"]`);if(source)delete source.dataset.previewLeaf;timeline.current=null;};
 },[opening,active,sceneRef]);

 useLayoutEffect(()=>{
  if(!opening||!panel.current||!art.current)return;
  const svg=panel.current.querySelector<SVGSVGElement>(`svg.${styles.connectors}`)!;
  const update=()=>{
   const bounds=svg.getBoundingClientRect(),picture=art.current!.getBoundingClientRect();
   if(!bounds.width||!bounds.height)return;
   svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
   const rows=panel.current!.querySelectorAll('[data-botanical-link]');
   [...svg.querySelectorAll('g')].forEach((group,i)=>{
    const row=rows[i].getBoundingClientRect();
    const x=picture.left-bounds.left+picture.width*(.43+(i%2)*.1);
    const y=picture.top-bounds.top+picture.height*(.22+i*.18);
    const end=row.top-bounds.top+row.height*.5;
    group.querySelector('path')!.setAttribute('d',`M${x} ${y} C${x+65} ${y+12} ${bounds.width-80} ${end} ${bounds.width} ${end}`);
    group.querySelector('circle')!.setAttribute('cx',String(x));group.querySelector('circle')!.setAttribute('cy',String(y));
   });
  };
  const observer=new ResizeObserver(update);observer.observe(svg);observer.observe(art.current);update();
  return()=>observer.disconnect();
 },[opening]);

 const kind=opening?.kind;
 const preview=opening&&active&&<section ref={panel} id="light-botanical-preview" className={styles.preview} data-botanical-preview={kind} data-ready={ready} role="region" aria-label={`${kind==='projects'?'Projects':'Skills'} preview`}
  onPointerEnter={()=>{pointerInside.current=true;cancelClose();}} onPointerLeave={leave} onFocusCapture={cancelClose}
  onKeyDown={event=>{if(event.key==='Tab'&&event.shiftKey&&document.activeElement===panel.current?.querySelector('button')){event.preventDefault();triggers.current[opening.kind]?.focus();}}}>
  <div ref={sheet} className={styles.sheet}>
   <header className={styles.heading}><div><h2>{kind==='projects'?'Projects':'Skills'}</h2><p>{kind==='projects'?'Ideas, made tangible.':'The capabilities behind the work.'}</p></div>
    <button className={styles.close} onClick={()=>dismiss(true)} aria-label="Close preview"><span aria-hidden="true">×</span></button>
   </header>
   <div className={styles.spread}>
    <div className={styles.illustration}>
     <div ref={art} className={styles.art}><CanopyPreviewLeaf gold={opening.gold}/></div>
     <svg className={styles.connectors} viewBox="0 0 440 600" preserveAspectRatio="none" aria-hidden="true">
      {[95,230,365,500].map((y,i)=><g key={y}><path d={`M ${185+i%2*45} ${y+20} C 320 ${y+35} 315 ${y} 439 ${y}`}/><circle cx={185+i%2*45} cy={y+20} r="3"/></g>)}
     </svg>
    </div>
    <div className={styles.entries}>
     {(kind==='projects'?projectPlanets:skillSpacecraft).map((item,i)=><Link key={item.id} className={`${styles.entry} ${kind==='skills'?styles.skill:''}`} href={item.href} data-botanical-link={item.id}>
      <div className={styles.copy}><span className={styles.number}>{String(i+1).padStart(2,'0')}</span><h3>{item.title}</h3><p>{item.summary}</p>
       {kind==='skills'&&<div className={styles.capabilities}>{item.detail.split(' · ').map(value=><span key={value}>{value}</span>)}</div>}
       <span className={styles.look}>{kind==='projects'?'Look closer':'Explore capability'} <span aria-hidden="true">↗</span></span>
      </div>
      {kind==='projects'&&item.image&&<Image unoptimized className={styles.thumbnail} src={item.image} alt={`${item.title} — project artifact`} width={160} height={105}/>}
     </Link>)}
    </div>
   </div>
   <footer className={styles.foot}><span>{kind==='projects'?'Four selected projects':'Product · Technology · Design · Delivery'}</span><Link href={`/homepage-poc/projects#${kind}`}>{kind==='projects'?'All projects':'Skills overview'} <span aria-hidden="true">→</span></Link></footer>
  </div>
  <svg className={styles.shoot} aria-hidden="true"><path ref={shoot} fill="none" stroke="#6e7062" strokeLinecap="round"/></svg>
  <div ref={flight} className={styles.flight} aria-hidden="true"><CanopyPreviewLeaf gold={opening.gold}/></div>
 </section>;

 return <div ref={root} className={styles.root} data-botanical-root data-open={!!opening&&active}>
  <div className={styles.targets} aria-hidden="true">
   {(['projects','skills'] as const).map(k=><button key={k} className={styles[k]} tabIndex={-1} aria-label={`${k} tree`} disabled={!active} data-tree-target={k}
    onPointerEnter={e=>{if(e.pointerType==='mouse')enter(k);}} onPointerLeave={leave} onClick={()=>activate(k)}/>)}</div>
  <div className={`${base.labels} ${world.labels} ${styles.labels}`}>
   {(['projects','skills'] as const).map(k=><span key={k}><button ref={node=>{triggers.current[k]=node;}} type="button" aria-expanded={kind===k&&active} aria-controls={kind===k?'light-botanical-preview':undefined} data-tree-trigger={k} disabled={!active}
    onPointerEnter={e=>{if(e.pointerType==='mouse')enter(k);}} onPointerLeave={leave} onFocus={()=>focus(k)} onBlur={leave} onClick={()=>activate(k)}
    onKeyDown={event=>{if(event.key==='Tab'&&!event.shiftKey&&opening?.kind===k){event.preventDefault();panel.current?.querySelector<HTMLElement>('button,a')?.focus();}}}>
    {k==='projects'?'Projects':'Skills'}<small>{k==='projects'?'Explore my work':'Explore my toolbox'}</small></button></span>)}
  </div>
  {preview&&createPortal(preview,document.body)}
 </div>;
}
