'use client';
import {useCallback,useEffect,useRef,useState,type RefObject} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {projectPlanets,skillSpacecraft} from '../space-system.data';
import {projectFacts} from '../light-home-v2/data';
import {useSpecimenScan} from '../botanical-scan/interaction';
import {TypedText} from './typed-text';
import {AiPcLiveLink} from '../projects/ai-pc-live-link';
import styles from './scanner.module.css';

/** Native hit targets follow the renderer's existing capture poses; no extra canvas. */
export function ReferenceScanner({sceneRef}:{sceneRef:RefObject<HTMLElement|null>}){
 const [reduced,setReduced]=useState(true),[fine,setFine]=useState(false);
 const origin=useRef<HTMLElement|null>(null),restore=useRef(false),touch=useRef(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const panel=useRef<HTMLElement>(null),latest=useRef({id:null as string|null,open:false});
 const keyboard=useRef(false);
 const scan=useSpecimenScan(reduced,()=>{restore.current=true;queueMicrotask(()=>{restore.current=false;});return origin.current;});
 const {dismiss,inspect,select:selectScan}=scan;
 const item=[...projectPlanets,...skillSpacecraft].find(i=>i.id===scan.id),project=item?projectFacts[item.id]:undefined;
 const visible=Boolean(item&&['revealed','selected'].includes(scan.phase));
 const collection=project?projectPlanets:skillSpacecraft;
 const heading=project?'Selected projects':'Skills & capabilities';
 const entryText=collection.map(entry=>[entry.title,entry.summary,...(project?[]:[entry.detail])]);
 const total=heading.length+entryText.flat().join('').length;
 const typed=(text:string,offset:number)=><TypedText text={text} offset={offset} step={Math.min(.014,2.4/total)} animate={fine&&!reduced}/>;
 const clear=useCallback(()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;},[]);
 const leave=useCallback(()=>{clear();if(touch.current)return;timer.current=setTimeout(()=>{
  // Native target events and React's delegated enter event can arrive in different
  // orders. Check the actual pointer location before dismissing the reading state.
  if(origin.current?.matches(':hover')||panel.current?.matches(':hover'))return;
  const focus=document.activeElement;
  if(keyboard.current&&focus?.matches(':focus-visible')&&(focus===origin.current||panel.current?.contains(focus)))return;
  dismiss();
 },420);},[clear,dismiss]);
 useEffect(()=>{
  const a=matchMedia('(prefers-reduced-motion: reduce)'),b=matchMedia('(hover:hover) and (pointer:fine)');
  const sync=()=>{setReduced(a.matches);setFine(b.matches);};sync();a.addEventListener('change',sync);b.addEventListener('change',sync);
  return()=>{a.removeEventListener('change',sync);b.removeEventListener('change',sync);};
 },[]);
 useEffect(()=>{
  const scene=sceneRef.current;if(!scene)return;
  latest.current={id:scan.id,open:visible};scene.dataset.scanOpen=String(visible);
  const identity=scene.querySelector<HTMLElement>('[data-reference-identity]');if(identity)identity.inert=visible||scene.dataset.cEntrance!=='done';
  scene.querySelectorAll<HTMLElement>('[data-reference-target]').forEach(el=>el.setAttribute('aria-expanded',String(visible&&el===origin.current)));
  return()=>{delete scene.dataset.scanOpen;if(identity)identity.inert=scene.dataset.cEntrance!=='done';};
 },[scan.id,visible,sceneRef]);
 useEffect(()=>{
  const scene=sceneRef.current;if(!scene)return;
  const targets=Array.from(scene.querySelectorAll<HTMLElement>('[data-reference-target]')),cleanups:(()=>void)[]=[];
  const enabled=(el:HTMLElement)=>!el.inert&&!scene.closest('[inert]')&&getComputedStyle(el).visibility==='visible';
  const lock=()=>{
   const target=origin.current;
   if(!latest.current.id||!target||!enabled(target))return;
   const r=target.getBoundingClientRect(),s=scene.getBoundingClientRect();
   scene.style.setProperty('--scan-x',`${r.left-s.left+r.width/2}px`);scene.style.setProperty('--scan-y',`${r.top-s.top+r.height/2}px`);scene.style.setProperty('--scan-r',`${r.width*.65}px`);
  };
  targets.forEach(target=>{
   const old={label:target.getAttribute('aria-label'),expanded:target.getAttribute('aria-expanded'),controls:target.getAttribute('aria-controls')};
   const group=target.dataset.referenceTarget==='projects'?'projects':'skills';
   target.setAttribute('aria-label',group==='projects'?'Scan project planet':'Scan skills celestial object');target.setAttribute('aria-controls','reference-scanner-preview');target.setAttribute('data-scan-boundary','');
   const activate=(direct=false)=>{
    if(restore.current||!enabled(target))return;clear();origin.current=target;
    const id=group==='projects'?projectPlanets[0].id:skillSpacecraft[0].id;
    dismiss();if(direct)selectScan(id,target);else inspect(id,target);
   };
   const enter=(e:PointerEvent)=>{if(e.pointerType==='mouse'){keyboard.current=false;touch.current=false;activate();}};
   const focus=()=>{if(target.matches(':focus-visible')){keyboard.current=true;activate();}};
   const click=(e:MouseEvent)=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();e.stopPropagation();if(touch.current&&latest.current.open&&origin.current===target){dismiss();return;}activate(touch.current);};
   const down=(e:PointerEvent)=>{touch.current=e.pointerType!=='mouse';};
   const blur=()=>leave();
   target.addEventListener('pointerenter',enter);target.addEventListener('pointerleave',leave);target.addEventListener('pointerdown',down);target.addEventListener('focus',focus);target.addEventListener('blur',blur);target.addEventListener('click',click,true);
   cleanups.push(()=>{target.removeEventListener('pointerenter',enter);target.removeEventListener('pointerleave',leave);target.removeEventListener('pointerdown',down);target.removeEventListener('focus',focus);target.removeEventListener('blur',blur);target.removeEventListener('click',click,true);target.removeAttribute('data-scan-boundary');for(const[key,value]of Object.entries(old)){const attr=key==='label'?'aria-label':key==='expanded'?'aria-expanded':'aria-controls';if(value===null)target.removeAttribute(attr);else target.setAttribute(attr,value);}});
  });
  const observer=new ResizeObserver(lock);observer.observe(scene);scene.addEventListener('portfolio:reference-frame',lock);scene.addEventListener('pointerleave',leave);window.addEventListener('scroll',lock,true);
  lock();return()=>{clear();observer.disconnect();cleanups.forEach(fn=>fn());scene.removeEventListener('portfolio:reference-frame',lock);scene.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',lock,true);};
 },[sceneRef,dismiss,inspect,selectScan,leave,clear]);
 useEffect(()=>{sceneRef.current?.dispatchEvent(new Event('portfolio:reference-frame'));},[scan.id,sceneRef]);
 return <>
  <div className={styles.veil} data-visible={visible} aria-hidden="true"/>
  {visible&&item&&<aside ref={panel} id="reference-scanner-preview" className={styles.preview} data-preview-kind={project?'projects':'skills'} aria-label={project?'Projects preview':'Skills preview'} data-scan-boundary onPointerEnter={e=>{if(e.pointerType==='mouse')keyboard.current=false;clear();}} onPointerLeave={leave} onFocusCapture={e=>{keyboard.current=e.target.matches(':focus-visible');clear();}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))leave();}}>
   <h2 className={styles.heading}>{typed(heading,0)}</h2>
   <div className={styles.collection}>{collection.map((entry,i)=>{const start=heading.length+entryText.slice(0,i).flat().join('').length;return <article className={styles.entry} key={entry.id}>
    <Image src={project?entry.image!:`/homepage-poc/webgl-v4/skill-${i+1}.webp`} alt={project?`${entry.title} — original project artifact`:''} width={400} height={250} loading="eager" unoptimized className={project?styles.projectArt:styles.skillArt}/>
    <div className={styles.copy}><h3>{typed(entry.title,start)}</h3><p className={styles.summary}>{typed(entry.summary,start+entry.title.length)}</p>{!project&&<p className={styles.detail}>{typed(entry.detail,start+entry.title.length+entry.summary.length)}</p>}<div className={styles.actions}><Link href={entry.href} className={styles.cta} aria-label={`Look closer: ${entry.title}`}>Look Closer.</Link>{entry.id==='ai-pc-build-advisor'&&<AiPcLiveLink compact/>}</div></div>
   </article>;})}</div>
  </aside>}
 </>;
}
