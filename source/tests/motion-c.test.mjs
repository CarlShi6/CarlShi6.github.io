import test from 'node:test';
import assert from 'node:assert/strict';
import {createGravityPath,transportCoordinate,transportProgress} from '../app/homepage-poc/dark-motion-c/paths.ts';

test('all eight curves start offscreen, pass through their object and end inside the horizon',()=>{
  for(let i=0;i<8;i++){
    const anchor={x:i<4?140:1300,y:140+i%4*180},center={x:720,y:412};
    const p=createGravityPath(i,anchor,1440,center,250);
    assert.ok(p.sample(0).position.x<0||p.sample(0).position.x>1440);
    assert.ok(p.sample(p.stop).position.distanceTo({x:anchor.x,y:anchor.y,z:0})<2);
    assert.ok(Math.hypot(p.sample(1).position.x-center.x,p.sample(1).position.y-center.y)<250);
    assert.ok(p.sample(p.stop).width>p.sample(.95).width);
    assert.ok(p.mergeAt>p.stop);
    assert.ok(p.sample(p.stop-.001).tangent.dot(p.sample(p.stop+.001).tangent)>.98,'capture and flow have matching tangents');
  }
});
test('pulse advances monotonically along arc length and accelerates inward',()=>{
  let previous=-1,previousStep=0;
  for(let i=0;i<=100;i++){
    const q=i/100,s=transportProgress(q);
    assert.ok(s>previous);assert.ok(Math.abs(transportCoordinate(s)-q)<1e-10);
    if(i>1)assert.ok(s-previous>=previousStep-1e-10);
    previousStep=s-previous;previous=s;
  }
});
test('neighbouring streams share their merge point and terminal tangent',()=>{
  const a=createGravityPath(0,{x:140,y:120},1440,{x:720,y:412},250);
  const b=createGravityPath(1,{x:120,y:350},1440,{x:720,y:412},250);
  assert.ok(a.sample(a.mergeAt).position.distanceTo(b.sample(b.mergeAt).position)<2);
  assert.ok(a.sample(1).tangent.dot(b.sample(1).tangent)>.999);
});
