'use client';
import {useEffect,useLayoutEffect,useRef,useState,type RefObject} from 'react';
import {createPortal} from 'react-dom';
import gsap from 'gsap';
import {projectPlanets,skillSpacecraft} from '../space-system.data';
import {useSpecimenScan} from './interaction';
import {ProjectPaper} from './project-paper';
import styles from './home.module.css';
const items=[...projectPlanets,...skillSpacecraft];
const anchorTargets=[{x:270,y:235},{x:405,y:155},{x:375,y:367},{x:520,y:270},{x:1020,y:230},{x:1140,y:150},{x:1270,y:260},{x:1300,y:330}];
type Pose={x:number;y:number;scale:number};
const clamp=(n:number,a:number,b:number)=>Math.min(Math.max(n,a),Math.max(a,b));
/** Eight pendants use the existing foliage clock and actual branch attachment matrices. */
export function HomepageBotanicalScan({sceneRef}:{sceneRef:RefObject<HTMLDivElement|null>}){
 const [reduced,setReduced]=useState(true),[fine,setFine]=useState(false);
 const scan=useSpecimenScan(reduced);
 const portal=useRef<HTMLDivElement>(null),wrappers=useRef<(HTMLDivElement|null)[]>([]),lines=useRef<(SVGPathElement|null)[]>([]);
 const active=useRef<string|null>(null),place=useRef<((animate:boolean)=>void)|null>(null);
 const activeId=['nearby','scanning','revealed','selected'].includes(scan.phase)?scan.id:null;
 useEffect(()=>{
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),pointer=matchMedia('(hover:hover) and (pointer:fine)');
  const sync=()=>{setReduced(motion.matches);setFine(pointer.matches);};sync();
  motion.addEventListener('change',sync);pointer.addEventListener('change',sync);
  return()=>{motion.removeEventListener('change',sync);pointer.removeEventListener('change',sync);};
 },[]);
 useLayoutEffect(()=>{
  const scene=sceneRef.current;if(!scene||!portal.current)return;
  const refined=!!scene.closest('[data-editorial-home=true]');
  portal.current.dataset.editorialHome=String(refined);
  const svg=scene.querySelector<SVGSVGElement>('[data-formation-art]');if(!svg)return;
  const available=Array.from(scene.querySelectorAll<SVGGElement>('[data-leaf-carrier][data-parent-branch]'));
  const used=new Set<SVGGElement>();
  const anchors=anchorTargets.map((target,i)=>{
   const wanted=new DOMPoint(target.x,target.y).matrixTransform(svg.getScreenCTM()!);
   const candidates=available.filter(n=>!used.has(n)&&n.dataset.foliageSide===(i>=4?'skills':'projects'));
   const distance=(n:SVGGElement)=>{const p=new DOMPoint(0,0).matrixTransform(n.getScreenCTM()!);return Math.hypot(p.x-wanted.x,p.y-wanted.y);};
   const node=candidates.sort((a,b)=>distance(a)-distance(b))[0];if(node)used.add(node);return node;
  });
  if(anchors.some(n=>!n))return;
  const poses:Pose[]=anchors.map(()=>({x:0,y:0,scale:0})),points=anchors.map(()=>({x:0,y:0}));
  const tweens:(gsap.core.Tween|undefined)[]=[],context=gsap.context(()=>{},portal.current);
  let time=0,last=performance.now();
  const draw=(i:number)=>{
   const node=wrappers.current[i],pose=poses[i];if(!node)return;
   const opened=active.current===items[i].id,scroll=innerWidth<=700?scrollY:0;
   // Incommensurate periods give a bounded breeze, with no random jumps or new ticker.
   const breeze=reduced||opened?0:Math.sin(time*(.61+i*.037)+i*1.7)*3.4+Math.sin(time*1.19+i*2.8)*.95;
   const angle=reduced||opened?0:breeze*1.3;
   const hx=pose.x+180*pose.scale+breeze,hy=pose.y+24*pose.scale+scroll;
   node.style.transform=`translate3d(${hx}px,${hy}px,0) rotate(${angle}deg) scale(${pose.scale}) translate(-180px,-24px)`;
   node.style.setProperty('--object-scale',String(Math.max(.08,pose.scale)));
   node.dataset.holeX=String(hx);node.dataset.holeY=String(hy);node.dataset.wind=String(angle);
   const a=points[i],ay=a.y+scroll;
   lines.current[i]?.setAttribute('d',`M${a.x} ${ay} Q${a.x+(hx-a.x)*.35+breeze*.7} ${ay+(hy-ay)*.6} ${hx} ${hy}`);
   lines.current[i]?.setAttribute('data-parent-branch',anchors[i].dataset.parentBranch??'');
  };
  function refresh(animate=false){
   const now=performance.now();if(document.hidden){last=now;return;}time+=Math.min((now-last)/1000,.05);last=now;
   const small=innerWidth<=700,identity=scene!.querySelector<HTMLElement>('[data-light-identity]')?.getBoundingClientRect();
   const bounds=svg!.getBoundingClientRect(),vh=visualViewport?.height??innerHeight,top=visualViewport?.offsetTop??0;
   anchors.forEach((n,i)=>{const p=new DOMPoint(0,0).matrixTransform(n.getScreenCTM()!);points[i]={x:p.x,y:p.y};});
   anchors.forEach((_,i)=>{
    const a=points[i],j=i%4,right=i>=4,opened=active.current===items[i].id;
    const restScale=small?(refined?.08:.095):.105;
    // More reading space for project evidence; the resting tag and its anchor stay unchanged.
    const scale=opened?Math.min(i<4?1.2:.92,(innerWidth-28)/360,(vh-100)/500):restScale;
    const group=points.slice(right?4:0,right?8:4);
    const restingX=small?(innerWidth*(right?.63:.08)+(j%2)*48):bounds.left+(right?1010:185)*bounds.width/1448+j*Math.max(56,bounds.width*.055);
    const restY=small?Math.min(...group.map(p=>p.y))+30+Math.floor(j/2)*60:a.y+28+(j%2)*10;
    const safeY=identity&&restingX+360*restScale>identity.left&&restingX<identity.right?Math.min(restY,identity.top-500*restScale-12):restY;
    const x=opened?clamp(right?restingX:restingX+360*restScale-360*scale,14,innerWidth-360*scale-14):clamp(restingX,10,innerWidth-360*restScale-10);
    const y=opened?clamp(restY+24*restScale-24*scale,top+82,top+vh-500*scale-12):safeY;
    const target={x,y,scale};wrappers.current[i]?.setAttribute('data-chosen',String(opened));
    if(animate){tweens[i]?.kill();context.add(()=>{tweens[i]=gsap.to(poses[i],{...target,duration:reduced?0:.38,ease:'power3.out',onUpdate:()=>draw(i)});});}
    else if(!tweens[i]?.isActive()){Object.assign(poses[i],target);draw(i);}else draw(i);
   });
   portal.current!.dataset.positioned='true';
  }
  place.current=refresh;refresh();
  const frame=()=>refresh(),resize=()=>refresh(true),visibility=()=>{last=performance.now();if(!document.hidden)refresh();};
  scene.addEventListener('portfolio:foliage-frame',frame);window.addEventListener('resize',resize);window.addEventListener('scroll',frame,true);visualViewport?.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);
  const observer=new ResizeObserver(frame);observer.observe(svg);
  return()=>{place.current=null;context.revert();observer.disconnect();scene.removeEventListener('portfolio:foliage-frame',frame);window.removeEventListener('resize',resize);window.removeEventListener('scroll',frame,true);visualViewport?.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);};
 },[sceneRef,reduced]);
 useLayoutEffect(()=>{active.current=activeId;place.current?.(true);},[activeId]);
 return createPortal(<div ref={portal} className={styles.portal} data-home-scan data-phase={scan.phase} data-active-id={scan.id??''}>
  <svg className={styles.strings} aria-hidden="true">{items.map((item,i)=><path key={item.id} ref={n=>{lines.current[i]=n;}} data-string-for={item.id}/>)}</svg>
  {items.map((item,i)=><div key={item.id} ref={n=>{wrappers.current[i]=n;}} className={styles.project} data-project-paper={item.id} data-tag-kind={i<4?'project':'skill'}>
   <ProjectPaper project={item} kind={i<4?'project':'skill'} scan={scan} reduced={reduced} fine={fine} penPreview editorialPreview/>
  </div>)}
 </div>,document.body);
}
