"use client";
import Link from 'next/link';
import {lazy,Suspense,useLayoutEffect,useRef,useState} from 'react';
import {CsLogo} from '../cs-logo';
import {CursorHint} from '../cursor-hint';
import {IvoryHome} from '../ivory-home';
import {ThemeSwitch} from '../theme-switch';
import type {CaptureController} from '../dark-motion-e6/controller';
import {createThemeController,type ThemeController,type View} from './controller';
import home from '../homepage-poc.module.css';
import styles from './rc4.module.css';
import {LightGrowthLayers} from './growth-layers';
const loadDark=()=>import('../dark-motion-e6/prototype').then(module=>({default:module.DarkMotionE6}));
const DarkMotionE6=lazy(loadDark);

export function HomepageRC4(){
  const root=useRef<HTMLElement>(null),dark=useRef<CaptureController|null>(null),controller=useRef<ThemeController|null>(null);
  const [view,setView]=useState<View>({host:'light',target:'light',busy:false,dark:false,light:true,entrance:false});
  useLayoutEffect(()=>{
    if(!root.current)return;
    const api=createThemeController(root.current,document.documentElement.dataset.portfolioTheme==='dark'?'dark':'light',()=>dark.current,setView);
    controller.current=api;
    if(process.env.NODE_ENV!=='production')(window as unknown as {__homepageRC2:ThemeController}).__homepageRC2=api;
    return()=>{api.dispose();controller.current=null;delete (window as unknown as {__homepageRC2?:ThemeController}).__homepageRC2;};
  },[]);
  return <main ref={root} className={`${home.poc} ${styles.home}`} data-integrated="e6" data-rc2="" data-rc3="" data-rc4="" data-light-boot="pending" data-nav-theme={view.target} data-theme={view.host} data-transitioning={view.busy}>
    <noscript><style>{'[data-rc4][data-light-boot="pending"] [data-rc2-light] [data-light-composition]>*{visibility:visible!important}[data-rc4][data-light-boot="pending"] [data-rc2-light] [data-light-planet],[data-rc4] [data-light-branches]{visibility:hidden!important}'}</style></noscript>
    {view.host==='light'&&!view.busy&&!view.entrance&&<CursorHint theme="light"/>}
    <nav className={home.pocNav} aria-label="Primary navigation">
      <Link className={home.identity} href="/" aria-label="Carl Shi — Home" data-cursor-hint="Main"><span className={home.identityMark}><CsLogo/></span><span className={home.homeLabel}>Home</span></Link>
      <div className={home.themeCenter} data-rc2-switch onPointerEnter={()=>{void loadDark();}} onFocus={()=>{void loadDark();}}><ThemeSwitch theme={view.target} onRequest={next=>controller.current?.request(next)}/></div>
      <div className={home.navLinks}><Link href="/homepage-poc/projects#projects">Projects</Link><Link href="/homepage-poc/projects#about">About</Link></div>
    </nav>
    <div className={styles.worlds}>
      {view.light&&<div className={styles.light} data-rc2-light data-active={view.host==='light'} inert={view.busy||view.entrance||view.host!=='light'} aria-hidden={view.busy||view.entrance||view.host!=='light'}><IvoryHome transitionLayers primaryProjectsOnly growthLayers={<LightGrowthLayers/>}/></div>}
      {view.dark&&<div className={styles.dark} data-rc2-dark data-active={view.host==='dark'} inert={view.busy||view.host!=='dark'} aria-hidden={view.busy||view.host!=='dark'}><Suspense fallback={<div className={styles.loading} aria-label="Loading celestial scene"/>}><DarkMotionE6 dismissOnPointerLeave official controlled externalControllerRef={dark}/></Suspense></div>}
    </div>
    {view.busy&&<button className={styles.skip} data-rc2-skip onClick={()=>controller.current?.skip()}>Skip transition</button>}
    {view.entrance&&<button className={styles.skip} data-rc2-skip onClick={()=>controller.current?.skip()}>Skip entrance</button>}
    {!view.busy&&view.host==='dark'&&<button className={`${styles.skip} ${styles.initialSkip}`} data-rc2-skip onClick={()=>controller.current?.skip()}>Skip entrance</button>}
    <span className={styles.status} role="status" aria-live="polite">{view.entrance?'Light scene forming. Escape skips the entrance.':view.busy?`Switching to ${view.target} mode. Escape skips the transition.`:''}</span>
  </main>;
}
