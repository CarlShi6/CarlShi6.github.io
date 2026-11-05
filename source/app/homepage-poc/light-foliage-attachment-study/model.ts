import gsap from 'gsap';
import {art} from '../light-home-v24-formation/artwork';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {branchSpecs,connect,envelope,identity,multiply,rotation,point,clamp,smooth,type Matrix,type Node} from '../light-home-v22/growth-model';

export const representativeId='2-0';
export type Attachment={id:string;parentBranchId:string;u:number;localOrientation:number;petioleLength:number;size:number;gold:boolean;barkOpacity:number};
export type Branch=Node&{id:string;raw:ReturnType<typeof MotionPathPlugin.getRawPath>;paintedAnchors:{u:number;opacity:number}[];supportMask:string};
export type Mode='single'|'both';

/** Arc-length location and tangent are sampled from the original bark guide. */
export function sample(branch:Branch,u:number){const p=MotionPathPlugin.getPositionOnPath(branch.raw,clamp(u),true);return{x:p.x,y:p.y,angle:'angle' in p?p.angle:0};}
export async function makeSkeleton():Promise<Branch[]>{
 // Existing masks are broad reveal guides, not exact bark centerlines. Refine
 // attachment sampling inside their normal corridor against the original pigment.
 // This moves no artwork and preserves branch IDs, parents and entrance times.
 const image=new Image();image.src=art;await image.decode();
 const canvas=document.createElement('canvas');canvas.width=1448;canvas.height=1086;
 const ctx=canvas.getContext('2d',{willReadFrequently:true})!;ctx.drawImage(image,0,0,1448,1086);
 const pixels=ctx.getImageData(0,0,1448,1086).data;
 const luminance=(x:number,y:number)=>{const offset=(Math.max(0,Math.min(1085,Math.round(y)))*1448+Math.max(0,Math.min(1447,Math.round(x))))*4;return pixels[offset]*.2126+pixels[offset+1]*.7152+pixels[offset+2]*.0722;};
 // Match the actual alpha filter, rather than treating a traced guide as bark.
 const opacity=(x:number,y:number)=>{const offset=(Math.max(0,Math.min(1085,Math.round(y)))*1448+Math.max(0,Math.min(1447,Math.round(x))))*4;return clamp(10.6-4*(pixels[offset]+pixels[offset+1]+pixels[offset+2])/255);};
 gsap.registerPlugin(MotionPathPlugin);
 const raw=branchSpecs.map(b=>{const r=MotionPathPlugin.getRawPath(b.d);MotionPathPlugin.cacheRawPathMeasurements(r,24);return r;});
 const samples=raw.map(r=>Array.from({length:161},(_,i)=>{const p=MotionPathPlugin.getPositionOnPath(r,i/160,true);return{x:p.x,y:p.y};}));
 const nodes=connect(samples),lookup=new Map<number,Node>();
 // Validate the visible artwork, not just its mathematical guides. Keep only
 // painted pixels connected to a trunk through the union of the growth masks.
 const maskCanvas=document.createElement('canvas');maskCanvas.width=1448;maskCanvas.height=1086;
 const maskContext=maskCanvas.getContext('2d')!;
 nodes.forEach(n=>maskContext.fill(new Path2D(envelope(n,1,1))));
 const maskPixels=maskContext.getImageData(0,0,1448,1086),supported=new Uint8Array(1448*1086),connected=new Uint8Array(supported.length);
 for(let i=0;i<supported.length;i++)supported[i]=Number(maskPixels.data[i*4+3]>128&&clamp(10.6-4*(pixels[i*4]+pixels[i*4+1]+pixels[i*4+2])/255)>.12);
 const queue=new Int32Array(supported.length);let head=0,tail=0;
 for(const root of nodes.filter(n=>n.parent===null)){
  for(let dy=-12;dy<=12;dy++)for(let dx=-12;dx<=12;dx++){
   const x=Math.round(root.points[0].x)+dx,y=Math.round(root.points[0].y)+dy,index=y*1448+x;
   if(x>=0&&x<1448&&y>=0&&y<1086&&supported[index]&&!connected[index]){connected[index]=1;queue[tail++]=index;}
  }
 }
 // Up to two artwork pixels bridges watercolor antialiasing, not missing limbs.
 while(head<tail){const i=queue[head++],x=i%1448,y=Math.floor(i/1448);
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
   const nx=x+dx,ny=y+dy,j=ny*1448+nx;
   if(nx>=0&&nx<1448&&ny>=0&&ny<1086&&supported[j]&&!connected[j]){connected[j]=1;queue[tail++]=j;}
  }
 }
 const attached=(x:number,y:number)=>Boolean(connected[Math.round(y)*1448+Math.round(x)]);
 // A visibility mask removes isolated crop slivers; original branch textures
 // and individual branch transforms remain separate and animation-ready.
 for(let i=0;i<supported.length;i++){maskPixels.data[i*4]=255;maskPixels.data[i*4+1]=255;maskPixels.data[i*4+2]=255;maskPixels.data[i*4+3]=0;}
 for(let i=0;i<connected.length;i++)if(connected[i]){const x=i%1448,y=Math.floor(i/1448);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>=0&&x+dx<1448&&y+dy>=0&&y+dy<1086)maskPixels.data[((y+dy)*1448+x+dx)*4+3]=255;
 }
 maskContext.putImageData(maskPixels,0,0);const supportMask=maskCanvas.toDataURL();
 for(const n of nodes){const parent=n.parent===null?null:lookup.get(n.parent)!;n.start=parent?parent.start+parent.span*n.attach+.035:0;n.span=.32+n.length/170;lookup.set(n.index,n);}
 const extent=Math.max(...nodes.map(n=>n.start+n.span));
 return nodes.map(n=>{
  const refined=n.points.map((p,i)=>{
   const a=n.points[Math.max(0,i-1)],b=n.points[Math.min(n.points.length-1,i+1)],length=Math.hypot(b.x-a.x,b.y-a.y)||1;
   const nx=-(b.y-a.y)/length,ny=(b.x-a.x)/length;
   let best=Infinity,shift=0;
   for(let d=-14;d<=14;d+=.5){const value=luminance(p.x+nx*d,p.y+ny*d)+Math.abs(d)*1.25;if(value<best){best=value;shift=d;}}
   return{x:p.x+nx*shift,y:p.y+ny*shift};
  });
  // A mild local average suppresses texture speckle while staying inside bark.
  const centerline=refined.map((p,i)=>{const a=refined[Math.max(0,i-1)],b=refined[Math.min(refined.length-1,i+1)];return{x:(a.x+p.x*2+b.x)/4,y:(a.y+p.y*2+b.y)/4};});
  const d=centerline.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join(' '),path=MotionPathPlugin.getRawPath(d);MotionPathPlugin.cacheRawPathMeasurements(path,24);
  const mask=new Path2D(envelope(n,1,1));
  const paintedAnchors=Array.from({length:241},(_,i)=>{
   const u=i/240,p=MotionPathPlugin.getPositionOnPath(path,u);
   return {u,opacity:ctx.isPointInPath(mask,p.x,p.y)&&attached(p.x,p.y)?opacity(p.x,p.y):0};
  }).filter(p=>p.u>=.08&&p.u<=.94&&p.opacity>=.65);
  return {...n,start:2.15+n.start/extent*2.65,span:n.span/extent*2.65,id:branchSpecs[n.index].id,raw:path,paintedAnchors,supportMask};
 });
}

/** Deterministic, alternating placement; no screen coordinates, detached clusters or particles. */
export function attachments(branches:Branch[],mode:Mode):Attachment[]{
 const selected=mode==='single'?branches.filter(b=>b.id===representativeId):branches.filter(b=>b.depth>=2);
 return selected.flatMap(b=>{
  // Some old reveal guides extend into empty paper. Never hang leaves there.
  const anchors=b.paintedAnchors;
  if(anchors.length<12)return [];
  const count=mode==='single'?10:Math.max(2,Math.min(6,Math.round(b.length/25)));
  return Array.from({length:count},(_,i)=>{const anchor=anchors[Math.floor((i+.5)*anchors.length/count)];return {id:`${b.id}:leaf-${i}`,parentBranchId:b.id,
   u:anchor.u,barkOpacity:anchor.opacity,
   localOrientation:(i%2?1:-1)*(40+(b.index*3+i*7)%27),
   petioleLength:8+(b.index+i*5)%7,size:.34+(b.index+i*7)%6*.035,gold:(b.index+i)%3===0};});
 });
}

export function leafProgress(leaf:Attachment,branch:Branch,time:number){
 // Arrival is governed by the parent growth front, not a separate stagger.
 const arrival=Math.max(4.8,branch.start+branch.span*leaf.u+.08);
 return smooth((time-arrival)/Math.min(.55,6-arrival));
}
export function branchMatrices(branches:Branch[],ambient:number,amount:number,mode:Mode){
 const matrices=new Map<string,Matrix>();
 for(const b of branches){
  const parent=b.parent===null?null:branches.find(n=>n.index===b.parent)!;
  const inherited=mode==='both'&&parent?matrices.get(parent.id)!:identity();
  // Rotate at the physical junction. Children inherit every ancestor's matrix.
  const pivot=parent?b.anchor:b.points[0];
  const radians=amount*(mode==='single'?1.1:Math.min(.42,b.depth*.07))*Math.PI/180*Math.sin(ambient*.75+b.index*.69)*smooth(ambient/1.2);
  matrices.set(b.id,multiply(inherited,rotation(pivot,radians)));
 }
 return matrices;
}
export function leafPose(leaf:Attachment,branch:Branch,p:number,ambient:number,amount:number){
 const anchor=sample(branch,leaf.u);
 const flutter=Math.sin(ambient*1.13+leaf.u*13+branch.index)*3*amount*smooth(ambient/1.2);
 const angle=anchor.angle+leaf.localOrientation+flutter,r=angle*Math.PI/180;
 const length=leaf.petioleLength*smooth(p/.45);
 return {anchor,angle,end:{x:Math.cos(r)*length,y:Math.sin(r)*length},blade:smooth((p-.18)/.82)};
}
export {point,clamp};
