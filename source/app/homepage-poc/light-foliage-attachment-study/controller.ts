import gsap from 'gsap';
import {createFormation,duration} from '../light-home-v24-formation/motion';
import {envelope} from '../light-home-v22/growth-model';
import {branchMatrices,leafPose,leafProgress,clamp,sample,type Branch,type Attachment,type Mode} from './model';

export function createAttachmentStudy(root:HTMLElement,branches:Branch[],leaves:Attachment[],mode:Mode){
 const base=createFormation(root);base.seek(0);
 const rig=root.querySelector<SVGSVGElement>('[data-foliage-rig]')!;
 const groups=new Map(branches.map(b=>[b.id,rig.querySelector<SVGGElement>(`[data-rig-branch="${b.id}"]`)]));
 const leafGroups=leaves.map(l=>rig.querySelector<SVGGElement>(`[data-attached-leaf="${l.id}"]`)!);
 const clock={time:0},media=matchMedia('(prefers-reduced-motion:reduce)');
 const lastGrowth=new Map<string,number>();
 let ambient=0,amount=1,paused=false,hidden=document.hidden,disposed=false,reduced=media.matches;
 let maxError=0,petioleError=0,earlyLeaves=0;
 const readError=()=>{
  maxError=0;petioleError=0;earlyLeaves=0;
  leaves.forEach((leaf,i)=>{
   const b=branches.find(n=>n.id===leaf.parentBranchId)!,group=leafGroups[i],branch=groups.get(b.id)!;
   const guide=branch.querySelector<SVGPathElement>('[data-rig-guide]')!;
   // Independent browser arc-length sample versus the MotionPath placement.
   const p=guide.getPointAtLength(guide.getTotalLength()*leaf.u);
   const expected=new DOMPoint(p.x,p.y).matrixTransform(guide.getScreenCTM()!);
   const actual=new DOMPoint(0,0).matrixTransform(group.getScreenCTM()!);
   const error=Math.hypot(expected.x-actual.x,expected.y-actual.y);maxError=Math.max(maxError,error);
   const stem=group.querySelector<SVGPathElement>('[data-petiole]')!,tip=stem.getPointAtLength(stem.getTotalLength());
   const endpoint=new DOMPoint(tip.x,tip.y).matrixTransform(stem.getScreenCTM()!);
   const blade=new DOMPoint(0,0).matrixTransform(group.querySelector<SVGGElement>('[data-leaf-blade]')!.getScreenCTM()!);
   if(group.dataset.grown==='true')petioleError=Math.max(petioleError,Math.hypot(endpoint.x-blade.x,endpoint.y-blade.y));
   if(group.dataset.grown==='true'&&clamp((clock.time-b.start)/b.span)<leaf.u)earlyLeaves++;
   group.querySelector('[data-error-label]')!.textContent=`${error.toFixed(2)}px`;
   group.querySelector('[data-error-marker]')!.setAttribute('stroke',error>.75?'#bf3c32':'#387d61');
  });
 };
 const render=()=>{
  const matrices=branchMatrices(branches,ambient,reduced?0:amount,mode);
  for(const b of branches){const g=groups.get(b.id);if(!g)continue;
   g.setAttribute('transform',`matrix(${matrices.get(b.id)!.join(' ')})`);
   const p=clamp((clock.time-b.start)/b.span);
   // Mature bark geometry is static; ambient motion changes its parent matrix only.
   if(lastGrowth.get(b.id)!==p){
    g.querySelector('[data-rig-envelope]')!.setAttribute('d',envelope(b,p,1));
    g.querySelector('[data-junction]')!.setAttribute('d',p>0&&b.parent!==null?`M${b.anchor.x} ${b.anchor.y} L${b.points[0].x} ${b.points[0].y}`:'M0 0');
    lastGrowth.set(b.id,p);
   }
  }
  leaves.forEach((l,i)=>{
   const b=branches.find(n=>n.id===l.parentBranchId)!,g=leafGroups[i],p=leafProgress(l,b,clock.time),pose=leafPose(l,b,p,ambient,reduced?0:amount);
   g.setAttribute('transform',`translate(${pose.anchor.x} ${pose.anchor.y})`);g.dataset.grown=String(p>0);
   g.querySelector('[data-leaf-growth]')!.setAttribute('visibility',p>0?'visible':'hidden');
   g.querySelector('[data-petiole]')!.setAttribute('d',`M0 0 Q${pose.end.x*.45} ${pose.end.y*.65} ${pose.end.x} ${pose.end.y}`);
   g.querySelector('[data-leaf-blade]')!.setAttribute('transform',`translate(${pose.end.x} ${pose.end.y}) rotate(${pose.angle+90}) scale(${l.size*pose.blade})`);
  });
 };
 const context=gsap.context(()=>{},root);let tl!:gsap.core.Timeline;
 context.add(()=>{tl=gsap.timeline({paused:true}).to(clock,{time:duration,duration,ease:'none',onUpdate:()=>{base.seek(clock.time/duration);render();}});});
 const ticker=(_t:number,delta:number)=>{if(disposed||paused||hidden||reduced||clock.time<duration)return;ambient+=Math.min(delta/1000,.05);render();};
 const finish=()=>{tl.pause();clock.time=duration;base.seek(1);render();};
 const visibility=()=>{hidden=document.hidden;if(hidden)tl.pause();else if(!paused&&!reduced&&clock.time<duration)tl.play();};
 const preference=()=>{reduced=media.matches;if(reduced)finish();};
 const resize=()=>readError();
 render();gsap.ticker.add(ticker);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);window.addEventListener('resize',resize);
 const api={
  play(){paused=false;if(reduced)finish();else if(!hidden&&clock.time<duration)tl.play();},
  pause(){paused=true;tl.pause();},
  replay(){paused=false;ambient=0;tl.pause();clock.time=0;base.seek(0);tl.progress(0,true);render();api.play();},
  seek(p:number){paused=true;tl.pause();ambient=0;clock.time=clamp(p)*duration;tl.progress(clamp(p),true);base.seek(clamp(p));render();},
  finish(){paused=false;finish();},
  sway(n:number){amount=n;render();},
  sampleAmbient(t:number){paused=true;finish();ambient=t;render();},
  snapshot(){readError();return{mode,time:clock.time,progress:clock.time/duration,paused,reduced,hidden,ambient,amount,maxAnchorErrorPx:maxError,maxPetioleErrorPx:petioleError,minimumBarkOpacity:Math.min(...leaves.map(l=>l.barkOpacity)),earlyLeaves,leafCount:leaves.length,visibleLeaves:leafGroups.filter(g=>g.dataset.grown==='true').length,attachments:leaves.map(l=>({...l,...sample(branches.find(b=>b.id===l.parentBranchId)!,l.u)}))};},
  dispose(){disposed=true;context.revert();base.dispose();gsap.ticker.remove(ticker);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);window.removeEventListener('resize',resize);},
 };
 return api;
}
