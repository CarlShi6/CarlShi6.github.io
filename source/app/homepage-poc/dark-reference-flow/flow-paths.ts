import {CubicBezierCurve3,CurvePath,Vector3} from 'three';

type Layout={w:number;h:number;cx:number;cy:number;radius:number;mobile:boolean;anchors:number[][]};
export type FlowPath=ReturnType<typeof mainFlow>;

// Every segment is in CSS pixels, with Y pointing down. The approach and
// spiral share an analytic tangent, rather than overlapping separate curves.
export function mainFlow(i:number,l:Layout){
 const owner=i===3?0:i,{w,h,cx,cy,radius:r,mobile}=l,[ax,ay]=l.anchors[owner];
 const anchor=new Vector3(ax*w,ay*h,0),unit=mobile?w/1000*1.2:Math.min(w/1672,h/863);
 const body=(owner===0?101:owner===2?62:30)*unit;
 const p=(x:number,y:number)=>new Vector3(x*w,y*h,0);
 const local=(x:number,y:number)=>anchor.clone().add(new Vector3(x*body,y*body,0));
 const angle=[-Math.PI/2,-.14,Math.PI/2,Math.PI][i];
 const entryRadius=1.025*r;
 const join=new Vector3(cx+Math.cos(angle)*entryRadius,cy+Math.sin(angle)*entryRadius,0);
 const tangent=new Vector3(-Math.sin(angle),Math.cos(angle),0);
 const curve=new CurvePath<Vector3>();
 const source=i===0?local(-.15,-.55):i===3?local(.3,.45):i===1?local(.18,.25):local(.15,.25);
 const crest=mobile?
  [p(.44,.26),p(.82,.37),p(.64,.79),p(.18,.34)][i]:
  [p(.294,.145),p(.745,.323),p(.767,.627),p(.263,.486)][i];
 const first=mobile?
  [local(1.1,-.15),local(-.65,.2),local(-.9,-.2),local(.1,1.15)][i]:
  [local(.9,-1.05),local(-.8,-.35),local(-1.1,-.3),local(.6,1.2)][i];
 const crestTangent=join.clone().sub(source).normalize();
 const outerLength=source.distanceTo(crest);
 curve.add(new CubicBezierCurve3(source,first,crest.clone().addScaledVector(crestTangent,-outerLength*.28),crest));
 curve.add(new CubicBezierCurve3(crest,crest.clone().addScaledVector(crestTangent,outerLength*.26),join.clone().addScaledVector(tangent,-r*.48),join));
 // Radius contracts gradually only AFTER entering the circular rim. This
 // preserves the visible streamline from the object all the way into the disk.
 const approachLength=curve.getLength();
 const sweep=4.6,steps=14,dr=(.98-1.025)*r/sweep;
 const at=(a:number)=>new Vector3(cx+Math.cos(a)*(entryRadius+dr*(a-angle)),cy+Math.sin(a)*(entryRadius+dr*(a-angle)),0);
 const derivative=(a:number)=>{const rr=entryRadius+dr*(a-angle);return new Vector3(dr*Math.cos(a)-rr*Math.sin(a),dr*Math.sin(a)+rr*Math.cos(a),0);};
 for(let n=0;n<steps;n++){
  const a=angle+sweep*n/steps,b=angle+sweep*(n+1)/steps,step=(b-a)/3;
  const start=at(a),end=at(b);
  const incoming=n===0?tangent.clone().multiplyScalar(entryRadius):derivative(a);
  curve.add(new CubicBezierCurve3(start,start.clone().addScaledVector(incoming,step),end.clone().addScaledVector(derivative(b),-step),end));
 }
 curve.updateArcLengths();
 return {curve,anchor,owner,source,join,joinTangent:tangent,kind:'main' as 'main'|'free'|'branch'|'wake',sourceProgress:0,joinProgress:approachLength/curve.getLength()};
}

export function secondaryFlows(main:FlowPath[],l:Layout):FlowPath[]{
 const {w,h,cx,cy,radius:r,mobile}=l;
 const p=(x:number,y:number)=>new Vector3(x*w,y*h,0);
 const orbit=(a:number,k:number)=>new Vector3(cx+Math.cos(a)*r*k,cy+Math.sin(a)*r*k,0);
 const loose=(points:Vector3[],parent:FlowPath|null,sourceProgress=0):FlowPath=>{
  const curve=new CurvePath<Vector3>();curve.add(new CubicBezierCurve3(points[0],points[1],points[2],points[3]));curve.updateArcLengths();
  return {curve,source:points[0],anchor:parent?.anchor??points[0],owner:parent?.owner??-1,join:points[3],joinTangent:new Vector3(),kind:parent?'branch':'free',sourceProgress,joinProgress:1};
 };
 return [
  // Two short detached wakes: both ends stay inside the composition and fade.
  loose([orbit(.58,1.32),orbit(.96,1.64),orbit(1.84,1.62),orbit(2.14,1.35)],null),
  loose(mobile?[p(.12,.33),p(.12,.27),p(.36,.22),p(.48,.25)]:[p(.20,.53),p(.10,.62),p(.075,.70),p(.13,.72)],null),
  // A fork peels away from the existing lower-left stream; its root uses
  // exactly the parent's deformation at that arc coordinate.
  loose([main[3].curve.getPointAt(.24),mobile?p(.08,.39):p(.19,.59),mobile?p(.09,.48):p(.09,.65),mobile?p(.16,.5):p(.045,.69)],main[3],.24),
 ];
}

// Inward-moving wakes describe the history BEHIND each captured group. They
// are independent from the object-to-hole paths but share the parent's pose.
export function captureWakes(main:FlowPath[],l:Layout):FlowPath[]{
 const {w,h,mobile}=l,p=(x:number,y:number)=>new Vector3(x*w,y*h,0);
 return [0,1].map(owner=>{
  const parent=main[owner],source=parent.anchor.clone();
  const controls=owner===0?
   (mobile?[source,p(.12,.20),p(.025,.25),p(-.05,.30)]:[source,p(.10,.265),p(.015,.33),p(-.08,.44)]):
   (mobile?[source,p(.91,.30),p(.97,.34),p(1.07,.40)]:[source,p(.91,.40),p(.965,.47),p(1.07,.53)]);
  const curve=new CurvePath<Vector3>();curve.add(new CubicBezierCurve3(...controls as [Vector3,Vector3,Vector3,Vector3]));curve.updateArcLengths();
  return {curve,anchor:parent.anchor,owner,source,join:controls[3],joinTangent:new Vector3(),kind:'wake',sourceProgress:0,joinProgress:1};
 });
}
