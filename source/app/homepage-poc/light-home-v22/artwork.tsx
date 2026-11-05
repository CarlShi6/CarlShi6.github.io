import {useId,type CSSProperties} from 'react';
import {planetOutline} from '../homepage-rc4/growth-geometry';
import styles from './world.module.css';
import {branchSpecs} from './growth-model';
const art='/media/ivory-cosmos/tree-growth/bare-planet.webp';
// Each canopy sprig starts at a real terminal fork; no full-tree opacity reveal.
export const forks=[[277,117],[312,112],[255,75],[265,155],[219,202],[197,178],[326,55],[396,66],[403,29],[432,64],[478,89],[524,35],[549,153],[572,125],[610,159],[344,196],[264,314],[259,231],[355,295],[392,307],[1169,93],[1127,65],[1173,74],[1073,116],[1266,134],[1288,127],[1277,161],[1221,233],[1269,244],[1289,224],[1000,151],[1045,146],[979,174],[895,239],[952,216],[884,245],[1068,291],[1083,367],[1143,347],[1159,232],[1189,299]];
export function Artwork(){
 const id=useId().replace(/:/g,'');
 return <svg className={styles.artwork} viewBox="0 0 1448 1086" aria-hidden="true">
  <defs>
   <clipPath id={`${id}-planet`}><path d={planetOutline}/></clipPath>
   <mask id={`${id}-surface`}><rect width="1448" height="1086" fill="black"/><circle data-surface-reveal cx="715" cy="640" r="0" fill="white"/></mask>
   {branchSpecs.map((branch,i)=><g key={branch.id}>
    <mask id={`${id}-branch-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><path data-growth-outline={i} d="M0 0" fill="white"/></mask>
    <mask id={`${id}-branch-art-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><path d={branch.d} stroke="white" strokeWidth={branch.width} fill="none" strokeLinecap="round" strokeLinejoin="round"/></mask>
   </g>)}
   <pattern id={`${id}-mineral`} width="48" height="48" patternUnits="userSpaceOnUse"><image href={art} width="350" height="263" x="-100" y="-164"/></pattern>
  </defs>
  <g data-fragments>{Array.from({length:20},(_,i)=><g key={i} data-fragment opacity="0"><path d={`M-15 -5 L-8 -17 L${8+i%5} -12 L18 1 L7 16 L-10 12 Z`} fill={`url(#${id}-mineral)`} stroke="#a49d88" strokeWidth=".7"/><path d="M-8 -17 L0 -2 L18 1 M0 -2 L-10 12" fill="none" stroke="#f5edd8" strokeWidth="1.3" opacity=".8"/></g>)}</g>
  <g data-core transform="translate(715 640)" opacity="0"><path d="M-28 -6 L-13 -28 L14 -25 L29 -4 L20 21 L-12 28 L-30 8 Z" fill={`url(#${id}-mineral)`} stroke="#b5a789" strokeWidth="1.4"/></g>
  <g data-planet style={{transformOrigin:'715px 640px'}}><image href={art} width="1448" height="1086" clipPath={`url(#${id}-planet)`} mask={`url(#${id}-surface)`}/></g>
  <g data-trees>{branchSpecs.map((branch,i)=><g key={branch.id} data-branch-layer={i} visibility="hidden"><g mask={`url(#${id}-branch-${i})`}><image href={art} width="1448" height="1086" mask={`url(#${id}-branch-art-${i})`}/></g></g>)}</g>
  <g visibility="hidden">{branchSpecs.map((b,i)=><path key={b.id} data-growth-guide={i} d={b.d}/>)}</g>
  <g data-buds>{forks.map(([x,y],i)=><ellipse key={i} data-bud={i} cx={x} cy={y} rx="0" ry="0" fill="#727f4a"/>)}</g>
  <g data-canopy>{forks.map(([x,y],i)=><g key={i} data-leaf-carrier={i}><g transform={`translate(${x} ${y}) rotate(${i%3===0?-75:i%3===1?20:-20})`}><g data-leaf visibility="hidden"><g className={styles.leafBreeze} style={{'--leaf-period':`${8+i%7}s`,'--leaf-angle':`${i%2?1:-1}deg`} as CSSProperties}><image href="/homepage-poc/light-v2/foliage-sprig.png" x="-10" y={-105-i%4*12} width={115+i%4*14} height={115+i%4*14}/></g></g></g></g>)}</g>
 </svg>;
}
