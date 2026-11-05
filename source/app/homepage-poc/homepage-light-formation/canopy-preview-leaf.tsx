import {useId} from 'react';
import {foliage,LeafDefinitions} from '../light-home-v24-formation/artwork';

/** Exactly the same pigment, outline and veins as the living canopy. */
export function CanopyPreviewLeaf({gold}:{gold:boolean}){
 const id=useId().replace(/:/g,'');
 return <svg viewBox="-22 -48 44 54" width="100%" height="100%" aria-hidden="true" data-canopy-preview-leaf>
  <LeafDefinitions id={id}/><use href={`#${id}-leaf-${gold?'gold':'blue'}`}/>
 </svg>;
}

export function selectCanopyLeaf(scene:HTMLElement,kind:'projects'|'skills'){
 const target=kind==='projects'?{x:355,y:295}:{x:1159,y:232};
 const art=scene.querySelector<SVGSVGElement>('[data-formation-art]')!;
 const targetScreen=new DOMPoint(target.x,target.y).matrixTransform(art.getScreenCTM()!);
 const rig=scene.querySelector('[data-foliage-rig]');
 if(rig){
  const candidates=Array.from(rig.querySelectorAll<SVGGElement>('[data-leaf-carrier]')).filter(carrier=>{
   const matrix=carrier.querySelector<SVGGElement>('[data-leaf-blade]')!.transform.baseVal.consolidate()?.matrix;
   return carrier.dataset.foliageSide===kind&&carrier.dataset.grown==='true'&&!!matrix&&Math.hypot(matrix.a,matrix.b)>.3;
  });
  const distance=(node:SVGGElement)=>{const p=new DOMPoint(0,0).matrixTransform(node.getScreenCTM()!);return Math.hypot(p.x-targetScreen.x,p.y-targetScreen.y);};
  const leaf=candidates.sort((a,b)=>distance(a)-distance(b))[0];if(!leaf)return null;
  const matrix=leaf.querySelector<SVGGElement>('[data-leaf-blade]')!.getScreenCTM()!,stem=new DOMPoint(0,0).matrixTransform(matrix),branch=new DOMPoint(0,0).matrixTransform(leaf.getScreenCTM()!);
  return{index:leaf.dataset.leafCarrier!,x:stem.x,y:stem.y,anchorX:branch.x,anchorY:branch.y,scale:Math.hypot(matrix.a,matrix.b),angle:Math.atan2(matrix.b,matrix.a)*180/Math.PI,gold:leaf.dataset.gold==='true'};
 }
 const candidates=Array.from(scene.querySelectorAll<SVGGElement>('[data-leaf-carrier]')).filter(carrier=>{
  const i=Number(carrier.dataset.leafCarrier),unfold=carrier.querySelector<SVGGElement>('[data-leaf-unfold]')!;
  const m=unfold.transform.baseVal.consolidate()?.matrix;
  return (foliage[i].fork<20)===(kind==='projects')&&(!m||Math.hypot(m.a,m.b)>.8);
 });
 const leaf=candidates.sort((a,b)=>{
  const distance=(n:SVGGElement)=>{const r=n.getBoundingClientRect();return Math.hypot(r.x+r.width/2-targetScreen.x,r.y+r.height/2-targetScreen.y);};
  return distance(a)-distance(b);
 })[0];
 if(!leaf)return null;
 const index=Number(leaf.dataset.leafCarrier),blade=leaf.querySelector<SVGGElement>('[data-leaf-blade]')!;
 const matrix=blade.getScreenCTM()!,stem=new DOMPoint(0,0).matrixTransform(matrix);
 const branch=new DOMPoint(0,0).matrixTransform(leaf.getScreenCTM()!);
 return {index,x:stem.x,y:stem.y,anchorX:branch.x,anchorY:branch.y,scale:Math.hypot(matrix.a,matrix.b),angle:Math.atan2(matrix.b,matrix.a)*180/Math.PI,gold:foliage[index].gold};
}
