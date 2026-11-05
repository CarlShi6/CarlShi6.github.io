import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,materialDefaults,schedule,settingsExport,arrivalOrder} from '../app/homepage-poc/dark-motion-e/model.ts';
import {schedule as pairSchedule} from '../app/homepage-poc/dark-motion-d/model.ts';
import {withCaptureApproach as pairPath} from '../app/homepage-poc/dark-motion-d/paths.ts';
import {withCaptureApproach} from '../app/homepage-poc/dark-motion-e/paths.ts';
import {createGravityPath} from '../app/homepage-poc/dark-motion-c/paths.ts';

test('E uses the latest approved timing and literal material overrides',()=>{
  assert.deepEqual(defaults,{birthDuration:1.45,accretionDuration:1.41,flowEntryDuration:2.27,captureDuration:3.25,arrivalStagger:.44,pullStrength:1.7,orbitalDrift:2.21});
  assert.deepEqual(materialDefaults,{radius:.89,formation:.53,rotation:.3,flow:.35,intensity:1});
  const exported=JSON.parse(settingsExport(defaults,materialDefaults));
  assert.deepEqual(exported.timing,defaults);assert.deepEqual(exported.material,materialDefaults);
  assert.equal(exported.scope,'all-eight');assert.equal(exported.objects.length,8);
});
test('E keeps representative choreography and gives every object a unique light-first arrival',()=>{
  for(const arrivalStagger of [.15,.44,1.2])for(const flowEntryDuration of [.6,2.27,3.5]){
    const settings={...defaults,arrivalStagger,flowEntryDuration},p=schedule(settings);
    assert.deepEqual(p.captures.slice(0,2),pairSchedule(settings).captures);
    assert.equal(new Set(p.captures.map(c=>c.index)).size,8);
    for(const [rank,c] of p.captures.entries()){
      assert.ok(c.start>p.flowStart+rank*.08+flowEntryDuration);
      if(rank)assert.ok(c.start>p.captures[rank-1].start);
      assert.ok(c.start+c.duration<p.end);
    }
  }
});
test('all eight curves start offscreen, meet their anchor smoothly, and retain the exact pair paths',()=>{
  for(const i of arrivalOrder){
    const anchor={x:i<4?130:1310,y:140+(i%4)*180};
    const make=()=>createGravityPath(i,anchor,1440,{x:720,y:412},225);
    const path=withCaptureApproach(make(),1440);
    assert.ok(path.sample(0).position.x<0||path.sample(0).position.x>1440);
    assert.ok(path.sample(path.stop).position.distanceTo({x:anchor.x,y:anchor.y,z:0})<2);
    assert.ok(path.sample(path.stop-.001).tangent.dot(path.sample(path.stop+.001).tangent)>.98);
    if(i===0||i===4){const approved=pairPath(make(),1440);for(const s of [0,.1,.3,.5,.8,1])assert.ok(path.sample(s).position.distanceTo(approved.sample(s).position)<1e-8);}
  }
});
