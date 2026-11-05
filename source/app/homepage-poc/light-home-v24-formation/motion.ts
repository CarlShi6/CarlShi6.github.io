import gsap from 'gsap';
import {bind,clamp,connect,envelope,smooth,type Node} from '../light-home-v22/growth-model';
import {foliage,surfaceSites} from './artwork';

export const duration=6;
const ease=(a:number,b:number,t:number)=>smooth((t-a)/(b-a));
export type FoliageDriver={render(time:number):void;reset():void;tick(delta:number):void;snapshot():{ambientTime:number;fallCount:number;emitted:number;completedFalls:number;leafProgress:number[]}};
export function createFormation(root:HTMLElement,{connectedLeaves=false,getFoliage}:{connectedLeaves?:boolean;getFoliage?:()=>FoliageDriver|null}={}){
 const q=<T extends Element>(s:string)=>Array.from(root.querySelectorAll<T>(s));
 const guides=q<SVGPathElement>('[data-tree-guide]');
 const nodes=connect(guides.map(path=>{const length=path.getTotalLength(),n=Math.max(24,Math.ceil(length/2));return Array.from({length:n},(_,i)=>{const p=path.getPointAtLength(length*i/(n-1));return {x:p.x,y:p.y};});}));
 const byId=new Map<number,Node>();
 for(const node of nodes){const parent=node.parent===null?null:byId.get(node.parent)!;node.start=parent?parent.start+parent.span*node.attach+.035:0;node.span=.32+node.length/170;byId.set(node.index,node);}
 const extent=Math.max(...nodes.map(n=>n.start+n.span));
 for(const node of nodes){node.start=2.15+node.start/extent*2.65;node.span=node.span/extent*2.65;}
 const bindings=bind(nodes,foliage.map(l=>({x:l.x,y:l.y})),foliage.filter(l=>l.fork<20).length);
 const leafTimes=bindings.map((b,i)=>{const n=byId.get(b.node)!;return Math.max(4.8,n.start+n.span*b.at+.16)+(i%7)*.035;});
 const paths=q<SVGPathElement>('[data-tree-envelope]'),rocks=q<SVGGElement>('[data-rock]'),sites=q<SVGCircleElement>('[data-surface-site]');
 const leaves=q<SVGGElement>('[data-leaf-carrier]'),unfold=q<SVGGElement>('[data-leaf-unfold]'),fallNodes=q<SVGGElement>('[data-falling-leaf]');
 // Bind the leaf carrier to the same surveyed geometry that reveals the bark.
 // Old standalone studies retain their original placement unless explicitly opted in.
 const attached=foliage.map((leaf,i)=>{
  if(!connectedLeaves)return{x:leaf.x,y:leaf.y};
  const b=bindings[i],n=byId.get(b.node)!,f=b.at*(n.points.length-1),a=n.points[Math.floor(f)],z=n.points[Math.min(n.points.length-1,Math.ceil(f))];
  const p={x:a.x+(z.x-a.x)*(f%1),y:a.y+(z.y-a.y)*(f%1)};
  leaves[i].setAttribute('transform',`translate(${p.x} ${p.y})`);
  leaves[i].dataset.branch=String(b.node);leaves[i].dataset.attachment=String(b.at);
  return p;
 });
 const supports=q<SVGPathElement>('[data-canopy-support]');
 const planet=root.querySelector<SVGGElement>('[data-planet-mass]')!,identity=root.querySelector<HTMLElement>('[data-light-identity]')!;
 const crust=root.querySelector<SVGPathElement>('[data-core-outline]')!,cracks=root.querySelector<SVGGElement>('[data-core-cracks]')!,young=root.querySelector<SVGGElement>('[data-young-core]')!,mature=root.querySelector<SVGCircleElement>('[data-mature-surface]')!;
 const coreTone=root.querySelector<SVGFEColorMatrixElement>('[data-core-tone]')!;
 const art=root.querySelector<SVGSVGElement>('[data-formation-art]')!,overlay=root.querySelector<SVGSVGElement>('[data-falling-layer]')!;
 const media=matchMedia('(prefers-reduced-motion: reduce)'),clock={time:0};
 let reduced=media.matches,settled=false,paused=false,disposed=false,hidden=document.hidden,ambientTime=0,nextFall=0,serial=0,completedFalls=0,scale=.12;
 let bounds=art.getBoundingClientRect();
 let progress:number[]=[],leafProgress:number[]=[];
 type Fall={slot:number;source:number;start:number;life:number;x:number;y:number;size:number;gold:boolean};
 const falls:Fall[]=[];const regrowth=new Map<number,number>();
 const clearFalls=()=>{getFoliage?.()?.reset();falls.length=0;for(const source of regrowth.keys())unfold[source].setAttribute('transform','scale(1)');regrowth.clear();fallNodes.forEach(n=>n.setAttribute('visibility','hidden'));ambientTime=0;nextFall=0;serial=0;completedFalls=0;};
 const measure=()=>{bounds=art.getBoundingClientRect();overlay.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);clearFalls();};
 const onScroll=()=>{bounds=art.getBoundingClientRect();};
 const render=()=>{
  const t=clock.time;
  // Constant-density volume law: accumulated incoming mass controls radius.
  const arrival=rocks.map((_,i)=>clamp((t-i*.025)/(.96+(i%5)*.13)));
  const mass=arrival.reduce((sum,p,i)=>sum+ease(.77,1,p)*(1+i%3*.35),0)/rocks.reduce((sum,_,i)=>sum+1+i%3*.35,0);
  scale=Math.cbrt(.001728+.998272*mass);
  planet.setAttribute('transform',`translate(715 640) scale(${scale}) translate(-715 -640)`);
  // Accreted mass fills fissures and consolidates the irregular mineral pieces.
  // The young body has no miniature mature vegetation baked into it.
  const consolidation=smooth(mass);
  const shade=.8+.2*consolidation;
  coreTone.setAttribute('values',`${shade} 0 0 0 0 0 ${Math.min(1,shade+.02)} 0 0 0 0 0 ${Math.min(1,shade+.05)} 0 0 0 0 0 1 0`);
  const edgePoints=Array.from({length:32},(_,i)=>{
   const angle=i*Math.PI/16,r=375*(consolidation+(1-consolidation)*(.54+((i*13)%17)/48));
   return `${(715+Math.cos(angle)*r).toFixed(2)},${(640+Math.sin(angle)*r).toFixed(2)}`;
  });
  crust.setAttribute('d','M'+edgePoints.join('L')+'Z');
  cracks.setAttribute('stroke-width',String(48*Math.pow(1-consolidation,1.3)));
  const maturation=ease(2.23,3.05,t);
  mature.setAttribute('r',String(390*maturation));
  young.setAttribute('visibility',maturation>=1?'hidden':'visible');
  rocks.forEach((node,i)=>{
   const p=arrival[i];node.setAttribute('visibility',t>=i*.025&&p<1?'visible':'hidden');
   if(p>=1)return;
   const a=i*2.39996+p*(i%2?.88:-.7),edge=325*scale,r=edge*.86+(530+i%5*42-edge*.86)*Math.pow(1-p,1.65);
   node.setAttribute('transform',`translate(${715+Math.cos(a)*r} ${640+Math.sin(a)*r*.84}) rotate(${i*37+p*145}) scale(${.42+(i%5)*.17})`);
  });
  sites.forEach((node,i)=>node.setAttribute('r',String((i===8?42:48)*ease(2.25+i*.025,2.95+i*.025,t))));
  progress=[];
  for(const node of nodes){
   const p=clamp((t-node.start)/node.span);progress[node.index]=p;
   if(!getFoliage)paths[node.index].setAttribute('d',envelope(node,p,1));
   if(connectedLeaves&&supports[node.index]){
    // The raster's fine tips can end before the surveyed guide. Continue those
    // same connected twigs into the petioles, using the tree's growth front.
    const front=p*(node.points.length-1),last=Math.floor(front),points=node.points.slice(0,last+1);
    if(last<node.points.length-1){const a=node.points[last],b=node.points[last+1];points.push({x:a.x+(b.x-a.x)*(front-last),y:a.y+(b.y-a.y)*(front-last)});}
    if(node.parent!==null)points.unshift(node.anchor);
    supports[node.index].setAttribute('d',p>0?points.map((v,i)=>`${i?'L':'M'}${v.x} ${v.y}`).join(' '):'M0 0');
   }
  }
  leafProgress=getFoliage?[]:leaves.map((node,i)=>{
   const p=ease(leafTimes[i],Math.min(5.96,leafTimes[i]+.65),t);
   node.setAttribute('visibility',p>0?'visible':'hidden');
   unfold[i].setAttribute('transform',`rotate(${(i%2?1:-1)*16*(1-p)}) scale(${p*(.25+.75*p)} ${p})`);return p;
  });
  getFoliage?.()?.render(t);
  const ip=ease(2,2.65,t);identity.style.opacity=String(ip);identity.inert=ip<.95;
  const next=t>=duration;settled=next;root.dataset.settled=String(next);
 };
 const context=gsap.context(()=>{},root);
 let timeline!:gsap.core.Timeline;
 context.add(()=>{timeline=gsap.timeline({paused:true,defaults:{ease:'none'}})
  .addLabel('mass-accretion',0).addLabel('surface',2.23).addLabel('trees',2.15).addLabel('leaves',4.8).addLabel('living-world',6)
  .fromTo(clock,{time:0},{time:duration,duration,onUpdate:render},0);});
 const ambient=(_time:number,delta:number)=>{
  if(disposed||hidden||paused||reduced||!settled)return;
  if(getFoliage){getFoliage()?.tick(delta);return;}
  ambientTime+=Math.min(delta/1000,.05);
  const cap=innerWidth<600?5:10;
  if(ambientTime>=nextFall&&falls.length<cap){
   const slot=fallNodes.findIndex((_,i)=>!falls.some(f=>f.slot===i));
   const source=(serial*47+19)%foliage.length,l=foliage[source];
   if(leaves[source].dataset.previewLeaf==='true'){nextFall=ambientTime+.3;serial++;return;}
   falls.push({slot,source,start:ambientTime,life:8+serial%4,x:bounds.x+(attached[source].x+l.dx)/1448*bounds.width,y:bounds.y+(attached[source].y+l.dy)/1086*bounds.height,size:l.size*bounds.width/1448,gold:l.gold});
   fallNodes[slot].querySelector('use')!.setAttribute('href',fallNodes[slot].querySelector('use')!.getAttribute('href')!.replace(/(blue|gold)$/,l.gold?'gold':'blue'));
   regrowth.set(source,ambientTime);nextFall=ambientTime+(innerWidth<600?2:1.25);serial++;
  }
  for(let i=falls.length-1;i>=0;i--){
   const fall=falls[i],p=(ambientTime-fall.start)/fall.life,n=fallNodes[fall.slot];
   if(p>=1){n.setAttribute('visibility','hidden');falls.splice(i,1);completedFalls++;continue;}
   const x=fall.x+Math.sin(p*7+fall.source)*34*p+(fall.source%2?1:-1)*p*62;
   const y=fall.y+(innerHeight+65-fall.y)*Math.pow(p,.86),roll=Math.sin(p*11+fall.source)*43+p*(fall.source%2?100:-90);
   n.setAttribute('visibility','visible');n.setAttribute('transform',`translate(${x} ${y}) rotate(${roll}) scale(${fall.size*(.45+.55*Math.abs(Math.cos(p*7)))} ${fall.size})`);
  }
  for(const [source,start] of regrowth){if(leaves[source].dataset.previewLeaf==='true')continue;const p=ease(start+1.5,start+4.8,ambientTime);unfold[source].setAttribute('transform',`scale(${p})`);if(p>=1)regrowth.delete(source);}
 };
 const onVisibility=()=>{hidden=document.hidden;if(hidden)timeline.pause();else if(!paused&&!reduced&&!settled)timeline.play();};
 const finish=()=>{timeline.pause();clock.time=duration;timeline.progress(1,true);clearFalls();render();};
 const preference=()=>{reduced=media.matches;if(reduced)finish();};
 measure();render();gsap.ticker.add(ambient);document.addEventListener('visibilitychange',onVisibility);window.addEventListener('resize',measure);window.addEventListener('scroll',onScroll,{passive:true});media.addEventListener('change',preference);
 return {
  play(){paused=false;if(reduced)finish();else if(!hidden&&!settled)timeline.play();},
  pause(){paused=true;timeline.pause();},
  replay(){paused=false;clearFalls();clock.time=0;timeline.progress(0,true);render();if(reduced)finish();else if(!hidden)timeline.play();},
  seek(p:number){paused=true;timeline.pause();clearFalls();clock.time=clamp(p)*duration;timeline.progress(clamp(p),true);render();},
  finish(){paused=false;finish();},
  speed(n:number){timeline.timeScale(n);},
  snapshot(){return {time:clock.time,progress:clock.time/duration,settled,paused,reduced,hidden,ambientTime,fallCount:falls.length,emitted:serial,completedFalls,scale,nodes:nodes.map(n=>({index:n.index,parent:n.parent,attach:n.attach,p:progress[n.index],start:n.start,span:n.span})),leafProgress,surfaceSites,...getFoliage?.()?.snapshot()};},
  dispose(){disposed=true;context.revert();gsap.ticker.remove(ambient);document.removeEventListener('visibilitychange',onVisibility);window.removeEventListener('resize',measure);window.removeEventListener('scroll',onScroll);media.removeEventListener('change',preference);},
 };
}
