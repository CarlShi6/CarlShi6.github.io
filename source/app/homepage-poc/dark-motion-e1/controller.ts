import gsap from 'gsap';
import { createAmbientRenderer } from './renderer';
import type { Formation } from '../dark-motion-c/renderer';
import { createGravityPath, transportProgress, type GravityPath } from '../dark-motion-c/paths';
import { defaults, materialDefaults, schedule, type Setting } from '../dark-motion-e/model';
import { captureResponse, ranges, responseVelocity, smooth } from '../dark-motion-d/model';
import { withCaptureApproach } from '../dark-motion-e/paths';
import { ambientDefaults, ambientPose, ambientRanges, representativeAmbientObjects, type AmbientMode, type AmbientSetting } from './model';

export function createLivingObjectController(root:HTMLElement,canvas:HTMLCanvasElement,onStatus:()=>void,onFailure:()=>void){
  const stage=root.querySelector<HTMLElement>("section[aria-label='Dark gravitational portfolio system']")!;
  const hole=root.querySelector<HTMLElement>("[data-transition-role='dark-hole']")!;
  const identity=root.querySelector<HTMLElement>("[data-transition-role='dark-identity']")!;
  const objects=Array.from(root.querySelectorAll<HTMLElement>('[data-object-id]'));
  const art=objects.map(el=>el.querySelector<HTMLElement>('span')!);
  const view=createAmbientRenderer(canvas);
  view.renderer.debug.onShaderError=onFailure;
  const state:Formation={horizon:.018,photon:0,formation:0,density:.35,distortion:0,identity:0,settle:0};
  const settings={...defaults},tuning={...materialDefaults},ambient={...ambientDefaults};
  const enabled=objects.map((_,i)=>representativeAmbientObjects.includes(i as 0|4));
  const phases=objects.map(()=>({reveal:0,capture:0}));
  let mode:AmbientMode='coupled',plan=schedule(settings),paths:GravityPath[]=[];
  let time=0,spin=0,flowTime=0,orbitTime=0,userPaused=false,hidden=document.hidden,disposed=false,ready=false;
  let fallback=false,debug=false,quality=1,frameCount=0;
  const frameTimes:number[]=[];
  let master:gsap.core.Timeline,timelineContext:gsap.Context|undefined;
  const setters=objects.map(el=>({x:gsap.quickSetter(el,'x','px'),y:gsap.quickSetter(el,'y','px'),rotation:gsap.quickSetter(el,'rotation','deg'),scale:gsap.quickSetter(el,'scale')}));
  const context=gsap.context(()=>{
    gsap.set(identity,{autoAlpha:1});gsap.set(objects,{x:0,y:0,rotation:0,scale:1,autoAlpha:1});gsap.set(art,{filter:'brightness(1)'});
  },root);
  art[0]?.setAttribute('data-e1-surface','true');art[4]?.setAttribute('data-e1-technology','satellite');

  function buildTimeline(){
    timelineContext?.revert();plan=schedule(settings);
    Object.assign(state,{horizon:.018,photon:0,formation:0,density:.35,distortion:0,identity:0,settle:0});
    phases.forEach(p=>{p.reveal=0;p.capture=0;});
    timelineContext=gsap.context(()=>{
      master=gsap.timeline({id:'motion-e1-master',paused:true,defaults:{ease:'none'}})
        .to(state,{horizon:1,duration:settings.birthDuration,ease:'power2.out'},0)
        .to(state,{photon:1,duration:settings.birthDuration,ease:'power2.inOut'},settings.birthDuration*.3125)
        .to(state,{formation:1,density:1,distortion:1,duration:settings.accretionDuration,ease:'sine.inOut'},plan.accretionStart)
        .to(state,{identity:1,duration:.55},plan.accretionStart+settings.accretionDuration*.58)
        .to(state,{settle:1,duration:.8},plan.end-.8);
      phases.forEach((p,i)=>master.to(p,{reveal:1,duration:settings.flowEntryDuration,ease:'sine.inOut'},plan.flowStart+(i<4?i*2:(i-4)*2+1)*.08));
      plan.captures.forEach(c=>master.to(phases[c.index],{capture:1,duration:c.duration},c.start));
    },root);
  }
  buildTimeline();
  const poses=objects.map(()=>({x:0,y:0,progress:0,velocity:0,rotation:0,scale:1,wake:0,alignmentError:0,ambientX:0,ambientY:0,surface:0,orientation:0}));

  function layout(){
    setters.forEach(s=>{s.x(0);s.y(0);s.rotation(0);s.scale(1);});
    const rect=stage.getBoundingClientRect(),hr=hole.getBoundingClientRect(),field=canvas.parentElement!.getBoundingClientRect();
    const center={x:hr.x+hr.width/2-rect.x,y:hr.y+hr.height/2-rect.y},radius=hr.width*.35;
    view.resize(rect.width,field.height,center.x,center.y,radius);
    paths=objects.map((object,i)=>{const r=object.getBoundingClientRect();return withCaptureApproach(createGravityPath(i,{x:r.x+r.width/2-rect.x,y:r.y+r.height/2-rect.y},rect.width,center,radius*tuning.radius),rect.width);});
    view.paths(fallback?[]:paths);
  }

  function paint(){
    if(disposed)return;
    master.time(Math.min(time,plan.end),false);
    identity.style.opacity=state.identity<1?String(state.identity):'';identity.style.visibility=state.identity===0?'hidden':'';
    objects.forEach((el,i)=>{
      const path=paths[i];if(!path)return;
      const phase=plan.captures.find(c=>c.index===i)!;
      const capture=phases[i].capture,progress=captureResponse(capture,settings.pullStrength);
      const head=progress*path.stop,sample=path.sample(head),complete=capture>=1;
      const age=Math.max(0,time-phase.start-phase.duration),envelope=!fallback?smooth(age/1.8):0;
      const baseDrift=settings.orbitalDrift*envelope;
      const baseX=baseDrift*(Math.sin(orbitTime*.22+i)*.8+Math.sin(orbitTime*.13+i)*.2);
      const baseY=baseDrift*Math.sin(orbitTime*.17+i+.5)*.55;
      const living=(i===0||i===4)&&enabled[i]&&mode!=='baseline'&&!fallback;
      const livingPose=ambientPose(i,orbitTime,ambient),ambientX=living?livingPose.x*envelope:0,ambientY=living?livingPose.y*envelope:0;
      const x=complete?path.anchor.x+baseX+ambientX:sample.position.x;
      const y=complete?path.anchor.y+baseY+ambientY:sample.position.y;
      const inertia=Math.sin(capture*Math.PI)*Math.exp(-capture*1.2)*(i<4?-1:1)*12;
      const rotation=inertia+envelope*Math.sin(orbitTime*.11+i)*.45;
      const scale=.62+.38*progress;
      setters[i].x(x-path.anchor.x);setters[i].y(y-path.anchor.y);setters[i].rotation(rotation);setters[i].scale(scale);
      el.style.opacity=complete?'':String(Math.min(1,capture*8));el.style.visibility=capture<=0?'hidden':'';el.inert=!complete;

      const enhancedOrientation=living?livingPose.orientation*envelope:0;
      if(i===0){
        art[i].style.setProperty('--e1-surface-shift',`${living?Math.sin(livingPose.surface)*4*envelope:0}px`);
        art[i].style.setProperty('--e1-surface-light',String(living?.28+.12*Math.sin(livingPose.surface+.8):0));
      }
      if(i===4){
        art[i].style.setProperty('--e1-yaw',`${enhancedOrientation*.72}deg`);
        art[i].style.setProperty('--e1-roll',`${enhancedOrientation}deg`);
      }
      const coupling=living&&mode==='coupled'?ambient.gravityCoupling:0;
      const speed=Math.abs(responseVelocity(capture,settings.pullStrength))*path.stop*path.length/phase.duration;
      const ambientSpeed=living?ambient.driftAmplitude*Math.PI*2/Math.max(ambient.driftPeriod,1)*envelope:0;
      const wake=!fallback?Math.min(.85,speed/650)*(1-smooth((capture-.55)/.45))+envelope*(.055+.02*Math.sin(orbitTime*.7+i))+.018*ambientSpeed*coupling:0;
      const light=!fallback?.86+.14*Math.min(progress,1)+Math.sin(spin*.7+i)*.025*(complete?envelope:Math.sin(capture*Math.PI))+.025*Math.sin(livingPose.theta)*coupling:1;
      art[i].style.filter=`brightness(${light})`;
      const visualOffsetX=x-sample.position.x,visualOffsetY=y-sample.position.y;
      const ribbonOffsetX=visualOffsetX-(living&&mode==='living'?ambientX:0);
      const ribbonOffsetY=visualOffsetY-(living&&mode==='living'?ambientY:0);
      view.tether(i,head,wake,ribbonOffsetX,ribbonOffsetY,true,coupling);
      poses[i]={x,y,progress,velocity:speed,rotation,scale,wake,ambientX,ambientY,surface:living?livingPose.surface*envelope:0,orientation:enhancedOrientation,alignmentError:Math.hypot(x-(sample.position.x+ribbonOffsetX),y-(sample.position.y+ribbonOffsetY))};
    });
    root.dataset.cEntrance=time<plan.end?'running':'done';root.dataset.e1Mode=mode;
    view.streams(phases.map(p=>p.reveal),time,flowTime,tuning.intensity,debug,paths[0]);view.draw(state,tuning,time,spin);frameCount++;
  }

  function seek(t:number){time=Math.max(0,t);spin=time*tuning.rotation;flowTime=time*tuning.flow;orbitTime=time;paint();onStatus();}
  function finish(){time=Math.max(time,plan.end);spin=time*tuning.rotation;flowTime=time*tuning.flow;orbitTime=time;paint();onStatus();}
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),small=matchMedia('(max-width: 900px)');
  function syncFallback(){fallback=reduce.matches||small.matches;root.dataset.cFallback=String(fallback);layout();if(fallback)finish();else paint();onStatus();}
  function visibility(){hidden=document.hidden;onStatus();}
  function key(event:KeyboardEvent){if(event.key==='Escape'&&time<plan.end)finish();}
  function lost(event:Event){event.preventDefault();onFailure();}
  function tick(_seconds:number,deltaMs:number){
    if(disposed||!ready||hidden||fallback||userPaused)return;
    const dt=Math.min(deltaMs/1000,.05);time+=dt;spin+=dt*tuning.rotation;flowTime+=dt*tuning.flow;
    const previewOpen=Boolean(root.querySelector('[data-preview-open="true"]'))||document.activeElement?.matches('[data-object-id]');
    if(!previewOpen)orbitTime+=dt;
    if(time>plan.end+1){frameTimes.push(deltaMs);if(frameTimes.length>1800)frameTimes.shift();}
    if(frameCount%180===0&&frameTimes.length>=180&&quality>.6&&frameTimes.slice(-120).filter(v=>v>24).length>55){quality=quality===1?.75:.6;view.quality(quality);}
    paint();if(frameCount%15===0)onStatus();
  }
  const observer=new ResizeObserver(()=>{layout();paint();});observer.observe(stage);
  reduce.addEventListener('change',syncFallback);small.addEventListener('change',syncFallback);document.addEventListener('visibilitychange',visibility);window.addEventListener('keydown',key);canvas.addEventListener('webglcontextlost',lost);
  layout();syncFallback();paint();ready=true;root.dataset.cReady='true';gsap.ticker.add(tick);

  return {
    pause(){userPaused=true;onStatus();},resume(){userPaused=false;onStatus();},replay(){if(fallback)return;userPaused=false;seek(0);},seek(t:number){userPaused=true;seek(fallback?plan.end:t);},finish,
    set(name:keyof typeof tuning,value:number){tuning[name]=value;if(name==='radius')layout();paint();onStatus();},
    timing(name:Setting,value:number){const oldEnd=plan.end,after=time>=oldEnd;settings[name]=Math.min(ranges[name][1],Math.max(ranges[name][0],value));if(name!=='pullStrength'&&name!=='orbitalDrift'){buildTimeline();if(after)time=plan.end+(time-oldEnd);}if(fallback)finish();else paint();onStatus();},
    ambient(name:AmbientSetting,value:number){ambient[name]=Math.min(ambientRanges[name][1],Math.max(ambientRanges[name][0],value));paint();onStatus();},
    mode(value:AmbientMode){mode=value;paint();onStatus();},ambientEnabled(index:number,value:boolean){if(index===0||index===4){enabled[index]=value;paint();onStatus();}},
    exportSettings(){return JSON.stringify({schema:'carl-portfolio.motion-e1.v1',scope:'representative-ambient-pair',objects:[0,4],timing:{...settings},material:{...tuning},ambient:{...ambient},ambientMode:mode,ambientEnabled:{0:enabled[0],4:enabled[4]}},null,2);},
    debug(value:boolean){debug=value;paint();onStatus();},resetMetrics(){frameTimes.length=0;view.resetMetrics();},
    snapshot(){return {time,spin,flowTime,orbitTime,userPaused,hidden,fallback,ready,debug,quality,mode,plan,settings:{...settings},tuning:{...tuning},ambient:{...ambient},enabled:[...enabled],state:{horizon:state.horizon,formation:state.formation,identity:state.identity},phases:phases.map((p,i)=>({reveal:p.reveal,capture:p.capture,stop:paths[i]?.stop})),poses:poses.map(p=>({...p})),anchors:paths.map(p=>({...p.anchor})),endpoints:view.endpoints(),pulseProgress:paths[0]?transportProgress((flowTime*paths[0].speed)%1):0,frameCount,frameTimes:[...frameTimes],metrics:view.metrics(),shader:view.parameters(),drawCalls:view.renderer.info.render.calls,liveTimelines:gsap.globalTimeline.getChildren(true,false,true).filter(t=>t.vars.id==='motion-e1-master').length};},
    dispose(){disposed=true;gsap.ticker.remove(tick);timelineContext?.revert();observer.disconnect();reduce.removeEventListener('change',syncFallback);small.removeEventListener('change',syncFallback);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('keydown',key);canvas.removeEventListener('webglcontextlost',lost);context.revert();objects.forEach(el=>el.removeAttribute('inert'));art.forEach(el=>{el.removeAttribute('data-e1-surface');el.removeAttribute('data-e1-technology');for(const name of ['--e1-surface-shift','--e1-surface-light','--e1-yaw','--e1-roll'])el.style.removeProperty(name);});identity.style.opacity='';identity.style.visibility='';root.dataset.cEntrance='done';delete root.dataset.e1Mode;view.dispose();delete root.dataset.cReady;},
  };
}

export type LivingObjectController=ReturnType<typeof createLivingObjectController>;
