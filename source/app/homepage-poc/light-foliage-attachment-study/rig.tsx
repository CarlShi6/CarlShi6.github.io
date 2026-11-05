import {useId} from 'react';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {LeafDefinitions,art} from '../light-home-v24-formation/artwork';
import {sample,type Branch,type Attachment,type Mode,representativeId} from './model';

export function FoliageRig({branches,leaves,mode,interactive=false}:{branches:Branch[];leaves:Attachment[];mode:Mode;interactive?:boolean}){
 const id=useId().replace(/:/g,'');
 return <svg data-foliage-rig viewBox={mode==='single'?'205 35 340 215':'0 0 1448 1086'} aria-label={mode==='single'?'One original watercolor branch with ten attached leaves':'Both original watercolor trees with attached foliage'} role="img">
  <LeafDefinitions id={id}/>
  <defs>
   <filter id={`${id}-alpha`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -4 -4 -4 0 10.6"/></filter>
   <mask id={`${id}-connected`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><image href={branches[0].supportMask} width="1448" height="1086"/></mask>
   <g id={`${id}-bark`} mask={`url(#${id}-connected)`}><image href={art} width="1448" height="1086" filter={`url(#${id}-alpha)`}/></g>
  </defs>
  {branches.filter(b=>mode==='both'||b.id===representativeId).map(b=><g key={b.id} data-rig-branch={b.id}>
   <defs><mask id={`${id}-${b.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1448" height="1086"><path data-rig-envelope d="M0 0" fill="white"/></mask></defs>
   <use href={`#${id}-bark`} mask={`url(#${id}-${b.id})`}/>
   <path data-rig-guide d={MotionPathPlugin.rawPathToString(b.raw)} visibility="hidden"/>
   <path data-junction visibility="hidden"/>
   {!interactive&&<g data-debug="ids"><text x={b.points[0].x+4} y={b.points[0].y+12}>{b.id}</text></g>}
   {leaves.filter(l=>l.parentBranchId===b.id).map(leaf=>{
    const anchor=sample(b,leaf.u);
    return <g key={leaf.id} data-attached-leaf={leaf.id} data-leaf-carrier={interactive?leaf.id:undefined} data-foliage-side={Number(b.id.split('-')[0])<20?'projects':'skills'} data-gold={leaf.gold} data-parent-branch={b.id} data-u={leaf.u} data-bark-opacity={leaf.barkOpacity} data-local-orientation={leaf.localOrientation} transform={`translate(${anchor.x} ${anchor.y})`}>
     <g data-leaf-growth visibility="hidden">
      <path data-petiole d="M0 0" fill="none" stroke={leaf.gold?'#a58a59':'#657b80'} strokeWidth=".8" strokeLinecap="round"/>
      <g data-leaf-blade><use href={`#${id}-leaf-${leaf.gold?'gold':'blue'}`}/></g>
     </g>
     {!interactive&&<><g data-debug="anchors"><circle cx="0" cy="0" r="1.8"/><text x="3" y="-4">{leaf.u.toFixed(2)}</text></g>
     <g data-debug="tangents" transform={`rotate(${anchor.angle})`}><path d="M-7 0 L12 0 L8 -2 M12 0 L8 2"/></g>
     <g data-debug="errors"><circle data-error-marker r="3" fill="none"/><text data-error-label x="4" y="8">0px</text></g></>}
    </g>;
   })}
  </g>)}
 </svg>;
}
