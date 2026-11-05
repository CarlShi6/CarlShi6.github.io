import assert from 'node:assert/strict';
import test from 'node:test';
import {mainFlow,secondaryFlows,captureWakes} from '../app/homepage-poc/dark-reference-flow/flow-paths.ts';

const layouts=[[1672,863],[1440,822],[768,946],[390,774],[320,650]].map(([w,h])=>({w,h,mobile:w<700,cx:w*.503,cy:h*(w<700?.52:.49),radius:Math.min(w*(w<700?.32:.132),h*.275),anchors:w<700?[[.28,.17],[.82,.29],[.78,.84]]:[[.178,.25],[.837,.395],[.887,.714]]}));

test('incoming light continues into the accretion rim without position or tangent seams',()=>{
 for(const layout of layouts)for(let i=0;i<4;i++){
  const path=mainFlow(i,layout),segments=path.curve.curves;
  for(let n=0;n<segments.length-1;n++){
   assert.ok(segments[n].getPoint(1).distanceTo(segments[n+1].getPoint(0))<1e-6);
   assert.ok(segments[n].getTangent(1).dot(segments[n+1].getTangent(0))>.999,'Connected light must not kink at a segment boundary');
  }
  const end=path.curve.getPointAt(1);
  assert.ok(Math.abs(Math.hypot(end.x-layout.cx,end.y-layout.cy)/layout.radius-.98)<1e-6);
 }
});

test('two detached wakes remain inside the viewport and the planet fork starts on its parent flow',()=>{
 for(const layout of layouts){
  const main=[0,1,2,3].map(i=>mainFlow(i,layout)),secondary=secondaryFlows(main,layout);
  assert.equal(secondary.filter(p=>p.kind==='free').length,2);
  for(const path of secondary.filter(p=>p.kind==='free')){
   assert.equal(path.owner,-1);
   for(let n=0;n<=100;n++){
    const p=path.curve.getPointAt(n/100);
    assert.ok(p.x>0&&p.x<layout.w&&p.y>0&&p.y<layout.h,'Detached light should fade within the scene');
   }
  }
  const fork=secondary.find(p=>p.kind==='branch');
  assert.equal(fork.owner,main[3].owner);
  assert.ok(fork.source.distanceTo(main[3].curve.getPointAt(fork.sourceProgress))<1e-6);
 }
});


test('capture wakes attach to the correct moving groups and trail outward',()=>{
 for(const layout of layouts){
  const main=[0,1,2,3].map(i=>mainFlow(i,layout)),wakes=captureWakes(main,layout);
  assert.deepEqual(wakes.map(w=>w.owner),[0,1]);
  for(const wake of wakes){
   assert.equal(wake.kind,'wake');
   assert.ok(wake.curve.getPointAt(0).distanceTo(main[wake.owner].anchor)<1e-6);
   const start=wake.curve.getPointAt(0),end=wake.curve.getPointAt(1);
   assert.ok(wake.owner===0?end.x<start.x:end.x>start.x);
   for(let i=0;i<=100;i++){
    const point=wake.curve.getPointAt(i/100);
    assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y));
   }
  }
 }
});
