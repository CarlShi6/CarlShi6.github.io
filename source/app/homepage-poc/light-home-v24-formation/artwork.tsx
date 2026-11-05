import {useId} from 'react';
import {planetOutline} from '../homepage-rc4/growth-geometry';
import {branchSpecs} from '../light-home-v22/growth-model';
import {forks} from '../light-home-v22/artwork';
export const art='/media/ivory-cosmos/tree-growth/bare-planet.webp';
export const surfaceSites=[[423,465],[372,565],[408,654],[469,803],[854,338],[1018,500],[1064,619],[1005,805],[618,350],[909,370]];
export const foliage=forks.flatMap(([x,y],fork)=>Array.from({length:4+(fork%3)},(_,j)=>({fork,x,y,dx:(j%2?1:-1)*(10+(fork*7+j*11)%26),dy:-12-(fork*13+j*7)%27,angle:(j%2?1:-1)*(25+(fork+j*11)%45),size:.32+(fork*3+j*7)%8*.04,gold:(fork+j)%3===0})));
export function LeafDefinitions({id}:{id:string}){
 return <defs>
  <linearGradient id={`${id}-blue`} x1="0" x2="1" y1="0" y2=".7"><stop stopColor="#d5d8ce"/><stop offset=".5" stopColor="#8799a6"/><stop offset="1" stopColor="#354e62"/></linearGradient>
  <linearGradient id={`${id}-gold`} x1="0" x2="1" y1="0" y2=".6"><stop stopColor="#f7e5b9"/><stop offset=".6" stopColor="#d8ad58"/><stop offset="1" stopColor="#9e733b"/></linearGradient>
  <filter id={`${id}-leafpaper`} x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".28" numOctaves="2" seed="9"/><feColorMatrix type="saturate" values="0"/><feComposite in2="SourceGraphic" operator="in"/><feComponentTransfer result="grain"><feFuncA type="linear" slope=".35"/></feComponentTransfer><feBlend in="SourceGraphic" in2="grain" mode="soft-light"/></filter>
  {[false,true].map(gold=><g key={String(gold)} id={`${id}-leaf-${gold?'gold':'blue'}`}>
   <path d="M0 0 C-16 -5 -17 -23 -4 -36 C-2 -40 -2 -43 -1 -45 C6 -32 20 -22 12 -12 C8 -6 2 -5 0 0Z" fill={`url(#${id}-${gold?'gold':'blue'})`} stroke={gold?'#a98c59':'#647e8c'} strokeWidth=".65" filter={`url(#${id}-leafpaper)`}/>
   <path d="M0 3 Q6 -16 -1 -39 M4 -13 L-7 -21 M3 -22 L9 -28" fill="none" stroke={gold?'#947449':'#4c6575'} opacity=".55" strokeWidth=".7"/>
  </g>)}
 </defs>;
}
export function FormationArtwork(){
 const id=useId().replace(/:/g,'');
 return <svg data-formation-art viewBox="0 0 1448 1086" aria-hidden="true">
  <LeafDefinitions id={id}/>
  <defs>
   <filter id={`${id}-paint-alpha`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -4 -4 -4 0 10.6"/></filter>
   <clipPath id={`${id}-planet`}><path d={planetOutline}/></clipPath>
   <filter id={`${id}-core-tone`} colorInterpolationFilters="sRGB"><feColorMatrix data-core-tone type="matrix" values=".8 0 0 0 0 0 .82 0 0 0 0 0 .85 0 0 0 0 0 1 0"/></filter>
   <mask id={`${id}-crust`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><rect width="1448" height="1086" fill="black"/><path data-core-outline d="M0 0" fill="white"/>
    <g data-core-cracks stroke="black" strokeWidth="42" fill="none" strokeLinejoin="miter"><path d="M328 415 L431 468 L489 461 L555 522 L574 559 L621 570 L649 603 L701 614 L715 640 L763 669 L770 709 L821 745 L886 751 L918 796 L1041 862 M470 965 L527 876 L513 843 L588 774 L605 724 L593 686 L649 603 L678 550 L669 517 L727 457 L782 415 L795 354 L887 273 M821 745 L855 696 L897 680 L916 636 L967 626 L987 583 L1112 514 M555 522 L541 466 L508 441 L521 399 L500 348"/></g>
   </mask>
   <mask id={`${id}-mature-surface`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><rect width="1448" height="1086" fill="black"/><circle data-mature-surface cx="715" cy="640" r="0" fill="white"/></mask>
   <pattern id={`${id}-rock`} patternUnits="userSpaceOnUse" width="64" height="64"><image href={art} x="-210" y="-344" width="760" height="570"/></pattern>
   <mask id={`${id}-growth`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><rect width="1448" height="1086" fill="black"/>{branchSpecs.map((b,i)=><path key={b.id} data-tree-envelope={i} d="M0 0" fill="white"/>)}</mask>
   <mask id={`${id}-surface`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><rect width="1448" height="1086" fill="black"/>{surfaceSites.map(([x,y],i)=><circle key={i} data-surface-site={i} cx={x} cy={y} r="0" fill="white"/>)}</mask>
  </defs>
  <g data-rocks>{Array.from({length:36},(_,i)=><g key={i} data-rock={i} visibility="hidden"><path d={`M-14 -4 L-8 -15 L${5+i%7} -12 L15 2 L7 14 L-10 10Z`} fill={`url(#${id}-rock)`} stroke="#5e6c75" strokeWidth=".6"/><path d="M-8 -15 L-2 -1 L15 2 M-2 -1 L-10 10" stroke="#e7dfc9" strokeWidth="1" fill="none" opacity=".7"/></g>)}</g>
  <g data-planet-mass transform="translate(715 640) scale(.13) translate(-715 -640)">
   <g clipPath={`url(#${id}-planet)`}>
    {/* Sample only the undecorated interior mineral wash for the young body.
        The mature rim, embedded stones and plants are a separate delayed layer. */}
    <g data-young-core mask={`url(#${id}-crust)`} filter={`url(#${id}-core-tone)`}><image href={art} x="-572" y="-512" width="2606.4" height="1954.8"/></g>
    <image href={art} width="1448" height="1086" mask={`url(#${id}-mature-surface)`}/>
   </g>
  </g>
  <image href={art} width="1448" height="1086" mask={`url(#${id}-surface)`} filter={`url(#${id}-paint-alpha)`}/>
  {/* One original watercolor image; connected growth masks never swap completed trees. */}
  <image data-tree-art href={art} width="1448" height="1086" mask={`url(#${id}-growth)`} filter={`url(#${id}-paint-alpha)`}/>
  <g visibility="hidden">{branchSpecs.map((b,i)=><path key={b.id} data-tree-guide={i} d={b.d}/>)}</g>
  <g fill="none" stroke="#71766a" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" opacity=".85">{branchSpecs.map((b,i)=><path key={b.id} data-canopy-support={i} d="M0 0"/>)}</g>
  <g data-canopy>{foliage.map((leaf,i)=><g key={i} data-leaf-carrier={i} transform={`translate(${leaf.x} ${leaf.y})`} visibility="hidden">
   <g data-leaf-unfold={i}><path d={`M0 0 Q${leaf.dx*.35} ${leaf.dy*.8} ${leaf.dx} ${leaf.dy}`} fill="none" stroke={leaf.gold?'#a88a59':'#647a83'} strokeWidth=".75"/><g data-leaf-blade={i} transform={`translate(${leaf.dx} ${leaf.dy}) rotate(${leaf.angle}) scale(${leaf.size})`}><use href={`#${id}-leaf-${leaf.gold?'gold':'blue'}`}/></g></g>
  </g>)}</g>
 </svg>;
}
export function FallingLeaves(){
 const id=useId().replace(/:/g,'');
 return <svg data-falling-layer aria-hidden="true"><LeafDefinitions id={id}/>{Array.from({length:10},(_,i)=><g key={i} data-falling-leaf={i} visibility="hidden"><use href={`#${id}-leaf-${i%3===0?'gold':'blue'}`}/></g>)}</svg>;
}
