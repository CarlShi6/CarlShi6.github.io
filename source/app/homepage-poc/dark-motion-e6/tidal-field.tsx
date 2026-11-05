"use client";
import gsap from 'gsap';
import { useEffect,useRef,useState,type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { createGravityPath,type GravityPath } from '../dark-motion-c/paths';
import { withCaptureApproach } from '../dark-motion-e/paths';
import type { TidalSettings } from './settings';
import styles from './study.module.css';
import type { CaptureController } from './controller';

const hash=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const clamp=(n:number,a=0,b=1)=>Math.min(b,Math.max(a,n));
const smooth=(n:number)=>{const q=clamp(n);return q*q*(3-2*q);};
type Kind='hero'|'flow'|'dust';
type Fragment={id:number;object:number;kind:Kind;order:number;front:boolean;phase:number;speed:number;size:number;side:number;sprite:number};
const seeds=Array.from({length:8},(_,object)=>{
  const counts=object===0?[12,18,24]:object<4?[8,12,16]:[4,8,10];
  return counts.flatMap((count,k)=>Array.from({length:count},(_,order):Fragment=>{
    const n=object*193+k*31+order*7+1;
    return {id:object*100+k*25+order,object,kind:(['hero','flow','dust'] as const)[k],order,front:(order+object)%3!==1,phase:hash(n),speed:.65+hash(n+3)*.7,size:k===2?1+hash(n+7):k===0?(object<4?13+hash(n+8)*15:7+hash(n+8)*6):8+hash(n+8)*10,side:hash(n+11)*2-1,sprite:(order+object*2)%6};
  }));
});
const cells=['0 0 550 512','550 0 510 512','1060 0 476 512','0 512 550 512','550 512 510 512','1060 512 476 512'];
const objectCells=['0 0 538 512','538 0 510 512','1048 0 488 512','0 512 512 512','512 512 512 512','1024 512 512 512'];
function FragmentArt({seed}:{seed:Fragment}){
  return <span className={styles.fragment} data-e6-fragment={seed.id} data-kind={seed.kind}>
    {seed.kind!=='dust'&&(seed.object<4?<svg viewBox={cells[seed.sprite]} aria-hidden="true"><image href="/homepage-poc/motion-e4/mineral-fragments.png" width="1536" height="1024"/></svg>:<svg viewBox="0 0 48 48" aria-hidden="true">
      <path d={['M9 10L31 7 40 19 30 38 11 32Z','M8 18L34 10 39 23 24 35 12 29Z','M12 6L28 13 35 38 23 41 8 22Z'][seed.sprite%3]} fill="#101a23" stroke="#8e826d" strokeWidth="1.1"/>
      <path d="M10 18L28 13 34 22 22 32Z" fill="#34404a"/><path d="M10 18L28 13 34 22M22 32L34 22" fill="none" stroke="#c2ad84" strokeWidth="1.2"/><path d="M14 20L21 29M19 18L26 27" stroke="#111b24" strokeWidth="2"/>
    </svg>)}
  </span>;
}
type Point={x:number;y:number;tx:number;ty:number};
type Model={path:GravityPath;table:Point[];size:number;artOffset:{x:number;y:number};art:HTMLElement;key:string};
type Diagnostic={index:number;visible:number;origin:{x:number;y:number};vibration:number;fragments:Array<{x:number;y:number;s:number;opacity:number;size:number}>};

export function FullTidalField({root,settings,controllerRef}:{root:RefObject<HTMLDivElement|null>;settings:TidalSettings;controllerRef:RefObject<CaptureController|null>}){
  const [stage,setStage]=useState<HTMLElement|null>(null);
  const [arts,setArts]=useState<HTMLElement[]>([]);
  const current=useRef(settings);
  useEffect(()=>{current.current=settings;},[settings]);
  useEffect(()=>{const frame=requestAnimationFrame(()=>{
    const el=root.current?.querySelector<HTMLElement>("section[aria-label='Dark gravitational portfolio system']");
    setStage(el??null);setArts(el?Array.from(el.querySelectorAll<HTMLElement>('[data-object-id] [data-art]')):[]);
  });return()=>cancelAnimationFrame(frame);},[root]);
  useEffect(()=>{
    if(!stage||arts.length!==8)return;
    const objects=Array.from(stage.querySelectorAll<HTMLElement>('[data-object-id]'));
    const hole=stage.querySelector<HTMLElement>('[data-transition-role="dark-hole"]')!;
    const nodes=seeds.map(group=>group.map(seed=>stage.querySelector<HTMLElement>(`[data-e6-fragment="${seed.id}"]`)!));
    const models:Model[]=[];let dirty=true,width=0,height=0,center={x:0,y:0},radius=0;
    let lastTime=-1,clock=0,lastPaint='',writes=0;
    const reduce=matchMedia('(prefers-reduced-motion:reduce)');
    const observer=new ResizeObserver(()=>{dirty=true;});observer.observe(stage);observer.observe(hole);arts.forEach(a=>observer.observe(a));
    const sample=(m:Model,s:number)=>{const f=clamp(s)*768,i=Math.floor(f),a=m.table[i],b=m.table[Math.min(i+1,768)],t=f-i;return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,tx:a.tx+(b.tx-a.tx)*t,ty:a.ty+(b.ty-a.ty)*t};};
    const tick=()=>{
      if(document.hidden)return;
      const state=controllerRef.current?.snapshot(),config=current.current,time=state?.visualTime??state?.time??0;
      const staticMotion=reduce.matches||!!state?.fallback||!state;
      if(lastTime>=0&&!staticMotion){
        if(state?.transitionControlled||time>=lastTime)clock+=(time-lastTime)*.65;
        else clock=time*.65;
      }
      lastTime=time;
      let rect:DOMRect|undefined;
      if(dirty){rect=stage.getBoundingClientRect();const hr=hole.getBoundingClientRect();width=rect.width;height=rect.height;center={x:hr.x+hr.width/2-rect.x,y:hr.y+hr.height/2-rect.y};radius=hr.width*.35;}
      objects.forEach((object,i)=>{
        const br=dirty?object.getBoundingClientRect():null;
        const anchor=state?.anchors[i]??(rect&&br?{x:br.x+br.width/2-rect.x,y:br.y+br.height/2-rect.y}:models[i]?.path.anchor);
        if(!anchor)return;
        const key=JSON.stringify([width,anchor,center,radius,state?.tuning.radius]);
        if(dirty||key!==models[i]?.key){
          const path=withCaptureApproach(createGravityPath(i,anchor,width,center,radius*(state?.tuning.radius??.89)),width);
          const ar=arts[i].getBoundingClientRect();
          models[i]={path,key,art:arts[i],size:arts[i].offsetWidth,artOffset:width<=900&&br?{x:ar.x+ar.width/2-br.x-br.width/2,y:ar.y+ar.height/2-br.y-br.height/2}:{x:0,y:0},table:Array.from({length:769},(_,n)=>{const p=path.sample(n/768);return {x:p.position.x,y:p.position.y,tx:p.tangent.x,ty:p.tangent.y};})};
        }
      });
      if(models.length!==8)return;
      const signature=JSON.stringify([config,time,staticMotion,dirty]);dirty=false;
      if(signature===lastPaint)return;lastPaint=signature;writes++;
      const output:Diagnostic[]=[];
      models.forEach((m,i)=>{
        const c=config.objects[i],intensity=clamp(config.global*c.intensity,0,2),mechanical=i>=4;
        const phase=state?.phases[i]?.capture??1,parent=state?.poses[i]??{...m.path.anchor,scale:1,progress:1,velocity:0};
        const head=parent.progress*m.path.stop,p0=sample(m,head),offset={x:parent.x-p0.x,y:parent.y-p0.y};
        const side=i<4?1:-1,vertical=i%4<2?1:-1;
        const ox=side*m.size*(mechanical?.22:.23),oy=vertical*m.size*(mechanical?.12:.18);
        const t=staticMotion?0:clock;
        // Subpixel structural tension acts on artwork only; the Scanner button stays stable.
        const vibration=mechanical&&!staticMotion?Math.sin(t*(.6+i*.07)+i)*.32*intensity*smooth(phase):0;
        m.art.style.rotate=`${vibration}deg`;
        m.art.style.translate=`${vibration*.5}px ${vibration*.3}px`;
        const results:Diagnostic['fragments']=[];
        seeds[i].forEach((seed,j)=>{
          const el=nodes[i][j];if(!el)return;
          const baseCount=i===0?(seed.kind==='hero'?7:seed.kind==='flow'?11:14):mechanical?(seed.kind==='hero'?2:seed.kind==='flow'?3:4):(seed.kind==='hero'?4:seed.kind==='flow'?6:8);
          const count=Math.round(baseCount*config.density);
          let opacity=c.enabled&&seed.order<count?clamp(intensity*2):0;
          if(seed.kind==='dust')opacity*=config.turbulence;
          const cycle=(seed.phase+t*(seed.kind==='hero'?.023:.024)*seed.speed)%1;
          // JavaScript remainder is signed. Reverse playback must stay in [0,1)
          // before fractional powers and arc-table lookup.
          const q=cycle<0?cycle+1:cycle;
          const peel=smooth((q-.18)/.82),settle=smooth((phase-.60)/.40);
          const scale=clamp(m.size/184,.65,1.12)*parent.scale;
          let s=head,x=0,y=0,size=seed.size,turn=seed.phase*42-21;
          if(seed.kind==='hero'){
            const lag=!staticMotion?Math.min(.025,parent.velocity/m.path.length*.08)*(1-smooth((phase-.72)/.28)):0;
            s=head-lag*(.5+seed.phase)+peel*(mechanical?.035:.075)*settle*intensity;
            const p=sample(m,s),detach=1-peel*.7;
            const transverse=seed.side*m.size*.065*config.spread;
            x=p.x+offset.x+m.artOffset.x+ox*detach*parent.scale-p.ty*transverse;
            y=p.y+offset.y+m.artOffset.y+oy*detach*parent.scale+p.tx*transverse;
            if(width<=900){x=parent.x+m.artOffset.x+ox+side*peel*m.size*.10;y=parent.y+m.artOffset.y+oy+seed.side*m.size*.08*config.spread;}
            turn+=Math.sin(t*.13*seed.speed+i)*22*intensity;
            size*=1-peel*.45;
            opacity*=(seed.front?.96:.67)*smooth(q/.07)*smooth((1-q)/.22);
          }else{
            const extent=Math.min(mechanical?.19:.30,(m.path.mergeAt-m.path.stop)*.78);
            s=head+Math.pow(q,1.35)*extent*settle-(.008+q*.075)*(1-settle);
            const p=sample(m,s),tether=Math.exp(-Math.pow((s-head)/.09,2));
            const spread=seed.side*m.size*(mechanical?.09:.16)*config.spread*Math.sin(q*Math.PI);
            const origin=1-smooth(q/.55);
            x=p.x+offset.x*tether-p.ty*spread+ox*origin*parent.scale;
            y=p.y+offset.y*tether+p.tx*spread+oy*origin*parent.scale;
            size*=(seed.kind==='dust'?Math.pow(1-q,.7):.28+.72*Math.pow(1-q,.7))*(seed.front?1:.8);
            opacity*=smooth(q/.12)*smooth((1-q)/.25)*(seed.kind==='dust'?.22:seed.front?.9:.7);
            turn+=Math.sin(t*.08*seed.speed+i)*20*intensity;
            if(width<=900){x=parent.x+m.artOffset.x+ox+side*q*m.size*.22;y=parent.y+m.artOffset.y+oy+seed.side*m.size*.10*config.spread;opacity*=.6;}
          }
          size*=scale*(.8+hash(seed.id+21)*.4);opacity*=smooth(phase*5);
          if(phase>=1){x=clamp(x,size/2+6,width-size/2-6);y=clamp(y,size/2+6,height-size/2-6);}
          const base=seed.kind==='dust'?3:48;
          el.style.transform=`translate3d(${x-base/2}px,${y-base/2}px,0) rotate(${turn}deg) scale(${size/base})`;
          el.style.opacity=String(opacity);
          el.style.filter=seed.kind==='dust'?'none':`brightness(${(seed.front?.85:.58)*(1+.1*Math.sin(t*.13+seed.phase*6))}) saturate(.65)`;
          results.push({x,y,s,opacity,size});
        });
        output.push({index:i,visible:results.filter(f=>f.opacity>.02).length,origin:{x:parent.x+ox,y:parent.y+oy},vibration,fragments:results});
      });
      if(process.env.NODE_ENV!=='production')window.__motionE6={clock,staticMotion,writes,settings:structuredClone(config),objects:output};
    };
    gsap.ticker.add(tick);tick();
    return()=>{gsap.ticker.remove(tick);observer.disconnect();arts.forEach(a=>{a.style.rotate='';a.style.translate='';});delete window.__motionE6;};
  },[stage,arts,controllerRef]);
  if(!stage)return null;
  return <>
    {arts.map((art,i)=>i===0||i===4?null:createPortal(<svg className={styles.atlas} viewBox={objectCells[i<4?i-1:i-2]} aria-hidden="true"><image href="/homepage-poc/motion-e6/celestial-atlas.png" width="1536" height="1024"/></svg>,art))}
    {createPortal(<>{[false,true].map(front=><div key={String(front)} aria-hidden="true" className={`${styles.layer} ${front?styles.front:styles.back}`}>
      {seeds.flat().filter(seed=>seed.front===front).map(seed=><FragmentArt key={seed.id} seed={seed}/>)}
    </div>)}</>,stage)}
  </>;
}
declare global {interface Window {__motionE6?:{clock:number;staticMotion:boolean;writes:number;settings:TidalSettings;objects:Diagnostic[]}}}
