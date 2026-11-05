import {BufferGeometry,CatmullRomCurve3,DoubleSide,Float32BufferAttribute,Mesh,NoToneMapping,OrthographicCamera,PlaneGeometry,Points,Scene,ShaderMaterial,SRGBColorSpace,TextureLoader,Vector2,Vector3,WebGLRenderer,type Texture} from 'three';
import {mainFlow,secondaryFlows,captureWakes,type FlowPath} from './flow-paths';
import {atmosphereFragment,wakeDebrisVertex,wakeDebrisFragment,dustFragment,dustVertex,filamentFragment,fieldFragment,ribbonFragment,ribbonVertex,screenVertex,spriteFragment,spriteVertex} from './shaders';

export const duration=7.2;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const p=clamp(v);return p*p*(3-2*p);};
export function composition(w:number,h:number){
 const mobile=w<700;
 return {w,h,mobile,cx:w*.503,cy:h*(mobile?.52:.49),radius:Math.min(w*(mobile?.32:.132),h*.275),
  anchors:mobile?[[.28,.17],[.82,.29],[.78,.84]]:[[.178,.25],[.837,.395],[.887,.714]]};
}
type Layout=ReturnType<typeof composition>;
function makePath(i:number,l:Layout){
 const [ax,ay]=l.anchors[i%3],{w,h,cx,cy,radius:r,mobile}=l;
 const v=(x:number,y:number)=>new Vector3(x,y,0),p=(x:number,y:number)=>v(x*w,y*h),orbit=(a:number,k=1.07)=>v(cx+Math.cos(a)*r*k,cy+Math.sin(a)*r*k);
 const points=i===0?[p(-.18,.44),p(ax,ay),p(.30,mobile?.12:.15),orbit(-1.84),orbit(-1.0),orbit(-.2),orbit(.6,.97)]:
  i===1?[p(1.18,.18),p(ax,ay),p(.74,mobile?.22:.315),orbit(-.35),orbit(-1.05),orbit(-1.8,.97)]:
  i===2?[p(1.17,.86),p(ax,ay),p(.765,mobile?.81:.625),orbit(.68),orbit(1.45),orbit(2.15,.97)]:
  [p(-.14,.77),p(.17,.57),p(.29,.52),orbit(2.94,1.18),orbit(3.7,1.13),orbit(4.35,.97)];
 if(mobile){
  if(i===0)points.splice(0,points.length,p(-.2,.2),p(ax,ay),p(.36,.27),orbit(-2.15),orbit(-1.2),orbit(-.3,.97));
  if(i===1)points.splice(0,points.length,p(1.2,.13),p(ax,ay),p(.9,.37),orbit(-.25),orbit(-1.),orbit(-1.9,.97));
  if(i===2)points.splice(0,points.length,p(1.2,.94),p(ax,ay),p(.62,.82),orbit(.95),orbit(1.8,.97));
 }
 const curve=new CatmullRomCurve3(points,false,'centripetal');curve.arcLengthDivisions=1200;curve.updateArcLengths();
 const anchor=p(ax,ay);let stop=0,best=Infinity;
 for(let k=0;k<=1200;k++){const d=curve.getPointAt(k/1200).distanceToSquared(anchor);if(d<best){best=d;stop=k/1200;}}
 return {curve,stop,anchor};
}
const fan=(s:number,path:FlowPath)=>{
 if(path.kind==='main'){
  const j=path.joinProgress;
  if(s<=j)return .26+.64*Math.pow(Math.sin(Math.PI*s/j),1.15)+.18*smooth((s/j-.65)/.35);
  const q=(s-j)/(1-j);return (.44+.22*Math.sin(Math.PI*q))*(1-.42*smooth((q-.72)/.28));
 }
 return (.13+.82*Math.pow(Math.sin(Math.PI*Math.min(1,s/.78)),1.2))*(1-.66*smooth((s-.38)/.32));
};
function geometry(path:FlowPath,width:number){
 const pos:number[]=[],uv:number[]=[],indices:number[]=[];const count=300,cross=6;
 for(let i=0;i<=count;i++){
  const s=i/count,p=path.curve.getPointAt(s),t=path.curve.getTangentAt(s);
  const spread=width*fan(s,path)*(1+.08*Math.sin(s*13));
  for(let j=0;j<=cross;j++){
   const v=j/cross,ring=path.kind==='main'?smooth((s/path.joinProgress-.65)/.35):0,offset=(v*2-1-ring*.06)*spread;
   pos.push(p.x-t.y*offset,p.y+t.x*offset,0);uv.push(s,v);
   if(i<count&&j<cross){const a=i*(cross+1)+j,b=a+cross+1;indices.push(a,b,a+1,b,b+1,a+1);}
  }
 }
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(indices);return g;
}


const random=(i:number)=>{const n=Math.sin(i*127.1+311.7)*43758.5453;return n-Math.floor(n);};
function filamentGeometry(path:FlowPath,width:number,seed:number){
 const pos:number[]=[],uv:number[]=[],idx:number[]=[];const count=260,lanes=42;
 for(let k=0;k<lanes;k++){
  const lane=random(k+seed*90),phase=random(k+37)*6.28;
  const fringe=k%9===0?.92:.62;
  for(let i=0;i<=count;i++){
   const s=i/count,p=path.curve.getPointAt(s),t=path.curve.getTangentAt(s);
   const spread=width*fan(s,path);
   const offset=((lane-.5)*2*fringe+Math.sin(s*8+phase)*.12+Math.sin(s*16+phase)*.035)*spread;
   const thickness=(.20+random(k+22)*.56)*(1-.4*s);
   for(let j=0;j<2;j++){const d=offset+(j?1:-1)*thickness;pos.push(p.x-t.y*d,p.y+t.x*d,0);uv.push(s,(k+(j?.95:.05))/lanes);}
   if(i<count){const a=k*(count+1)*2+i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3);}
  }
 }
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(idx);return g;
}
function dustGeometry(path:FlowPath,width:number,seed:number,count:number){
 const pos:number[]=[],params:number[]=[],dir:number[]=[];
 for(let i=0;i<count;i++){
  const raw=random(i+seed*133),s=clamp(raw+.045*Math.sin(raw*29+seed)),p=path.curve.getPointAt(s),t=path.curve.getTangentAt(s),v=(random(i+901)-.5)*2;
  const scatter=v*v*v*width*fan(s,path)*(1.1+Math.sin(s*17+seed)*.35);
  pos.push(p.x-t.y*scatter,p.y+t.x*scatter,0);dir.push(t.x,t.y);params.push(s,random(i+51),random(i+97));
 }
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setAttribute('aDirection',new Float32BufferAttribute(dir,2));g.setAttribute('aParams',new Float32BufferAttribute(params,3));return g;
}

/** One canvas. All world positions are CSS pixels, Y down. Text remains native DOM. */
export async function createReferenceRenderer(canvas:HTMLCanvasElement,options:{transparent?:boolean}={}){
 const renderer=new WebGLRenderer({canvas,alpha:!!options.transparent,antialias:true,powerPreference:'high-performance'});
 renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=NoToneMapping;renderer.setClearColor(0x080f16,options.transparent?0:1);
 const scene=new Scene(),camera=new OrthographicCamera(0,1,0,1,.1,100);camera.position.z=10;
 const loader=new TextureLoader();const textures:Texture[]=[];
 let flow:Texture,planet:Texture,rocks:Texture,moon:Texture;
 try{[flow,planet,rocks,moon]=await Promise.all(['dark-reference-flow/flow-fine-v2.png','dark-reference-flow/planet.png','motion-e4/mineral-fragments.png','dark-reference-flow/moon.png'].map(async file=>{const t=await loader.loadAsync('/homepage-poc/'+file);t.colorSpace=SRGBColorSpace;textures.push(t);return t;}));}
 catch(error){textures.forEach(t=>t.dispose());renderer.dispose();throw error;}
 const holeUniforms={uFlow:{value:flow},uSize:{value:new Vector2()},uCenter:{value:new Vector2()},uRadius:{value:200},uBirth:{value:0},uFormation:{value:0},uTime:{value:0}};
 const disk=new Mesh(new PlaneGeometry(2,2),new ShaderMaterial({vertexShader:screenVertex,fragmentShader:fieldFragment,uniforms:holeUniforms,transparent:true,depthTest:false,depthWrite:false}));disk.frustumCulled=false;disk.renderOrder=5;scene.add(disk);
 const atmosphere=new Mesh(new PlaneGeometry(2,2),new ShaderMaterial({vertexShader:screenVertex,fragmentShader:atmosphereFragment,uniforms:holeUniforms,depthTest:false,depthWrite:false}));atmosphere.frustumCulled=false;atmosphere.renderOrder=0;scene.add(atmosphere);
 const ribbons:Mesh<BufferGeometry,ShaderMaterial>[]=[];
 const objects:Mesh<PlaneGeometry,ShaderMaterial>[]=[];
 const fragments:Points<BufferGeometry,ShaderMaterial>[]=[];
 const filaments:Mesh<BufferGeometry,ShaderMaterial>[]=[];const dust:Points<BufferGeometry,ShaderMaterial>[]=[];
 // Three principal groups; two small satellites of the left planet are decorative.
 function sprite(map:Texture,moon=0,flip=0,cell=-1){
  const x=[0,550,1060][Math.max(cell,0)%3],width=[550,510,476][Math.max(cell,0)%3];
  const material=new ShaderMaterial({vertexShader:spriteVertex,fragmentShader:spriteFragment,transparent:true,depthWrite:false,depthTest:false,side:DoubleSide,uniforms:{uMap:{value:map},uOpacity:{value:0},uMoon:{value:moon},uFlip:{value:flip},uLight:{value:1},uOffset:{value:new Vector2(cell<0?0:x/1536,cell<0?0:cell<3?.5:0)},uRepeat:{value:new Vector2(cell<0?1:width/1536,cell<0?1:.5)}}});
  const mesh=new Mesh(new PlaneGeometry(1,1),material);mesh.renderOrder=8;scene.add(mesh);objects.push(mesh);return mesh;
 }
 sprite(planet);sprite(planet,0,1);sprite(moon);sprite(moon);
 const rockSeeds=Array.from({length:21},(_,i)=>({x:i<3?[0,32,-29][i]:Math.sin(i*2.4)*(38+i*2),y:i<3?[0,26,-18][i]:Math.cos(i*2.4)*(24+i*1.4),size:i<3?[92,72,56][i]:5+(i*7%13),angle:i*.68}));
 rockSeeds.forEach((_,i)=>sprite(rocks,0,0,i%6));
 let layout=composition(1,1),paths:ReturnType<typeof makePath>[]=[],flowPaths:FlowPath[]=[],last=0,draws=0;
 const frameMs:number[]=[];let stamp=0;
 function resize(w:number,h:number){
  layout=composition(w,h);renderer.setPixelRatio(Math.min(devicePixelRatio,layout.mobile?1.25:1.5));renderer.setSize(w,h,false);
  camera.right=w;camera.bottom=h;camera.updateProjectionMatrix();
  holeUniforms.uSize.value.set(w,h);holeUniforms.uCenter.value.set(layout.cx,layout.cy);holeUniforms.uRadius.value=layout.radius;
  ribbons.forEach(m=>{scene.remove(m);m.geometry.dispose();m.material.dispose();});ribbons.length=0;
  for(const m of [...filaments,...dust,...fragments]){scene.remove(m);m.geometry.dispose();m.material.dispose();}filaments.length=0;dust.length=0;fragments.length=0;
  paths=[0,1,2].map(i=>makePath(i,layout));
  const main=[0,1,2,3].map(i=>mainFlow(i,layout));flowPaths=[...main,...secondaryFlows(main,layout),...captureWakes(main,layout)];
  function coupling(path:FlowPath){return {uCouplingEnd:{value:path.kind==='main'?path.joinProgress:path.kind==='branch'?main[3].joinProgress:.68},uJoin:{value:path.joinProgress},uReverse:{value:path.kind==='wake'?1:0},uSourceProgress:{value:path.sourceProgress},uFree:{value:path.kind==='main'?0:1},uAnchor:{value:new Vector2(path.anchor.x,path.anchor.y)},uObject:{value:new Vector2(path.anchor.x,path.anchor.y)},uObjectScale:{value:1},uCenter:{value:new Vector2(layout.cx,layout.cy)},uRadius:{value:layout.radius},uBirth:{value:1}};}
  flowPaths.forEach((path,i)=>{
   const m=new ShaderMaterial({vertexShader:ribbonVertex,fragmentShader:ribbonFragment,transparent:true,depthTest:false,depthWrite:false,side:DoubleSide,uniforms:{uFlow:{value:flow},uTime:{value:0},uReveal:{value:0},uSeed:{value:(path.kind==='branch'?3:i)*2.31},uStrength:{value:path.kind==='main'?(i===3?.72:.88):path.kind==='wake'?.26:path.kind==='free'?.15:.24},...coupling(path)}});
   const mesh=new Mesh(geometry(path,Math.min(w*.105,h*.21)*(path.kind==='main'?(i===3?.9:1):path.kind==='wake'?.78:.42)),m);mesh.frustumCulled=false;mesh.renderOrder=6;scene.add(mesh);ribbons.push(mesh);
   const fine=new Mesh(filamentGeometry(path,Math.min(w*.115,h*.22)*(path.kind==='main'?1:path.kind==='wake'?.8:.48),i),new ShaderMaterial({vertexShader:ribbonVertex,fragmentShader:filamentFragment,transparent:true,depthTest:false,depthWrite:false,side:DoubleSide,uniforms:{uTime:{value:0},uReveal:{value:0},uSeed:{value:(path.kind==='branch'?3:i)*2.31},...coupling(path)}}));fine.frustumCulled=false;fine.renderOrder=6;scene.add(fine);filaments.push(fine);
   const cloud=new Points(dustGeometry(path,Math.min(w*.15,h*.30),i,path.kind==='main'?(layout.mobile?320:1400):(path.kind==='wake'?(layout.mobile?220:900):(layout.mobile?90:350))),new ShaderMaterial({vertexShader:dustVertex,fragmentShader:dustFragment,transparent:true,depthTest:false,depthWrite:false,uniforms:{uTime:{value:0},uReveal:{value:0},uRatio:{value:renderer.getPixelRatio()},...coupling(path)}}));cloud.frustumCulled=false;cloud.renderOrder=6;scene.add(cloud);dust.push(cloud);
   if(path.kind==='wake'){
    const bits=new Points(dustGeometry(path,Math.min(w*.06,h*.12),i+3,layout.mobile?9:20),new ShaderMaterial({vertexShader:wakeDebrisVertex,fragmentShader:wakeDebrisFragment,transparent:true,depthTest:false,depthWrite:false,uniforms:{uMap:{value:rocks},uTime:{value:0},uReveal:{value:0},uRatio:{value:renderer.getPixelRatio()},...coupling(path)}}));bits.frustumCulled=false;bits.renderOrder=7;scene.add(bits);fragments.push(bits);
   }


  });
  draw(last);
  return layout;
 }
 function pose(group:number,time:number){
  const start=2.05+group*.7,p=smooth((time-start)/2.7),path=paths[group];
  const point=p===1?path.anchor.clone():path.curve.getPointAt(path.stop*p);
  const ambient=smooth((time-start-2.7)/1.5);
  point.x+=Math.sin(time*.24+group*2.1)*2.8*ambient;point.y+=Math.sin(time*.17+group)*1.6*ambient;
  return {point,alpha:smooth((time-start)/.45),scale:.72+.28*p,complete:p===1};
 }
 function draw(time:number,materialTime=time,objectTime=time){
  last=time;if(!paths.length)return;
  holeUniforms.uBirth.value=.025+.975*smooth(time/1.45);holeUniforms.uFormation.value=smooth((time-.25)/2.15);holeUniforms.uTime.value=materialTime;
  const poses=[pose(0,objectTime),pose(1,objectTime),pose(2,objectTime)];
  const [left,debris,right]=poses;
  [ribbons,filaments,dust].forEach(collection=>collection.forEach((mesh,i)=>{
   const u=mesh.material.uniforms,path=flowPaths[i],parent=path.owner<0?{point:path.anchor,scale:1}:poses[path.owner];
   u.uTime.value=materialTime;u.uReveal.value=1.1*smooth((time-(path.kind==='main'?1.3+i*.17:path.kind==='wake'?2.05+path.owner*.7:3.8))/2.65);
   u.uObject.value.set(parent.point.x,parent.point.y);u.uObjectScale.value=parent.scale;
   u.uBirth.value=holeUniforms.uBirth.value;
  }));
  fragments.forEach((mesh,k)=>{
   const i=flowPaths.length-2+k,u=mesh.material.uniforms,path=flowPaths[i],parent=poses[path.owner];
   u.uTime.value=materialTime;u.uReveal.value=1.1*smooth((time-2.05-path.owner*.7)/2.2);
   u.uObject.value.set(parent.point.x,parent.point.y);u.uObjectScale.value=parent.scale;u.uBirth.value=holeUniforms.uBirth.value;
  });
  const unit=layout.mobile?layout.w/1000:Math.min(layout.w/1672,layout.h/863);
  const scale=layout.mobile?1.2:1;
  function place(i:number,x:number,y:number,w:number,h:number,alpha:number,angle=0){const m=objects[i];m.position.set(x,y,0);m.scale.set(w,-h,1);m.rotation.z=angle;m.material.uniforms.uOpacity.value=alpha;}
  place(0,left.point.x,left.point.y,460*unit*scale*left.scale,307*unit*scale*left.scale,left.alpha);
  place(1,right.point.x,right.point.y,285*unit*scale*right.scale,190*unit*scale*right.scale,right.alpha,.12);
  place(2,left.point.x-66*unit,left.point.y+89*unit,180*unit*scale,120*unit*scale,left.alpha);
  place(3,left.point.x-14*unit,left.point.y+152*unit,50*unit*scale,33*unit*scale,left.alpha);
  rockSeeds.forEach((seed,i)=>{
   const lag=smooth((time-2.75-i*.015)/2.7),dx=seed.x*unit,dy=seed.y*unit;
   const wobble=Math.max(0,objectTime-5.8);
   place(i+4,debris.point.x+dx+(1-lag)*90*unit,debris.point.y+dy+Math.sin(wobble*.14+i)*unit*2,seed.size*unit*scale,seed.size*unit*scale,debris.alpha*smooth(lag*3),seed.angle+Math.sin(wobble*.12+i)*.06);
  });
  const now=performance.now();if(stamp&&now-stamp<200){frameMs.push(now-stamp);if(frameMs.length>600)frameMs.shift();}stamp=now;
  renderer.render(scene,camera);draws++;
  return {left,right,debris};
 }
 return {resize,draw,renderSurface:()=>({renderer,scene,camera,canvas}),composition:()=>layout,
  snapshot(){return {time:last,draws,drawCalls:renderer.info.render.calls,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,pixelRatio:renderer.getPixelRatio(),frameMs:[...frameMs],layout,secondaryFlows:flowPaths.slice(4).map(p=>({kind:p.kind,start:p.source.toArray(),end:p.curve.getPointAt(1).toArray()})),connections:flowPaths.slice(0,4).map((path,i)=>{
    const p=pose(path.owner,last),local=path.source.clone().sub(path.anchor).multiplyScalar(p.scale),source=p.point.clone().add(local),u=ribbons[i].material.uniforms;
    const rendered=path.source.clone().sub(path.anchor).multiplyScalar(u.uObjectScale.value).add(new Vector3(u.uObject.value.x,u.uObject.value.y,0));
    return {owner:path.owner,source:source.toArray(),rendered:rendered.toArray(),error:source.distanceTo(rendered),haloEnd:path.curve.getPointAt(1).toArray()};
   }),groups:paths.slice(0,3).map((_,i)=>{const p=pose(i,last);return{x:p.point.x,y:p.point.y,alpha:p.alpha,complete:p.complete};})};},
  dispose(){for(const m of [...ribbons,...filaments,...dust,...fragments,...objects,disk,atmosphere]){m.geometry.dispose();m.material.dispose();}textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();},
 };
}
