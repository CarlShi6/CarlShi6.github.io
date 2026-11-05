import {growthBranches} from '../homepage-rc4/growth-geometry';

export type Point={x:number;y:number};
export type Matrix=[number,number,number,number,number,number];
export type Settings={duration:number;speed:number;trunk:number;delay:number;thickness:number;leafTiming:number;side:'left'|'both'};
export const defaults:Settings={duration:4.2,speed:1,trunk:1,delay:.025,thickness:1,leafTiming:.16,side:'both'};
// Split every pen lift. One node must describe one connected botanical branch.
export const branchSpecs=growthBranches.flatMap(([d,width],source)=>(d.match(/M[^M]+/g)??[]).map((path,part)=>({id:`${source}-${part}`,source,side:source<20?'left':'right',d:path.trim(),width:width+7,root:source===0||source===20})));
export type Node={index:number;points:Point[];length:number;parent:number|null;attach:number;anchor:Point;gap:number;depth:number;start:number;span:number};
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const smooth=(n:number)=>{const p=clamp(n);return p*p*(3-2*p);};
export const identity=():Matrix=>[1,0,0,1,0,0];
export const point=(m:Matrix,p:Point):Point=>({x:m[0]*p.x+m[2]*p.y+m[4],y:m[1]*p.x+m[3]*p.y+m[5]});
export function multiply(a:Matrix,b:Matrix):Matrix{return [a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];}
export function rotation(p:Point,angle:number):Matrix{const c=Math.cos(angle),s=Math.sin(angle);return[c,s,-s,c,p.x-c*p.x+s*p.y,p.y-s*p.x-c*p.y];}
export function nearest(points:Point[],target:Point){let distance=Infinity,index=0;points.forEach((p,i)=>{const d=Math.hypot(p.x-target.x,p.y-target.y);if(d<distance){distance=d;index=i;}});return{distance,fraction:index/(points.length-1),point:points[index]};}

/** Rooted minimum-distance attachment graph, sampled once on the original traced paths.
 * Unlike time-based staggering, each node has one physical parent and an arc-length joint. */
export function connect(samples:Point[][]):Node[]{
 const result:Node[]=[];
 for(const side of ['left','right']){
  const remaining=new Set(branchSpecs.map((b,i)=>b.side===side?i:-1).filter(i=>i>=0));
  const root=[...remaining].find(i=>branchSpecs[i].root)!;
  const make=(index:number,parent:Node|null,attach=0,anchor=samples[index][0],gap=0):Node=>({index,points:samples[index],length:samples[index].slice(1).reduce((s,p,i)=>s+Math.hypot(p.x-samples[index][i].x,p.y-samples[index][i].y),0),parent:parent?.index??null,attach,anchor,gap,depth:parent?parent.depth+1:0,start:0,span:0});
  result.push(make(root,null));remaining.delete(root);
  while(remaining.size){
   let best:{index:number;parent:Node;fraction:number;point:Point;distance:number}|undefined;
   for(const index of remaining)for(const parent of result.filter(n=>branchSpecs[n.index].side===side)){
    const hit=nearest(parent.points,samples[index][0]);
    if(!best||hit.distance<best.distance)best={index,parent,...hit};
   }
   if(!best)throw Error('Disconnected tree graph');
   result.push(make(best.index,best.parent,best.fraction,best.point,best.distance));remaining.delete(best.index);
  }
 }
 return result;
}
export type Binding={node:number;at:number;distance:number};
export function bind(nodes:Node[],targets:Point[],leftCount:number):Binding[]{return targets.map((target,i)=>{
 const side=i<leftCount?'left':'right';let best:Binding={node:0,at:0,distance:Infinity};
 for(const node of nodes.filter(n=>branchSpecs[n.index].side===side)){const hit=nearest(node.points,target);if(hit.distance<best.distance)best={node:node.index,at:hit.fraction,distance:hit.distance};}
 return best;
});}
export function schedule(nodes:Node[],leaves:Binding[],settings:Settings){
 const byId=new Map<number,Node>();
 for(const node of nodes){
  const parent=node.parent===null?null:byId.get(node.parent)!;
  node.start=parent?parent.start+parent.span*node.attach+settings.delay:0;
  node.span=(.17+node.length/270)*(node.depth===0?settings.trunk:1);
  byId.set(node.index,node);
 }
 const leafTimes=leaves.map((leaf,i)=>{const n=byId.get(leaf.node)!;return {start:n.start+n.span*leaf.at+settings.leafTiming+(i*17%11)*.009,span:.3+(i*7%5)*.035};});
 const extent=Math.max(...nodes.map(n=>n.start+n.span+.12),...leafTimes.map(l=>l.start+l.span));
 const scale=(settings.duration-1.65)/extent;
 for(const node of nodes){node.start=.9+node.start*scale;node.span*=scale;}
 return leafTimes.map(l=>({start:.9+l.start*scale,span:l.span*scale}));
}
/** A continuous tapered growth envelope. No opacity animation and no full-artwork switch. */
export function envelope(node:Node,p:number,thickness:number):string{
 if(p<=0)return 'M0 0';
 const pts=node.points,front=p*(pts.length-1),last=Math.floor(front);
 const samples=pts.slice(0,last+1);
 if(last<pts.length-1){const a=pts[last],b=pts[last+1],f=front-last;samples.push({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f});}
 // Add the parent's attachment before the child's surveyed start (usually < 5 px).
 if(node.parent!==null)samples.unshift(node.anchor);
 if(samples.length<2)return 'M0 0';
 const sides:Point[][]=[[],[]];
 samples.forEach((v,i)=>{const before=samples[Math.max(0,i-1)],after=samples[Math.min(samples.length-1,i+1)];const dx=after.x-before.x,dy=after.y-before.y,l=Math.hypot(dx,dy)||1;
  const u=i/(samples.length-1)*p;
  const age=clamp((p-u)/.22);
  const mature=smooth((p-.68)/.32);
  const young=(.08+.92*smooth(age))*Math.pow(p,.28/thickness);
  const radius=(branchSpecs[node.index].width/2+2)*(young+(1-young)*mature);
  sides[0].push({x:v.x-dy/l*radius,y:v.y+dx/l*radius});sides[1].push({x:v.x+dy/l*radius,y:v.y-dx/l*radius});
 });
 // Round end coverage reaches the exact old mask smoothly as the branch matures.
 const end=samples.at(-1)!,previous=samples.at(-2)!,angle=Math.atan2(end.y-previous.y,end.x-previous.x),r=(branchSpecs[node.index].width/2+2)*smooth((p-.68)/.32);
 const cap=Array.from({length:9},(_,i)=>({x:end.x+Math.cos(angle+Math.PI/2-i*Math.PI/8)*r,y:end.y+Math.sin(angle+Math.PI/2-i*Math.PI/8)*r}));
 return [...sides[0],...cap,...sides[1].reverse()].map((v,i)=>`${i?'L':'M'}${v.x.toFixed(2)} ${v.y.toFixed(2)}`).join(' ')+' Z';
}
