import gsap from 'gsap';
import {createReferenceRenderer,duration} from './renderer';

export async function createReferenceController(root:HTMLElement,canvas:HTMLCanvasElement,options:{controlled?:boolean}={}){
 const view=await createReferenceRenderer(canvas,{transparent:options.controlled}),state={time:0};
 // A rapid theme reversal can unmount this host while texture decoding awaits.
 if(!root.isConnected){view.dispose();throw new DOMException('Celestial host unmounted','AbortError');}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let time=0,materialTime=0,paused=!!options.controlled,disposed=false,hidden=document.hidden,lastPaint=-1;
 let transition:{captureTime:number;materialTime:number;ambientAge:number}|null=null;
 const context=gsap.context(()=>{},root);let timeline!:gsap.core.Timeline;
 context.add(()=>{timeline=gsap.timeline({paused:true,defaults:{ease:'none'}}).addLabel('black-hole',0).addLabel('light-capture',1.3).addLabel('celestial-arrival',2.05).addLabel('living-world',duration).to(state,{time:duration,duration},0);});
 const identity=root.querySelector<HTMLElement>('[data-reference-identity]')!;
 const targets=Array.from(root.querySelectorAll<HTMLElement>('[data-reference-target]'));
 const clamp=(v:number)=>Math.min(1,Math.max(0,v));
 function paint(){
  if(disposed)return;
  timeline.time(Math.min(time,duration),true);
  const visualTime=state.time+Math.max(0,time-duration);
  const retained=transition?transition.ambientAge*(1-clamp(Math.abs(time-transition.captureTime)/.8)):0;
  const poses=view.draw(visualTime,materialTime,visualTime+retained);
  const alpha=clamp((visualTime-1.8)/1.2);identity.style.opacity=String(alpha);identity.inert=alpha<.95||root.dataset.scanOpen==='true';
  const l=view.composition();
  root.style.setProperty('--cx',`${l.cx}px`);root.style.setProperty('--cy',`${l.cy}px`);root.style.setProperty('--radius',`${l.radius}px`);
  if(poses)[poses.left,poses.debris,poses.right].forEach((p,i)=>{const el=targets[i];el.style.left=p.point.x+'px';el.style.top=p.point.y+'px';el.inert=!p.complete;el.style.visibility=p.complete?'visible':'hidden';});
  root.dataset.cEntrance=time<duration?'running':'done';root.dataset.ready='true';root.dataset.phase=time<1.45?'birth':time<3?'light':time<duration?'capture':'ambient';
  root.dispatchEvent(new Event('portfolio:reference-frame'));
 }
 function resize(){const r=root.getBoundingClientRect();if(!root.isConnected||r.width<=0||r.height<=0)return;view.resize(r.width,r.height);paint();}
 const observer=new ResizeObserver(resize);observer.observe(root);
 const tick=(_t:number,delta:number)=>{
  if(disposed||paused||hidden||reduced.matches)return;
  const dt=Math.min(delta/1000,.05);time+=dt;materialTime+=dt;
  const now=performance.now();if(innerWidth<700&&now-lastPaint<32)return;lastPaint=now;paint();
 };
 const finish=()=>{time=Math.max(time,duration);materialTime=Math.max(materialTime,duration);paused=false;paint();};
 const preference=()=>{if(reduced.matches)finish();};
 const visibility=()=>{hidden=document.hidden;};
 const loss=(e:Event)=>{e.preventDefault();paused=true;root.dataset.failed='true';identity.style.opacity='1';identity.inert=false;};
 resize();if(reduced.matches)finish();gsap.ticker.add(tick);reduced.addEventListener('change',preference);document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',loss);
 return {
  replay(){time=0;materialTime=0;paused=false;if(reduced.matches)finish();else paint();},
  seek(seconds:number){time=Math.max(0,Math.min(duration,seconds));materialTime=time;paused=true;paint();},
  pause(){paused=true;},play(){paused=false;},finish,
  transitionTakeover(){paused=true;transition??={captureTime:Math.min(time,duration),materialTime,ambientAge:Math.max(0,time-duration)};},
  transitionSeek(seconds:number){
   paused=true;transition??={captureTime:Math.min(time,duration),materialTime,ambientAge:Math.max(0,time-duration)};
   time=reduced.matches?duration:Math.max(0,Math.min(duration,seconds));
   materialTime=transition.materialTime+time-transition.captureTime;paint();
  },
  transitionRelease(){if(transition&&time>=duration)time+=transition.ambientAge;transition=null;paused=false;},
  renderSurface:view.renderSurface,
  snapshot(){return {...view.snapshot(),paused,reduced:reduced.matches,hidden,duration,ready:root.dataset.ready==='true'&&root.dataset.failed!=='true',plan:{end:duration},materialTime,transitionControlled:!!transition};},
  dispose(){disposed=true;gsap.ticker.remove(tick);observer.disconnect();context.revert();reduced.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',loss);view.dispose();},
 };
}
export type ReferenceController=Awaited<ReturnType<typeof createReferenceController>>;
