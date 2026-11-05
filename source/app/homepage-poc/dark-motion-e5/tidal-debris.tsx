"use client";

import gsap from 'gsap';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { createGravityPath, type GravityPath } from '../dark-motion-c/paths';
import { withCaptureApproach } from '../dark-motion-e/paths';
import styles from './study.module.css';

export type StudyMode = 'legacy' | 'sculpted' | 'coupled';
export type DebrisControls = { density:number; variation:number; speed:number; spread:number; lighting:number };
type Seed = { id:number; kind:'hero'|'flow'|'dust'; front:boolean; phase:number; speed:number; turn:number; x:number; y:number; size:number; sprite:number };
const hash = (i:number) => { const v=Math.sin(i*127.1+311.7)*43758.5453; return v-Math.floor(v); };
const clamp = (v:number, min=0, max=1) => Math.min(max,Math.max(min,v));
const smooth = (v:number) => { const x=clamp(v); return x*x*(3-2*x); };
const clusters = [[.23,.10],[.26,.19],[.17,.27],[.28,.23],[.20,.14],[.14,.29],[.31,.15],[.25,.25],[.20,.22],[.22,.16]];
const seeds:Seed[] = [
  ...clusters.map(([x,y],id):Seed=>({id,kind:'hero',front:id%3!==1,phase:hash(id+1),speed:.55+hash(id+11),turn:(id%2?1:-1)*(2+hash(id+17)*3),x,y,size:[27,18,22,12,16,10,14,11,9,13][id],sprite:id%6})),
  ...Array.from({length:16},(_,i):Seed=>({id:i+10,kind:'flow',front:i%3===0,phase:hash(i+81),speed:.65+hash(i+92)*.65,turn:(i%2?-1:1)*(5+hash(i+100)*5),x:0,y:(hash(i+110)-.5)*2,size:9+hash(i+120)*12,sprite:(i+2)%6})),
  ...Array.from({length:20},(_,i):Seed=>({id:i+26,kind:'dust',front:false,phase:hash(i+161),speed:.8+hash(i+172)*.6,turn:0,x:0,y:(hash(i+180)-.5)*2,size:1.1+hash(i+190)*1.1,sprite:0})),
];
// Native SVG viewports select complete, alpha-padded atlas cells without editing the artwork.
const cells = ['0 0 550 512','550 0 510 512','1060 0 476 512','0 512 550 512','550 512 510 512','1060 512 476 512'];

function Rock({ seed }: {seed:Seed}) {
  return <span className={styles.fragment} data-tidal-fragment-id={seed.id} data-kind={seed.kind}>
    {seed.kind!=='dust' && <svg viewBox={cells[seed.sprite]} aria-hidden="true"><image href="/homepage-poc/motion-e4/mineral-fragments.png" width="1536" height="1024" /></svg>}
  </span>;
}

export function TidalDebris({root,mode,controls}:{root:RefObject<HTMLDivElement|null>;mode:StudyMode;controls:DebrisControls}) {
  const [stage,setStage]=useState<HTMLElement|null>(null);
  const current=useRef({mode,controls});
  useEffect(()=>{current.current={mode,controls};},[mode,controls]);
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>setStage(root.current?.querySelector<HTMLElement>("section[aria-label='Dark gravitational portfolio system']")??null));
    return()=>cancelAnimationFrame(frame);
  },[root]);

  useEffect(()=>{
    if(!stage)return;
    const object=stage.querySelector<HTMLElement>('[data-object-id]');
    const hole=stage.querySelector<HTMLElement>('[data-transition-role="dark-hole"]');
    if(!object||!hole)return;
    const layers=Array.from(stage.querySelectorAll<HTMLElement>('[data-e5-layer]'));
    const fragments=seeds.map(seed=>stage.querySelector<HTMLElement>(`[data-tidal-fragment-id="${seed.id}"]`)!);
    let dirty=true, cacheKey='', path:GravityPath|undefined, width=0, parentSize=184, center={x:0,y:0}, radius=200;
    let artOffset={x:0,y:0};
    let table:Array<{x:number;y:number;tx:number;ty:number}>=[];
    let lastTime=-1, localTime=0, lastPaint='', writes=0;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const observer=new ResizeObserver(()=>{dirty=true;});observer.observe(stage);observer.observe(hole);observer.observe(object);
    const invalidate=()=>{dirty=true;lastPaint='';};
    reduce.addEventListener('change',invalidate);
    const sample=(s:number)=>{
      const f=clamp(s)*(table.length-1), i=Math.floor(f), a=table[i], b=table[Math.min(i+1,table.length-1)], t=f-i;
      return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,tx:a.tx+(b.tx-a.tx)*t,ty:a.ty+(b.ty-a.ty)*t};
    };
    const paint=()=>{
      if(document.hidden)return;
      const {mode:activeMode,controls:c}=current.current;
      const api=window.__motionE, state=api?.snapshot();
      const staticMotion=reduce.matches||!!state?.fallback||!state;
      const time=state?.time??0;
      if(lastTime>=0 && time>=lastTime && activeMode==='coupled' && !staticMotion) localTime+=(time-lastTime)*c.speed;
      if(time<lastTime) localTime=time*c.speed;
      lastTime=time;
      if(dirty){
        // One read batch on resize, never a DOM read for every fragment/frame.
        const sr=stage.getBoundingClientRect(),hr=hole.getBoundingClientRect();
        width=sr.width;
        const art=object.querySelector<HTMLElement>('[data-art]')!;
        parentSize=art.offsetWidth;
        if(width<=900){
          const ar=art.getBoundingClientRect(),br=object.getBoundingClientRect();
          artOffset={x:ar.x+ar.width/2-br.x-br.width/2,y:ar.y+ar.height/2-br.y-br.height/2};
        }else artOffset={x:0,y:0};
        center={x:hr.x+hr.width/2-sr.x,y:hr.y+hr.height/2-sr.y};radius=hr.width*.35;
      }
      const sr=dirty&&!state?stage.getBoundingClientRect():null,or=dirty&&!state?object.getBoundingClientRect():null;
      const anchor=state?.anchors[0]??(sr&&or?{x:or.x+or.width/2-sr.x,y:or.y+or.height/2-sr.y}:path?.anchor);
      if(!anchor)return;
      const key=`${width},${anchor.x},${anchor.y},${center.x},${center.y},${radius},${state?.tuning.radius??.89}`;
      if(dirty||key!==cacheKey){
        path=withCaptureApproach(createGravityPath(0,anchor,width,center,radius*(state?.tuning.radius??.89)),width);
        table=Array.from({length:769},(_,i)=>{const p=path!.sample(i/768);return {x:p.position.x,y:p.position.y,tx:p.tangent.x,ty:p.tangent.y};});
        cacheKey=key;dirty=false;lastPaint='';
      }
      if(!path)return;
      const activePath=path;
      const phase=state?.phases[0]?.capture??1, pose=state?.poses[0], head=(pose?.progress??1)*path.stop;
      const parent=pose??{x:anchor.x,y:anchor.y,scale:1,rotation:0,velocity:0};
      const atHead=sample(head),offset={x:parent.x-atHead.x,y:parent.y-atHead.y};
      const clock=activeMode==='coupled'&&!staticMotion?localTime:0;
      const signature=JSON.stringify([activeMode,c,clock,parent.x,parent.y,parent.scale,phase,staticMotion]);
      if(signature===lastPaint)return;
      lastPaint=signature;writes++;
      const visible=activeMode!=='legacy', scale=clamp(parentSize/184,.72,1.12)*parent.scale;
      layers.forEach(layer=>{layer.style.visibility=visible?'visible':'hidden';});
      const telemetry:Array<{id:number;kind:string;x:number;y:number;s:number;size:number;opacity:number}>=[];
      seeds.forEach((seed,index)=>{
        const element=fragments[index];if(!element)return;
        const limit=seed.kind==='hero'?Math.round(7*c.density):seed.kind==='flow'?11:14;
        const localIndex=seed.kind==='hero'?index:seed.kind==='flow'?index-10:index-26;
        let opacity=visible&&localIndex<limit?1:0;
        let x=0,y=0,s=head,turn=seed.phase*42-21,size=seed.size;
        const variation=1+(hash(index+250)-.5)*c.variation*.8;
        if(seed.kind==='hero'){
          // Capture inertia decays to zero before ambient. Front/back assignment stays fixed.
          const lag=activeMode==='coupled'&&!staticMotion?Math.min(.025,parent.velocity/activePath.length*.08)*(1-smooth((phase-.72)/.28)):0;
          const release=(seed.phase+clock*.023*seed.speed)%1;
          const peel=smooth((release-.18)/.82);
          s=Math.max(0,head-lag*(.5+seed.phase)+peel*.075*smooth((phase-.6)/.4));const p=sample(s);
          const ambient=smooth((phase-.8)/.2);
          x=p.x+offset.x+artOffset.x+seed.x*parentSize*c.spread*parent.scale*(1-peel*.7)+Math.sin(clock*.19*seed.speed+seed.phase*6)*2*ambient;
          y=p.y+offset.y+artOffset.y+seed.y*parentSize*c.spread*parent.scale*(1-peel*.7)+Math.cos(clock*.14*seed.speed+seed.phase*6)*1.5*ambient;
          if(width<=900){
            x=parent.x+artOffset.x+(seed.x+peel*.12)*parentSize*c.spread;
            y=parent.y+artOffset.y+(seed.y+peel*.06)*parentSize*c.spread;
          }
          turn+=Math.sin(clock*.13*seed.speed)*22;
          size*=1-peel*.45;
          opacity*=(seed.front?.96:.67)*smooth(release/.07)*smooth((1-release)/.22);
        }else{
          const q=(seed.phase+clock*.024*seed.speed)%1;
          // Unequal seeded phases / speeds, with density strongest near the parent.
          const extent=Math.min(.30,(activePath.mergeAt-activePath.stop)*.78);
          const settledBlend=smooth((phase-.60)/.40);
          // Until settling, rocks trail behind the captured body. They then feed
          // into its inward ribbon, with a continuous handover instead of a jump.
          s=head+Math.pow(q,1.35)*extent*settledBlend-(.008+q*.075)*(1-settledBlend);
          const p=sample(s),tether=Math.exp(-Math.pow((s-head)/.09,2));
          const normal=seed.y*parentSize*.16*c.spread*Math.sin(q*Math.PI)*(seed.kind==='dust'?1.3:1);
          const origin=1-smooth(q/.55);
          x=p.x+offset.x*tether-p.ty*normal+parentSize*.23*origin*parent.scale;
          y=p.y+offset.y*tether+p.tx*normal+parentSize*.18*origin*parent.scale;
          size*=(seed.kind==='dust'?Math.pow(1-q,.7):.28+.72*Math.pow(1-q,.7))*(seed.front?1:.8);
          opacity*=smooth(q/.12)*smooth((1-q)/.25)*(seed.kind==='dust'?.26:seed.front?.9:.7);
          turn+=Math.sin(clock*.08*seed.speed)*seed.turn*3;
          if(width<=900){
            // Tablet/mobile uses a compact local cluster; no invisible long desktop ribbon.
            x=parent.x+artOffset.x+parentSize*(.2+q*.32)*c.spread;
            y=parent.y+artOffset.y+parentSize*(.13+q*.15+seed.y*.12)*c.spread;
            opacity*=.65;
          }
        }
        size*=scale*variation;
        opacity*=smooth(phase*5);
        // Keep settled silhouettes inside the stage; entrance intentionally starts outside.
        if(phase>=1)x=clamp(x,size/2+4,width-size/2-4);
        const base=seed.kind==='dust'?3:48;
        element.style.transform=`translate3d(${x-base/2}px,${y-base/2}px,0) rotate(${turn}deg) scale(${size/base})`;
        element.style.opacity=String(opacity);
        const lighting=c.lighting*(seed.front?1:.68)*(1+.12*Math.sin(clock*.13+seed.phase*6));
        element.style.filter=seed.kind==='dust'?'none':`brightness(${lighting}) saturate(.65)`;
        telemetry.push({id:seed.id,kind:seed.kind,x,y,s,size,opacity});
      });
      if(process.env.NODE_ENV!=='production')window.__motionE5={mode:activeMode,clock,staticMotion,writes,path:{stop:path.stop,merge:path.mergeAt,head},fragments:telemetry};
    };
    // Share Motion E's ticker, time, pause/seek and hidden-page lifecycle; no new timeline.
    gsap.ticker.add(paint);paint();
    return()=>{gsap.ticker.remove(paint);observer.disconnect();reduce.removeEventListener('change',invalidate);delete window.__motionE5;};
  },[stage]);

  if(!stage)return null;
  return createPortal(<>
    {[false,true].map(front=><div key={String(front)} data-e5-layer={front?'front':'back'} aria-hidden="true" className={`${styles.layer} ${front?styles.front:styles.back}`}>
      {seeds.filter(seed=>seed.front===front).map(seed=><Rock key={seed.id} seed={seed}/>)}
    </div>)}
  </>,stage);
}

declare global { interface Window { __motionE5?:{mode:StudyMode;clock:number;staticMotion:boolean;writes:number;path:{stop:number;merge:number;head:number};fragments:Array<{id:number;kind:string;x:number;y:number;s:number;size:number;opacity:number}>} } }
