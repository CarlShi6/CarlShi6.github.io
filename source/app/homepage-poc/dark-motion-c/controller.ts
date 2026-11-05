import gsap from "gsap";
import { createLivingRenderer, defaultTuning, type Formation } from "./renderer";
import { createGravityPath, transportProgress, type GravityPath } from "./paths";

export const ENTRANCE_SECONDS=4.2;
export function createMotionController(root:HTMLElement,canvas:HTMLCanvasElement,onStatus:()=>void,onFailure:()=>void){
  const stage=root.querySelector<HTMLElement>("section[aria-label='Dark gravitational portfolio system']")!;
  const hole=root.querySelector<HTMLElement>("[data-transition-role='dark-hole']")!;
  const identity=root.querySelector<HTMLElement>("[data-transition-role='dark-identity']")!;
  const objects=Array.from(root.querySelectorAll<HTMLElement>("[data-object-id]"));
  const view=createLivingRenderer(canvas);
  view.renderer.debug.onShaderError=()=>onFailure();
  const state:Formation={horizon:.018,photon:0,formation:0,density:.35,distortion:0,identity:0,settle:0};
  const tuning={...defaultTuning};
  const streams=objects.map(()=>({reveal:0,capture:0}));
  let paths:GravityPath[]=[];
  let time=0,spin=0,flowTime=0,userPaused=false,hidden=document.hidden,disposed=false,ready=false;
  let fallback=false,debug=false,quality=1,frameCount=0;
  const frameTimes:number[]=[];
  let master!:gsap.core.Timeline;
  const setters=objects.map(el=>({x:gsap.quickSetter(el,"x","px"),y:gsap.quickSetter(el,"y","px"),rotation:gsap.quickSetter(el,"rotation","deg"),scale:gsap.quickSetter(el,"scale")}));
  const context=gsap.context(()=>{
    // Register owned style changes so revert restores the inherited v8 styles.
    gsap.set(identity,{autoAlpha:1});gsap.set(objects,{x:0,y:0,rotation:0,scale:1,autoAlpha:1});
    master=gsap.timeline({paused:true,defaults:{ease:"none"}})
      .to(state,{horizon:1,duration:.8,ease:"power2.out"},0)
      .to(state,{photon:1,duration:.8,ease:"power2.inOut"},.25)
      .to(state,{formation:1,duration:1.3,ease:"sine.inOut"},.5)
      .to(state,{density:1,duration:1.3},.5)
      .to(state,{distortion:1,duration:1.3},.5)
      .to(state,{identity:1,duration:.55},1.25)
      .to(state,{settle:1,duration:.7},3.5);
    streams.forEach((stream,i)=>master.to(stream,{reveal:1,duration:1.22,ease:"sine.inOut"},1+(i<4?i*2:(i-4)*2+1)*.08));
    const order=[0,4,1,5,2,6,3,7];
    order.forEach((index,i)=>master.to(streams[index],{capture:1,duration:1.15,ease:"power2.inOut"},1.8+i*.12));
  },root);
  function layout(){
    // Measure the inherited final layout, never a currently transformed frame.
    setters.forEach(s=>{s.x(0);s.y(0);s.rotation(0);s.scale(1);});
    const rect=stage.getBoundingClientRect(),hr=hole.getBoundingClientRect();
    const field=canvas.parentElement!.getBoundingClientRect();
    const center={x:hr.x+hr.width/2-rect.x,y:hr.y+hr.height/2-rect.y},radius=hr.width*.35;
    view.resize(rect.width,field.height,center.x,center.y,radius);
    paths=objects.map((object,i)=>{const r=object.getBoundingClientRect();return createGravityPath(i,{x:r.x+r.width/2-rect.x,y:r.y+r.height/2-rect.y},rect.width,center,radius*tuning.radius);});
    view.paths(fallback?[]:paths);
  }
  function paint(){
    if(disposed)return;
    master.time(Math.min(time,ENTRANCE_SECONDS),false);
    identity.style.opacity=state.identity<1?String(state.identity):"";
    identity.style.visibility=state.identity===0?"hidden":"";
    const interacting=root.querySelector('main')?.dataset.previewOpen==='true';
    objects.forEach((el,i)=>{
      const path=paths[i];if(!path)return;
      const capture=streams[i].capture,sample=path.sample(capture*path.stop),setter=setters[i];
      const complete=capture>=.999999;
      const drift=complete&&!fallback&&!interacting?Math.min(1,Math.max(0,time-ENTRANCE_SECONDS))*.35:0;
      setter.x(complete?Math.sin(time*.27+i)*drift:sample.position.x-path.anchor.x);
      setter.y(complete?Math.sin(time*.21+i*.7)*drift:sample.position.y-path.anchor.y);
      setter.rotation(complete?0:(1-capture)*Math.sin(capture*Math.PI)*13*(i<4?-1:1));
      setter.scale(.56+.44*capture);
      el.style.opacity=complete?"":String(Math.min(1,capture*4));
      el.style.visibility=capture<=0?"hidden":"";
      el.inert=time<ENTRANCE_SECONDS;
    });
    root.dataset.cEntrance=time<ENTRANCE_SECONDS?"running":"done";
    view.streams(streams.map(s=>s.reveal),time,flowTime,tuning.intensity,debug,paths[0]);
    view.draw(state,tuning,time,spin);
    frameCount++;
  }
  function setTime(value:number){
    time=Math.max(0,value);spin=time*tuning.rotation;flowTime=time*tuning.flow;
    paint();onStatus();
  }
  function finish(){Object.assign(tuning,defaultTuning);layout();if(time<ENTRANCE_SECONDS)setTime(ENTRANCE_SECONDS);else{paint();onStatus();}}
  const reduce=matchMedia("(prefers-reduced-motion: reduce)"),small=matchMedia("(max-width: 900px)");
  function syncFallback(){fallback=reduce.matches||small.matches;root.dataset.cFallback=String(fallback);layout();if(fallback)finish();else paint();onStatus();}
  function visibility(){hidden=document.hidden;onStatus();}
  function key(event:KeyboardEvent){if(event.key==="Escape"&&time<ENTRANCE_SECONDS)finish();}
  function lost(event:Event){event.preventDefault();onFailure();}
  // A single GSAP ticker owns BOTH the paused timeline playhead and all shader
  // clocks. There is no R3F useFrame or private requestAnimationFrame loop here.
  function tick(_seconds:number,deltaMs:number){
    if(disposed||!ready||hidden||fallback||userPaused)return;
    const dt=Math.min(deltaMs/1000,.05);
    time+=dt;spin+=dt*tuning.rotation;flowTime+=dt*tuning.flow;
    if(time>ENTRANCE_SECONDS+1){frameTimes.push(deltaMs);if(frameTimes.length>1800)frameTimes.shift();}
    if(frameCount%180===0&&frameTimes.length>=180&&quality>.6&&frameTimes.slice(-120).filter(v=>v>24).length>55){quality=quality===1?.75:.6;view.quality(quality);}
    paint();
    if(frameCount%15===0)onStatus();
  }
  const observer=new ResizeObserver(()=>{layout();paint();});observer.observe(stage);
  reduce.addEventListener("change",syncFallback);small.addEventListener("change",syncFallback);
  document.addEventListener("visibilitychange",visibility);window.addEventListener("keydown",key);
  canvas.addEventListener("webglcontextlost",lost);
  layout();syncFallback();paint();ready=true;root.dataset.cReady="true";
  gsap.ticker.add(tick);
  return {
    pause(){userPaused=true;onStatus();},resume(){userPaused=false;onStatus();},
    replay(){if(fallback)return;window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));Object.assign(tuning,defaultTuning);layout();userPaused=false;setTime(0);},
    seek(value:number){userPaused=true;setTime(fallback?ENTRANCE_SECONDS:value);},finish,
    set(name:keyof typeof tuning,value:number){tuning[name]=value;if(name==='radius')layout();paint();onStatus();},
    debug(value:boolean){debug=value;paint();onStatus();},
    resetMetrics(){frameTimes.length=0;view.resetMetrics();},
    snapshot(){return {time,spin,flowTime,userPaused,hidden,fallback,ready,debug,quality,state:{horizon:state.horizon,photon:state.photon,formation:state.formation,density:state.density,distortion:state.distortion,identity:state.identity,settle:state.settle},streams:streams.map((s,i)=>({reveal:s.reveal,capture:s.capture,stop:paths[i]?.stop,merge:paths[i]?.mergeAt,speed:paths[i]?.speed})),pulseProgress:paths[0]?transportProgress((flowTime*paths[0].speed)%1):0,tuning:{...tuning},frameCount,frameTimes:[...frameTimes],metrics:view.metrics(),shader:view.parameters(),drawCalls:view.renderer.info.render.calls,triangles:view.renderer.info.render.triangles};},
    dispose(){disposed=true;gsap.ticker.remove(tick);observer.disconnect();reduce.removeEventListener("change",syncFallback);small.removeEventListener("change",syncFallback);document.removeEventListener("visibilitychange",visibility);window.removeEventListener("keydown",key);canvas.removeEventListener("webglcontextlost",lost);context.revert();objects.forEach(el=>el.removeAttribute("inert"));identity.style.opacity="";identity.style.visibility="";root.dataset.cEntrance="done";view.dispose();delete root.dataset.cReady;},
  };
}
export type MotionController=ReturnType<typeof createMotionController>;
