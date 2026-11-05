import {branchMatrices,leafPose,leafProgress,clamp,type Branch,type Attachment} from '../light-foliage-attachment-study/model';
import {envelope,smooth} from '../light-home-v22/growth-model';
import type {FoliageDriver} from '../light-home-v24-formation/motion';

/** Render adapter driven by the existing entrance/transition clock. No extra ticker. */
export function createAttachedFoliage(root:HTMLElement,branches:Branch[],leaves:Attachment[]):FoliageDriver{
 const rig=root.querySelector<SVGSVGElement>('[data-foliage-rig]')!;
 const branchViews=branches.map(branch=>{const group=rig.querySelector<SVGGElement>(`[data-rig-branch="${branch.id}"]`)!;return{branch,group,mask:group.querySelector('[data-rig-envelope]')!,progress:-1};});
 const leafViews=leaves.map(leaf=>{const group=rig.querySelector<SVGGElement>(`[data-attached-leaf="${leaf.id}"]`)!;return{leaf,branch:branches.find(b=>b.id===leaf.parentBranchId)!,group,growth:group.querySelector('[data-leaf-growth]')!,stem:group.querySelector('[data-petiole]')!,blade:group.querySelector<SVGGElement>('[data-leaf-blade]')!};});
 const overlay=root.querySelector<SVGSVGElement>('[data-falling-layer]')!;
 const slots=Array.from(overlay.querySelectorAll<SVGGElement>('[data-falling-leaf]'));
 let time=0,ambientTime=0,emitted=0,completedFalls=0,nextFall=.8,pending=0;
 let progress:number[]=[];
 const regrowth=new Map<number,number>();
 type Fall={slot:number;source:number;start:number;life:number;x:number;y:number;size:number};
 const falls:Fall[]=[];
 function render(nextTime:number){
  time=nextTime;
  const matrices=branchMatrices(branches,ambientTime,1,'both');
  for(const view of branchViews){
   view.group.setAttribute('transform',`matrix(${matrices.get(view.branch.id)!.join(' ')})`);
   const p=clamp((time-view.branch.start)/view.branch.span);
   if(view.progress!==p){view.mask.setAttribute('d',envelope(view.branch,p,1));view.progress=p;}
  }
  progress=leafViews.map((view,i)=>{
   const p=leafProgress(view.leaf,view.branch,time),pose=leafPose(view.leaf,view.branch,p,ambientTime,1);
   const born=regrowth.get(i),regrow=born===undefined?1:smooth((ambientTime-born-1.5)/3.3);
   if(regrow>=1)regrowth.delete(i);
   view.group.setAttribute('transform',`translate(${pose.anchor.x} ${pose.anchor.y})`);
   view.group.dataset.grown=String(p>0);view.growth.setAttribute('visibility',p>0?'visible':'hidden');
   view.stem.setAttribute('d',`M0 0 Q${pose.end.x*.45} ${pose.end.y*.65} ${pose.end.x} ${pose.end.y}`);
   // Preview owns opacity while enlarged; keeping its source transform intact
   // lets it return to the same branch after dismissal.
   view.blade.setAttribute('transform',`translate(${pose.end.x} ${pose.end.y}) rotate(${pose.angle+90}) scale(${view.leaf.size*pose.blade*regrow})`);
   return p*regrow;
  });
  // Optional DOM attachment consumers share this clock; no second ambient ticker.
  root.dispatchEvent(new Event('portfolio:foliage-frame'));
 }
 function reset(){
  ambientTime=0;emitted=0;completedFalls=0;nextFall=.8;pending=0;falls.length=0;regrowth.clear();
  overlay.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);slots.forEach(n=>n.setAttribute('visibility','hidden'));
 }
 function tick(delta:number){
  pending+=Math.min(delta/1000,.05);
  // Watercolor sway needs no high-frequency diagnostic or geometry updates.
  if(pending<(innerWidth<600?1/20:1/30))return;
  ambientTime+=pending;pending=0;render(time);
  if(ambientTime>=nextFall&&falls.length<(innerWidth<600?5:10)){
   const source=(emitted*47+19)%leafViews.length,view=leafViews[source];
   nextFall=ambientTime+(innerWidth<600?2:1.25);emitted++;
   if(view.group.dataset.previewLeaf!=='true'&&!regrowth.has(source)){
    const matrix=view.blade.getScreenCTM()!;const point=new DOMPoint(0,0).matrixTransform(matrix);
    const slot=slots.findIndex((_,i)=>!falls.some(f=>f.slot===i));
    if(slot>=0){
     const use=slots[slot].querySelector('use')!;
     use.setAttribute('href',use.getAttribute('href')!.replace(/(blue|gold)$/,view.leaf.gold?'gold':'blue'));
     falls.push({slot,source,start:ambientTime,life:8+emitted%4,x:point.x,y:point.y,size:Math.hypot(matrix.a,matrix.b)});
     regrowth.set(source,ambientTime);
    }
   }
  }
  for(let i=falls.length-1;i>=0;i--){
   const f=falls[i],p=(ambientTime-f.start)/f.life,node=slots[f.slot];
   if(p>=1){node.setAttribute('visibility','hidden');falls.splice(i,1);completedFalls++;continue;}
   const x=f.x+Math.sin(p*7+f.source)*34*p+(f.source%2?1:-1)*p*62;
   const y=f.y+(innerHeight+65-f.y)*Math.pow(p,.86),angle=Math.sin(p*11+f.source)*43+p*(f.source%2?100:-90);
   node.setAttribute('visibility','visible');node.setAttribute('transform',`translate(${x} ${y}) rotate(${angle}) scale(${f.size*(.45+.55*Math.abs(Math.cos(p*7)))} ${f.size})`);
  }
 }
 reset();render(0);
 return{render,reset,tick,snapshot:()=>({ambientTime,emitted,completedFalls,fallCount:falls.length,leafProgress:progress})};
}
