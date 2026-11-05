"use client";
import {useId} from 'react';
import {growthBranches,hangers,planetOutline} from './growth-geometry';
import styles from './growth.module.css';
const artwork='/media/ivory-cosmos/tree-growth/bare-planet.webp';

export function LightGrowthLayers(){
 const id=useId().replace(/:/g,'');
 return <>
  <span className={styles.center} data-light-center aria-hidden="true"/>
  <svg className={styles.planet} data-light-planet viewBox="0 0 1448 1086" aria-hidden="true">
   <defs><clipPath id={`${id}-planet`}><path d={planetOutline}/></clipPath></defs>
   <image href={artwork} width="1448" height="1086" clipPath={`url(#${id}-planet)`}/>
  </svg>
  <svg className={styles.branches} data-light-branches viewBox="0 0 1448 1086" aria-hidden="true">
   <defs><mask id={`${id}-growth`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086">
    <rect width="1448" height="1086" fill="black"/>
    {growthBranches.map(([d,width,start,duration],index)=><path key={index} data-light-branch data-growth-start={start} data-growth-duration={duration} d={d} pathLength="1" fill="none" stroke="white" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"/>)}
   </mask></defs>
   <g data-light-branch-art><image href={artwork} width="1448" height="1086" mask={`url(#${id}-growth)`}/></g>
   {hangers.map(({x,y,anchorY},index)=><line key={index} data-light-string x1={x} x2={x} y1={anchorY} y2={index<4?y-27:y} pathLength="1" stroke="#7d684a" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>)}
  </svg>
 </>;
}
