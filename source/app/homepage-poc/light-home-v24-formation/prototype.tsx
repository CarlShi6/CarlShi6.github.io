"use client";
import {useLayoutEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {CsLogo} from '../cs-logo';
import {ThemeSwitch} from '../theme-switch';
import {PortfolioIdentity} from '../ivory-home';
import {art,FallingLeaves,FormationArtwork} from './artwork';
import {createFormation} from './motion';
import base from '../light-home-v23/study.module.css';
import styles from './world.module.css';

export function FormationStudy(){
 const root=useRef<HTMLElement>(null),api=useRef<ReturnType<typeof createFormation>|null>(null);
 const [progress,setProgress]=useState(0),[paused,setPaused]=useState(false);
 useLayoutEffect(()=>{
  const element=root.current!;document.documentElement.dataset.portfolioTheme='light';
  const controller=createFormation(element);api.current=controller;let disposed=false;
  const image=new Image();image.src=art;
  void image.decode().catch(()=>{}).then(()=>{if(!disposed)controller.play();});
  const interval=setInterval(()=>{const s=controller.snapshot();setProgress(s.progress);setPaused(s.paused);},150);
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')controller.finish();};window.addEventListener('keydown',key);
  if(process.env.NODE_ENV!=='production')(window as unknown as {__lightFormation:typeof controller}).__lightFormation=controller;
  return()=>{disposed=true;clearInterval(interval);window.removeEventListener('keydown',key);controller.dispose();api.current=null;delete(window as unknown as {__lightFormation?:unknown}).__lightFormation;};
 },[]);
 return <main ref={root} className={`${base.page} ${styles.page}`} data-formation-study data-settled="false">
  <nav className={base.nav} aria-label="Primary navigation"><Link className={base.home} href="/" aria-label="Carl Shi — Home"><CsLogo/><span>Home</span></Link><ThemeSwitch theme="light" onRequest={()=>{localStorage.setItem('carl-portfolio-home-theme','dark');location.assign('/');}}/><div><Link href="/homepage-poc/projects#projects">Projects</Link><Link href="/homepage-poc/projects#about">About</Link></div></nav>
  <div className={base.note}><span>01 / Personal universe</span><span>AI · Product · Design</span></div>
  <section className={base.scene} aria-label="A watercolor planet accretes rocks, grows trees and leaves, then releases falling leaves">
   <div className={`${base.composition} ${styles.composition}`}><div className={base.world}><FormationArtwork/><PortfolioIdentity/></div>
    <div className={`${base.labels} ${styles.labels}`}><span>Projects<small>Explore my work</small></span><span>Skills<small>Explore my toolbox</small></span></div>
   </div>
  </section>
  <FallingLeaves/>
  <footer className={base.footer}><span>Page inspired by The Little Prince</span><span>Planet formation · Living watercolor study</span></footer>
  {progress<1&&<button className={styles.skip} onClick={()=>api.current?.finish()}>Skip entrance</button>}
  {process.env.NODE_ENV!=='production'&&<details className={base.inspector} data-inspector><summary>Formation · Motion controls</summary><label>Progress <input aria-label="Formation progress" type="range" min="0" max="100" step=".1" value={progress*100} onChange={e=>{api.current?.seek(Number(e.target.value)/100);setProgress(Number(e.target.value)/100);}}/></label><label>Speed <select aria-label="Formation speed" defaultValue="1" onChange={e=>api.current?.speed(Number(e.target.value))}><option value=".65">Slow · 9.2 s</option><option value="1">Normal · 6 s</option><option value="1.5">Quick · 4 s</option></select></label><div className={styles.actions}><button onClick={()=>api.current?.replay()}>Replay</button><button onClick={()=>paused?api.current?.play():api.current?.pause()}>{paused?'Play':'Pause'}</button><button onClick={()=>api.current?.finish()}>Final state</button></div><p>Rocks → surface → trees → leaves. Ambient leaves pause with the scene.</p></details>}
 </main>;
}
