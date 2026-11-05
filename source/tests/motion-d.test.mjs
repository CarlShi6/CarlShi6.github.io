import test from 'node:test';
import assert from 'node:assert/strict';
import {captureResponse,responseVelocity,defaults,schedule,settingsExport} from '../app/homepage-poc/dark-motion-d/model.ts';
import {withCaptureApproach} from '../app/homepage-poc/dark-motion-d/paths.ts';
import {createGravityPath} from '../app/homepage-poc/dark-motion-c/paths.ts';

test('capture accelerates, overshoots once, and reaches an exact stationary anchor',()=>{
  for(const strength of [.4,1,2]){
    assert.equal(captureResponse(0,strength),0);assert.equal(captureResponse(1,strength),1);
    assert.ok(responseVelocity(.08,strength)>responseVelocity(.01,strength));
    const samples=Array.from({length:101},(_,i)=>captureResponse(i/100,strength));
    assert.ok(Math.max(...samples)>1.02);assert.ok(Math.max(...samples)<1.16);
    assert.ok(responseVelocity(1,strength)<.001);
  }
});
test('light is at both representative anchors before capture at all timing extremes',()=>{
  for(const flowEntryDuration of [.6,1.4,3.5])for(const arrivalStagger of [.15,.45,1.2]){
    const p=schedule({...defaults,flowEntryDuration,arrivalStagger});
    assert.ok(p.captures[0].start>p.flowStart+flowEntryDuration);
    assert.ok(p.captures[1].start>p.flowStart+.08+flowEntryDuration);
    assert.ok(p.captures[1].start>p.captures[0].start);
    assert.notEqual(p.captures[0].duration,p.captures[1].duration);
    assert.ok(p.end>Math.max(...p.captures.map(c=>c.start+c.duration)));
  }
});
test('settings export preserves timing and material values and honestly identifies pair scope',()=>{
  const settings={...defaults,captureDuration:3.1,orbitalDrift:2};
  const saved=JSON.parse(settingsExport(settings,{flow:.8,intensity:.9}));
  assert.deepEqual(saved.timing,settings);assert.equal(saved.material.flow,.8);
  assert.deepEqual(saved.objects,[0,4]);assert.equal(saved.scope,'representative-pair');
});
test('representative approaches are offscreen, curved, tangent-continuous and keep the final anchors',()=>{
  for(const i of [0,4]){
    const anchor={x:i===0?115:1320,y:140};
    const path=withCaptureApproach(createGravityPath(i,anchor,1440,{x:720,y:412},250),1440);
    assert.ok(path.sample(0).position.x<0||path.sample(0).position.x>1440);
    assert.ok(path.sample(path.stop).position.distanceTo({x:anchor.x,y:anchor.y,z:0})<2);
    assert.ok(path.sample(path.stop-.001).tangent.dot(path.sample(path.stop+.001).tangent)>.98);
    assert.ok(path.sample(path.stop*.4).curvature>0);
  }
});
