"use client";
import Link from 'next/link';
import Image from 'next/image';
import {useEffect,useRef,useState,type RefObject} from 'react';
import {createReferenceController,type ReferenceController} from './controller';
import type {ThemeDarkController} from '../homepage-light-formation/controller';
import styles from './study.module.css';
import {ReferenceScanner} from './scanner';

/** Shared markup: the approved standalone and the homepage use the same scene. */
export function ReferenceWorld({root,canvas,failed,integrated=false,scanner=false}:{root:RefObject<HTMLElement|null>;canvas:RefObject<HTMLCanvasElement|null>;failed:boolean;integrated?:boolean;scanner?:boolean}){
 return (
  <section ref={root} className={styles.scene} data-reference-scene data-failed={failed} data-dark-reference-official={integrated||undefined} aria-label="Dark celestial portfolio">
   <div className={styles.notes}><span>01 / Personal universe</span><span>AI · Product · Design</span></div>
   <div className={styles.fallback} aria-hidden="true"><Image src="/homepage-poc/dark-reference-flow/halo.png" alt="" width={1280} height={1280} unoptimized/></div>
   <canvas ref={canvas} className={styles.canvas} data-transition-canvas aria-hidden="true"/>
   <div className={styles.center} data-transition-role="dark-hole" aria-hidden="true"/>
   <div className={styles.identity} data-reference-identity data-transition-role="dark-identity">
    <span>Design × Business × Technology</span><h1>Carl Shi</h1>
    <p>I build at the intersection of AI, product, design, and technology. Currently exploring Product, Technical PM, and AI Product opportunities.</p>
    <Link href="/carl-shi-resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</Link>
   </div>
   <Link className={styles.target} data-reference-target="projects" href="/homepage-poc/projects#projects" aria-label="Explore Carl Shi's projects"><span className={styles.targetFrame} aria-hidden="true"><i/><i/><i/><i/></span><span className={styles.targetHint}>Projects</span></Link>
   <Link className={`${styles.target} ${styles.rocks}`} data-reference-target="capabilities" href="/homepage-poc/projects#skills" aria-label="Explore skills and capabilities"><span className={styles.targetFrame} aria-hidden="true"><i/><i/><i/><i/></span></Link>
   <Link className={`${styles.target} ${styles.small}`} data-reference-target="skills" href="/homepage-poc/projects#skills" aria-label="Explore the skills collection"><span className={styles.targetFrame} aria-hidden="true"><i/><i/><i/><i/></span><span className={styles.targetHint}>Skills</span></Link>
   {scanner&&<ReferenceScanner sceneRef={root}/>}
  </section>
 );
}

export function ReferenceHomepageScene({controllerRef,active=true}:{controllerRef:RefObject<ThemeDarkController|null>;active?:boolean}){
 const root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  let disposed=false,owned:ReferenceController|null=null;
  void createReferenceController(root.current!,canvas.current!,{controlled:true}).then(api=>{
   if(disposed){api.dispose();return;}
   owned=api;controllerRef.current=api;
   if(process.env.NODE_ENV!=='production')(window as unknown as {__homepageDarkReference:ReferenceController}).__homepageDarkReference=api;
  }).catch(error=>{if(!disposed){console.error('Homepage celestial fallback',error);setFailed(true);}});
  return()=>{disposed=true;if(controllerRef.current===owned)controllerRef.current=null;owned?.dispose();delete(window as unknown as {__homepageDarkReference?:unknown}).__homepageDarkReference;};
 },[controllerRef]);
 return <div className={`${styles.page} ${styles.integrated}`}><ReferenceWorld root={root} canvas={canvas} failed={failed} integrated scanner={active&&!failed}/></div>;
}
