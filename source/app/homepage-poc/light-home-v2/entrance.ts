import gsap from 'gsap';
export const duration=4;
/** Paused scene adapter, ready for a future shared Spiral controller. */
export function createGrowth(root:HTMLElement,onComplete:()=>void){
 let timeline!:gsap.core.Timeline;
 const context=gsap.context(()=>{
  const q=(s:string)=>Array.from(root.querySelectorAll<HTMLElement>(s));
  timeline=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'},onComplete});
  timeline.addLabel('fragments',0).addLabel('planet',.4).addLabel('trunks',1).addLabel('canopy',1.6).addLabel('tags',2.6).addLabel('settled',4);
  timeline.set(q('[data-planet]'),{scale:.17,svgOrigin:'715 640'},0)
   .set(q('[data-surface-reveal]'),{attr:{r:0}},0)
   .set(q('[data-branch]'),{strokeDasharray:1,strokeDashoffset:1},0)
   .set(q('[data-leaf]'),{scale:.01,autoAlpha:0,svgOrigin:'0 0'},0)
   .set(q('[data-tag-reveal]'),{autoAlpha:0},0)
   .set(q('[data-string]'),{scaleY:0,transformOrigin:'50% 0%'},0)
   .set(q('[data-light-identity],[data-section-label]'),{autoAlpha:0},0);
  q('[data-fragment]').forEach((node,i)=>{
   const angle=i*2.39996,radius=115+i%5*33,phase={p:0};
   const render=()=>{const p=phase.p,r=radius*(1-p),a=angle+p*1.15;gsap.set(node,{x:715+Math.cos(a)*r,y:640+Math.sin(a)*r*.7,rotation:i*37+p*120,scale:(.38+(i%4)*.13)*(1-p*.55),opacity:Math.sin(Math.min(1,p*4)*Math.PI/2)*(1-Math.max(0,(p-.7)/.3))});};
   timeline.to(phase,{p:1,duration:.72+(i%3)*.06,ease:'power2.in',onUpdate:render},i*.012);
  });
  timeline.fromTo(q('[data-core]'),{opacity:0,scale:.25,svgOrigin:'715 640'},{opacity:.9,scale:.8,duration:.42},.05).to(q('[data-core]'),{opacity:0,duration:.25},.53);
  timeline.to(q('[data-surface-reveal]'),{attr:{r:500},duration:.78,ease:'power2.inOut'},.28)
   .to(q('[data-planet]'),{scale:1,duration:.85,ease:'power3.inOut'},.35)
   .to(q('[data-light-identity]'),{autoAlpha:1,duration:.42},1.1);
  q('[data-branch]').forEach(node=>timeline.to(node,{strokeDashoffset:0,duration:Number(node.dataset.duration)*1.15,ease:'sine.inOut'},1+(Number(node.dataset.start)-.43)*.9));
  q('[data-leaf]').forEach(node=>timeline.to(node,{scale:1,autoAlpha:1,duration:.55,ease:'power2.out'},Number(node.dataset.leafStart)));
  timeline.to(q('[data-section-label]'),{autoAlpha:1,duration:.3},2.25);
  q('[data-tag-reveal]').forEach((node,i)=>{
   timeline.to(node,{autoAlpha:1,duration:.22},2.65+i*.07);
   const cord=node.querySelector('[data-string]');
   timeline.to(cord,{scaleY:1,duration:.25},2.6+i*.07);
   timeline.fromTo(node,{rotation:(i%2?1:-1)*6,transformOrigin:'50% 0%'},{rotation:0,duration:.84,ease:'elastic.out(1,.65)'},2.85+i*.04);
  });
  timeline.to({hold:0},{hold:1,duration:.1},3.9);
 },root);
 return {duration,play(){timeline.play();},pause(){timeline.pause();},seek(t:number){timeline.time(t,false);},finish(){timeline.progress(1,false).pause();},snapshot(){return {time:timeline.time(),playing:timeline.isActive()};},dispose(){context.revert();}};
}
