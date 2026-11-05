"use client";
import {useCallback,useEffect,useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import {CsLogo} from '../cs-logo';
import {ThemeSwitch} from '../theme-switch';
import {PortfolioIdentity} from '../ivory-home';
import {Artwork} from './artwork';
import {attachments,projectFacts,tags} from './data';
import {createGrowth} from './entrance';
import styles from './world.module.css';

export function LightHomeV2(){
 const root=useRef<HTMLElement>(null),panel=useRef<HTMLElement>(null),growth=useRef<ReturnType<typeof createGrowth>|null>(null);
 const buttons=useRef<Array<HTMLButtonElement|null>>([]),hide=useRef<ReturnType<typeof setTimeout>|null>(null),flight=useRef<gsap.core.Timeline|null>(null);
 const [ready,setReady]=useState(false),[selected,setSelected]=useState<number|null>(null),[reduced,setReduced]=useState(false);
 const pinned=useRef(false),selectedRef=useRef<number|null>(null),returning=useRef(false),ignoreFocus=useRef(false),lastSource=useRef<'pointer'|'keyboard'|'touch'>('pointer');
 const clearHide=useCallback(()=>{if(hide.current)clearTimeout(hide.current);hide.current=null;},[]);
 useLayoutEffect(()=>{
  const element=root.current!;document.documentElement.dataset.portfolioTheme='light';
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const api=createGrowth(element,()=>{element.dataset.settled='true';setReady(true);});growth.current=api;
  let started=false,disposed=false;
  const start=()=>{if(disposed||started)return;started=true;setReduced(media.matches);if(media.matches)api.finish();else if(!document.hidden)api.play();};
  // Decode the two actual scene textures before starting the world, no loading screen.
  const assets=['/media/ivory-cosmos/tree-growth/bare-planet.webp','/homepage-poc/light-v2/foliage-sprig.png'];
  void Promise.all(assets.map(src=>new Promise<void>(resolve=>{const image=new window.Image();image.onload=image.onerror=()=>resolve();image.src=src;}))).then(start);
  const fallback=setTimeout(start,1800);
  const visibility=()=>{element.dataset.paused=String(document.hidden);if(document.hidden)api.pause();else if(started&&api.snapshot().time<4)api.play();};
  const preference=()=>{setReduced(media.matches);if(media.matches)api.finish();};
  document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);
  const debug={seek(t:number){api.pause();api.seek(t);element.dataset.settled=String(t>=4);setReady(t>=4);},replay(){setReady(false);element.dataset.settled='false';api.seek(0);api.play();},finish:()=>api.finish(),snapshot:()=>api.snapshot()};
  if(process.env.NODE_ENV!=='production')(window as unknown as {__lightV2:typeof debug}).__lightV2=debug;
  return()=>{disposed=true;clearTimeout(fallback);api.dispose();growth.current=null;document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);delete(window as unknown as {__lightV2?:unknown}).__lightV2;};
 },[]);
 const restoreTag=useCallback((index:number)=>{const b=buttons.current[index];if(b)b.style.opacity='';},[]);
 const dismiss=useCallback(()=>{
  clearHide();if(selectedRef.current===null||returning.current)return;
  const index=selectedRef.current,source=buttons.current[index],card=panel.current;if(!source||!card)return;
  returning.current=true;pinned.current=false;flight.current?.kill();
  const a=source.getBoundingClientRect(),b=card.getBoundingClientRect();
  const finish=()=>{restoreTag(index);selectedRef.current=null;returning.current=false;setSelected(null);if(document.activeElement?.closest('#light-tag-preview')){ignoreFocus.current=true;source.focus({preventScroll:true});}};
  if(reduced){finish();return;}
  flight.current=gsap.timeline({onComplete:finish}).to(card.querySelector('[data-card-content]'),{opacity:0,duration:.12},0)
   .to(card,{x:a.x+a.width/2-(b.x+b.width/2),y:a.y+a.height/2-(b.y+b.height/2),scaleX:a.width/b.width,scaleY:a.height/b.height,rotation:index%2?-4:3,rotationY:-15,duration:.48,ease:'power3.inOut'},0);
 },[clearHide,reduced,restoreTag]);
 const schedule=useCallback(()=>{clearHide();if(pinned.current)return;hide.current=setTimeout(()=>{if(pinned.current)return;if(document.activeElement?.matches(':focus-visible')&&document.activeElement.closest('[data-tag],#light-tag-preview'))return;dismiss();},550);},[clearHide,dismiss]);
 const inspect=(index:number,source:'pointer'|'keyboard'|'touch')=>{
  if(!ready)return;if(source==='keyboard'&&ignoreFocus.current){ignoreFocus.current=false;return;}
  clearHide();if(selectedRef.current===index){if(returning.current){returning.current=false;flight.current?.reverse();}return;}
  flight.current?.kill();if(selectedRef.current!==null)restoreTag(selectedRef.current);
  returning.current=false;lastSource.current=source;selectedRef.current=index;pinned.current=source==='touch';setSelected(index);
 };
 useLayoutEffect(()=>{
  if(selected===null||!panel.current)return;
  const card=panel.current,source=buttons.current[selected]!;const a=source.getBoundingClientRect(),b=card.getBoundingClientRect();source.style.opacity='0';
  const context=gsap.context(()=>{
   gsap.set(card,{transformPerspective:1000,transformOrigin:'50% 50%'});
   flight.current=gsap.timeline().fromTo(card,{x:a.x+a.width/2-(b.x+b.width/2),y:a.y+a.height/2-(b.y+b.height/2),scaleX:a.width/b.width,scaleY:a.height/b.height,rotation:selected%2?4:-4,rotationY:-28,opacity:1},{x:0,y:0,scaleX:1,scaleY:1,rotation:0,rotationY:0,duration:reduced?0:.62,ease:'power3.inOut'},0)
    .fromTo(card.querySelector('[data-card-content]'),{opacity:0},{opacity:1,duration:reduced?0:.25},reduced?0:.22);
  },card);
  if(lastSource.current==='touch')card.querySelector<HTMLElement>('button')?.focus({preventScroll:true});
  return()=>{context.revert();restoreTag(selected);};
 },[selected,reduced,restoreTag]);
 useEffect(()=>{
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){if(selectedRef.current!==null)dismiss();else growth.current?.finish();}};
  const resize=()=>{if(selectedRef.current!==null){flight.current?.kill();restoreTag(selectedRef.current);selectedRef.current=null;returning.current=false;setSelected(null);pinned.current=false;}};
  window.addEventListener('keydown',key);window.addEventListener('resize',resize);
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('resize',resize);};
 },[dismiss,restoreTag]);
 useEffect(()=>()=>{clearHide();flight.current?.kill();},[clearHide]);
 const item=selected===null?null:tags[selected],facts=item?projectFacts[item.id]:null;
 return <main ref={root} className={styles.page} data-light-v2 data-settled="false" data-preview={selected!==null}>
  <nav className={styles.nav} aria-label="Primary navigation"><Link className={styles.home} href="/" aria-label="Carl Shi — Home"><CsLogo/><span>Home</span></Link><ThemeSwitch theme="light" onRequest={()=>{localStorage.setItem('carl-portfolio-home-theme','dark');location.assign('/');}}/><div><Link href="/homepage-poc/projects#projects">Projects</Link><Link href="/homepage-poc/projects#about">About</Link></div></nav>
  <div className={styles.note}><span>01 / Personal universe</span><span>AI · Product · Design</span></div>
  <section className={styles.scene} aria-label="Ivory planet with Projects and Skills trees">
   <div className={styles.composition}><div className={styles.world}><Artwork/><PortfolioIdentity/></div>
    <div className={styles.labels} data-section-label><span>Projects<small>Explore the project tree</small></span><span>Skills<small>Explore the skill tree</small></span></div>
    <div className={styles.tags} inert={!ready} aria-label="Explore projects and skills">{tags.map((tag,i)=>{const a=attachments[i];return <div key={tag.id} className={styles.hanger} data-tag-reveal style={{left:`${a.x/1448*100}%`,top:`${a.y/1086*100}%`,'--cord':`${a.length/1448*100}cqw`,'--period':`${6.7+i*.63}s`,'--phase':`${-i*.71}s`,'--angle':`${i%2?-1:1}deg`} as CSSProperties}><div className={styles.sway}><span className={styles.string} data-string aria-hidden="true"/><button ref={node=>{buttons.current[i]=node;}} data-tag={i} type="button" className={styles.tag} aria-label={`Explore ${tag.title}`} aria-expanded={selected===i} aria-controls={selected===i?'light-tag-preview':undefined}
     onPointerDown={e=>{if(e.pointerType==='touch'){e.preventDefault();inspect(i,'touch');clearHide();pinned.current=true;}}} onPointerEnter={e=>{if(e.pointerType!=='touch')inspect(i,'pointer');}} onPointerLeave={schedule} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();panel.current?.querySelector<HTMLElement>('a')?.focus();}}} onFocus={()=>inspect(i,'keyboard')} onBlur={schedule} onClick={e=>{const touch=(e.nativeEvent as PointerEvent).pointerType==='touch';inspect(i,touch?'touch':'pointer');clearHide();pinned.current=true;if(touch)requestAnimationFrame(()=>panel.current?.querySelector<HTMLElement>('button')?.focus({preventScroll:true}));}}><span className={styles.hole} aria-hidden="true"/><span className={styles.paperGrain} aria-hidden="true"/></button></div></div>;})}</div>
   </div>
  </section>
  <footer className={styles.footer}><span>Page inspired by The Little Prince</span><span className={styles.mouseHint}>Hover or focus to explore · Click to view</span><span className={styles.touchHint}>Tap a hanging tag to explore</span></footer>
  {!ready&&<button className={styles.skip} onClick={()=>growth.current?.finish()}>Skip entrance</button>}
  {item&&<div className={styles.previewLayer} onPointerDown={e=>{if(e.target===e.currentTarget)dismiss();}}><aside ref={panel} id="light-tag-preview" className={styles.card} aria-labelledby="light-tag-title" onPointerEnter={clearHide} onPointerLeave={schedule} onFocusCapture={clearHide} onBlurCapture={schedule}>
   <span className={styles.cardHole} aria-hidden="true"/><div data-card-content><div className={styles.cardTop}><span className={styles.handwritten}>{facts?'A project from my world':'A way of working'}</span><button onClick={dismiss} aria-label="Close tag preview">Close</button></div><h2 id="light-tag-title">{item.title}</h2><p className={styles.summary}>{item.summary}</p><div className={styles.cardBody}><div className={styles.facts}>{facts?<dl><dt>What</dt><dd>{facts.what}</dd><dt>Role</dt><dd>{facts.role}</dd><dt>Verified deliverable</dt><dd>{facts.deliverable}</dd></dl>:<><h3>Capabilities</h3><p>{item.detail}</p></>}<Link href={item.href} className={styles.cta}>Look Closer. <span aria-hidden="true">↗</span></Link></div>{item.image&&<Image unoptimized src={item.image} width={360} height={260} alt={`${item.title} — original project artifact`}/>}</div></div>
  </aside></div>}
  {process.env.NODE_ENV!=='production'&&<details className={styles.inspector}><summary>Light v2 · motion study</summary><button onClick={()=>{dismiss();setReady(false);root.current!.dataset.settled='false';growth.current?.seek(0);growth.current?.play();}}>Replay entrance</button><label>Formation time<input aria-label="Formation time" type="range" min="0" max="4" step=".01" defaultValue="4" onChange={e=>{const t=Number(e.target.value);growth.current?.pause();growth.current?.seek(t);root.current!.dataset.settled=String(t>=4);setReady(t>=4);}}/></label><Link href="/homepage-poc/homepage-rc4/">Compare RC4</Link></details>}
 </main>;
}
