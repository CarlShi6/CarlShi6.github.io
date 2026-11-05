import gsap from 'gsap';
import {forks} from './artwork';
import {attachments} from './data';
import {createPlanetFormation} from './planet-formation';
import {bind,branchSpecs,clamp,connect,defaults,envelope,identity,multiply,point,rotation,schedule,smooth,type Settings,type Matrix} from './growth-model';

/** A single clock drives the connected tree graph. Child clocks derive from parent
 * arc length, not a list of stagger delays. All DOM geometry is cached at setup. */
export function createGrowth(root:HTMLElement,onState:(complete:boolean)=>void){
 const guides=Array.from(root.querySelectorAll<SVGPathElement>('[data-growth-guide]'));
 const samples=guides.map(path=>{const length=path.getTotalLength();const count=Math.max(16,Math.ceil(length/3));return Array.from({length:count},(_,i)=>{const p=path.getPointAtLength(length*i/(count-1));return{x:p.x,y:p.y};});});
 const nodes=connect(samples),byId=new Map(nodes.map(n=>[n.index,n]));
 const leaves=bind(nodes,forks.map(([x,y])=>({x,y})),20),hangers=bind(nodes,attachments,4);
 const layers=Array.from(root.querySelectorAll<SVGGElement>('[data-branch-layer]'));
 const outlines=Array.from(root.querySelectorAll<SVGPathElement>('[data-growth-outline]'));
 const leafNodes=Array.from(root.querySelectorAll<SVGGElement>('[data-leaf]'));
 const carriers=Array.from(root.querySelectorAll<SVGGElement>('[data-leaf-carrier]'));
 const buds=Array.from(root.querySelectorAll<SVGEllipseElement>('[data-bud]'));
 const tags=Array.from(root.querySelectorAll<HTMLElement>('[data-tag-reveal]'));
 const strings=tags.map(t=>t.querySelector<HTMLElement>('[data-string]')!);
 const planet=createPlanetFormation(root),clock={p:0};
 let settings={...defaults},leafTimes=schedule(nodes,leaves,settings),complete=false,resumeOnVisible=false;
 let progress:number[]=[],matrices:Matrix[]=[],leafProgress:number[]=[],tagProgress:number[]=[];
 const enabled=(index:number)=>settings.side==='both'||branchSpecs[index].side==='left';
 const matrixText=(m:Matrix)=>`matrix(${m.join(' ')})`;
 const render=()=>{
  const time=clock.p*settings.duration;planet.seek(time);
  progress=[];matrices=[];
  for(const node of nodes){
   const p=enabled(node.index)?clamp((time-node.start)/node.span):0;
   progress[node.index]=p;
   const parent=node.parent===null?identity():matrices[node.parent];
   // Uncurl gently about the physical joint; children inherit the moving joint frame.
   const curl=(node.index%2?1:-1)*(node.depth===0?.025:.045)*Math.pow(1-p,2);
   const world=multiply(parent,rotation(node.anchor,curl));matrices[node.index]=world;
   layers[node.index].setAttribute('transform',matrixText(world));
   layers[node.index].setAttribute('visibility',p>0?'visible':'hidden');
   outlines[node.index].setAttribute('d',envelope(node,p,settings.thickness));
  }
  leafProgress=leaves.map((binding,i)=>{
   const timing=leafTimes[i];const p=enabled(binding.node)?smooth((time-timing.start)/timing.span):0;
   const m=matrices[binding.node];carriers[i].setAttribute('transform',matrixText(m));
   const leaf=leafNodes[i];leaf.style.opacity='1';leaf.style.visibility=p>0?'visible':'hidden';
   leaf.setAttribute('transform',`rotate(${(i%2?1:-1)*11*(1-p)}) skewX(${(i%3-1)*18*(1-p)}) scale(${p*(.3+.7*Math.sqrt(p))} ${p})`);
   const bud=buds[i],at=point(m,{x:forks[i][0],y:forks[i][1]});
   bud.setAttribute('cx',String(at.x));bud.setAttribute('cy',String(at.y));
   const size=3.2*Math.sin(Math.PI*p);bud.setAttribute('rx',String(size*.7));bud.setAttribute('ry',String(size));
   return p;
  });
  tagProgress=hangers.map((binding,i)=>{
   const support=byId.get(binding.node)!;
   // The entire supporting branch, not just its attachment point, must mature.
   const start=Math.max(settings.duration-1.25+i*.055,support.start+support.span+.04);
   const p=enabled(binding.node)?clamp((time-start)/.25):0;
   const settle=clamp((time-start-.12)/.72);
   gsap.set(tags[i],{autoAlpha:p,rotation:(i%2?1:-1)*5*Math.exp(-5*settle)*Math.sin(settle*Math.PI*3)*(1-settle)});
   gsap.set(strings[i],{scaleY:p});return p;
  });
  const labels=root.querySelector('[data-section-label]');if(labels)gsap.set(labels,{autoAlpha:smooth((time-2)/.3)});
  const next=clock.p>=1;if(next!==complete){complete=next;root.dataset.settled=String(next);onState(next);}
 };
 const context=gsap.context(()=>{},root);
 const timeline=gsap.timeline({paused:true}).fromTo(clock,{p:0},{p:1,duration:settings.duration,ease:'none',onUpdate:render});
 render();
 const visibility=()=>{if(document.hidden){resumeOnVisible=!timeline.paused()&&clock.p<1;timeline.pause();}else if(resumeOnVisible){resumeOnVisible=false;timeline.play();}};
 document.addEventListener('visibilitychange',visibility);
 return {
  get duration(){return settings.duration;},play(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)this.finish();else if(document.hidden)resumeOnVisible=true;else timeline.play();},pause(){resumeOnVisible=false;timeline.pause();},
  seek(time:number){timeline.pause();clock.p=clamp(time/settings.duration);timeline.progress(clock.p,true);render();},
  finish(){timeline.pause();clock.p=1;timeline.progress(1,true);render();},
  configure(patch:Partial<Settings>){settings={...settings,...patch};leafTimes=schedule(nodes,leaves,settings);timeline.duration(settings.duration).timeScale(settings.speed);render();},
  snapshot(){return {time:clock.p*settings.duration,progress:clock.p,playing:timeline.isActive(),settings:{...settings},nodes:nodes.map(n=>({index:n.index,parent:n.parent,attach:n.attach,anchor:n.anchor,gap:n.gap,start:n.start,span:n.span,p:progress[n.index],matrix:matrices[n.index]})),leaves:leaves.map((b,i)=>({...b,p:leafProgress[i]})),tags:hangers.map((b,i)=>({...b,p:tagProgress[i]}))};},
  dispose(){timeline.kill();context.revert();planet.dispose();document.removeEventListener('visibilitychange',visibility);},
 };
}
