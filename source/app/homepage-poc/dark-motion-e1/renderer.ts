import { Mesh, ShaderMaterial, Vector2 } from 'three';
import { createLivingRenderer } from '../dark-motion-c/renderer';
import { ribbonFragment, ribbonVertex } from '../dark-motion-c/shaders';
import type { GravityPath } from '../dark-motion-c/paths';

const output = 'gl_FragColor=vec4(color,alpha);';
const project = 'projectionMatrix*modelViewMatrix*vec4(position,1.)';
if(!ribbonFragment.includes(output)||!ribbonVertex.includes(project))throw Error('Motion C shader contract changed');

const fragment = ribbonFragment.replace('precision highp float;',
  'precision highp float; uniform float uHead,uWake,uAttached,uCoupling;').replace(output, `
  float front=smoothstep(uHead-.009,uHead+.006,s);
  float tail=exp(-max(0.,uHead-s)*(48.-uCoupling*8.))*smoothstep(uHead-.13,uHead-.09,s)*(1.-front);
  alpha*=mix(1.,front+tail*(.2+uWake*.65),uAttached);
  color+=vec3(.23,.18,.09)*tail*(uWake+.12*uCoupling)*uAttached;
  ${output}`);

const vertex = ribbonVertex.replace('varying vec2 vUv;',
  'uniform vec2 uObjectOffset; uniform float uHead,uCoupling; varying vec2 vUv;').replace(project,
  'projectionMatrix*modelViewMatrix*vec4(position.xy+uObjectOffset*exp(-pow((uv.x-uHead)/(.075+.045*uCoupling),2.)),position.z,1.)');

export function createAmbientRenderer(canvas:HTMLCanvasElement){
  const base=createLivingRenderer(canvas);
  let ribbons:ShaderMaterial[]=[];
  return {
    ...base,
    paths(paths:GravityPath[]){
      base.paths(paths);
      ribbons=base.scene.children.filter(node=>node instanceof Mesh && node.material instanceof ShaderMaterial && 'uReveal' in node.material.uniforms)
        .map(node=>(node as Mesh).material as ShaderMaterial);
      ribbons.forEach(material=>{
        material.vertexShader=vertex;material.fragmentShader=fragment;
        Object.assign(material.uniforms,{uHead:{value:0},uWake:{value:0},uAttached:{value:0},uCoupling:{value:0},uObjectOffset:{value:new Vector2()}});
        material.needsUpdate=true;
      });
    },
    tether(index:number,head:number,wake:number,offsetX:number,offsetY:number,attached:boolean,coupling=0){
      const uniforms=ribbons[index]?.uniforms;if(!uniforms)return;
      uniforms.uHead.value=head;uniforms.uWake.value=wake;uniforms.uAttached.value=attached?1:0;uniforms.uCoupling.value=coupling;
      uniforms.uObjectOffset.value.set(offsetX,offsetY);
    },
    endpoints(){return ribbons.map(m=>({head:m.uniforms.uHead.value,wake:m.uniforms.uWake.value,offset:m.uniforms.uObjectOffset.value.toArray(),attached:m.uniforms.uAttached.value,coupling:m.uniforms.uCoupling.value}));},
  };
}
