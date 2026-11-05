"use client";
import {useEffect,useId,useState} from 'react';
import Link from 'next/link';
import {CsLogo} from '../cs-logo';
import {ThemeSwitch} from '../theme-switch';
import {PortfolioIdentity} from '../ivory-home';
import {planetOutline} from '../homepage-rc4/growth-geometry';
import {anchors,grain,outline,skeleton} from './skeleton';
import styles from './study.module.css';

export function SkeletonStudy(){
 const id=useId().replace(/:/g,''),[markers,setMarkers]=useState(false);
 useEffect(()=>{document.documentElement.dataset.portfolioTheme='light';},[]);
 return <main className={styles.page} data-light-v23>
  <nav className={styles.nav} aria-label="Primary navigation"><Link className={styles.home} href="/" aria-label="Carl Shi — Home"><CsLogo/><span>Home</span></Link><ThemeSwitch theme="light" onRequest={()=>{localStorage.setItem('carl-portfolio-home-theme','dark');location.assign('/');}}/><div><Link href="/homepage-poc/projects#projects">Projects</Link><Link href="/homepage-poc/projects#about">About</Link></div></nav>
  <div className={styles.note}><span>01 / Personal universe</span><span>AI · Product · Design</span></div>
  <section className={styles.scene} aria-label="Static study of two connected watercolor tree skeletons growing from an ivory planet">
   <div className={styles.composition}><div className={styles.world}>
    <svg className={styles.artwork} viewBox="0 0 1448 1086" aria-hidden="true">
     <defs>
      <clipPath id={`${id}-planet`}><path d={planetOutline}/></clipPath>
      {skeleton.map(b=><pattern key={b.id} id={`${id}-bark-${b.id}`} width="68" height="180" patternUnits="userSpaceOnUse" patternTransform={`rotate(${(Math.atan2(b.p[3][1]-b.p[0][1],b.p[3][0]-b.p[0][0])*180/Math.PI-90).toFixed(3)} ${b.p[0].map(v=>v.toFixed(3)).join(' ')})`}><image href="/homepage-poc/light-v23/watercolor-bark.png" width="68" height="180" preserveAspectRatio="none"/></pattern>)}
      <filter id={`${id}-edge`} x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".19" numOctaves="2" seed="23" result="paper"/><feDisplacementMap in="SourceGraphic" in2="paper" scale=".9" xChannelSelector="R" yChannelSelector="G"/></filter>
      <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="1" y2=".4"><stop stopColor="#e2d6b7" stopOpacity=".14"/><stop offset=".45" stopColor="#40505b" stopOpacity=".3"/><stop offset="1" stopColor="#263b48" stopOpacity=".6"/></linearGradient>
     </defs>
     <image href="/media/ivory-cosmos/tree-growth/bare-planet.webp" width="1448" height="1086" clipPath={`url(#${id}-planet)`}/>
     <g data-skeleton filter={`url(#${id}-edge)`}>{[...skeleton].reverse().map(b=><g key={b.id} data-branch={b.id} data-parent={b.parent??''} data-side={b.side} data-start={b.p[0].map(v=>v.toFixed(3)).join(',')} data-depth={b.depth}>
      <path d={outline(b)} fill={`url(#${id}-bark-${b.id})`}/>
      <path d={outline(b)} fill={`url(#${id}-wash)`}/>
      {b.width>4&&[-.68,-.27,.13,.52].map((offset,i)=><path key={offset} d={grain(b,offset)} fill="none" stroke={i%2?'#283b46':'#eee4c9'} strokeWidth={b.width>20?1.1:.65} opacity={i%2?.34:.49} strokeLinecap="round"/>)}
     </g>)}</g>
     {markers&&<g data-anchors>{anchors.map(a=><g key={a.id} transform={`translate(${a.position.join(' ')})`}><circle r="4" fill="#bd8b3b" stroke="#fff9e9" strokeWidth="1.5"/><text x="8" y="-8" fill="#7b5825" fontSize="15" fontFamily="monospace">{a.id}</text></g>)}</g>}
    </svg><PortfolioIdentity/>
   </div><div className={styles.labels}><span>Projects<small>Explore the project tree</small></span><span>Skills<small>Explore the skill tree</small></span></div></div>
  </section>
  <footer className={styles.footer}><span>Page inspired by The Little Prince</span><span>Tree skeleton study · Gate A</span></footer>
  {process.env.NODE_ENV!=='production'&&<details className={styles.inspector} data-inspector><summary>Skeleton study · Gate A</summary><p>Static tree architecture. Growth is pending silhouette approval.</p><label><input type="checkbox" checked={markers} onChange={e=>setMarkers(e.target.checked)}/> Show eight structural anchors</label><Link href="/homepage-poc/light-home-v22/">Compare Light v2.2 ↗</Link></details>}
 </main>;
}
