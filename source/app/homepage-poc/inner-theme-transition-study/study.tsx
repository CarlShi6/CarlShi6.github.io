'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import styles from './study.module.css';
const paths={projects:'/homepage-poc/projects/',case:'/homepage-poc/projects/case-studies/#build-hope-content-operations'};
export function InnerThemeStudy(){
 const frame=useRef<HTMLIFrameElement>(null),run=useRef(0),[page,setPage]=useState<'projects'|'case'>('projects'),[direction,setDirection]=useState<'light'|'dark'>('light'),[duration,setDuration]=useState(740),[status,setStatus]=useState('Use the page toggle, or Replay a direction.');
 useEffect(()=>()=>{run.current++;},[]);
 const settings=()=>frame.current?.contentDocument?.documentElement.style.setProperty('--theme-motion-duration',`${duration}ms`);
 const replay=async()=>{
  const doc=frame.current?.contentDocument;if(!doc)return;
  const serial=++run.current,root=doc.documentElement,from=direction==='light'?'Dark':'Light',to=direction==='light'?'Light':'Dark';
  const select=(name:string)=>doc.querySelector<HTMLButtonElement>(`[aria-label="${name} mode"]`)?.click();
  // Replay uses the real page's existing toggle/state. No preview theme store.
  root.style.setProperty('--theme-motion-duration','1ms');select(from);
  await new Promise<void>(resolve=>setTimeout(resolve,160));
  if(run.current!==serial||frame.current?.contentDocument!==doc)return;
  root.style.setProperty('--theme-motion-duration',`${duration}ms`);select(to);
  setStatus(`${from} → ${to} · ${duration}ms (reduced motion uses an instant switch)`);
 };
 return <main className={styles.study}>
  <header><div><h1>Inner theme transition · Phase 4A</h1><p>Existing pages, real toggles. Scroll the page to compare a long reading position.</p></div><Link href="/">Homepage</Link></header>
  <div className={styles.controls}>
   <label>Page<select value={page} onChange={e=>{run.current++;setPage(e.target.value as typeof page);}}><option value="projects">All Projects</option><option value="case">Build Hope / Case studies</option></select></label>
   <label>Direction<select value={direction} onChange={e=>setDirection(e.target.value as typeof direction)}><option value="light">Dark → Light · Ivory Bloom</option><option value="dark">Light → Dark · Gravity Reveal</option></select></label>
   <label>Duration <output>{duration}ms</output><input type="range" min="650" max="800" step="10" value={duration} onChange={e=>{const next=Number(e.target.value);setDuration(next);frame.current?.contentDocument?.documentElement.style.setProperty('--theme-motion-duration',`${next}ms`);}}/></label>
   <button onClick={()=>void replay()}>Replay</button><a href={paths[page]} target="_blank" rel="noreferrer">Open full viewport ↗</a>
  </div><p role="status" className={styles.status}>{status}</p>
  <iframe ref={frame} src={paths[page]} title="Portfolio inner-page theme transition comparison" onLoad={()=>{settings();const doc=frame.current?.contentDocument;const target=doc?.querySelector(page==='projects'?'[aria-label="Selected project case studies"]':'#build-hope-content-operations');if(target&&doc?.defaultView)doc.defaultView.scrollTo({top:target.getBoundingClientRect().top+doc.defaultView.scrollY-90,behavior:'instant'});}}/>
 </main>;
}
