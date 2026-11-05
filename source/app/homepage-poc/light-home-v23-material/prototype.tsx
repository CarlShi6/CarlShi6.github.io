"use client";
import {useEffect,useId,useState} from 'react';
import Link from 'next/link';
import {CsLogo} from '../cs-logo';
import {ThemeSwitch} from '../theme-switch';
import {PortfolioIdentity} from '../ivory-home';
import {planetOutline} from '../homepage-rc4/growth-geometry';
import {anchors} from '../light-home-v23/skeleton';
import {WatercolorTrees} from './watercolor-trees';
import styles from '../light-home-v23/study.module.css';

export function WatercolorStudy(){
 const id=useId().replace(/:/g,''),[markers,setMarkers]=useState(false);
 useEffect(()=>{document.documentElement.dataset.portfolioTheme='light';},[]);
 return <main className={styles.page} data-light-v23 data-material-study>
  <nav className={styles.nav} aria-label="Primary navigation"><Link className={styles.home} href="/" aria-label="Carl Shi — Home"><CsLogo/><span>Home</span></Link><ThemeSwitch theme="light" onRequest={()=>{localStorage.setItem('carl-portfolio-home-theme','dark');location.assign('/');}}/><div><Link href="/homepage-poc/projects#projects">Projects</Link><Link href="/homepage-poc/projects#about">About</Link></div></nav>
  <div className={styles.note}><span>01 / Personal universe</span><span>AI · Product · Design</span></div>
  <section className={styles.scene} aria-label="Static study of two connected watercolor tree skeletons growing from an ivory planet">
   <div className={styles.composition}><div className={styles.world}>
    <svg className={styles.artwork} viewBox="0 0 1448 1086" aria-hidden="true">
     <defs>
      <clipPath id={`${id}-planet`}><path d={planetOutline}/></clipPath>
     </defs>
     <image href="/media/ivory-cosmos/tree-growth/bare-planet.webp" width="1448" height="1086" clipPath={`url(#${id}-planet)`}/>
     <WatercolorTrees id={id}/>
     {markers&&<g data-anchors>{anchors.map(a=><g key={a.id} transform={`translate(${a.position.join(' ')})`}><circle r="4" fill="#bd8b3b" stroke="#fff9e9" strokeWidth="1.5"/><text x="8" y="-8" fill="#7b5825" fontSize="15" fontFamily="monospace">{a.id}</text></g>)}</g>}
    </svg><PortfolioIdentity/>
   </div><div className={styles.labels}><span>Projects<small>Explore the project tree</small></span><span>Skills<small>Explore the skill tree</small></span></div></div>
  </section>
  <footer className={styles.footer}><span>Page inspired by The Little Prince</span><span>Watercolor tree study · Gate A.1</span></footer>
  {process.env.NODE_ENV!=='production'&&<details className={styles.inspector} data-inspector><summary>Watercolor material · Gate A.1</summary><p>Approved skeleton, refined watercolor materials. Growth awaits material approval.</p><label><input type="checkbox" checked={markers} onChange={e=>setMarkers(e.target.checked)}/> Show eight structural anchors</label><Link href="/homepage-poc/light-home-v23/">Compare Gate A materials ↗</Link></details>}
 </main>;
}
