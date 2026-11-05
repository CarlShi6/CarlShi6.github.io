import gsap from 'gsap';
import {hangers,projectHangers} from './growth-geometry';

export const LIGHT_DURATION=3;
/** A paused, reversible adapter. The homepage controller owns the only clock. */
export function createLightTimeline(container:HTMLElement,origin?:{x:number;y:number}){
 const root=container.querySelector<HTMLElement>('[aria-label="Ivory Cosmos portfolio"]')!;
 const one=<T extends Element=HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;
 const all=<T extends Element=HTMLElement>(selector:string)=>Array.from(root.querySelectorAll<T>(selector));
 const base=one('[data-light-base]'),planet=one('[data-light-planet]'),growth=one('[data-light-branches]'),art=one('[data-light-branch-art]');
 const branches=all<SVGPathElement>('[data-light-branch]'),strings=all<SVGLineElement>('[data-light-string]');
 const leaves=all('[data-leaf-tree]'),fruit=all('[data-fruit-tree]'),charms=all<HTMLElement>('[data-tree] a'),labels=all('[data-light-label]');
 const identity=one('[data-light-identity]'),energy=one('[data-light-energy]');
 const composition=one('[data-light-composition]').getBoundingClientRect(),center=one('[data-light-center]').getBoundingClientRect();
 const offset=origin?{x:origin.x-center.x,y:origin.y-center.y}:{x:0,y:0};
 const nodes=[base,planet,growth,art,identity,energy,...branches,...strings,...leaves,...fruit,...charms,...labels];
 const originals=new Map(nodes.map(node=>[node,node.getAttribute('style')]));
 let restored=false,disposed=false,timeline!:gsap.core.Timeline;
 function restore(){
  for(const[node,style]of originals){if(style===null)node.removeAttribute('style');else node.setAttribute('style',style);}
  delete root.dataset.lightControlled;root.dataset.lightProgress='done';
  // Removing the control class restores CSS interaction transforms, not a second entrance.
  for(const animation of root.getAnimations({subtree:true})){
   const end=animation.effect?.getComputedTiming().endTime;
   if(typeof end==='number'&&Number.isFinite(end)){try{animation.finish();}catch{/* Detached animation. */}}
  }
  restored=true;
 }
 root.dataset.lightControlled='true';
 const context=gsap.context(()=>{
  timeline=gsap.timeline({paused:true,id:'rc4-original-tree-growth',defaults:{ease:'power2.out'}});
  timeline.set(base,{autoAlpha:0},0).set(growth,{autoAlpha:1},0).set(art,{autoAlpha:1},0)
   .set(planet,{autoAlpha:1,scale:.24,x:offset.x,y:offset.y,transformOrigin:'50% 61%'},0)
   .set(branches,{strokeDasharray:1,strokeDashoffset:1},0)
   .set(strings,{strokeDasharray:1,strokeDashoffset:1,autoAlpha:0},0)
   .set([leaves,fruit,charms,labels,identity,energy].flat(),{autoAlpha:0},0)
   .addLabel('planet',0).to(planet,{scale:1,x:0,y:0,duration:.78,ease:'power3.inOut'},0)
   .addLabel('trunks',.43).addLabel('branches',.79).addLabel('twigs',1.22)
   .to(identity,{autoAlpha:1,duration:.36},.85);
  branches.forEach(branch=>timeline.to(branch,{strokeDashoffset:0,duration:Number(branch.dataset.growthDuration),ease:'none'},Number(branch.dataset.growthStart)));
  // Only the last hairline twigs and original paper grain are restored here.
  // Both complete raster trees have already grown through traced path masks.
  timeline.to(base,{autoAlpha:1,duration:.13},1.83).to([planet,art],{autoAlpha:0,duration:.13},1.83)
   .addLabel('leaves',1.96).to(labels,{autoAlpha:1,duration:.22,stagger:.06},1.91)
   .to(energy,{autoAlpha:1,duration:.3},2.04);
  leaves.forEach((leaf,index)=>{
   timeline.set(leaf,{scale:.78},0).to(leaf,{autoAlpha:.28,scale:1,duration:.28},1.96+(index%5)*.025+(index>4?.025:0));
  });
  timeline.addLabel('strings',2.04).addLabel('objects',2.20);
  strings.forEach((line,index)=>{
   const anchor=hangers[index];
   timeline.to(line,{autoAlpha:.58,strokeDashoffset:0,duration:.18,ease:'power2.inOut'},2.04+index*.03);
   // Cords and charms rotate about the same measured branch attachment.
   timeline.set(line,{svgOrigin:`${anchor.x} ${anchor.anchorY}`},0);
  });
  function swing(node:Element,index:number,opacity:number){
   const direction=index%2? -1:1,start=2.20+index*.032;
   timeline.set(node,{rotation:direction*3.5},0)
    .to(node,{autoAlpha:opacity,duration:.15},start)
    .to(node,{rotation:direction*-1.8,duration:.22,ease:'sine.inOut'},start)
    .to(node,{rotation:direction*.65,duration:.19,ease:'sine.inOut'},start+.22)
    .to(node,{rotation:0,duration:.16,ease:'sine.out'},start+.41);
  }
  charms.forEach((charm,index)=>{
   const a=hangers[index],skill=charm.hasAttribute('data-tool');
   const anchorY=(a.anchorY-a.y)*composition.height/1086+(skill?0:charm.offsetHeight/2);
   timeline.set(charm,{xPercent:-50,yPercent:skill?0:-50,scale:skill?.9:.92,transformOrigin:`50% ${anchorY}px`},0);
   swing(charm,index,skill?1:.72);
   swing(strings[index],index,.58);
  });
  fruit.forEach((image,index)=>{
   const a=projectHangers[index];
   timeline.set(image,{scale:1,transformOrigin:`${a.x/1448*100}% ${a.anchorY/1086*100}%`},0);
   swing(image,index,.62);
  });
  // Existing artwork/stems own the permanent cords; the temporary growth cords
  // leave only after the ornaments settle, at the same coordinates.
  timeline.to(strings,{autoAlpha:0,duration:.12},2.88).set(growth,{autoAlpha:0},LIGHT_DURATION);
 },root);
 function seek(seconds:number){
  if(disposed)return;
  const t=Math.max(0,Math.min(LIGHT_DURATION,seconds));
  if(t===LIGHT_DURATION){timeline.totalTime(t,true).pause();if(!restored)restore();return;}
  root.dataset.lightControlled='true';root.dataset.lightProgress=t.toFixed(3);
  if(restored){timeline.totalTime(0,true).pause();restored=false;}
  timeline.totalTime(t,true).pause();
 }
 seek(LIGHT_DURATION);
 return {duration:LIGHT_DURATION,seek,finish:()=>seek(LIGHT_DURATION),dispose(){if(disposed)return;disposed=true;context.revert();restore();delete root.dataset.lightProgress;}};
}
