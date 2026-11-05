'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './study.module.css';

const variants = [
  {id:'decode', name:'Scramble Decode', theme:'dark', duration:.56, note:'A short, directional identification pass.'},
  {id:'type', name:'Technical Typewriter', theme:'dark', duration:.68, note:'Sequential output; the cursor retires when complete.'},
  {id:'ink', name:'Watercolor Ink', theme:'light', duration:.72, note:'A soft pigment front, with small variations at its edge.'},
  {id:'vein', name:'Botanical Vein Writing', theme:'light', duration:.84, note:'A fine leading line followed by an organic text reveal.'},
] as const;
type Variant = typeof variants[number];
// Verbatim study excerpts, not a second source of production project data.
const contexts = {
  archive:{label:'All Projects · page heading', title:'Projects', metadata:'Project archive', intro:'A visual index of client work, working prototypes, and design concepts that make complex decisions easier to understand.',href:'/homepage-poc/projects/',cta:'View selected work'},
  accordion:{label:'Expanded project · title',title:'AI PC Build Advisor',metadata:'AI product prototyping · User research · Compatibility',intro:'Defined and tested an AI-assisted PC-building prototype through five user interviews, three prototype tests, and iterative development across 37 merged pull requests.',href:'/homepage-poc/projects/case-studies/#ai-pc-build-advisor',cta:'View Case Study'},
  hero:{label:'Case study · hero',title:'Build Hope — Content Operations System',metadata:'Content operations · Digital operations system',intro:'Designing a scalable workflow that helps a nonprofit turn community impact into consistent storytelling.',href:'/homepage-poc/projects/case-studies/#build-hope-content-operations',cta:'Explore the workflow'},
  section:{label:'Case study · section heading',title:'From community impact to consistent storytelling.',metadata:'Proposed content operations system',intro:'Ideate · Plan · Publish · Learn',href:'/homepage-poc/projects/case-studies/#build-hope-content-operations',cta:'Explore the workflow'},
} as const;
type Context = keyof typeof contexts;
const motionQuery='(prefers-reduced-motion: reduce)';
const subscribeMotion=(notify:()=>void)=>{const query=matchMedia(motionQuery);query.addEventListener('change',notify);return()=>query.removeEventListener('change',notify);};

function MotionSample({variant,context,speed,paused,reduced,replay}:{variant:Variant;context:Context;speed:number;paused:boolean;reduced:boolean;replay:number}) {
  const root=useRef<HTMLElement>(null),timeline=useRef<gsap.core.Timeline|null>(null);
  const playback=useRef({speed,paused});
  const [localReplay,setLocalReplay]=useState(0);
  const content=contexts[context];
  useEffect(()=>{
    playback.current={speed,paused};
    timeline.current?.timeScale(speed).paused(paused || document.hidden);
  },[speed,paused]);
  useEffect(()=>{
    const element=root.current;if(!element)return;
    gsap.registerPlugin(ScrambleTextPlugin,TextPlugin);
    const words=[...element.querySelectorAll<HTMLElement>('[data-word]')];
    const pigment=[...element.querySelectorAll<HTMLElement>('[data-pigment]')];
    const line=element.querySelector<SVGPathElement>('[data-vein]');
    const finish=()=>{
      words.forEach(word=>{word.textContent=word.dataset.word!;word.style.setProperty('--cursor','0');});
      pigment.forEach(word=>word.style.setProperty('--ink','120%'));
      if(line)line.style.strokeDashoffset='0';
      element.dataset.state='complete';element.dataset.progress='1';
    };
    const ctx=gsap.context(()=>{
      if(reduced){finish();return;}
      const tl=gsap.timeline({paused:true,defaults:{ease:'none'},onUpdate:()=>{element.dataset.progress=String(tl.progress());},onComplete:finish});
      timeline.current=tl;
      element.dataset.state='running';
      tl.addLabel('identify',0);
      if(variant.id==='decode'||variant.id==='type'){
        const total=words.reduce((sum,w)=>sum+w.dataset.word!.length,0);
        let offset=0;
        words.forEach(word=>{
          const text=word.dataset.word!,share=text.length/total;
          tl.set(word,{textContent:'','--cursor':0},0);
          if(variant.id==='decode'){
            tl.to(word,{duration:.25+share*.22,scrambleText:{text,chars:'01/—',speed:.35,revealDelay:0,tweenLength:false}},offset*.28);
          }else{
            const start=offset*variant.duration;
            tl.set(word,{'--cursor':1},start);
            tl.to(word,{duration:share*variant.duration,text:{value:text,padSpace:false}},start);
            tl.set(word,{'--cursor':0},start+share*variant.duration);
          }
          offset+=share;
        });
        if(variant.id==='decode')tl.duration(variant.duration);
      }else{
        const lead=variant.id==='vein'?.2:0;
        if(line)tl.fromTo(line,{strokeDashoffset:1},{strokeDashoffset:0,duration:.54,ease:'power1.inOut'},0);
        const total=pigment.reduce((sum,word)=>sum+word.textContent!.length,0);
        let offset=0;
        pigment.forEach(word=>{
          const share=word.textContent!.length/total,travel=variant.duration-lead-.16;
          tl.fromTo(word,{'--ink':'-20%'},{'--ink':'120%',duration:.16+share*travel,ease:'sine.inOut'},lead+offset*travel);
          offset+=share;
        });
      }
      tl.timeScale(playback.current.speed).paused(playback.current.paused || document.hidden);
    },element);
    const visibility=()=>{timeline.current?.paused(document.hidden || playback.current.paused);};
    // Reflow changes only wrapping. A resize settles the accent, never replays it.
    const resize=()=>{timeline.current?.progress(1);finish();};
    document.addEventListener('visibilitychange',visibility);
    window.addEventListener('resize',resize);
    return()=>{ctx.revert();timeline.current=null;document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',resize);};
  },[variant,context,reduced,replay,localReplay]);
  return <section ref={root} className={styles.sample} data-variant={variant.id} data-world={variant.theme} data-context={context}>
    <header className={styles.sampleHeader}><div><h2>{variant.theme==='dark'?'Dark':'Light'} · {variant.name}</h2><p>{Math.round(variant.duration*1000/speed)}ms · {variant.note}</p></div><button type="button" onClick={()=>setLocalReplay(n=>n+1)}>Replay {variant.name}</button></header>
    <div className={styles.specimen}>
      <p className={styles.meta}>{content.metadata}</p>
      <div className={styles.headingBlock}>
        {variant.id==='vein'&&<svg className={styles.vein} viewBox="0 0 180 26" aria-hidden="true"><path data-vein pathLength="1" d="M2 21 C31 20 37 7 67 10 S116 22 177 5"/></svg>}
        <h3 className={styles.title} data-motion-title>
          <span className={styles.semantic}>{content.title}</span>
          <span aria-hidden="true" className={styles.visual}>{content.title.split(/(\s+)/).map((word,index)=>/^\s+$/.test(word)?word:
            variant.theme==='dark'?<span className={styles.word} key={index}><span className={styles.reserve}>{word}</span><span className={styles.output} data-word={word}>{word}</span></span>:
            <span key={index} className={styles.pigment} data-pigment style={{'--edge':`${96+(index%4)*5}deg`} as React.CSSProperties}>{word}</span>
          )}</span>
        </h3>
      </div>
      <p className={styles.intro}>{content.intro}</p>
      <Link className={styles.cta} href={content.href}>{content.cta} <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}

export function TypographyLab(){
  const [context,setContext]=useState<Context>('accordion'),[variation,setVariation]=useState('all'),[speed,setSpeed]=useState(1),[paused,setPaused]=useState(false),[reduce,setReduce]=useState(false),[replay,setReplay]=useState(0);
  const systemReduced=useSyncExternalStore(subscribeMotion,()=>matchMedia(motionQuery).matches,()=>false);
  return <main className={styles.lab}>
    <header className={styles.labHeader}><div><p>Local study · Phase 4B</p><h1>Two worlds. One reading rhythm.</h1><p>Compare four short accents on real portfolio headings. Body text and links are always available.</p></div><Link href="/">Back to portfolio</Link></header>
    <div className={styles.controls} aria-label="Typography motion controls">
      <label>Context<select value={context} onChange={e=>setContext(e.target.value as Context)}>{Object.entries(contexts).map(([key,item])=><option key={key} value={key}>{item.label}</option>)}</select></label>
      <label>Variation<select value={variation} onChange={e=>setVariation(e.target.value)}><option value="all">Compare all four</option>{variants.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
      <label>Speed · {speed.toFixed(2)}×<input aria-label="Animation speed" type="range" min=".5" max="1.5" step=".25" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/></label>
      <label className={styles.check}><input type="checkbox" checked={reduce} onChange={e=>setReduce(e.target.checked)}/>Reduced motion preview</label>
      <button onClick={()=>{setPaused(false);setReplay(n=>n+1);}}>Replay all</button><button aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?'Resume':'Pause'}</button>
    </div>
    <p className={styles.status} role="status">{systemReduced?'System reduced motion is on. All examples remain static.':reduce?'Reduced motion preview: final text, no animation.':paused?'Paused. Resume continues from the same position.':'One pass per example. Scrolling and pointer movement never restart the text.'}</p>
    <div className={styles.comparison} data-single={variation!=='all'}>{variants.filter(v=>variation==='all'||variation===v.id).map(v=><MotionSample key={v.id} variant={v} context={context} speed={speed} paused={paused} reduced={reduce||systemReduced} replay={replay}/>)}</div>
    <footer className={styles.footer}>Study only. No production typography or theme state is changed. After approval: one title accent per new context; no paragraph animation and no replay on theme switches.</footer>
  </main>;
}
