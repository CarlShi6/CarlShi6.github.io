import gsap from 'gsap';
import type { CaptureController } from '../dark-motion-e6/controller';
import {duration, type createFormation} from '../light-home-v24-formation/motion';
import type { createSpiralPass } from '../homepage-rc3/spiral-pass';

export type ThemeDarkController=Pick<CaptureController,'transitionTakeover'|'transitionSeek'|'transitionRelease'|'finish'|'renderSurface'> & {snapshot():{ready:boolean;time:number;plan:{end:number}}};
export type Theme='light'|'dark';
export type View={host:Theme;target:Theme;busy:boolean;dark:boolean;light:boolean;entrance:boolean};
const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));

/** One reversible playhead. Children are paused render adapters, never competing timelines. */
export function createThemeController(root:HTMLElement, initial:Theme, getDark:()=>ThemeDarkController|null, change:(view:View)=>void, getLight:()=>ReturnType<typeof createFormation>|null,visitedKey='dark-motion-e6-visited'){
  // Scene owns the renderer and its ambient lifecycle; this adapter only scrubs entrance.
  function createLightTimeline(){
    const api=getLight();
    if(!api)throw new Error('Light formation scene not mounted');
    return {duration,seek:(seconds:number)=>api.seek(seconds/duration),finish:()=>api.finish(),dispose:()=>{}};
  }
  let host=initial,target=initial,busy=false,disposed=false,hidden=document.hidden,boot=initial==='dark';
  let light:ReturnType<typeof createLightTimeline>|undefined,spiral:ReturnType<typeof createSpiralPass>|undefined;
  let master:gsap.core.Timeline|undefined,owned:ThemeDarkController|null=null;
  let makeSpiral:typeof createSpiralPass|undefined;
  let spiralLoading:Promise<void>|undefined;
  function loadSpiral(){spiralLoading??=import('../homepage-rc3/spiral-pass').then(module=>{makeSpiral=module.createSpiralPass;}).catch(()=>{if(!disposed)settle();});}
  const failedDark=()=>!!root.querySelector('[data-rc2-dark] picture img[src*="approved-field"], [data-reference-scene][data-failed="true"]');
  const clock={p:0}; let lightEnd=3,darkEnd=11.1325,total=14.1325,mode:Theme=initial;
  let lightBoot=false,lightBootTime=0,interruptedGrowth:number|null=null;
  let running=false,lastHost=initial,frames=0,waitingSince=0,bootFinal=false; const frameTimes:number[]=[];
  let lastVisibleTick=performance.now();
  let frozenCenter:{x:number;y:number}|undefined;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),small=matchMedia('(max-width: 900px)');
  function emit(){change({host,target,busy,dark:busy||host==='dark',light:busy||host==='light',entrance:lightBoot});root.dataset.rc2Phase=lightBoot?'light-entrance':busy?(clock.p<=lightEnd?'light-growth':'dark-capture'):'idle';}
  function publish(theme:Theme){document.documentElement.dataset.portfolioTheme=theme;root.dataset.theme=theme;}
  function persist(theme:Theme){try{localStorage.setItem('carl-portfolio-home-theme',theme);}catch{/* Optional preference. */}}
  function startTicker(){if(!running){running=true;lastVisibleTick=performance.now();gsap.ticker.add(tick);}}
  function stopTicker(){if(running){running=false;gsap.ticker.remove(tick);}}
  function resetAdapters(){spiral?.dispose();spiral=undefined;master?.kill();master=undefined;light?.dispose();light=undefined;owned=null;frozenCenter=undefined;}
  function center(){
    const marker=root.querySelector<HTMLElement>(host==='dark'?"[data-transition-role='dark-hole']":'[data-light-center]');
    if(marker){const r=marker.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}
    return frozenCenter??{x:innerWidth/2,y:innerHeight/2};
  }
  function prepare(){
    const api=getDark(),lightRoot=root.querySelector<HTMLElement>('[data-rc2-light]');
    if(!api?.snapshot().ready||!lightRoot||!getLight()||!makeSpiral)return false;
    if(owned)return true;
    owned=api;api.transitionTakeover();
    light??=createLightTimeline();lightEnd=light.duration;darkEnd=api.snapshot().plan.end;total=lightEnd+darkEnd;
    const initialPosition=host==='dark'?lightEnd+Math.min(api.snapshot().time,darkEnd):interruptedGrowth===null?0:lightEnd-interruptedGrowth;
    interruptedGrowth=null;
    clock.p=0;
    master=gsap.timeline({paused:true,id:'homepage-rc2-master',defaults:{ease:'none'}}).to(clock,{p:total,duration:total},0);
    master.time(initialPosition);spiral=makeSpiral(api);frozenCenter=center();
    return true;
  }
  function paint(){
    if(!owned||!light||!spiral)return;
    const next:Theme=clock.p>lightEnd?'dark':'light';
    if(next!==host){host=next;publish(host);emit();}
    // Light is never exposed in its completed state during Dark formation.
    light.seek(clamp(lightEnd-clock.p,0,lightEnd));
    owned.transitionSeek(Math.max(0,clock.p-lightEnd));
    // Let the incoming bare planet become visible while it is still expanding.
    // The existing Spiral shader/pass is unchanged; only its Light handoff overlap is shorter.
    const mask=clock.p<=lightEnd?clamp(1-(lightEnd-clock.p)/(mode==='light'?.65:1.45)):clamp(1-(clock.p-lightEnd)/2.15);
    root.dataset.rc2Mask=String(mask>0);
    if(host==='dark'){
      const identity=root.querySelector<HTMLElement>("[data-transition-role='dark-identity']");
      if(identity)identity.style.opacity=String(clamp((clock.p-lightEnd-2.15)/.65));
    }
    // Interpolate the two measured centers only at the fully covered handoff.
    const current=center();
    if(host===lastHost)frozenCenter=current;
    else {frozenCenter=current;lastHost=host;}
    spiral.render(mask,mode,frozenCenter,clock.p,host==='light');
    root.dataset.rc2Progress=clock.p.toFixed(3);frames++;
  }
  function settle(next=target){
    lightBoot=false;interruptedGrowth=null;root.dataset.lightBoot='done';
    const api=getDark();target=next;host=next;busy=false;boot=next==='dark'&&!api&&!failedDark();bootFinal=boot;
    if(document.activeElement?.hasAttribute('data-rc2-skip'))root.querySelector<HTMLElement>('[data-rc2-switch] button')?.focus({preventScroll:true});
    if(next==='dark'&&api){api.transitionSeek(api.snapshot().plan.end);api.transitionRelease();try{sessionStorage.setItem(visitedKey,'true');}catch{/* Optional. */}}
    if(next==='light')getLight()?.finish();else getLight()?.pause();resetAdapters();stopTicker();delete root.dataset.rc2Mask;publish(next);persist(next);emit();
    if(boot){waitingSince=performance.now();startTicker();}
  }
  function request(next:Theme){
    if(disposed)return;
    publish(host);
    if(next===target&&busy)return;
    if(!busy&&next===host)return;
    if(lightBoot){interruptedGrowth=lightBootTime;lightBoot=false;root.dataset.lightBoot='done';}
    target=next;persist(next);getLight()?.pause();
    if(reduced.matches||small.matches||failedDark()){settle(next);if(next==='dark'&&!failedDark()){boot=true;bootFinal=true;startTicker();}return;}
    loadSpiral();
    if(!busy){window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));mode=next;busy=true;boot=false;owned=null;waitingSince=performance.now();}
    emit();startTicker();
  }
  function tick(_time:number,deltaMs:number){
    // GSAP lag smoothing plus a per-frame 50ms cap stretched six seconds into
    // minutes in slow SVG renderers. Advance by visible elapsed time instead;
    // visibility changes reset this clock, so background time is never replayed.
    const now=performance.now(),elapsed=Math.max(0,(now-lastVisibleTick)/1000);lastVisibleTick=now;
    if(disposed||hidden)return;
    if(lightBoot&&!busy){
      if(root.querySelector('[data-formation-scene]')?.getAttribute('data-art-ready')!=='true'&&performance.now()-waitingSince<2500)return;
      lightBootTime=Math.min(lightEnd,lightBootTime+elapsed);
      light?.seek(lightBootTime);root.dataset.lightTime=lightBootTime.toFixed(3);
      if(lightBootTime>=lightEnd)finishLightBoot();
      return;
    }
    if(boot&&!busy){const api=getDark();if(!api?.snapshot().ready){if(failedDark()||(waitingSince&&performance.now()-waitingSince>6000)){boot=false;stopTicker();}return;}let visited=bootFinal;try{visited ||= sessionStorage.getItem(visitedKey)==='true';sessionStorage.setItem(visitedKey,'true');}catch{/* Optional. */}if(visited)api.finish();api.transitionRelease();boot=false;stopTicker();return;}
    if(!busy)return;
    if(owned&&getDark()!==owned){settle();return;}
    if(!prepare()){if(performance.now()-waitingSince>6000)settle();return;}
    // Reverse the same playhead, never finish-and-restart. Incoming E.6 keeps its exact timings.
    const forward=target==='dark';
    const rate=forward?(clock.p<lightEnd?2.15:1):(clock.p>lightEnd?3.05:1.35);
    const next=clamp(clock.p+(forward?1:-1)*elapsed*rate,0,total);
    master!.time(next,false);paint();
    frameTimes.push(deltaMs);if(frameTimes.length>2400)frameTimes.shift();
    if(forward?next>=total:next<=0)settle();
  }
  function finishLightBoot(){if(document.activeElement?.hasAttribute('data-rc2-skip'))root.querySelector<HTMLElement>('[data-rc2-switch] button')?.focus({preventScroll:true});light?.finish();light?.dispose();light=undefined;lightBoot=false;lightBootTime=lightEnd;root.dataset.lightBoot='done';stopTicker();emit();}
  function skip(){if(lightBoot)finishLightBoot();else if(busy)settle();else getDark()?.finish();}
  function visibility(){hidden=document.hidden;lastVisibleTick=performance.now();if(!hidden)waitingSince=lastVisibleTick;}
  function key(event:KeyboardEvent){if(event.key==='Escape'&&(busy||lightBoot)){event.preventDefault();skip();}}
  function preference(){if(reduced.matches&&lightBoot)skip();else if((reduced.matches||small.matches)&&busy)skip();}
  function storage(event:StorageEvent){if(event.key==='carl-portfolio-home-theme'&&(event.newValue==='light'||event.newValue==='dark'))request(event.newValue);}
  function resize(){if(lightBoot)finishLightBoot();else if(busy)paint();}
  document.addEventListener('visibilitychange',visibility);window.addEventListener('keydown',key);window.addEventListener('storage',storage);window.addEventListener('resize',resize);
  reduced.addEventListener('change',preference);small.addEventListener('change',preference);
  publish(initial);
  if(initial==='light'&&!reduced.matches){
    light=createLightTimeline();lightEnd=light.duration;light.seek(0);lightBoot=true;root.dataset.lightBoot='running';waitingSince=performance.now();startTicker();
  }else root.dataset.lightBoot='done';
  emit();if(boot){waitingSince=performance.now();startTicker();}
  return {request,skip,
    snapshot(){return {host,target,busy,hidden,position:clock.p,lightEnd,darkEnd,total,mode,frames,frameTimes:[...frameTimes],canvases:root.querySelectorAll('canvas').length,formation:getLight()?.snapshot(),center:center(),owned:!!owned,entrance:lightBoot,lightTime:lightBootTime};},
    seekLight(seconds:number){if(lightBoot){lightBootTime=clamp(seconds,0,lightEnd);light?.seek(lightBootTime);root.dataset.lightTime=lightBootTime.toFixed(3);}},
    // Development-only caller exposes this for reproducible intermediate-frame comparisons.
    seek(position:number){if(prepare()){master!.time(clamp(position,0,total));paint();}},
    dispose(){disposed=true;stopTicker();resetAdapters();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('keydown',key);window.removeEventListener('storage',storage);window.removeEventListener('resize',resize);reduced.removeEventListener('change',preference);small.removeEventListener('change',preference);},
  };
}
export type ThemeController=ReturnType<typeof createThemeController>;
