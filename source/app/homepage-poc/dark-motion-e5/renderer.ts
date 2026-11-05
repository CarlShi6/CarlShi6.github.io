import { Mesh, ShaderMaterial } from 'three';
import { createCaptureRenderer as createBaseRenderer } from '../dark-motion-d/renderer';
import type { GravityPath } from '../dark-motion-c/paths';

// Curve-space s is arc progress toward the horizon; v is the transverse lane.
// This shader variation belongs exclusively to stream 0 in the E.5 study.
const organic = /* glsl */ `
  if(uOrganic>.5){
    float sheet=noiseR(vec2(advect*9.2,v*2.1));
    float shear=(sheet-.5)*.40+sin(advect*18.+v*2.)*.16;
    float envelope=smoothstep(uHead-.01,uHead+.05,s)*(1.-smoothstep(uMerge-.06,uMerge+.06,s));
    float broad=0.;float threads=0.;float mist=0.;
    for(int j=0;j<8;j++){
      float k=float(j),seed=k*13.7;
      float laneCenter=(k-3.5)*.16;
      float curl=sin(advect*(24.+k*.81)+k*.93)*(.11+.17*sheet);
      float fold=sin(advect*39.+k*1.7+sin(advect*11.))* .075;
      float branch=sin(advect*11.+k)*.12;
      float transverse=v-laneCenter-(shear+curl+fold)*envelope;
      float grain=noiseR(vec2(advect*47.+seed,transverse*12.+seed));
      float width=.014+.032*noiseR(vec2(advect*16.+seed,k));
      float gate=.25+.75*smoothstep(.25,.7,noiseR(vec2(advect*21.+seed,k*2.)));
      // Daughter filaments converge locally; broad shearing is shared, not random jitter.
      float filament=exp(-pow(transverse/width,2.));
      float split=exp(-pow((transverse-branch*envelope)/(width*.48),2.));
      broad+=(filament*1.6+split*.65)*gate*(.45+grain*.55);
      threads+=exp(-abs(transverse)*90.)*gate*.3;
      mist+=exp(-abs(transverse)*12.)*grain*.065;
    }
    striation=mix(striation,broad,envelope);
    fine=mix(fine,threads,envelope);
    core=mix(core,mist,envelope);
    pulses=mix(pulses,.2+.8*sheet,envelope);
    texture=mix(texture,noiseR(vec2(advect*32.,v*13.+shear*9.)),envelope);
    noise=mix(noise,.48+sheet*.52,envelope);
  }
`;

export function createCaptureRenderer(canvas:HTMLCanvasElement){
  const base=createBaseRenderer(canvas);
  let enabled=true,material:ShaderMaterial|undefined;
  let lastDraw:Parameters<typeof base.draw>|undefined;
  const change=(event:Event)=>{enabled=Boolean((event as CustomEvent<boolean>).detail);if(material)material.uniforms.uOrganic.value=enabled?1:0;if(lastDraw)base.draw(...lastDraw);};
  window.addEventListener('motion-e5-organic',change);
  return {
    ...base,
    draw(...args:Parameters<typeof base.draw>){lastDraw=args;base.draw(...args);},
    paths(paths:GravityPath[]){
      base.paths(paths);
      const mesh=base.scene.children.find(node=>node instanceof Mesh&&node.material instanceof ShaderMaterial&&'uReveal' in node.material.uniforms) as Mesh|undefined;
      material=mesh?.material as ShaderMaterial|undefined;
      if(!material)return;
      const source=material.fragmentShader;
      if(!source.includes('float reveal=')||!source.includes('gl_FragColor=vec4(color,alpha);'))throw new Error('E.5 ribbon shader contract changed');
      material.uniforms.uOrganic={value:enabled?1:0};
      material.fragmentShader=source.replace('precision highp float;','precision highp float; uniform float uOrganic;')
        .replace('float reveal=',organic+'\n float reveal=')
        .replace('gl_FragColor=vec4(color,alpha);',/* glsl */`
          if(uOrganic>.5){
            float mask=smoothstep(uHead-.01,uHead+.055,s)*(1.-smoothstep(uMerge-.04,uMerge+.05,s));
            float smoke=noiseR(vec2(advect*13.+v*.5,v*4.+noise*1.3));
            float mottled=smoothstep(.28,.67,smoke)*pow(max(0.,1.-v*v),2.);
            // Dark mineral suspension partly occludes filaments; a faint cold veil sits between them.
            color*=1.-mask*mottled*.38;
            color+=vec3(.045,.065,.083)*mottled*mask*uIntensity;
            alpha=max(alpha,mottled*.13*mask*reveal*taper);
          }
          gl_FragColor=vec4(color,alpha);
        `);
      material.needsUpdate=true;
    },
    dispose(){window.removeEventListener('motion-e5-organic',change);base.dispose();},
  };
}
