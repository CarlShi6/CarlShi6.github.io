// Gate A: art-directed, connected cubic skeletons. No growth is enabled before approval.
export type Point = [number, number];
export type Branch = {id:string; side:'left'|'right'; parent:string|null; at:number; p:Point[]; width:number; depth:number};
export function point(b:Branch,t:number):Point {
 const [a,c,d,e]=b.p,u=1-t;
 return [u*u*u*a[0]+3*u*u*t*c[0]+3*u*t*t*d[0]+t*t*t*e[0],u*u*u*a[1]+3*u*u*t*c[1]+3*u*t*t*d[1]+t*t*t*e[1]];
}
export function tangent(b:Branch,t:number):Point {
 const [a,c,d,e]=b.p,u=1-t;
 const x=3*u*u*(c[0]-a[0])+6*u*t*(d[0]-c[0])+3*t*t*(e[0]-d[0]);
 const y=3*u*u*(c[1]-a[1])+6*u*t*(d[1]-c[1])+3*t*t*(e[1]-d[1]);
 const length=Math.hypot(x,y)||1;return [x/length,y/length];
}
const branches:Branch[]=[];
function root(id:string,side:Branch['side'],p:Point[],width:number){branches.push({id,side,parent:null,at:0,p,width,depth:0});}
function limb(id:string,parent:string,at:number,end:Point,bend:Point,width:number,lead=25){
 const base=branches.find(b=>b.id===parent)!;const a=point(base,at),v=tangent(base,at);
 branches.push({id,side:base.side,parent,at,p:[a,[a[0]+v[0]*lead,a[1]+v[1]*lead],bend,end],width,depth:base.depth+1});
}
// The left tree leans into a broad, wind-shaped crown with long horizontal limbs.
root('L','left',[[548,413],[502,352],[541,244],[406,153]],34);
limb('L-crown','L',.94,[314,54],[350,100],11,24);
limb('L-west','L',.46,[135,238],[272,267],19,34);
limb('L-high','L',.76,[205,135],[298,170],16,32);
limb('L-rise','L',.63,[487,51],[491,128],15,25);
limb('L-east','L',.35,[609,181],[560,212],15,27);
limb('L-west-low','L-west',.49,[222,326],[302,294],9,28);
limb('L-west-fork','L-west',.73,[157,179],[205,197],7,21);
limb('L-west-tip','L-west',.89,[121,213],[135,225],3.3,11);
limb('L-high-up','L-high',.48,[273,75],[295,119],8,19);
limb('L-high-flat','L-high',.75,[163,137],[198,154],5,18);
limb('L-rise-east','L-rise',.52,[550,80],[526,119],8,22);
limb('L-rise-west','L-rise',.76,[447,45],[450,66],5,18);
limb('L-crown-west','L-crown',.57,[258,45],[300,71],5,16);
limb('L-crown-tip','L-crown',.79,[321,22],[326,40],3.2,12);
limb('L-east-high','L-east',.64,[586,124],[573,159],6,18);
limb('L-east-tip','L-east',.84,[629,165],[616,180],3,14);
limb('L-west-low-fork','L-west-low',.62,[207,280],[240,290],3.5,14);
// The right tree has a rising leader, a low sweeping bough and a sparser high crown.
root('R','right',[[950,432],[1003,377],[956,288],[1054,204]],32);
limb('R-leader','R',.92,[1142,75],[1070,113],15,27);
limb('R-east','R',.58,[1350,241],[1215,219],20,34);
limb('R-low','R',.31,[1257,356],[1136,367],17,30);
limb('R-west','R',.68,[898,174],[941,221],12,22);
limb('R-up','R',.52,[1004,110],[969,192],13,27);
limb('R-leader-east','R-leader',.48,[1260,119],[1181,141],10,24);
limb('R-leader-top','R-leader',.73,[1115,41],[1125,75],5,17);
limb('R-east-up','R-east',.51,[1274,164],[1240,199],9,24);
limb('R-east-low','R-east',.66,[1341,301],[1299,281],8,20);
limb('R-east-tip','R-east',.87,[1365,216],[1341,232],3.2,13);
limb('R-low-up','R-low',.65,[1205,290],[1159,321],7,17);
limb('R-low-tip','R-low',.85,[1299,327],[1267,345],4.3,15);
limb('R-west-up','R-west',.64,[916,119],[923,151],5.6,16);
limb('R-up-west','R-up',.65,[965,87],[975,126],6,17);
limb('R-up-right','R-up',.82,[1041,83],[1017,110],4,14);
limb('R-leader-east-fork','R-leader-east',.69,[1241,74],[1224,111],5,17);
// Smaller ramification is grown from real parent curve positions, never detached strokes.
const scaffold=[...branches];
for(const [index,b] of scaffold.entries()){
 if(b.depth===0)continue;
 const count=b.depth===1?3:2;
 for(let n=0;n<count;n++){
  const at=.38+n*.23+(index%3)*.025,a=point(b,at),v=tangent(b,at);
  const sign=(index+n)%2?1:-1,length=(b.depth===1?44:24)+((index*11+n*7)%23);
  const angle=sign*(.42+(index%4)*.09),c=Math.cos(angle),s=Math.sin(angle);
  const vx=v[0]*c-v[1]*s,vy=v[0]*s+v[1]*c;
  const end:Point=[a[0]+vx*length,a[1]+vy*length];
  // Keep the crown within the composition's generous safe area.
  end[0]=Math.max(113,Math.min(1368,end[0]));end[1]=Math.max(18,end[1]);
  limb(`${b.id}-twig${n}`,b.id,at,end,[a[0]+vx*length*.63,a[1]+vy*length*.63],Math.min(4.2,b.width*.28),length*.22);
 }
}
export const skeleton=branches;
export const anchors=[
 {id:'P1',branch:'L-west-fork',at:.64},{id:'P2',branch:'L-west-low',at:.57},
 {id:'P3',branch:'L-high',at:.37},{id:'P4',branch:'L-east',at:.86},
 {id:'S1',branch:'R-west',at:.58},{id:'S2',branch:'R-low',at:.62},
 {id:'S3',branch:'R-east-up',at:.67},{id:'S4',branch:'R-east-low',at:.74},
].map(a=>({...a,position:point(branches.find(b=>b.id===a.branch)!,a.at)}));
// Parent wood carries the cross-section of its daughters. This avoids a thin
// parent tip feeding an abruptly thicker child (the segmented first-pass look).
export function radius(b:Branch,t:number){
 let area=Math.pow(b.width*.5*Math.pow(1-t,.9),2);
 for(const child of branches.filter(c=>c.parent===b.id)){
  const q=Math.max(0,Math.min(1,(child.at+.075-t)/.15));
  area+=Math.pow(child.width*.43,2)*q*q*(3-2*q);
 }
 return .15+Math.sqrt(area);
}
export function outline(b:Branch){
 const left:Point[]=[],right:Point[]=[];
 for(let i=0;i<=64;i++){
  const t=i/64,p=point(b,t),v=tangent(b,t);
  const r=radius(b,t)*(1+.035*Math.sin(t*29+b.width));
  left.push([p[0]-v[1]*r,p[1]+v[0]*r]);right.push([p[0]+v[1]*r,p[1]-v[0]*r]);
 }
 return 'M'+[...left,...right.reverse()].map(p=>p.map(v=>v.toFixed(2)).join(',')).join('L')+'Z';
}
export function grain(b:Branch,offset:number){
 return Array.from({length:48},(_,i)=>{const t=i/49,p=point(b,t),v=tangent(b,t),r=radius(b,t);const d=offset*r+Math.sin(t*24+b.width)*r*.055;return `${i?'L':'M'}${(p[0]-v[1]*d).toFixed(2)},${(p[1]+v[0]*d).toFixed(2)}`;}).join('');
}
