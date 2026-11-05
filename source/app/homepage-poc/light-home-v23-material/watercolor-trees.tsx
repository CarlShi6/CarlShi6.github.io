import {outline,point,radius,skeleton,tangent,type Branch} from '../light-home-v23/skeleton';

const f=(v:number)=>v.toFixed(3);
/** A broken brush deposit in curve coordinates, bounded by the unchanged outline.
 * Its t interval and normal offset can be clipped by the future growth front.
 * No raster tree, separate branch bitmap, fixed-screen crop or opacity entrance. */
function brush(b:Branch,start:number,end:number,offset:number,width:number,seed:number){
 const sides:[number,number][][]=[[],[]];
 for(let i=0;i<=30;i++){
  const u=i/30,t=start+(end-start)*u,p=point(b,t),v=tangent(b,t),r=radius(b,t);
  const edge=Math.pow(Math.sin(Math.PI*u),.5),w=width*r*edge*(.7+.3*Math.sin(t*47+seed));
  const bend=offset+Math.sin(t*19+seed)*.12;
  for(let side=0;side<2;side++){
   const d=bend*r+(side?1:-1)*w;
   sides[side].push([p[0]-v[1]*d,p[1]+v[0]*d]);
  }
 }
 return 'M'+[...sides[0],...sides[1].reverse()].map(p=>p.map(f).join(',')).join('L')+'Z';
}

export function WatercolorTrees({id}:{id:string}){
 return <>
  <defs>
   {/* A shared pigment field crosses every joint without changing phase. */}
   <filter id={`${id}-pigment`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".018 .036" numOctaves="3" seed="31" result="wash"/>
    <feColorMatrix in="wash" type="saturate" values="0"/>
    <feComponentTransfer>
     <feFuncR type="table" tableValues=".12 .20 .38 .64 .84"/>
     <feFuncG type="table" tableValues=".20 .29 .42 .61 .79"/>
     <feFuncB type="table" tableValues=".25 .35 .46 .54 .68"/>
    </feComponentTransfer>
   </filter>
   <pattern id={`${id}-barkgrain`} patternUnits="userSpaceOnUse" width="164" height="210"><image href="/homepage-poc/light-v23/watercolor-bark.png" width="164" height="210" preserveAspectRatio="none"/></pattern>
   <pattern id={`${id}-watercolor`} patternUnits="userSpaceOnUse" width="1448" height="1086"><rect width="1448" height="1086" fill="#93958b" filter={`url(#${id}-pigment)`}/><rect width="1448" height="1086" fill={`url(#${id}-barkgrain)`} opacity=".48"/></pattern>
   <filter id={`${id}-brush-edge`} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency=".08 .16" numOctaves="2" seed="13" result="wet"/>
    <feDisplacementMap in="SourceGraphic" in2="wet" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
    <feGaussianBlur stdDeviation=".5"/>
   </filter>
   <filter id={`${id}-paper`} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".42" numOctaves="2" seed="17" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 .24 0 0 0 0 .29 0 0 0 0 .32 .22 .22 .22 0 .05" result="granules"/>
    <feComposite in="granules" in2="SourceGraphic" operator="in" result="deposit"/>
    <feBlend in="SourceGraphic" in2="deposit" mode="multiply" result="paint"/>
    <feDisplacementMap in="paint" in2="grain" scale=".65" xChannelSelector="R" yChannelSelector="G"/>
   </filter>
   {skeleton.map(b=>{const end=point(b,.3);return <g key={b.id}>
    <clipPath id={`${id}-wood-${b.id}`}><path d={outline(b)}/></clipPath>
    <linearGradient id={`${id}-joint-paint-${b.id}`} gradientUnits="userSpaceOnUse" x1={f(b.p[0][0])} y1={f(b.p[0][1])} x2={f(end[0])} y2={f(end[1])}><stop stopColor="white" stopOpacity="0"/><stop offset="1" stopColor="white"/></linearGradient>
    <mask id={`${id}-joint-${b.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><rect width="1448" height="1086" fill={`url(#${id}-joint-paint-${b.id})`}/></mask>
   </g>;})}
   {skeleton.filter(b=>!b.parent).map(b=>{
    const end=point(b,.16);
    return <g key={b.id}>
     <linearGradient id={`${id}-root-fade-${b.id}`} gradientUnits="userSpaceOnUse" x1={b.p[0][0]} y1={b.p[0][1]} x2={f(end[0])} y2={f(end[1])}><stop stopColor="white" stopOpacity="0"/><stop offset=".3" stopColor="white" stopOpacity=".48"/><stop offset="1" stopColor="white"/></linearGradient>
     <mask id={`${id}-root-${b.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><rect width="1448" height="1086" fill={`url(#${id}-root-fade-${b.id})`}/></mask>
    </g>;
   })}
  </defs>
  <g data-skeleton data-watercolor-material filter={`url(#${id}-paper)`}>
   {[...skeleton].reverse().map((b,index)=><g key={b.id} data-branch={b.id} data-parent={b.parent??''} data-side={b.side} data-depth={b.depth} data-start={b.p[0].map(f).join(',')} mask={b.parent?undefined:`url(#${id}-root-${b.id})`}>
    <g clipPath={`url(#${id}-wood-${b.id})`} data-material-carrier={b.id}>
     <path d={outline(b)} fill={`url(#${id}-watercolor)`}/>
     {b.width>4&&<g mask={b.parent?`url(#${id}-joint-${b.id})`:undefined} filter={`url(#${id}-brush-edge)`}>
      {/* Irregular cool recesses and warm exposed wood, never full-length stripes. */}
      <path d={brush(b,.035,.89,.38,.38,index)} fill="#344e5e" opacity=".28"/>
      <path d={brush(b,.08,.73,-.48,.28,index+2)} fill="#efe6d1" opacity=".38"/>
      <path d={brush(b,.28,.94,-.12,.29,index+7)} fill="#a3977f" opacity=".26"/>
      {Array.from({length:b.width>12?9:4},(_,i)=>{
       const start=.07+(i*17%31)/40,end=Math.min(.98,start+.09+(i%3)*.045),offset=((i*7%13)/6-1)*.68;
       return <path key={i} d={brush(b,start,end,offset,.045+(i%3)*.02,index+i)} fill={i%3===0?'#e8debf':i%3===1?'#314857':'#726d60'} opacity={i%3===0?.66:.48}/>;
      })}
     </g>}
    </g>
   </g>)}
  </g>
 </>;
}
