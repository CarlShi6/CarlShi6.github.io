"use client";
import Link from 'next/link';
import {ReferenceWorld} from './scene';
import {useEffect,useRef,useState} from 'react';
import {CsLogo} from '../cs-logo';
import {ThemeSwitch} from '../theme-switch';
import {createReferenceController,type ReferenceController} from './controller';
import {duration} from './renderer';
import styles from './study.module.css';

export function DarkReferenceFlow(){
 const root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null),api=useRef<ReferenceController|null>(null);
 const [failed,setFailed]=useState(false),[time,setTime]=useState(0),[paused,setPaused]=useState(false);
 useEffect(()=>{
  let disposed=false;document.documentElement.dataset.portfolioTheme='dark';
  void createReferenceController(root.current!,canvas.current!).then(controller=>{
   if(disposed){controller.dispose();return;}api.current=controller;
   if(process.env.NODE_ENV!=='production')(window as unknown as {__darkReference:ReferenceController}).__darkReference=controller;
  }).catch(error=>{if(!disposed){console.error('Reference scene fallback',error);setFailed(true);}});
  const id=setInterval(()=>{const s=api.current?.snapshot();if(s){setTime(s.time);setPaused(s.paused);}},200);
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')api.current?.finish();};window.addEventListener('keydown',key);
  return()=>{disposed=true;clearInterval(id);window.removeEventListener('keydown',key);api.current?.dispose();api.current=null;delete(window as unknown as {__darkReference?:unknown}).__darkReference;};
 },[]);
 return <main className={styles.page}>
  <nav className={styles.nav} aria-label="Primary navigation">
   <Link href="/" className={styles.brand} aria-label="Carl Shi — Home"><CsLogo/><span>Home</span></Link>
   <ThemeSwitch theme="dark" onRequest={()=>{try{localStorage.setItem('carl-portfolio-home-theme','light');}catch{}location.assign('/');}}/>
   <div><Link href="/homepage-poc/projects#projects">Projects</Link><Link href="/homepage-poc/projects#about">About</Link></div>
  </nav>
  <ReferenceWorld root={root} canvas={canvas} failed={failed}/>
  {!failed&&time<duration&&<button className={styles.skip} onClick={()=>api.current?.finish()}>Skip entrance</button>}
  {process.env.NODE_ENV!=='production'&&<details className={styles.inspector} data-inspector><summary>Motion preview</summary><label>Timeline <input aria-label="Animation timeline" type="range" min="0" max={duration} step=".01" value={Math.min(time,duration)} onChange={e=>api.current?.seek(Number(e.target.value))}/></label><div><button onClick={()=>api.current?.replay()}>Replay</button><button onClick={()=>paused?api.current?.play():api.current?.pause()}>{paused?'Play':'Pause'}</button><button onClick={()=>api.current?.finish()}>Final state</button></div><Link href="/">Current homepage ↗</Link></details>}
 </main>;
}
