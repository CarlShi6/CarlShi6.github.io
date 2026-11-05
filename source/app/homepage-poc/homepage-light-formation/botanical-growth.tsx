import {useId} from 'react';
import {branchSpecs,envelope,clamp,smooth,type Node} from '../light-home-v22/growth-model';

const curves={
 projects:['M68 2 C68 27 52 36 50 68 C49 96 32 122 29 147','M59 35 C43 36 24 48 11 60','M50 64 C35 66 22 79 12 87','M44 94 C35 94 25 111 20 118','M53 46 C88 59 87 86 65 108'],
 skills:['M45 6 C43 20 53 23 50 45 C49 75 50 106 52 139','M48 23 C28 19 13 29 9 50','M50 19 C68 12 84 19 92 39','M49 47 C15 54 11 98 33 130','M50 47 C84 49 95 94 73 132'],
};
/** The watercolor is revealed by connected, age-thickened envelopes, like the existing trees. */
export function GrowingBotanical({kind,src}:{kind:'projects'|'skills';src:string}){
 const id=useId().replace(/:/g,'');
 return <svg viewBox="0 0 100 150" width="100%" height="100%" overflow="visible" aria-hidden="true">
  <defs><mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="150"><rect width="100" height="150" fill="black"/>
   {curves[kind].map((d,i)=><path key={d} data-bud-envelope={i} fill="white" d="M0 0"/>)}</mask></defs>
  <g visibility="hidden">{curves[kind].map((d,i)=><path key={d} data-bud-guide={i} d={d}/>)}</g>
  <image href={src} width="100" height="150" mask={`url(#${id})`}/>
 </svg>;
}

export function bindBotanicalGrowth(element:HTMLElement,kind:'projects'|'skills'){
 const guides=Array.from(element.querySelectorAll<SVGPathElement>('[data-bud-guide]'));
 const masks=Array.from(element.querySelectorAll<SVGPathElement>('[data-bud-envelope]'));
 const widths=kind==='projects'?[24,32,35,29,38]:[35,25,25,52,52];
 const rootLength=guides[0].getTotalLength();
 const branches=guides.map((guide,i)=>{
  const length=guide.getTotalLength(),points=Array.from({length:81},(_,n)=>{const p=guide.getPointAtLength(length*n/80);return{x:p.x,y:p.y};});
  let attach=0;
  if(i){let nearest=Infinity;for(let n=0;n<=100;n++){const p=guides[0].getPointAtLength(rootLength*n/100),d=Math.hypot(p.x-points[0].x,p.y-points[0].y);if(d<nearest){nearest=d;attach=n/100;}}}
  // Transform the same tree envelope into the bud's texture coordinate system.
  const scale=widths[i]/(branchSpecs[0].width+4);
  const node:Node={index:0,points:points.map(p=>({x:p.x/scale,y:p.y/scale})),length,parent:null,attach:0,anchor:{x:0,y:0},gap:0,depth:0,start:0,span:1};
  masks[i].setAttribute('transform',`scale(${scale})`);
  return{node,start:i?attach*.66+.04:0,span:i?.38:.72};
 });
 return(progress:number)=>branches.forEach((branch,i)=>masks[i].setAttribute('d',envelope(branch.node,clamp((progress-branch.start)/branch.span),1)));
}

/** Snap to an actual surveyed tree branch, not a guessed screen coordinate. */
export function branchAttachment(scene:HTMLElement,kind:'projects'|'skills'){
 const target=kind==='projects'?{x:384,y:277}:{x:1137,y:320};
 const svg=scene.querySelector<SVGSVGElement>('[data-formation-art]')!,matrix=svg.getScreenCTM()!;
 let best=Infinity,point=target;
 scene.querySelectorAll<SVGPathElement>('[data-tree-guide]').forEach((path,i)=>{
  if(branchSpecs[i].side!==(kind==='projects'?'left':'right'))return;
  const length=path.getTotalLength();for(let j=0;j<=80;j++){const p=path.getPointAtLength(length*j/80),d=Math.hypot(target.x-p.x,target.y-p.y);if(d<best){best=d;point={x:p.x,y:p.y};}}
 });
 const screen=new DOMPoint(point.x,point.y).matrixTransform(matrix);
 return{x:screen.x,y:screen.y};
}
export {smooth};
