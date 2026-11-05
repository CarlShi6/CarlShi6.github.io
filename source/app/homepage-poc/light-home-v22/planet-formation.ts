import gsap from 'gsap';

/** Paused scene adapter, ready for a future shared Spiral controller. */
export function createPlanetFormation(root:HTMLElement){
 let timeline!:gsap.core.Timeline;
 const context=gsap.context(()=>{
  const q=(s:string)=>Array.from(root.querySelectorAll<HTMLElement>(s));
  timeline=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'}});
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
  timeline.to({hold:0},{hold:1,duration:.01},1.51);
 },root);
 return {seek(t:number){timeline.time(Math.min(t,1.52),false);},dispose(){context.revert();}};
}
