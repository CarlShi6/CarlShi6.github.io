import { BufferGeometry, CubicBezierCurve3, CurvePath, Float32BufferAttribute, Vector3 } from "three";

export type Point={x:number;y:number};
export type GravityPath=ReturnType<typeof createGravityPath>;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export function transportCoordinate(s:number){return Math.log1p(3*clamp(s))/Math.log(4);}
export function transportProgress(q:number){return Math.expm1(clamp(q)*Math.log(4))/3;}

export function createGravityPath(index:number,anchor:Point,width:number,center:Point,radius:number){
  const side=index<4?-1:1,slot=index%4,pair=Math.floor(slot/2);
  const v=(p:Point)=>new Vector3(p.x,p.y,0);
  const outside={x:side<0?-260:width+260,y:anchor.y+(slot<2?-160:150)};
  const curve=new CurvePath<Vector3>();
  const capture=new CubicBezierCurve3(v(outside),v({x:outside.x-side*150,y:outside.y+(slot%2?100:-55)}),v({x:anchor.x+side*115,y:anchor.y+(slot<2?-65:65)}),v(anchor));
  capture.arcLengthDivisions=120;curve.add(capture);
  const angle=side<0?(pair===0?-2.70:2.95):(pair===0?-.20:.55);
  const polar=(a:number,r:number)=>({x:center.x+Math.cos(a)*r,y:center.y+Math.sin(a)*r});
  const merge=polar(angle,radius*1.10);
  const tangent={x:-Math.sin(angle),y:Math.cos(angle)};
  const bend=slot<2?-1:1;
  // Continue the capture segment's tangent at the object (C1 continuity).
  const approach=new CubicBezierCurve3(v(anchor),v({x:anchor.x-side*180,y:anchor.y-bend*(180*65/115)}),v({x:merge.x-tangent.x*radius*.65,y:merge.y-tangent.y*radius*.65}),v(merge));
  approach.arcLengthDivisions=180;curve.add(approach);
  const mergeLength=capture.getLength()+approach.getLength();
  // Neighbouring pairs share precisely the same tail: not two approximate
  // decorative connectors. The end enters behind the occulting horizon.
  for(let j=0;j<3;j++){
    const a0=angle+j*.50,a1=a0+.50,r0=radius*(1.10-j*.041),r1=radius*(1.10-(j+1)*.041);
    const p0=polar(a0,r0),p1=polar(a1,r1),arm=radius*.166;
    curve.add(new CubicBezierCurve3(v(p0),v({x:p0.x-Math.sin(a0)*arm,y:p0.y+Math.cos(a0)*arm}),v({x:p1.x+Math.sin(a1)*arm,y:p1.y-Math.cos(a1)*arm}),v(p1)));
  }
  curve.arcLengthDivisions=800;curve.updateArcLengths();
  const length=curve.getLength(),stop=capture.getLength()/length,mergeAt=mergeLength/length;
  function sample(s:number){
    const u=clamp(s),position=curve.getPointAt(u),tangent=curve.getTangentAt(u).normalize();
    const before=curve.getTangentAt(Math.max(0,u-.002)),after=curve.getTangentAt(Math.min(1,u+.002));
    const curvature=before.distanceTo(after)/Math.max(.004*length,.001);
    const narrowing=clamp((u-stop)/(1-stop));
    const localWidth=(8+64*Math.pow(1-narrowing,1.4))*(.93+index%3*.06);
    return {position,tangent,width:localWidth,curvature,progress:u};
  }
  return {index,curve,length,stop,mergeAt,anchor,speed:.085+(index%4)*.009+(index>=4?.006:0),sample};
}

export function ribbonGeometry(path:GravityPath,segments=220,cross=12){
  const positions:number[]=[],uvs:number[]=[],bends:number[]=[],indices:number[]=[];
  for(let i=0;i<=segments;i++){
    const s=i/segments,p=path.sample(s);
    for(let j=0;j<=cross;j++){
      const offset=(j/cross*2-1)*p.width;
      positions.push(p.position.x-p.tangent.y*offset,p.position.y+p.tangent.x*offset,0);
      uvs.push(s,j/cross);bends.push(Math.min(1,p.curvature*80));
      if(i<segments&&j<cross){const a=i*(cross+1)+j,b=a+cross+1;indices.push(a,b,a+1,b,b+1,a+1);}
    }
  }
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new Float32BufferAttribute(uvs,2));geometry.setAttribute('bend',new Float32BufferAttribute(bends,1));geometry.setIndex(indices);return geometry;
}
