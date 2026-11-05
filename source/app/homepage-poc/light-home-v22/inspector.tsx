import {useEffect,useState,type RefObject} from 'react';
import {createGrowth} from './entrance';
import {defaults,type Settings} from './growth-model';
import styles from './world.module.css';

const controls=[
 ['duration','Total entrance duration',3.5,7,.1,'s'],
 ['speed','Growth Speed',.25,2,.05,'×'],
 ['trunk','Trunk Extension',.5,1.8,.05,'×'],
 ['delay','Branch Growth Delay',0,.2,.005,'s / joint'],
 ['thickness','Branch Thickness',.4,2,.05,'× young wood'],
 ['leafTiming','Leaf Emergence Timing',.02,.55,.01,'s after arrival'],
] as const;
export function TreeInspector({api}:{api:RefObject<ReturnType<typeof createGrowth>|null>}){
 const [state,setState]=useState({progress:0,playing:false,settings:defaults});
 useEffect(()=>{const timer=setInterval(()=>{if(api.current){const s=api.current.snapshot();setState({progress:s.progress,playing:s.playing,settings:s.settings});}},100);return()=>clearInterval(timer);},[api]);
 const configure=(patch:Partial<Settings>)=>api.current?.configure(patch);
 return <details className={styles.inspector} data-tree-inspector data-ui>
  <summary>Tree Growth Inspector · v2.2</summary>
  <p>One connected growth front. Final watercolor geometry is preserved.</p>
  <label>Growth Progress — {Math.round(state.progress*100)}%<input aria-label="Growth Progress" type="range" min="0" max="100" step=".2" value={state.progress*100} onChange={e=>api.current?.seek(Number(e.target.value)/100*state.settings.duration)}/></label>
  {controls.map(([key,label,min,max,step,unit])=><label key={key}>{label}: {state.settings[key].toFixed(2)} {unit}<input aria-label={label} type="range" min={min} max={max} step={step} value={state.settings[key]} onChange={e=>configure({[key]:Number(e.target.value)})}/></label>)}
  <label>Tree study<select aria-label="Tree study" value={state.settings.side} onChange={e=>configure({side:e.target.value as Settings['side']})}><option value="left">Projects tree only</option><option value="both">Both asymmetric trees</option></select></label>
  <div><button onClick={()=>{api.current?.seek(0);api.current?.play();}}>Replay</button><button onClick={()=>state.playing?api.current?.pause():api.current?.play()}>{state.playing?'Pause':'Play'}</button><button onClick={()=>api.current?.finish()}>Final frame</button></div>
  <p>Thickness adjusts young-wood maturation, not the approved final silhouette. Scrubbing pauses playback.</p>
 </details>;
}
