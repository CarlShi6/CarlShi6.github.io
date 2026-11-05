"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./project-case-studies.module.css";

const stages = [
  ["Ideate", "Story backlog", "Gather existing material and identify stories the nonprofit can share consistently.", "Event photos, videos, program updates, and community stories", "A backlog of story ideas ready to prioritize."],
  ["Plan", "Shared calendar", "Select content, assign publishing dates, and review and approve before publishing.", "Story backlog and organized photos and videos", "A review-ready publishing calendar."],
  ["Publish", "Scheduled content", "Schedule through the recommended platform, coordinate channels, and monitor published content.", "Reviewed content and the publishing calendar", "Published content and performance signals to review."],
  ["Learn", "Next-cycle insights", "Review top content, compare topics and formats, and apply insights to the next content cycle.", "Views, engagement, and follower changes", "Priorities for the next content cycle."],
] as const;

const operationsStages = [
  ["Content assets", "Photos, videos, updates, and quotes", "Bring existing story material into one visible starting point.", "A shared source library"],
  ["Organization", "Categories and tags", "Centralize media, create content categories, and organize existing assets.", "Assets ready to select"],
  ["Review", "Selection and approval", "Choose upcoming stories and review the content before it enters the publishing queue.", "Approved content briefs"],
  ["Scheduling", "Calendar and Metricool", "Assign dates and coordinate the approved content in a shared publishing calendar.", "A scheduled publishing plan"],
  ["Publishing", "Coordinated channels", "Publish across the selected social platforms from the proposed operating workflow.", "Published content to monitor"],
  ["Analytics", "Reach and engagement signals", "Review performance signals and identify the content that generated the strongest response.", "Comparable performance evidence"],
  ["Improvement", "Next-cycle priorities", "Compare topics and formats, then apply the learning to the next content cycle.", "An informed next plan"],
] as const;

export function HopeStageIcon({ stage }: { stage: number }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {stage===0&&<><rect x="8" y="13" width="26" height="28" rx="2"/><path d="M15 13V7h25v28h-6M13 31l6-7 5 5 5-4M13 36h16"/><circle cx="17" cy="20" r="2"/></>}
    {stage===1&&<><rect x="7" y="11" width="34" height="30" rx="3"/><path d="M7 21h34M16 7v8m16-8v8M15 28h5m8 0h5m-18 7h5m8 0h5"/></>}
    {stage===2&&<><rect x="6" y="20" width="36" height="21" rx="3"/><path d="M24 32V6m-8 8 8-8 8 8M12 34h6m12 0h6"/></>}
    {stage===3&&<><path d="M38 15A17 17 0 1 0 40 29M38 6v10H28M14 32V25m9 7V19m9 13V23"/></>}
  </svg>;
}

function WorkflowArt({ stage }: { stage: number }) {
  const patternId=useId();
  return <svg className={styles.hopeWorkflowArt} viewBox="0 0 600 230" role="img" aria-label={`${stages[stage][0]} workflow schematic`} fill="none">
    <title>{`${stages[stage][0]}: ${stages[stage][1]}`}</title>
    <defs><pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" stroke="none" opacity=".12"/></pattern></defs><rect width="600" height="230" fill={`url(#${patternId})`} stroke="none"/>
    {stage===0&&<>
      <g><rect x="60" y="52" width="112" height="132" rx="8" className={styles.hopeArtPaper} transform="rotate(-9 116 118)"/><rect x="88" y="42" width="112" height="132" rx="8" className={styles.hopeArtPaper}/><rect x="103" y="58" width="82" height="65" rx="3" className={styles.hopeArtTint}/><circle cx="122" cy="76" r="8"/><path d="m103 111 23-21 20 17 16-13 23 23M104 139h80m-80 15h51"/></g>
      <path d="M230 115h90m-12-8 12 8-12 8" className={styles.hopeArtConnector}/>
      <rect x="355" y="37" width="180" height="156" rx="8" className={styles.hopeArtPaper}/>{[0,1,2].map(i=><g key={i}><rect x="373" y={57+i*43} width="24" height="24" rx="4" className={styles.hopeArtTint}/><path d={`M410 ${64+i*43}h100m-100 10h65`}/></g>)}
    </>}
    {stage===1&&<>
      <rect x="130" y="28" width="340" height="180" rx="9" className={styles.hopeArtPaper}/><path d="M130 66h340M195 17v23m210-23v23"/>
      {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${154+i*45} 79v111`} opacity=".2"/>)}{[104,141,178].map(y=><path key={y} d={`M146 ${y}h307`} opacity=".2"/>)}
      <rect x="165" y="82" width="78" height="29" rx="4" className={styles.hopeArtTint}/><path d="M178 96h49"/><rect x="301" y="119" width="123" height="29" rx="4" className={styles.hopeArtTint}/><path d="M314 133h94"/><rect x="211" y="156" width="78" height="29" rx="4" className={styles.hopeArtTint}/><path d="m225 170 5 5 10-11m8 6h24"/>
    </>}
    {stage===2&&<>
      <rect x="55" y="65" width="145" height="105" rx="8" className={styles.hopeArtPaper}/><path d="M73 87h66m-66 17h107m-107 17h80m-80 25h45"/><path d="M214 116h65v-61h76m-76 61h76m-76 0v61h76" className={styles.hopeArtConnector}/>
      {[0,1,2].map(i=><g key={i}><rect x="370" y={26+i*64} width="155" height="49" rx="7" className={styles.hopeArtPaper}/><circle cx="392" cy={50+i*64} r="9" className={styles.hopeArtTint}/><path d={`M413 ${44+i*64}h90m-90 12h62`}/></g>)}
    </>}
    {stage===3&&<>
      <defs><marker id={`${patternId}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 9 5 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
      {["M232 50Q300 8 370 50", "M410 80Q454 122 410 165", "M370 196Q300 238 232 196", "M192 165Q148 122 192 80"].map(d=><path key={d} d={d} className={styles.hopeArtConnector} markerEnd={`url(#${patternId}-arrow)`}/>)}
      {[[210,62],[392,62],[392,183],[210,183]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="25" className={styles.hopeArtPaper}/>{i===0?<path d={`M${x-8} ${y}h16m-8-8v16`}/>:i===1?<path d={`m${x-9} ${y} 6 6 12-12`}/>:i===2?<path d={`M${x-9} ${y+8}v-8m9 8v-16m9 16v-11`}/>:<path d={`M${x-9} ${y+5}q9-18 18 0m-15 4h12`}/>}</g>)}<circle cx="300" cy="122" r="25" className={styles.hopeArtTint}/><path d="m290 122 7 7 15-17"/>
    </>}
  </svg>;
}

export function HopeWorkflowExplorer() {
  const [active,setActive]=useState(0);
  const panelId=useId();
  const stage=stages[active];
  return <>
    <p className={styles.hopeInteractionHint}>Select a stage to trace how content moves through the system.</p>
    <div className={styles.hopeStageControls} role="group" aria-label="Explore content workflow">{stages.map((s,i)=><button type="button" key={s[0]} aria-pressed={active===i} aria-controls={panelId} onClick={()=>setActive(i)}><HopeStageIcon stage={i}/><span><small>0{i+1}</small>{s[0]}</span></button>)}</div>
    <div id={panelId} className={styles.hopeWorkflowPanel}>
      <div className={styles.hopeArtFrame} key={active}><WorkflowArt stage={active}/><span>Reconstructed diagram from verified project information · not client software</span></div>
      <div className={styles.hopeStageDetail} aria-live="polite" aria-atomic="true"><span>0{active+1} · {stage[0]}</span><h4>{stage[1]}</h4><p>{stage[2]}</p><dl><div><dt>Input</dt><dd>{stage[3]}</dd></div><div><dt>Handoff</dt><dd>{stage[4]}</dd></div></dl></div>
    </div>
    <div className={styles.hopeWorkflowFooter}><span>Ideate → Plan → Publish → Learn ↶</span><button type="button" onClick={()=>setActive((active+1)%stages.length)}>{active===3?"Back to ideation":"Next stage"} <span aria-hidden="true">→</span></button></div>
  </>;
}

export function HopeOperationsExplorer() {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const railRef = useRef<HTMLDivElement>(null);
  const stage = operationsStages[active];
  const goToStage = (index: number) => setActive(Math.max(0, Math.min(operationsStages.length - 1, index)));
  useEffect(() => {
    railRef.current?.querySelector<HTMLButtonElement>("[aria-selected='true']")?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);
  const selectWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? operationsStages.length - 1 : Math.max(0, Math.min(operationsStages.length - 1, index + (event.key === "ArrowRight" ? 1 : -1)));
    goToStage(next);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };
  return <div className={styles.hopeOperationsExplorer}>
    <div className={styles.hopeOperationsIntro}>
      <p className={styles.hopeInteractionHint}>Move through the seven-stage workflow with the arrows, step cards, or keyboard.</p>
      <span>Swipe or scroll the steps <b aria-hidden="true">→</b></span>
    </div>
    <div ref={railRef} className={styles.hopeOperationsRail} role="tablist" aria-label="Explore the proposed content operations workflow">
      {operationsStages.map((item, index) => <button key={item[0]} type="button" role="tab" aria-selected={active === index} aria-controls={panelId} tabIndex={active === index ? 0 : -1} onClick={() => goToStage(index)} onKeyDown={(event) => selectWithKeyboard(event, index)}><small>{String(index + 1).padStart(2, "0")}</small><span>{item[0]}</span><i aria-hidden="true">View stage</i></button>)}
    </div>
    <div id={panelId} className={styles.hopeOperationsPanel} role="tabpanel" aria-live="polite">
      <span>{String(active + 1).padStart(2, "0")} / {String(operationsStages.length).padStart(2, "0")} · Proposed workflow</span>
      <h4>{stage[0]}</h4>
      <strong>{stage[1]}</strong>
      <p>{stage[2]}</p>
      <dl><dt>Handoff</dt><dd>{stage[3]}</dd></dl>
    </div>
    <div className={styles.hopeOperationsNav} aria-label="Workflow stage controls">
      <span><b>{String(active + 1).padStart(2, "0")}</b> / {String(operationsStages.length).padStart(2, "0")} · {stage[0]}</span>
      <div>
        <button type="button" onClick={() => goToStage(active - 1)} disabled={active === 0} aria-label="Previous workflow stage"><span aria-hidden="true">←</span> Previous</button>
        <button type="button" onClick={() => goToStage(active + 1)} disabled={active === operationsStages.length - 1} aria-label="Next workflow stage">Next <span aria-hidden="true">→</span></button>
      </div>
    </div>
    <p className={styles.hopeOperationsBoundary}>This is a recommendation—not evidence of client implementation.</p>
  </div>;
}

const phases=[
  {start:1,end:2,title:"Set up",description:"Connect social platforms, review performance, and establish baseline metrics.",output:"A starting point for measurement"},
  {start:3,end:5,title:"Organize",description:"Centralize photos and videos, create categories, and tag existing assets.",output:"A usable content library"},
  {start:6,end:7,title:"Plan",description:"Select content, build a posting calendar, and review before publishing.",output:"A review-ready publishing plan"},
  {start:8,end:21,title:"Execute",description:"Schedule through Metricool, publish across platforms, and monitor reach and engagement.",output:"A first publishing cycle"},
  {start:22,end:30,title:"Optimize",description:"Identify top content, compare topics and formats, and apply insights to the next cycle.",output:"Priorities for the next cycle"},
] as const;

const phaseTasks=[
  ["Connect social platforms", "Review recent performance", "Establish baseline metrics"],
  ["Centralize photos and videos", "Create content categories", "Tag existing assets"],
  ["Select upcoming content", "Build the posting calendar", "Review and approve"],
  ["Schedule through Metricool", "Publish across platforms", "Monitor reach and engagement"],
  ["Identify top-performing content", "Compare topics and formats", "Apply insights to the next cycle"],
] as const;

function RoadmapPhaseArt({ phase }: { phase: number }) {
  const label = ["Connected channels and baseline", "Organized source library", "Review-ready calendar", "Coordinated publishing cycle", "Learning applied to the next cycle"][phase];
  return <figure className={styles.hopePhaseVisual}>
    <svg viewBox="0 0 620 250" role="img" aria-label={`${phases[phase].title}: ${label}`} fill="none">
      <title>{`${phases[phase].title}: ${label}`}</title>
      <path className={styles.hopePhaseOrbit} d="M78 126C172 36 432 34 544 126 432 220 172 216 78 126Z" />
      {phase === 0 && <><circle cx="172" cy="126" r="42"/><circle cx="310" cy="126" r="42"/><circle cx="448" cy="126" r="42"/><path d="M214 126h54m84 0h54M172 110v32m-16-16h32M292 137l13-13 12 10 17-20M432 142v-28m16 28v-46m16 46v-18"/></>}
      {phase === 1 && <><path d="M185 84h250v112H185zM217 84V62h82l22 22M213 119h194M213 149h126M213 173h170"/><circle cx="405" cy="149" r="13"/></>}
      {phase === 2 && <><rect x="179" y="63" width="262" height="139" rx="4"/><path d="M179 101h262M231 49v29m158-29v29M215 126h62m34 0h94m-190 36h110m34 0h66"/><circle cx="344" cy="162" r="14"/></>}
      {phase === 3 && <><rect x="205" y="83" width="210" height="112" rx="4"/><path d="M310 159V48m-31 33 31-33 31 33M230 111h57m-57 24h98m-98 24h45M425 88l45-25m-45 58 60 5m-60 28 47 28"/></>}
      {phase === 4 && <><path d="M217 165v-42m62 42V91m62 74v-25m62 25V66M198 183h231"/><path d="M219 76c35-37 102-45 150-20 32 17 53 48 57 82"/><path d="m410 119 16 19 16-20"/><circle cx="219" cy="76" r="9"/></>}
    </svg>
    <figcaption><span>Reconstructed diagram from verified project information</span><strong>{label}</strong></figcaption>
  </figure>;
}

export function HopeRoadmapExplorer() {
  const [day,setDay]=useState(1);
  const sliderId=useId();
  const detailId=useId();
  const index=phases.findIndex(p=>day>=p.start&&day<=p.end);
  const phase=phases[index];
  return <div className={styles.hopeInteractiveRoadmap}>
    <div className={styles.hopeTimelineHeading}><span>Proposed rollout · 30 days</span><p>Explore the plan, one phase at a time.</p></div>
    <div className={styles.hopeDayControl}><label htmlFor={sliderId}>Drag to explore <strong>Day {day} / 30</strong></label><input id={sliderId} type="range" min="1" max="30" step="1" value={day} aria-valuetext={`Day ${day}: ${phase.title}`} onChange={e=>setDay(Number(e.target.value))}/><div aria-hidden="true"><span>Day 1</span><span>Day 15</span><span>Day 30</span></div></div>
    <div className={styles.hopeGantt} role="group" aria-label="Select an implementation phase">
      <div className={styles.hopeGanttAxis} aria-hidden="true"><span>Phase</span><span>01</span><span>15</span><span>30</span></div>
      {phases.map((p,i)=><div key={p.title} className={styles.hopePhaseGroup} data-active={i===index}>
        <button type="button" className={styles.hopeGanttRow} aria-pressed={i===index} aria-expanded={i===index} aria-controls={`${detailId}-${i}`} onClick={()=>setDay(p.start)} onKeyDown={(event)=>{ if(!["ArrowUp","ArrowDown","Home","End"].includes(event.key)) return; event.preventDefault(); const next=event.key==="Home"?0:event.key==="End"?phases.length-1:(i+(event.key==="ArrowDown"?1:-1)+phases.length)%phases.length; setDay(phases[next].start); event.currentTarget.closest(`.${styles.hopeGantt}`)?.querySelectorAll<HTMLButtonElement>(`.${styles.hopeGanttRow}`)[next]?.focus(); }}><span className={styles.hopeGanttLabel}><b>0{i+1} · {p.title}</b><small>Days {p.start}–{p.end}</small></span><span className={styles.hopeGanttTrack}><span className={styles.hopeGanttBar} style={{gridColumn:`${p.start} / ${p.end+1}`}}/><span className={styles.hopeGanttCursor} style={{left:`${((day-.5)/30)*100}%`}}/></span></button>
        <div id={`${detailId}-${i}`} className={styles.hopeInlinePhase} hidden={i!==index} role="region" aria-label={`${p.title} phase details`}>
          <RoadmapPhaseArt phase={i}/>
          <div className={styles.hopeInlinePlan}>
            <span className={styles.hopeInlineEyebrow}>In this phase · Proposed tasks</span>
            <ol className={styles.hopeInlineTasks}>{phaseTasks[i].map((task,j)=><li key={task}><span aria-hidden="true">0{j+1}</span><p>{task}</p></li>)}</ol>
            <div className={styles.hopeInlineOutput}><span aria-hidden="true">↳</span><p><small>Intended output</small>{p.output}</p></div>
          </div>
        </div>
      </div>)}
    </div>
    <p className={styles.hopeSelectionStatus} role="status" aria-live="polite" aria-atomic="true">{`Day ${day}: ${phase.title}. ${phase.description} Intended output: ${phase.output}.`}</p>
    <p className={styles.hopeRoadmapNote}>Conceptual implementation plan · The marker explores the proposed schedule. It does not indicate implementation progress or completed work.</p>
  </div>;
}
