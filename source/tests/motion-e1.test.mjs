import test from 'node:test';
import assert from 'node:assert/strict';
import {ambientDefaults,ambientPose,ambientRanges,representativeAmbientObjects} from '../app/homepage-poc/dark-motion-e1/model.ts';

test('E.1 representative ambient controls stay inside restrained desktop ranges',()=>{
  assert.deepEqual(representativeAmbientObjects,[0,4]);
  assert.ok(ambientDefaults.driftAmplitude>=4&&ambientDefaults.driftAmplitude<=8);
  for(const [key,value] of Object.entries(ambientDefaults)){
    const [min,max]=ambientRanges[key];assert.ok(value>=min&&value<=max,`${key} default is outside its Inspector range`);
  }
});

test('planet and satellite drift are curved, bounded and unsynchronized',()=>{
  const planet=[],satellite=[];
  for(let time=0;time<=40;time+=.25){planet.push(ambientPose(0,time,ambientDefaults));satellite.push(ambientPose(4,time,ambientDefaults));}
  for(const poses of [planet,satellite])for(const pose of poses){
    assert.ok(Math.abs(pose.x)<=ambientDefaults.driftAmplitude*1.1);
    assert.ok(Math.abs(pose.y)<=ambientDefaults.driftAmplitude*.75);
  }
  assert.notDeepEqual(planet.map(p=>p.x),satellite.map(p=>p.x));
  assert.ok(planet.some((p,i)=>i&&Math.sign(p.x)!==Math.sign(planet[i-1].x)));
  assert.ok(planet.some((p,i)=>i&&Math.sign(p.y)!==Math.sign(planet[i-1].y)));
});

test('planet surface phase advances independently while satellite surface stays fixed',()=>{
  assert.ok(ambientPose(0,20,ambientDefaults).surface>ambientPose(0,10,ambientDefaults).surface);
  assert.equal(ambientPose(4,20,ambientDefaults).surface,0);
  assert.notEqual(ambientPose(0,10,ambientDefaults).orientation,ambientPose(4,10,ambientDefaults).orientation);
});

test('each ambient Inspector parameter changes the property it owns',()=>{
  const at=11.5,base=ambientPose(0,at,ambientDefaults);
  assert.notDeepEqual(ambientPose(0,at,{...ambientDefaults,driftAmplitude:8}),base);
  assert.notDeepEqual(ambientPose(0,at,{...ambientDefaults,driftPeriod:9}),base);
  assert.notEqual(ambientPose(0,at,{...ambientDefaults,surfaceRotationSpeed:1}).surface,base.surface);
  assert.notEqual(ambientPose(0,at,{...ambientDefaults,orientationVariation:6}).orientation,base.orientation);
});
