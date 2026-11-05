import { Color, Mesh, PlaneGeometry, Scene, ShaderMaterial, Vector2 } from 'three';
import type { CaptureController } from '../dark-motion-e6/controller';
import { vertexShader, fragmentShader } from './spiral-shader';

/** One temporary pass in E.6's existing context. Owns no renderer or ticker. */
export function createSpiralPass(api: CaptureController) {
  const { renderer, camera, canvas } = api.renderSurface();
  const scene=new Scene();
  const uniforms = {
    uResolution: { value: new Vector2() }, uOrigin: { value: new Vector2(.5,.5) },
    uProgress: { value: 0 }, uReveal: { value: 0 }, uTime: { value: 0 }, uAlpha: { value: 0 },
    uCover: { value: new Color() }, uRing: { value: new Color() }, uHot: { value: new Color() },
  };
  const material = new ShaderMaterial({vertexShader, fragmentShader, uniforms, transparent:true, depthTest:false, depthWrite:false});
  const geometry = new PlaneGeometry(2,2);
  const mesh = new Mesh(geometry,material);
  mesh.renderOrder=1000; mesh.frustumCulled=false; mesh.visible=false; scene.add(mesh);
  return {
    render(progress:number, mode:'light'|'dark', center:{x:number;y:number}, time:number, maskOnly:boolean) {
      const rect=canvas.getBoundingClientRect();
      uniforms.uResolution.value.set(rect.width,rect.height);
      uniforms.uOrigin.value.set((center.x-rect.left)/rect.width,1-(center.y-rect.top)/rect.height);
      uniforms.uProgress.value=progress; uniforms.uReveal.value=mode==='dark'||maskOnly?1:0;
      uniforms.uTime.value=time; uniforms.uAlpha.value=1;
      // This legacy GLSL writes display values directly, like the original Spiral.
      // Undo Color's linearization so the opaque handoff exactly matches CSS ivory.
      uniforms.uCover.value.set(mode==='dark'?'#01050b':'#f6f2e8').convertLinearToSRGB();
      uniforms.uRing.value.set(mode==='dark'?'#b7d9ee':'#d5aa68').convertLinearToSRGB();
      uniforms.uHot.value.set(mode==='dark'?'#fff0c9':'#fff8e9').convertLinearToSRGB();
      mesh.visible=progress>0;
      // Overlay just one draw, not a second rendering of the E.6 scene.
      const autoClear=renderer.autoClear;renderer.autoClear=false;
      if(maskOnly)renderer.clear();
      renderer.render(scene,camera);
      renderer.autoClear=autoClear;
    },
    dispose(){scene.remove(mesh);geometry.dispose();material.dispose();},
  };
}
