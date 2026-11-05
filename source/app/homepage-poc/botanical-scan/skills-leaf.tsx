'use client';
import Link from 'next/link';
import {useRef} from 'react';
import {LeafDefinitions} from '../light-home-v24-formation/artwork';
import {outline} from '../light-skills-v3/leaf';
import {skillSpacecraft} from '../space-system.data';
import {WaterLens} from './water-lens';
import {useSpecimenScan} from './interaction';
import styles from './objects.module.css';
const blade='translate(260 780) scale(16)';
const veins = [
  { d: 'M150 258 Q235 326 337 279', x: 150, y: 258, text: 'Prioritize opportunities and roadmaps.', keywords: 'Opportunity · priorities · roadmaps' },
  { d: 'M157 366 Q240 419 374 348', x: 374, y: 348, text: 'Connect models, APIs and data.', keywords: 'Models · APIs · data · feasibility' },
  { d: 'M121 443 Q222 505 314 458', x: 121, y: 443, text: 'Research, prototype and test.', keywords: 'Research · interaction · prototypes' },
  { d: 'M169 515 Q298 584 398 490', x: 398, y: 490, text: 'Scope, sequence and deliver.', keywords: 'Scope · sequencing · learning' },
];


export function SkillsLeaf({scan,reduced,fine}:{scan:ReturnType<typeof useSpecimenScan>;reduced:boolean;fine:boolean}){
 const root=useRef<HTMLDivElement>(null),leafSvg=useRef<SVGSVGElement>(null);
 const selected=scan.phase==='selected',visible=scan.phase==='revealed'||selected;
 const skillIndex=skillSpacecraft.findIndex(s=>s.id===scan.id),skill=skillIndex>=0?skillSpacecraft[skillIndex]:null;
 const bind=(id:string)=>({onPointerEnter:(e:React.PointerEvent<HTMLButtonElement>)=>{if(e.pointerType==='mouse')scan.inspect(id,e.currentTarget);},onPointerLeave:scan.leave,onFocus:(e:React.FocusEvent<HTMLButtonElement>)=>scan.inspect(id,e.currentTarget),onBlur:scan.leave,onClick:(e:React.MouseEvent<HTMLButtonElement>)=>scan.select(id,e.currentTarget)});
 return <div ref={root}>
        <div className={styles.leaf} data-scan-boundary>
          <svg ref={leafSvg} className={styles.leafArt} viewBox="0 0 520 850" aria-hidden="true">
            <LeafDefinitions id="scan-leaf"/>
            <style>{'#scan-leaf-leaf-blue path{stroke-width:.08} #scan-leaf-leaf-blue path+path{stroke-width:.09;opacity:.12}'}</style>
            <defs>
              <clipPath id="scan-leaf-clip"><path data-original-outline d={outline} transform={blade}/></clipPath>
              <radialGradient id="scan-leaf-wash"><stop stopColor="#e0e1c7" stopOpacity=".95"/><stop offset=".7" stopColor="#c7d0bc" stopOpacity=".7"/><stop offset="1" stopColor="#becabd" stopOpacity="0"/></radialGradient>
              {veins.map((v,i)=><path id={`scan-vein-${i}`} key={i} d={v.d}/>)}
            </defs>
            <g id="scan-leaf-art">
              <path d="M409 835Q306 824 260 780" fill="none" stroke="#758180" strokeWidth="5"/>
              <path d="M408 833Q306 820 260 780" fill="none" stroke="#c7c5ac" strokeWidth="1.5"/>
              <use href="#scan-leaf-leaf-blue" transform={blade}/>
              <g clipPath="url(#scan-leaf-clip)">
                <image href="/homepage-poc/light-botanical-preview/leaf.webp" x="-380" y="-220" width="1220" height="1830" opacity=".26"/>
                <ellipse cx="274" cy="583" rx="157" ry="146" fill="url(#scan-leaf-wash)"/>
                <path d="M260 780Q340 545 298 372Q273 242 244 60" stroke="#e4c585" strokeWidth="2" fill="none"/>
                {Array.from({length:17},(_,i)=>{const y=181+i*29,x=257+Math.sin(i/7)*58;return <path key={i} d={`M${x} ${y+44}Q${x-76} ${y+40} ${x-160} ${y-24}M${x} ${y+44}Q${x+72} ${y+20} ${x+120} ${y-45}`} fill="none" stroke="#f1e2ba" strokeWidth="1" opacity=".32"/>;})}
                {veins.map((v,i)=><path key={i} d={v.d} fill="none" stroke={skillIndex===i?'#b27e2b':'#d8bd81'} strokeWidth={skillIndex===i?4:1.7} className={styles.pigment}/>)}
              </g>
              {veins.map((_,i)=><text key={i} className={styles.veinText} style={{fontSize:i===0?23:i===2?24:26}} dy="-8" opacity={skillIndex===i&&visible?1:0}><textPath href={`#scan-vein-${i}`} startOffset="6%">{skillSpacecraft[i].title}</textPath></text>)}
            </g>
            {veins.map((v,i)=><path key={`hit-${i}`} d={v.d} fill="none" stroke="transparent" strokeWidth="62" pointerEvents="stroke" onPointerEnter={e=>{if(e.pointerType==='mouse'){const target=root.current?.querySelector<HTMLButtonElement>(`[data-scan-target="skill-${i}"]`);if(target)scan.inspect(skillSpacecraft[i].id,target);}}} onPointerLeave={scan.leave} onClick={()=>{const target=root.current?.querySelector<HTMLButtonElement>(`[data-scan-target="skill-${i}"]`);if(target)scan.select(skillSpacecraft[i].id,target);}} style={{cursor:'pointer'}}/>)}
            <WaterLens id="leaf-water" artId="scan-leaf-art" svg={leafSvg} enabled={fine&&!reduced&&skillIndex>=0}/>
          </svg>
          {veins.map((v,i)=><button key={skillSpacecraft[i].id} {...bind(skillSpacecraft[i].id)} className={styles.veinTarget} style={{left:`${v.x/520*100}%`,top:`${v.y/850*100}%`}} aria-label={`Examine ${skillSpacecraft[i].title}`} aria-expanded={selected&&skillIndex===i} aria-controls="leaf-reading" data-scan-target={`skill-${i}`} data-active={skillIndex===i&&visible}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span></button>)}
          <div id="leaf-reading" className={styles.leafReading} inert={!(selected&&skill)} aria-hidden={!(selected&&skill)} data-visible={Boolean(selected&&skill)}>
            <h3 className={styles.srOnly}>{skill?.title}</h3>
            <p>{skill ? veins[skillIndex].text : ''}</p>
            <Link href={skill?.href??'/homepage-poc/projects#skills'}>Explore skill <span aria-hidden="true">↗</span></Link>
          </div>
          <p className={styles.srOnly} aria-live="polite">{visible&&skill?`${skill.title}. ${veins[skillIndex].keywords}`:''}</p>
        </div>

</div>;
}
