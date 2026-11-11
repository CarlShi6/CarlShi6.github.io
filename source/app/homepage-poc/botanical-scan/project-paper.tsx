'use client';
import Link from 'next/link';
import Image from 'next/image';
import {useRef} from 'react';
import type {SpaceSystemItem} from '../space-system.data';
import {projectFacts} from '../light-home-v2/data';
import {WaterLens} from './water-lens';
import {WrittenText} from './written-text';
import {useSpecimenScan} from './interaction';
import {AiPcLiveLink} from '../projects/ai-pc-live-link';
import styles from './objects.module.css';
export function ProjectPaper({project,kind='project',scan,reduced,fine,penPreview=false,editorialPreview=false}:{project:SpaceSystemItem;kind?:'project'|'skill';scan:ReturnType<typeof useSpecimenScan>;reduced:boolean;fine:boolean;penPreview?:boolean;editorialPreview?:boolean}){
 const id='paper-'+project.id,paperSvg=useRef<SVGSVGElement>(null),button=useRef<HTMLButtonElement>(null),facts=projectFacts[project.id];
 const active=scan.id===project.id&&scan.phase!=='dismissed',expanded=active&&['revealed','selected'].includes(scan.phase);
 const inspect=()=>{if(button.current)scan.inspect(project.id,button.current);};
 const label=kind==='project'?'Selected project':'Capabilities';
 const lines=[label,project.title,...(kind==='project'?['What',facts.what,'Role',facts.role.replaceAll('Â·','·'),'Verified deliverable',facts.deliverable]:[project.summary,'Capabilities',project.detail])];
 const total=lines.join('').length;
 const write=(index:number)=><WrittenText text={lines[index]} offset={lines.slice(0,index).join('').length} step={Math.min(.012,1.8/total)} animate={penPreview&&expanded&&fine&&!reduced}/>;
 const editorial=editorialPreview&&kind==='project';
 return <div className={styles.paper} data-editorial-project={editorial||undefined} data-selected={expanded} data-pen-preview={penPreview} data-scan-boundary onPointerEnter={e=>{if(e.pointerType==='mouse')inspect();}} onPointerLeave={scan.leave} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))scan.leave();}}>
  <svg ref={paperSvg} className={styles.paperArt} viewBox="0 0 360 500" aria-hidden="true">
   <defs>
    <linearGradient id={`${id}-paper`} x2="1" y2="1"><stop stopColor="#faf3df"/><stop offset=".65" stopColor="#eee3cb"/><stop offset="1" stopColor="#e0d2b6"/></linearGradient>
    <filter id={`${id}-grain`}><feTurbulence type="fractalNoise" baseFrequency=".13" numOctaves="3" seed="8"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
    <clipPath id={`${id}-clip`}><path d="M47 2L312 2L353 48L349 481Q350 496 331 498L28 495Q10 495 10 478L7 49Z"/></clipPath>
   </defs>
   <g id={`${id}-art`}>
    <path d="M47 2L312 2L353 48L349 481Q350 496 331 498L28 495Q10 495 10 478L7 49Z" fill={`url(#${id}-paper)`} stroke="#c8b895" filter={`url(#${id}-grain)`}/>
    {expanded&&project.image&&!editorial&&<g clipPath={`url(#${id}-clip)`}><image href={project.image} x="260" y="65" width="68" height="86" preserveAspectRatio="xMidYMid slice" opacity=".9"/></g>}
    {!expanded&&<g stroke={kind==='project'?'#9b8760':'#617d78'} fill="none" strokeWidth="4" opacity=".65"><path d="M180 345Q150 260 203 183Q243 251 180 294M180 295Q118 278 124 229Q180 234 180 295M180 308L203 221"/><path d="M135 393Q180 388 224 393" strokeWidth="2"/></g>}
    <circle data-tag-hole cx="180" cy="24" r="7" fill="#b8a689"/><circle cx="180" cy="24" r="3" fill="#faf5e7"/>
   </g>
   {!penPreview&&<WaterLens id={`${id}-water`} artId={`${id}-art`} svg={paperSvg} enabled={fine&&!reduced&&active}/>}
  </svg>
  <button ref={button} onFocus={inspect} onClick={e=>scan.select(project.id,e.currentTarget)} className={styles.tagTarget} aria-label={`Examine ${project.title}`} aria-expanded={expanded} aria-controls={`${id}-reading`} data-project-target={project.id}>
   <span className={styles.tagNumber}>{write(0)}</span>
   <span className={styles.tagTitle}>{write(1)}</span>
  </button>
  <div id={`${id}-reading`} className={styles.tagReading} inert={!expanded} aria-hidden={!expanded}>
   {editorial?<div className={styles.readingFlow} tabIndex={expanded?0:-1} role="region" aria-label={`${project.title} image and project details`}>
    {project.image&&<Image src={project.image} alt={`${project.title} — original project artifact`} width={400} height={225} unoptimized className={styles.projectImage}/>}
    <dl className={styles.projectFacts}><div><dt>{write(2)}</dt><dd>{write(3)}</dd></div><div><dt>{write(4)}</dt><dd>{write(5)}</dd></div><div><dt>{write(6)}</dt><dd>{write(7)}</dd></div></dl>
   </div>:kind==='project'?<dl><dt>{write(2)}</dt><dd>{write(3)}</dd><dt>{write(4)}</dt><dd>{write(5)}</dd><dt>{write(6)}</dt><dd>{write(7)}</dd></dl>:<><p>{write(2)}</p><dl><dt>{write(3)}</dt><dd>{write(4)}</dd></dl></>}
   <div className={styles.tagActions}><Link href={project.href}>{kind==='project'?'Look Closer':'Explore skill'} <span aria-hidden="true">↗</span></Link>{project.id==='ai-pc-build-advisor'&&<AiPcLiveLink compact/>}</div>
  </div>
 </div>;
}
