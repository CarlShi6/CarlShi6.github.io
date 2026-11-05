import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Line, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, SphereGeometry, SRGBColorSpace, Vector2, WebGLRenderer, NoToneMapping } from "three";
import { diskFragment, screenVertex, ribbonFragment, ribbonVertex } from "./shaders";
import { ribbonGeometry, transportProgress, type GravityPath } from "./paths";

export type Formation = { horizon: number; photon: number; formation: number; density:number; distortion: number; identity: number; settle: number };
export type Tuning = { radius: number; formation: number; rotation: number; flow: number; intensity: number };
export const defaultTuning: Tuning = { radius: 1, formation: -1, rotation: 1, flow: 1, intensity: 1 };

export function createLivingRenderer(canvas: HTMLCanvasElement) {
  const renderer=new WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:"high-performance"});
  renderer.outputColorSpace=SRGBColorSpace;
  renderer.toneMapping=NoToneMapping;
  renderer.setClearColor(0x000000,0);
  // Installed Three r185 uses WebGL2; older @types still expose a WebGL1 union.
  const gl=renderer.getContext() as WebGL2RenderingContext;
  const timer=gl.getExtension('EXT_disjoint_timer_query_webgl2');
  const gpuTimes:number[]=[],cpuTimes:number[]=[];
  let query:WebGLQuery|null=null,drawCount=0;
  const scene=new Scene();
  const camera=new OrthographicCamera(-1,1,1,-1,.1,10);
  camera.position.z=2;
  const uniforms={
    uSize:{value:new Vector2(1,1)},uCenter:{value:new Vector2()},uRadius:{value:250},
    uHorizon:{value:.018},uPhoton:{value:0},uFormation:{value:0},uSpin:{value:0},
    uTime:{value:0},uDensity:{value:1},uIntensity:{value:1},uDistortion:{value:0},
  };
  const material=new ShaderMaterial({vertexShader:screenVertex,fragmentShader:diskFragment,uniforms,transparent:true,depthTest:false,depthWrite:false});
  const geometry=new PlaneGeometry(2,2);
  const disk=new Mesh(geometry,material);
  disk.frustumCulled=false;disk.renderOrder=5;scene.add(disk);
  let pixelRatio=1, width=1,height=1;
  let ribbons:Mesh<BufferGeometry,ShaderMaterial>[]=[];
  let debugLine:Line|undefined,arrows:LineSegments|undefined;
  const pulse=new Mesh(new SphereGeometry(3.5,10,8),new MeshBasicMaterial({color:0xffdd85,depthTest:false}));
  pulse.visible=false;pulse.renderOrder=12;scene.add(pulse);
  function clearPaths(){ribbons.forEach(m=>{scene.remove(m);m.geometry.dispose();m.material.dispose();});ribbons=[];for(const line of [debugLine,arrows]){if(line){scene.remove(line);line.geometry.dispose();(line.material as LineBasicMaterial).dispose();}}}
  function paths(models:GravityPath[]){
    clearPaths();
    ribbons=models.map(path=>{
      const mat=new ShaderMaterial({vertexShader:ribbonVertex,fragmentShader:ribbonFragment,transparent:true,depthWrite:false,depthTest:false,side:DoubleSide,uniforms:{uFlowTime:{value:0},uTime:{value:0},uReveal:{value:0},uSpeed:{value:path.speed},uSeed:{value:path.index*3.17},uIntensity:{value:1},uMerge:{value:path.mergeAt}}});
      const mesh=new Mesh(ribbonGeometry(path),mat);mesh.frustumCulled=false;mesh.renderOrder=2;scene.add(mesh);return mesh;
    });
    if(!models.length)return;
    const points=models[0].curve.getSpacedPoints(100);
    debugLine=new Line(new BufferGeometry().setFromPoints(points),new LineBasicMaterial({color:0x74e5ec,depthTest:false}));debugLine.renderOrder=10;debugLine.visible=false;scene.add(debugLine);
    const vertices:number[]=[];
    for(let s=.1;s<.95;s+=.1){const {position:p,tangent:t}=models[0].sample(s);const tip=p.clone().addScaledVector(t,16);for(const sign of [-1,1])vertices.push(tip.x,tip.y,0,p.x-t.y*sign*5,p.y+t.x*sign*5,0);}
    arrows=new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(vertices,3)),new LineBasicMaterial({color:new Color('#f6c780'),depthTest:false}));arrows.renderOrder=10;arrows.visible=false;scene.add(arrows);
  }
  function resize(w:number,h:number,cx:number,cy:number,radius:number){
    width=w;height=h;
    renderer.setPixelRatio(pixelRatio);renderer.setSize(w,h,false);
    camera.left=0;camera.right=w;camera.top=0;camera.bottom=h;camera.updateProjectionMatrix();
    uniforms.uSize.value.set(w,h);uniforms.uCenter.value.set(cx,cy);uniforms.uRadius.value=radius;
  }
  return {
    renderer,scene,camera,uniforms,resize,paths,
    metrics(){return {gpuTimerSupported:Boolean(timer),gpuMs:[...gpuTimes],cpuSubmitMs:[...cpuTimes],geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures};},
    resetMetrics(){gpuTimes.length=0;cpuTimes.length=0;},
    parameters(){return {horizon:uniforms.uHorizon.value,formation:uniforms.uFormation.value,spin:uniforms.uSpin.value,density:uniforms.uDensity.value,intensity:uniforms.uIntensity.value,flowTime:ribbons[0]?.material.uniforms.uFlowTime.value??0};},
    streams(reveals:number[],time:number,flowTime:number,intensity:number,debug:boolean,model?:GravityPath){
      ribbons.forEach((mesh,i)=>{const u=mesh.material.uniforms;u.uReveal.value=reveals[i];u.uTime.value=time;u.uFlowTime.value=flowTime;u.uIntensity.value=intensity;});
      if(debugLine)debugLine.visible=debug;if(arrows)arrows.visible=debug;pulse.visible=debug&&Boolean(model);
      if(model)pulse.position.copy(model.sample(transportProgress((flowTime*model.speed)%1)).position);
    },
    quality(ratio:number){pixelRatio=ratio;renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);},
    draw(state:Formation,tuning:Tuning,time:number,spin:number){
      uniforms.uHorizon.value=state.horizon*tuning.radius;
      uniforms.uPhoton.value=state.photon;
      uniforms.uFormation.value=tuning.formation<0?state.formation:tuning.formation;
      uniforms.uSpin.value=spin;uniforms.uTime.value=time;
      uniforms.uIntensity.value=tuning.intensity;uniforms.uDistortion.value=state.distortion;uniforms.uDensity.value=state.density;
      if(query&&gl.getQueryParameter(query,gl.QUERY_RESULT_AVAILABLE)){
        if(!gl.getParameter(timer.GPU_DISJOINT_EXT)){gpuTimes.push(gl.getQueryParameter(query,gl.QUERY_RESULT)/1e6);if(gpuTimes.length>120)gpuTimes.shift();}
        gl.deleteQuery(query);query=null;
      }
      const measure=timer&&!query&&drawCount++%30===0;
      if(measure){query=gl.createQuery();gl.beginQuery(timer.TIME_ELAPSED_EXT,query);}
      const start=performance.now();
      renderer.render(scene,camera);
      if(measure)gl.endQuery(timer.TIME_ELAPSED_EXT);
      cpuTimes.push(performance.now()-start);if(cpuTimes.length>1800)cpuTimes.shift();
    },
    dispose(){if(query)gl.deleteQuery(query);clearPaths();pulse.geometry.dispose();pulse.material.dispose();geometry.dispose();material.dispose();renderer.dispose();renderer.forceContextLoss();},
  };
}
