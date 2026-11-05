'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CsLogo } from '../../cs-logo';
import { LeafDefinitions } from '../../light-home-v24-formation/artwork';
import { outline } from '../../light-skills-v3/leaf';
import { projectPlanets, skillSpacecraft } from '../../space-system.data';
import { projectFacts } from '../../light-home-v2/data';
import { useGateBScan } from './interaction';
import { WaterLens } from '../../botanical-scan/water-lens';
import styles from './study.module.css';

const project = projectPlanets[0];
const facts = projectFacts[project.id];
const blade = 'translate(260 780) scale(16)';
const veins = [
  { d: 'M150 258 Q235 326 337 279', x: 150, y: 258, text: 'Frame opportunities, constraints and evidence.', keywords: 'Opportunity · priorities · roadmaps' },
  { d: 'M157 366 Q240 419 374 348', x: 374, y: 348, text: 'Connect models, APIs and data to user decisions.', keywords: 'Models · APIs · data · feasibility' },
  { d: 'M121 443 Q222 505 314 458', x: 121, y: 443, text: 'Make complex product logic understandable and testable.', keywords: 'Research · interaction · prototypes' },
  { d: 'M169 515 Q298 584 398 490', x: 398, y: 490, text: 'Turn plans into working outcomes through delivery.', keywords: 'Scope · sequencing · learning' },
];

export function WaterLensStudy() {
  const root = useRef<HTMLElement>(null), paper = useRef<HTMLDivElement>(null);
  const leafSvg = useRef<SVGSVGElement>(null), paperSvg = useRef<SVGSVGElement>(null);
  const [reduced, setReduced] = useState(true), [fine, setFine] = useState(false);
  const scan = useGateBScan(reduced, root);
  const selected = scan.phase === 'selected';
  const visible = scan.phase === 'revealed' || selected;
  const projectActive = scan.id === project.id && scan.phase !== 'dismissed';
  const projectSelected = selected && projectActive;
  const skillIndex = skillSpacecraft.findIndex(item => item.id === scan.id);
  const skill = skillIndex >= 0 ? skillSpacecraft[skillIndex] : null;
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)'), pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => { setReduced(motion.matches); setFine(pointer.matches); };
    update(); motion.addEventListener('change', update); pointer.addEventListener('change', update);
    return () => { motion.removeEventListener('change', update); pointer.removeEventListener('change', update); };
  }, []);
  useLayoutEffect(() => {
    const tween = gsap.to(paper.current, { scale: projectSelected ? 1 : .59, rotation: projectSelected ? 0 : -6, duration: reduced ? 0 : .55, ease: 'power3.inOut', overwrite: true });
    // Kill at its current transform on reversal; reverting would snap to the rest pose.
    return () => { tween.kill(); };
  }, [projectSelected, reduced]);
  const bind = (id: string) => ({
    onPointerEnter: (e: React.PointerEvent<HTMLButtonElement>) => { if (e.pointerType === 'mouse') scan.inspect(id, e.currentTarget); },
    onPointerLeave: () => scan.leave(),
    onFocus: (e: React.FocusEvent<HTMLButtonElement>) => scan.inspect(id, e.currentTarget),
    onBlur: () => scan.leave(),
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => scan.select(id, e.currentTarget),
  });
  return <main ref={root} className={styles.page} data-phase={scan.phase} data-active-id={scan.id ?? ''}>
    <nav className={styles.nav} aria-label="Primary navigation">
      <Link href="/" className={styles.home}><CsLogo /><span>Home</span></Link>
      <span className={styles.studyLabel}>Water lens · Gate B</span>
      <div><Link href="/homepage-poc/projects">Projects</Link><Link href="/homepage-poc/about">About</Link></div>
    </nav>
    <header className={styles.intro}><h1>A closer look.</h1><p><span className={styles.hoverHint}>Hover or focus to discover. </span><span className={styles.touchHint}>Tap to discover. </span>Choose to explore; click outside or press Escape to return.</p></header>
    <div className={styles.specimens}>
      <section className={styles.projectSection} aria-labelledby="project-heading">
        <header className={styles.sectionHeading}><span>01 /</span><h2 id="project-heading">Projects</h2><p>One story, held in paper.</p></header>
        <div className={styles.hanging}>
          <svg className={styles.branch} viewBox="0 0 500 140" preserveAspectRatio="none" aria-hidden="true"><path d="M35 51Q151 20 251 60T469 43" stroke="#817d6b" strokeWidth="6" fill="none"/><path d="M35 49Q151 19 251 58T469 41M214 48Q193 30 188 13M320 75Q348 24 368 20" stroke="#c7b999" strokeWidth="2" fill="none"/><path d="M250 60Q244 99 250 140" stroke="#a28e6a" strokeWidth="1.7" fill="none"/></svg>
          <div ref={paper} className={styles.paper} data-scan-boundary data-selected={projectSelected} data-revealed={projectActive && visible}>
            <svg ref={paperSvg} className={styles.paperArt} viewBox="0 0 360 500" aria-hidden="true">
              <defs>
                <linearGradient id="scan-paper" x2="1" y2="1"><stop stopColor="#faf3df"/><stop offset=".65" stopColor="#eee3cb"/><stop offset="1" stopColor="#e0d2b6"/></linearGradient>
                <filter id="scan-paper-grain"><feTurbulence type="fractalNoise" baseFrequency=".13" numOctaves="3" seed="8"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
                <clipPath id="scan-tag-clip"><path d="M47 2L312 2L353 48L349 481Q350 496 331 498L28 495Q10 495 10 478L7 49Z"/></clipPath>
              </defs>
              <g id="scan-tag-art">
                <path d="M47 2L312 2L353 48L349 481Q350 496 331 498L28 495Q10 495 10 478L7 49Z" fill="url(#scan-paper)" stroke="#c8b895" filter="url(#scan-paper-grain)"/>
                <g clipPath="url(#scan-tag-clip)"><image href={project.image} x={projectSelected?260:30} y={projectSelected?65:283} width={projectSelected?68:300} height={projectSelected?86:194} preserveAspectRatio="xMidYMid slice" opacity=".9"/></g>
                <circle cx="180" cy="24" r="7" fill="#b8a689"/><circle cx="180" cy="24" r="3" fill="#faf5e7"/>
                <path d="M180-20Q173 11 180 24" stroke="#8e7b5c" strokeWidth="2" fill="none"/>
              </g>
              <WaterLens id="tag-water" artId="scan-tag-art" svg={paperSvg} enabled={fine && !reduced && projectActive && !selected}/>
            </svg>
            <button {...bind(project.id)} className={styles.tagTarget} aria-label={`Examine ${project.title}`} aria-expanded={projectSelected} aria-controls="tag-reading" data-scan-target="project">
              <span className={styles.tagNumber}>01 / Selected project</span>
              <span className={styles.tagTitle}>{project.title}</span>
              <span className={styles.tagHint}>{projectSelected ? 'Working prototype' : projectActive && visible ? 'Choose to look closer' : 'A decision, made clearer.'}</span>
            </button>
            <div id="tag-reading" className={styles.tagReading} inert={!projectSelected} aria-hidden={!projectSelected}>
              <dl><dt>What</dt><dd>{facts.what}</dd><dt>Role</dt><dd>{facts.role.replaceAll('Â·','·')}</dd><dt>Verified deliverable</dt><dd>{facts.deliverable}</dd></dl>
              <Link href={project.href}>Look Closer <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.skillSection} aria-labelledby="skill-heading">
        <header className={styles.sectionHeading}><span>02 /</span><h2 id="skill-heading">Skills</h2><p>Four veins. One living leaf.</p></header>
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
              {veins.map((_,i)=><text key={i} className={styles.veinText} data-revealed={skillIndex===i&&visible} style={{fontSize:i===0?23:i===2?24:26}} dy="-8" opacity={skillIndex===i&&visible?1:0}><textPath href={`#scan-vein-${i}`} startOffset="6%">{skillSpacecraft[i].title}</textPath></text>)}
            </g>
            {veins.map((v,i)=><path key={`hit-${i}`} d={v.d} fill="none" stroke="transparent" strokeWidth="62" pointerEvents="stroke" onPointerEnter={e=>{if(e.pointerType==='mouse'){const target=root.current?.querySelector<HTMLButtonElement>(`[data-scan-target="skill-${i}"]`);if(target)scan.inspect(skillSpacecraft[i].id,target);}}} onPointerLeave={scan.leave} onClick={()=>{const target=root.current?.querySelector<HTMLButtonElement>(`[data-scan-target="skill-${i}"]`);if(target)scan.select(skillSpacecraft[i].id,target);}} style={{cursor:'pointer'}}/>)}
            <WaterLens id="leaf-water" artId="scan-leaf-art" svg={leafSvg} enabled={fine&&!reduced&&skillIndex>=0&&!selected}/>
          </svg>
          {veins.map((v,i)=><button key={skillSpacecraft[i].id} {...bind(skillSpacecraft[i].id)} className={styles.veinTarget} style={{left:`${v.x/520*100}%`,top:`${v.y/850*100}%`}} aria-label={`Examine ${skillSpacecraft[i].title}`} aria-expanded={selected&&skillIndex===i} aria-controls="leaf-reading" data-scan-target={`skill-${i}`} data-active={skillIndex===i&&visible}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span></button>)}
          <div key={skill?.id ?? "empty"} id="leaf-reading" className={styles.leafReading} inert={!(selected&&skill)} aria-hidden={!(selected&&skill)} data-visible={Boolean(selected&&skill)}>
            <h3 className={styles.srOnly}>{skill?.title}</h3>
            <p>{skill ? veins[skillIndex].text : ''}</p>
            <Link href={skill?.href??'/homepage-poc/projects#skills'}>Explore skill <span aria-hidden="true">↗</span></Link>
          </div>
          <p className={styles.srOnly} aria-live="polite">{visible&&skill?`${skill.title}. ${veins[skillIndex].keywords}`:''}</p>
        </div>
      </section>
    </div>
    <footer className={styles.footer}><span>One project tag and one Skills leaf. An isolated study.</span><Link href="/">Current homepage ↗</Link></footer>
  </main>;
}
