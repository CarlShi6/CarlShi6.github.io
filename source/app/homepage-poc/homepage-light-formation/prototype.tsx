"use client";
import Link from 'next/link';
import {StaticHomeLink} from '../static-home-link';
import {lazy,Suspense,useLayoutEffect,useRef,useState} from 'react';
import {CsLogo} from '../cs-logo';
import {CursorHint} from '../cursor-hint';
import {FormationScene,type FormationController} from './scene';
import {ThemeSwitch} from '../theme-switch';
import type {ThemeDarkController} from './controller';
import {createThemeController,type ThemeController,type View} from './controller';
import home from '../homepage-poc.module.css';
import styles from './integrated.module.css';
import balance from './homepage-balance.module.css';

// The approved homepage uses reference-flow. Keep the earlier E.6 scene available
// to local RC prototypes without emitting its standalone inspector in releases.
const loadDark=()=>process.env.NODE_ENV==='production'
  ? Promise.reject(new Error('The legacy E.6 preview is development-only.'))
  : import('../dark-motion-e6/prototype').then(module=>({default:module.DarkMotionE6}));
const DarkMotionE6=lazy(loadDark);
const loadReference=()=>import('../dark-reference-flow/scene').then(module=>({default:module.ReferenceHomepageScene}));
const ReferenceHomepage=lazy(loadReference);

export function HomepageLightFormation({darkVariant='e6',unifiedScan=false,editorialRefinement=false}:{darkVariant?:'e6'|'reference-flow';unifiedScan?:boolean;editorialRefinement?:boolean}){
  const light=useRef<FormationController|null>(null);
  const legacyDark=useRef<import('../dark-motion-e6/controller').CaptureController|null>(null);
  const root=useRef<HTMLElement>(null),dark=useRef<ThemeDarkController|null>(null),controller=useRef<ThemeController|null>(null);
  const [view,setView]=useState<View>({host:'light',target:'light',busy:false,dark:false,light:true,entrance:false});
  useLayoutEffect(()=>{
    if(!root.current)return;
    const api=createThemeController(root.current,document.documentElement.dataset.portfolioTheme==='dark'?'dark':'light',()=>darkVariant==='reference-flow'?dark.current:legacyDark.current,setView,()=>light.current,darkVariant==='reference-flow'?'dark-reference-flow-visited':'dark-motion-e6-visited');
    controller.current=api;
    if(process.env.NODE_ENV!=='production')(window as unknown as {__homepageRC2:ThemeController}).__homepageRC2=api;
    return()=>{api.dispose();controller.current=null;delete (window as unknown as {__homepageRC2?:ThemeController}).__homepageRC2;};
  },[darkVariant]);
  return <main ref={root} className={`${home.poc} ${styles.home}${editorialRefinement?` ${balance.refined}`:''}`} data-editorial-home={editorialRefinement||undefined} data-integrated="e6" data-rc2="" data-rc3="" data-rc4="" data-home-light="formation-v24" data-home-dark={darkVariant} data-light-boot="pending" data-nav-theme={view.target} data-theme={view.host} data-transitioning={view.busy}>

    {darkVariant!=='reference-flow'&&view.host==='light'&&!view.busy&&!view.entrance&&<CursorHint theme="light"/>}
    <nav className={home.pocNav} aria-label="Primary navigation">
      <StaticHomeLink className={home.identity} aria-label="Carl Shi — Home" data-cursor-hint="Main"><span className={home.identityMark}><CsLogo/></span><span className={home.homeLabel}>Home</span></StaticHomeLink>
      <div className={home.themeCenter} data-rc2-switch onPointerEnter={()=>{void (darkVariant==='reference-flow'?loadReference():loadDark());}} onFocus={()=>{void (darkVariant==='reference-flow'?loadReference():loadDark());}}><ThemeSwitch variant={darkVariant==='reference-flow'?'labeled':'orbit'} theme={view.target} onRequest={next=>controller.current?.request(next)}/></div>
      <div className={home.navLinks}><Link href="/homepage-poc/projects#projects">Projects</Link><Link href="/homepage-poc/projects#about">About</Link></div>
    </nav>
    <div className={styles.worlds}>
      {view.light&&<div className={styles.light} data-rc2-light data-active={view.host==='light'} inert={view.busy||view.entrance||view.host!=='light'} aria-hidden={view.busy||view.entrance||view.host!=='light'}><FormationScene unifiedScan={unifiedScan} controllerRef={light} interactive={darkVariant==='reference-flow'} active={!view.busy&&!view.entrance&&view.host==='light'}/></div>}
      {view.dark&&<div className={styles.dark} data-rc2-dark data-active={view.host==='dark'} inert={view.busy||view.host!=='dark'} aria-hidden={view.busy||view.host!=='dark'}><Suspense fallback={<div className={styles.loading} aria-label="Loading celestial scene"/>}>{darkVariant==='reference-flow'?<ReferenceHomepage controllerRef={dark} active={!view.busy&&view.host==='dark'}/>:<DarkMotionE6 dismissOnPointerLeave official controlled externalControllerRef={legacyDark}/>}</Suspense></div>}
    </div>
    {view.busy&&<button className={styles.skip} data-rc2-skip onClick={()=>controller.current?.skip()}>Skip transition</button>}
    {view.entrance&&<button className={styles.skip} data-rc2-skip onClick={()=>controller.current?.skip()}>Skip entrance</button>}
    {!view.busy&&view.host==='dark'&&<button className={`${styles.skip} ${styles.initialSkip}`} data-rc2-skip onClick={()=>controller.current?.skip()}>Skip entrance</button>}
    <span className={styles.status} role="status" aria-live="polite">{view.entrance?'Light scene forming. Escape skips the entrance.':view.busy?`Switching to ${view.target} mode. Escape skips the transition.`:''}</span>
  </main>;
}
