import { CubicBezierCurve3, Vector3 } from 'three';
import type { GravityPath } from '../dark-motion-c/paths';

// Preserve the approved D paths for slots 0/4 exactly. Extend their side-entry
// capture to the other slots with mirrored lower approaches and matched tangents.
export function withCaptureApproach(base:GravityPath,viewportWidth:number):GravityPath{
  const left=base.index<4,side=left?-1:1,anchor=base.anchor,slot=base.index%4;
  const outsideY=[165,120,-130,-90][slot],controlY=[190,145,-155,-110][slot];
  const curve=base.curve;
  const capture=new CubicBezierCurve3(
    new Vector3(left?-150:viewportWidth+150,anchor.y+outsideY,0),
    new Vector3(left?0:viewportWidth,anchor.y+controlY,0),
    new Vector3(anchor.x+side*115,anchor.y+(slot<2?-65:65),0),
    new Vector3(anchor.x,anchor.y,0),
  );
  capture.arcLengthDivisions=180;curve.curves[0]=capture;curve.updateArcLengths();
  const length=curve.getLength(),stop=capture.getLength()/length;
  const mergeAt=(capture.getLength()+curve.curves[1].getLength())/length;
  return {...base,length,stop,mergeAt,sample(s:number){
    const u=Math.max(0,Math.min(1,s)),position=curve.getPointAt(u),tangent=curve.getTangentAt(u).normalize();
    const curvature=curve.getTangentAt(Math.max(0,u-.002)).distanceTo(curve.getTangentAt(Math.min(1,u+.002)))/(.004*length);
    const narrowing=Math.max(0,Math.min(1,(u-stop)/(1-stop)));
    const width=(8+64*Math.pow(1-narrowing,1.4))*(.93+base.index%3*.06);
    return {position,tangent,curvature,width,progress:u};
  }};
}
