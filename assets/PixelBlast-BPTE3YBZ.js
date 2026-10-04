import{r as e}from"./rolldown-runtime-S-ySWqyJ.js";import{a as t,i as n}from"./framework-DC_sNd-Z.js";import{A as r,C as i,F as a,L as o,M as s,O as c,P as l,T as u,_ as d,a as f,d as p,i as m,j as h,k as g,l as _,m as ee,p as v,r as y,s as te,t as ne,u as b,v as x,w as S,x as C,y as w}from"./three.module-B9gjz9sS.js";var T=(()=>{let e=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),t=new Float32Array([0,0,2,0,0,2]),n=new f;return n.setAttribute(`position`,new m(e,3)),n.setAttribute(`uv`,new m(t,2)),n})(),E=class e{static get fullscreenGeometry(){return T}constructor(e=`Pass`,t=new g,n=new i){this.name=e,this.renderer=null,this.scene=t,this.camera=n,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthBlit=!1,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(e){if(this.rtt===e){let t=this.fullscreenMaterial;t!==null&&(t.needsUpdate=!0),this.rtt=!e}}set mainScene(e){}set mainCamera(e){}setRenderer(e){this.renderer=e}isEnabled(){return this.enabled}setEnabled(e){this.enabled=e}get fullscreenMaterial(){return this.screen===null?null:this.screen.material}set fullscreenMaterial(t){let n=this.screen;n===null?(n=new C(e.fullscreenGeometry,t),n.frustumCulled=!1,this.scene===null&&(this.scene=new g),this.scene.add(n),this.screen=n):n.material=t}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(e){this.fullscreenMaterial=e}getDepthTexture(){return null}setDepthTexture(e,t=y){}render(e,t,n,r,i){throw Error(`Render method not implemented!`)}setSize(e,t){}initialize(e,t,n){}dispose(){for(let t of Object.keys(this)){let n=this[t];(n instanceof o||n instanceof w||n instanceof h||n instanceof e)&&this[t].dispose()}this.fullscreenMaterial!==null&&this.fullscreenMaterial.dispose()}},D=class extends E{constructor(){super(`ClearMaskPass`,null,null),this.needsSwap=!1}render(e,t,n,r,i){let a=e.state.buffers.stencil;a.setLocked(!1),a.setTest(!1)}},O=`#ifdef COLOR_WRITE
#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#endif
#ifdef DEPTH_WRITE
#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}
#endif
#ifdef USE_WEIGHTS
uniform vec4 channelWeights;
#endif
uniform float opacity;varying vec2 vUv;void main(){
#ifdef COLOR_WRITE
vec4 texel=texture2D(inputBuffer,vUv);
#ifdef USE_WEIGHTS
texel*=channelWeights;
#endif
gl_FragColor=opacity*texel;
#ifdef COLOR_SPACE_CONVERSION
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
#else
gl_FragColor=vec4(0.0);
#endif
#ifdef DEPTH_WRITE
gl_FragDepth=readDepth(vUv);
#endif
}`,k=`varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}`,A=class extends r{constructor(){super({name:`CopyMaterial`,defines:{COLOR_SPACE_CONVERSION:`1`,DEPTH_PACKING:`0`,COLOR_WRITE:`1`},uniforms:{inputBuffer:new s(null),depthBuffer:new s(null),channelWeights:new s(null),opacity:new s(1)},blending:0,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:O,vertexShader:k}),this.depthFunc=1}get inputBuffer(){return this.uniforms.inputBuffer.value}set inputBuffer(e){let t=e!==null;this.colorWrite!==t&&(t?this.defines.COLOR_WRITE=!0:delete this.defines.COLOR_WRITE,this.colorWrite=t,this.needsUpdate=!0),this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){let t=e!==null;this.depthWrite!==t&&(t?this.defines.DEPTH_WRITE=!0:delete this.defines.DEPTH_WRITE,this.depthTest=t,this.depthWrite=t,this.needsUpdate=!0),this.uniforms.depthBuffer.value=e}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}get colorSpaceConversion(){return this.defines.COLOR_SPACE_CONVERSION!==void 0}set colorSpaceConversion(e){this.colorSpaceConversion!==e&&(e?this.defines.COLOR_SPACE_CONVERSION=!0:delete this.defines.COLOR_SPACE_CONVERSION,this.needsUpdate=!0)}get channelWeights(){return this.uniforms.channelWeights.value}set channelWeights(e){e===null?delete this.defines.USE_WEIGHTS:(this.defines.USE_WEIGHTS=`1`,this.uniforms.channelWeights.value=e),this.needsUpdate=!0}setInputBuffer(e){this.uniforms.inputBuffer.value=e}getOpacity(e){return this.uniforms.opacity.value}setOpacity(e){this.uniforms.opacity.value=e}},j=class extends E{constructor(e,t=!0){super(`CopyPass`),this.fullscreenMaterial=new A,this.needsSwap=!1,this.renderTarget=e,e===void 0&&(this.renderTarget=new o(1,1,{minFilter:d,magFilter:d,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name=`CopyPass.Target`),this.autoResize=t}get resize(){return this.autoResize}set resize(e){this.autoResize=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(e){this.autoResize=e}render(e,t,n,r,i){this.fullscreenMaterial.inputBuffer=t.texture,e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){this.autoResize&&this.renderTarget.setSize(e,t)}initialize(e,t,n){n!==void 0&&(this.renderTarget.texture.type=n,n===1009?e!==null&&e.outputColorSpace===`srgb`&&(this.renderTarget.texture.colorSpace=c):this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH=`1`)}},M=new te,N=class extends E{constructor(e=!0,t=!0,n=!1){super(`ClearPass`,null,null),this.needsSwap=!1,this.color=e,this.depth=t,this.stencil=n,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(e,t,n){this.color=e,this.depth=t,this.stencil=n}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(e){this.overrideClearColor=e}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(e){this.overrideClearAlpha=e}render(e,t,n,r,i){let a=this.overrideClearColor,o=this.overrideClearAlpha,s=e.getClearAlpha(),c=a!==null,l=o>=0;c?(e.getClearColor(M),e.setClearColor(a,l?o:s)):l&&e.setClearAlpha(o),e.setRenderTarget(this.renderToScreen?null:t),e.clear(this.color,this.depth,this.stencil),c?e.setClearColor(M,s):l&&e.setClearAlpha(s)}},P=class extends E{constructor(e,t){super(`MaskPass`,e,t),this.needsSwap=!1,this.clearPass=new N(!1,!1,!0),this.inverse=!1}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get inverted(){return this.inverse}set inverted(e){this.inverse=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(e){this.inverted=e}render(e,t,n,r,i){let a=e.getContext(),o=e.state.buffers,s=this.scene,c=this.camera,l=this.clearPass,u=+!this.inverted,d=1-u;o.color.setMask(!1),o.depth.setMask(!1),o.color.setLocked(!0),o.depth.setLocked(!0),o.stencil.setTest(!0),o.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),o.stencil.setFunc(a.ALWAYS,u,4294967295),o.stencil.setClear(d),o.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?l.render(e,null):(l.render(e,t),l.render(e,n))),this.renderToScreen?(e.setRenderTarget(null),e.render(s,c)):(e.setRenderTarget(t),e.render(s,c),e.setRenderTarget(n),e.render(s,c)),o.color.setLocked(!1),o.depth.setLocked(!1),o.stencil.setLocked(!1),o.stencil.setFunc(a.EQUAL,1,4294967295),o.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),o.stencil.setLocked(!0)}},F=1/1e3,I=1e3,L=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(e){typeof document<`u`&&document.hidden!==void 0&&(e?document.addEventListener(`visibilitychange`,this):document.removeEventListener(`visibilitychange`,this),this._autoReset=e)}get delta(){return this._delta*F}get fixedDelta(){return this._fixedDelta*F}set fixedDelta(e){this._fixedDelta=e*I}get elapsed(){return this._elapsed*F}update(e){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(e===void 0?performance.now():e)-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}getDelta(){return this.delta}getElapsed(){return this.elapsed}handleEvent(e){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}},R=class{constructor(e=null,{depthBuffer:t=!0,stencilBuffer:n=!1,multisampling:r=0,frameBufferType:i}={}){this.renderer=null,this.inputBuffer=this.createBuffer(t,n,i,r),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new j,this.depthRenderTarget=null,this.passes=[],this.timer=new L,this.autoRenderToScreen=!0,this.setRenderer(e)}get stableDepthTexture(){return this.depthRenderTarget?.depthTexture??null}get multisampling(){return this.inputBuffer.samples}set multisampling(e){this.multisampling!==e&&(this.inputBuffer.samples=e,this.outputBuffer.samples=e,this.inputBuffer.dispose(),this.outputBuffer.dispose())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(e){if(this.renderer=e,e!==null){let t=e.getSize(new a),n=e.getContext().getContextAttributes().alpha,r=this.inputBuffer.texture.type;r===1009&&e.outputColorSpace===`srgb`&&(this.inputBuffer.texture.colorSpace=c,this.outputBuffer.texture.colorSpace=c,this.inputBuffer.dispose(),this.outputBuffer.dispose()),e.autoClear=!1,this.setSize(t.width,t.height);for(let t of this.passes)t.initialize(e,n,r)}}replaceRenderer(e,t=!0){let n=this.renderer,r=n.domElement.parentNode;return this.setRenderer(e),t&&r!==null&&(r.removeChild(n.domElement),r.appendChild(e.domElement)),n}createDepthTexture(){let e=new b;e.name=`EffectComposer.InputDepth`,this.inputBuffer.stencilBuffer?(e.format=_,e.type=l):e.type=v;let t=e.clone();t.name=`EffectComposer.OutputDepth`;let n=e.clone();n.name=`EffectComposer.StableDepth`,this.inputBuffer.depthTexture=e,this.outputBuffer.depthTexture=t,this.inputBuffer.dispose(),this.outputBuffer.dispose();let{width:r,height:i}=this.inputBuffer;this.depthRenderTarget=new o(r,i,{depthBuffer:!0,stencilBuffer:this.inputBuffer.stencilBuffer,depthTexture:n})}blitDepthBuffer(e){let t=this.renderer,n=this.depthRenderTarget,r=t.properties,i=t.getContext();t.setRenderTarget(n);let a=r.get(e).__webglFramebuffer,o=r.get(n).__webglFramebuffer,s=e.stencilBuffer?i.DEPTH_BUFFER_BIT|i.STENCIL_BUFFER_BIT:i.DEPTH_BUFFER_BIT;i.bindFramebuffer(i.READ_FRAMEBUFFER,a),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,o),i.blitFramebuffer(0,0,e.width,e.height,0,0,n.width,n.height,s,i.NEAREST),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),t.setRenderTarget(null)}deleteDepthTexture(){var e,t,n;let r=this.stableDepthTexture;for(let e of this.passes)e.getDepthTexture()===r&&e.setDepthTexture(null);(e=this.depthRenderTarget)==null||e.dispose(),this.depthRenderTarget=null,(t=this.inputBuffer.depthTexture)==null||t.dispose(),this.inputBuffer.depthTexture=null,(n=this.outputBuffer.depthTexture)==null||n.dispose(),this.outputBuffer.depthTexture=null}createBuffer(e,t,n,r){let i=this.renderer,s=i===null?new a:i.getDrawingBufferSize(new a),l=new o(s.width,s.height,{minFilter:d,magFilter:d,samples:r,stencilBuffer:t,depthBuffer:e,type:n});return n===1009&&i!==null&&i.outputColorSpace===`srgb`&&(l.texture.colorSpace=c),l.texture.name=`EffectComposer.Buffer`,l.texture.generateMipmaps=!1,l}setMainScene(e){for(let t of this.passes)t.mainScene=e}setMainCamera(e){for(let t of this.passes)t.mainCamera=e}addPass(e,t){let n=this.passes,r=this.renderer,i=r.getDrawingBufferSize(new a),o=r.getContext().getContextAttributes().alpha,s=this.inputBuffer.texture.type;if(e.renderer=r,e.setSize(i.width,i.height),e.initialize(r,o,s),this.autoRenderToScreen&&(n.length>0&&(n[n.length-1].renderToScreen=!1),e.renderToScreen&&(this.autoRenderToScreen=!1)),t===void 0?n.push(e):n.splice(t,0,e),this.autoRenderToScreen&&(n[n.length-1].renderToScreen=!0),e.needsDepthTexture||this.depthRenderTarget!==null)if(this.depthRenderTarget===null){this.createDepthTexture();for(let e of n)e.setDepthTexture(this.stableDepthTexture)}else e.setDepthTexture(this.stableDepthTexture)}removePass(e){let t=this.passes,n=t.indexOf(e);if(n!==-1&&t.splice(n,1).length>0){let r=this.stableDepthTexture;r!==null&&(t.reduce((e,t)=>e||t.needsDepthTexture,!1)||(e.getDepthTexture()===r&&e.setDepthTexture(null),this.deleteDepthTexture())),this.autoRenderToScreen&&n===t.length&&(e.renderToScreen=!1,t.length>0&&(t[t.length-1].renderToScreen=!0))}}removeAllPasses(){let e=this.passes;this.deleteDepthTexture(),e.length>0&&(this.autoRenderToScreen&&(e[e.length-1].renderToScreen=!1),this.passes=[])}render(e){let t=this.renderer,n=this.copyPass,r=this.inputBuffer,i=this.outputBuffer,a,o=!1;e===void 0&&(this.timer.update(),e=this.timer.getDelta());for(let s of this.passes)if(s.enabled){if(s.render(t,r,i,e,o),s.needsDepthBlit&&this.depthRenderTarget!==null&&this.blitDepthBuffer(r),s.needsSwap){if(o){n.renderToScreen=s.renderToScreen;let a=t.getContext(),c=t.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),n.render(t,r,i,e,o),c.setFunc(a.EQUAL,1,4294967295)}a=r,r=i,i=a}s instanceof P?o=!0:s instanceof D&&(o=!1)}}setSize(e,t,n){let r=this.renderer,i=r.getSize(new a);(e===void 0||t===void 0)&&(e=i.width,t=i.height),(i.width!==e||i.height!==t)&&r.setSize(e,t,n);let o=r.getDrawingBufferSize(new a);this.inputBuffer.setSize(o.width,o.height),this.outputBuffer.setSize(o.width,o.height),this.depthRenderTarget!==null&&this.depthRenderTarget.setSize(o.width,o.height);for(let e of this.passes)e.setSize(o.width,o.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(let e of this.passes)e.dispose();this.deleteDepthTexture(),this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.copyPass.dispose(),this.timer.dispose(),this.passes=[],E.fullscreenGeometry.dispose()}},z={NONE:0,DEPTH:1,CONVOLUTION:2},B={FRAGMENT_HEAD:`FRAGMENT_HEAD`,FRAGMENT_MAIN_UV:`FRAGMENT_MAIN_UV`,FRAGMENT_MAIN_IMAGE:`FRAGMENT_MAIN_IMAGE`,VERTEX_HEAD:`VERTEX_HEAD`,VERTEX_MAIN_SUPPORT:`VERTEX_MAIN_SUPPORT`},re=class{constructor(){this.shaderParts=new Map([[B.FRAGMENT_HEAD,null],[B.FRAGMENT_MAIN_UV,null],[B.FRAGMENT_MAIN_IMAGE,null],[B.VERTEX_HEAD,null],[B.VERTEX_MAIN_SUPPORT,null]]),this.defines=new Map,this.uniforms=new Map,this.blendModes=new Map,this.extensions=new Set,this.attributes=z.NONE,this.varyings=new Set,this.uvTransformation=!1,this.readDepth=!1,this.colorSpace=x}},V=!1,H=class{constructor(e=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(e),this.meshCount=0,this.replaceMaterial=e=>{if(e.isMesh){let t;if(e.material.flatShading)switch(e.material.side){case 2:t=this.materialsFlatShadedDoubleSide;break;case 1:t=this.materialsFlatShadedBackSide;break;default:t=this.materialsFlatShaded;break}else switch(e.material.side){case 2:t=this.materialsDoubleSide;break;case 1:t=this.materialsBackSide;break;default:t=this.materials;break}this.originalMaterials.set(e,e.material),e.isSkinnedMesh?e.material=t[2]:e.isInstancedMesh?e.material=t[1]:e.material=t[0],++this.meshCount}}}cloneMaterial(e){if(!(e instanceof r))return e.clone();let t=e.uniforms,n=new Map;for(let e in t){let r=t[e].value;r.isRenderTargetTexture&&(t[e].value=null,n.set(e,r))}let i=e.clone();for(let e of n)t[e[0]].value=e[1],i.uniforms[e[0]].value=e[1];return i}setMaterial(e){if(this.disposeMaterials(),this.material=e,e!==null){let t=this.materials=[this.cloneMaterial(e),this.cloneMaterial(e),this.cloneMaterial(e)];for(let n of t)n.uniforms=Object.assign({},e.uniforms),n.side=0;t[2].skinning=!0,this.materialsBackSide=t.map(t=>{let n=this.cloneMaterial(t);return n.uniforms=Object.assign({},e.uniforms),n.side=1,n}),this.materialsDoubleSide=t.map(t=>{let n=this.cloneMaterial(t);return n.uniforms=Object.assign({},e.uniforms),n.side=2,n}),this.materialsFlatShaded=t.map(t=>{let n=this.cloneMaterial(t);return n.uniforms=Object.assign({},e.uniforms),n.flatShading=!0,n}),this.materialsFlatShadedBackSide=t.map(t=>{let n=this.cloneMaterial(t);return n.uniforms=Object.assign({},e.uniforms),n.flatShading=!0,n.side=1,n}),this.materialsFlatShadedDoubleSide=t.map(t=>{let n=this.cloneMaterial(t);return n.uniforms=Object.assign({},e.uniforms),n.flatShading=!0,n.side=2,n})}}render(e,t,n){let r=e.shadowMap.enabled;if(e.shadowMap.enabled=!1,V){let r=this.originalMaterials;this.meshCount=0,t.traverse(this.replaceMaterial),e.render(t,n);for(let e of r)e[0].material=e[1];this.meshCount!==r.size&&r.clear()}else{let r=t.overrideMaterial;t.overrideMaterial=this.material,e.render(t,n),t.overrideMaterial=r}e.shadowMap.enabled=r}disposeMaterials(){if(this.material!==null){let e=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(let t of e)t.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return V}static set workaroundEnabled(e){V=e}},U={SKIP:9,SET:30,ADD:0,ALPHA:1,AVERAGE:2,COLOR:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,DIVIDE:8,DST:9,EXCLUSION:10,HARD_LIGHT:11,HARD_MIX:12,HUE:13,INVERT:14,INVERT_RGB:15,LIGHTEN:16,LINEAR_BURN:17,LINEAR_DODGE:18,LINEAR_LIGHT:19,LUMINOSITY:20,MULTIPLY:21,NEGATION:22,NORMAL:23,OVERLAY:24,PIN_LIGHT:25,REFLECT:26,SATURATION:27,SCREEN:28,SOFT_LIGHT:29,SRC:30,SUBTRACT:31,VIVID_LIGHT:32},ie=new Map([[U.ADD,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.ALPHA,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,src.a*opacity);}`],[U.AVERAGE,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=(dst.rgb+src.rgb)*0.5;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.COLOR,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.xy,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.COLOR_BURN,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=mix(step(0.0,b)*(1.0-min(vec3(1.0),(1.0-a)/max(b,1e-9))),vec3(1.0),step(1.0,a));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.COLOR_DODGE,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=step(0.0,a)*mix(min(vec3(1.0),a/max(1.0-b,1e-9)),vec3(1.0),step(1.0,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.DARKEN,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.DIFFERENCE,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=abs(dst.rgb-src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.DIVIDE,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb/max(src.rgb,1e-9);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.DST,null],[U.EXCLUSION,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-2.0*dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.HARD_LIGHT,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb,1.0);vec3 b=min(src.rgb,1.0);vec3 c=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.HARD_MIX,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=step(1.0,dst.rgb+src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.HUE,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.x,a.yz));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.INVERT,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.INVERT_RGB,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=src.rgb*max(1.0-dst.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.LIGHTEN,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.LINEAR_BURN,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.LINEAR_DODGE,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb+src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.LINEAR_LIGHT,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(2.0*src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.LUMINOSITY,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.xy,b.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.MULTIPLY,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.NEGATION,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-abs(1.0-dst.rgb-src.rgb),0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.NORMAL,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,opacity);}`],[U.OVERLAY,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=2.0*src.rgb*dst.rgb;vec3 b=1.0-2.0*(1.0-src.rgb)*(1.0-dst.rgb);vec3 c=mix(a,b,step(0.5,dst.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.PIN_LIGHT,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 c=mix(mix(src2,dst.rgb,step(0.5*dst.rgb,src.rgb)),max(src2-1.0,vec3(0.0)),step(dst.rgb,src2-1.0));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.REFLECT,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb*dst.rgb/max(1.0-src.rgb,1e-9),1.0);vec3 c=mix(a,src.rgb,step(1.0,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.SATURATION,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.x,b.y,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.SCREEN,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-min(dst.rgb*src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.SOFT_LIGHT,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 d=dst.rgb+(src2-1.0);vec3 w=step(0.5,src.rgb);vec3 a=dst.rgb-(1.0-src2)*dst.rgb*(1.0-dst.rgb);vec3 b=mix(d*(sqrt(dst.rgb)-dst.rgb),d*dst.rgb*((16.0*dst.rgb-12.0)*dst.rgb+3.0),w*(1.0-step(0.25,dst.rgb)));vec3 c=mix(a,b,w);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.SRC,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return src;}`],[U.SUBTRACT,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],[U.VIVID_LIGHT,`vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=mix(max(1.0-min((1.0-dst.rgb)/(2.0*src.rgb),1.0),0.0),min(dst.rgb/(2.0*(1.0-src.rgb)),1.0),step(0.5,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`]]),ae=class extends p{constructor(e,t=1){super(),this._blendFunction=e,this.opacity=new s(t)}getOpacity(){return this.opacity.value}setOpacity(e){this.opacity.value=e}get blendFunction(){return this._blendFunction}set blendFunction(e){this._blendFunction=e,this.dispatchEvent({type:`change`})}getBlendFunction(){return this.blendFunction}setBlendFunction(e){this.blendFunction=e}getShaderCode(){return ie.get(this.blendFunction)}},W=class extends p{constructor(e,t,{attributes:n=z.NONE,blendFunction:r=U.NORMAL,defines:i=new Map,uniforms:a=new Map,extensions:o=null,vertexShader:s=null}={}){super(),this.name=e,this.renderer=null,this.attributes=n,this.fragmentShader=t,this.vertexShader=s,this.defines=i,this.uniforms=a,this.extensions=o,this.blendMode=new ae(r),this.blendMode.addEventListener(`change`,e=>this.setChanged()),this._inputColorSpace=x,this._outputColorSpace=``}get inputColorSpace(){return this._inputColorSpace}set inputColorSpace(e){this._inputColorSpace=e,this.setChanged()}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e,this.setChanged()}set mainScene(e){}set mainCamera(e){}getName(){return this.name}setRenderer(e){this.renderer=e}getDefines(){return this.defines}getUniforms(){return this.uniforms}getExtensions(){return this.extensions}getBlendMode(){return this.blendMode}getAttributes(){return this.attributes}setAttributes(e){this.attributes=e,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(e){this.fragmentShader=e,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(e){this.vertexShader=e,this.setChanged()}setChanged(){this.dispatchEvent({type:`change`})}setDepthTexture(e,t=y){}update(e,t,n){}setSize(e,t){}initialize(e,t,n){}dispose(){for(let e of Object.keys(this)){let t=this[e];(t instanceof o||t instanceof w||t instanceof h||t instanceof E)&&this[e].dispose()}}};new Float32Array([0,0]),new Float32Array([0,1,1]),new Float32Array([0,1,1,2]),new Float32Array([0,1,2,2,3]),new Float32Array([0,1,2,3,4,4,5]),new Float32Array([0,1,2,3,4,5,7,8,9,10]);var G=class extends E{constructor(e,t,n=null){super(`RenderPass`,e,t),this.needsSwap=!1,this.needsDepthBlit=!0,this.clearPass=new N,this.overrideMaterialManager=n===null?null:new H(n),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get renderToScreen(){return super.renderToScreen}set renderToScreen(e){super.renderToScreen=e,this.clearPass.renderToScreen=e}get overrideMaterial(){let e=this.overrideMaterialManager;return e===null?null:e.material}set overrideMaterial(e){let t=this.overrideMaterialManager;e===null?t!==null&&(t.dispose(),this.overrideMaterialManager=null):t===null?this.overrideMaterialManager=new H(e):t.setMaterial(e)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(e){this.overrideMaterial=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getSelection(){return this.selection}setSelection(e){this.selection=e}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(e){this.ignoreBackground=e}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(e){this.skipShadowMapUpdate=e}getClearPass(){return this.clearPass}render(e,t,n,r,i){let a=this.scene,o=this.camera,s=this.selection,c=o.layers.mask,l=a.background,u=e.shadowMap.autoUpdate,d=this.renderToScreen?null:t;s!==null&&o.layers.set(s.getLayer()),this.skipShadowMapUpdate&&(e.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(a.background=null),this.clearPass.enabled&&this.clearPass.render(e,t),e.setRenderTarget(d),this.overrideMaterialManager===null?e.render(a,o):this.overrideMaterialManager.render(e,a,o),o.layers.mask=c,a.background=l,e.shadowMap.autoUpdate=u}};Math.PI*.5;var oe=`#include <common>
#include <packing>
#include <dithering_pars_fragment>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
float depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
float depth=texture2D(depthBuffer,uv).r;
#endif
#if defined(USE_LOGARITHMIC_DEPTH_BUFFER) || defined(LOG_DEPTH)
float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
#elif defined(USE_REVERSED_DEPTH_BUFFER)
depth=1.0-depth;
#endif
return depth;}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
}`,se=`uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}`,ce=class extends r{constructor(e,t,n,r,i=!1){super({name:`EffectMaterial`,defines:{THREE_REVISION:`185`.replace(/\D+/g,``),DEPTH_PACKING:`0`,ENCODE_OUTPUT:`1`},uniforms:{inputBuffer:new s(null),depthBuffer:new s(null),resolution:new s(new a),texelSize:new s(new a),cameraNear:new s(.3),cameraFar:new s(1e3),aspect:new s(1),time:new s(0)},blending:0,toneMapped:!1,depthWrite:!1,depthTest:!1,dithering:i}),e&&this.setShaderParts(e),t&&this.setDefines(t),n&&this.setUniforms(n),this.copyCameraSettings(r)}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){this.uniforms.depthBuffer.value=e}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}setDepthBuffer(e,t=y){this.depthBuffer=e,this.depthPacking=t}setShaderData(e){this.setShaderParts(e.shaderParts),this.setDefines(e.defines),this.setUniforms(e.uniforms),this.setExtensions(e.extensions)}setShaderParts(e){return this.fragmentShader=oe.replace(B.FRAGMENT_HEAD,e.get(B.FRAGMENT_HEAD)||``).replace(B.FRAGMENT_MAIN_UV,e.get(B.FRAGMENT_MAIN_UV)||``).replace(B.FRAGMENT_MAIN_IMAGE,e.get(B.FRAGMENT_MAIN_IMAGE)||``),this.vertexShader=se.replace(B.VERTEX_HEAD,e.get(B.VERTEX_HEAD)||``).replace(B.VERTEX_MAIN_SUPPORT,e.get(B.VERTEX_MAIN_SUPPORT)||``),this.needsUpdate=!0,this}setDefines(e){for(let t of e.entries())this.defines[t[0]]=t[1];return this.needsUpdate=!0,this}setUniforms(e){for(let t of e.entries())this.uniforms[t[0]]=t[1];return this}setExtensions(e){this.extensions={};for(let t of e)this.extensions[t]=!0;return this}get encodeOutput(){return this.defines.ENCODE_OUTPUT!==void 0}set encodeOutput(e){this.encodeOutput!==e&&(e?this.defines.ENCODE_OUTPUT=`1`:delete this.defines.ENCODE_OUTPUT,this.needsUpdate=!0)}isOutputEncodingEnabled(e){return this.encodeOutput}setOutputEncodingEnabled(e){this.encodeOutput=e}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}setDeltaTime(e){this.uniforms.time.value+=e}adoptCameraSettings(e){this.copyCameraSettings(e)}copyCameraSettings(e){e&&(this.uniforms.cameraNear.value=e.near,this.uniforms.cameraFar.value=e.far,e instanceof S?this.defines.PERSPECTIVE_CAMERA=`1`:delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(e,t){let n=this.uniforms;n.resolution.value.set(e,t),n.texelSize.value.set(1/e,1/t),n.aspect.value=e/t}static get Section(){return B}};Number(`185`.replace(/\D+/g,``));var K=255/256;new Float32Array([K/256**3,K/256**2,K/256,K]),new Float32Array([K,K/256,K/256**2,1/256**3]);function q(e,t,n){for(let r of t){let t=`$1`+e+r.charAt(0).toUpperCase()+r.slice(1),i=RegExp(`([^\\.])(\\b`+r+`\\b)`,`g`);for(let e of n.entries())e[1]!==null&&n.set(e[0],e[1].replace(i,t))}}function le(e,t,n){let r=t.getFragmentShader(),i=t.getVertexShader(),a=r!==void 0&&/mainImage/.test(r),o=r!==void 0&&/mainUv/.test(r);if(n.attributes|=t.getAttributes(),r===void 0)throw Error(`Missing fragment shader (${t.name})`);if(o&&(n.attributes&z.CONVOLUTION)!==0)throw Error(`Effects that transform UVs are incompatible with convolution effects (${t.name})`);if(!a&&!o)throw Error(`Could not find mainImage or mainUv function (${t.name})`);{let s=/\w+\s+(\w+)\([\w\s,]*\)\s*{/g,c=n.shaderParts,l=c.get(B.FRAGMENT_HEAD)||``,u=c.get(B.FRAGMENT_MAIN_UV)||``,d=c.get(B.FRAGMENT_MAIN_IMAGE)||``,f=c.get(B.VERTEX_HEAD)||``,p=c.get(B.VERTEX_MAIN_SUPPORT)||``,m=new Set,h=new Set;if(o&&(u+=`	${e}MainUv(UV);
`,n.uvTransformation=!0),i!==null&&/mainSupport/.test(i)){let t=/mainSupport *\([\w\s]*?uv\s*?\)/.test(i);p+=`	${e}MainSupport(`,p+=t?`vUv);
`:`);
`;for(let e of i.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))for(let t of e[1].split(/\s*,\s*/))n.varyings.add(t),m.add(t),h.add(t);for(let e of i.matchAll(s))h.add(e[1])}for(let e of r.matchAll(s))h.add(e[1]);for(let e of t.defines.keys())h.add(e.replace(/\([\w\s,]*\)/g,``));for(let e of t.uniforms.keys())h.add(e);h.delete(`while`),h.delete(`for`),h.delete(`if`),t.uniforms.forEach((t,r)=>n.uniforms.set(e+r.charAt(0).toUpperCase()+r.slice(1),t)),t.defines.forEach((t,r)=>n.defines.set(e+r.charAt(0).toUpperCase()+r.slice(1),t));let g=new Map([[`fragment`,r],[`vertex`,i]]);q(e,h,n.defines),q(e,h,g),r=g.get(`fragment`),i=g.get(`vertex`);let _=t.blendMode;if(n.blendModes.set(_.blendFunction,_),a){t.inputColorSpace!==null&&t.inputColorSpace!==n.colorSpace&&(d+=t.inputColorSpace===`srgb`?`color0 = sRGBTransferOETF(color0);
	`:`color0 = sRGBToLinear(color0);
	`),t.outputColorSpace===``?t.inputColorSpace!==null&&(n.colorSpace=t.inputColorSpace):n.colorSpace=t.outputColorSpace,d+=`${e}MainImage(color0, UV, `,(n.attributes&z.DEPTH)!==0&&/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/.test(r)&&(d+=`depth, `,n.readDepth=!0),d+=`color1);
	`;let i=e+`BlendOpacity`;n.uniforms.set(i,_.opacity),d+=`color0 = blend${_.blendFunction}(color0, color1, ${i});

	`,l+=`uniform float ${i};

`}if(l+=r+`
`,i!==null&&(f+=i+`
`),c.set(B.FRAGMENT_HEAD,l),c.set(B.FRAGMENT_MAIN_UV,u),c.set(B.FRAGMENT_MAIN_IMAGE,d),c.set(B.VERTEX_HEAD,f),c.set(B.VERTEX_MAIN_SUPPORT,p),t.extensions!==null)for(let e of t.extensions)n.extensions.add(e)}}var J=class extends E{constructor(e,...t){super(`EffectPass`),this.fullscreenMaterial=new ce(null,null,null,e),this.listener=e=>this.handleEvent(e),this.effects=[],this.setEffects(t),this.skipRendering=!1,this.minTime=1,this.maxTime=1/0,this.timeScale=1}set mainScene(e){for(let t of this.effects)t.mainScene=e}set mainCamera(e){this.fullscreenMaterial.copyCameraSettings(e);for(let t of this.effects)t.mainCamera=e}get encodeOutput(){return this.fullscreenMaterial.encodeOutput}set encodeOutput(e){this.fullscreenMaterial.encodeOutput=e}get dithering(){return this.fullscreenMaterial.dithering}set dithering(e){let t=this.fullscreenMaterial;t.dithering=e,t.needsUpdate=!0}setEffects(e){for(let e of this.effects)e.removeEventListener(`change`,this.listener);this.effects=e.sort((e,t)=>t.attributes-e.attributes);for(let e of this.effects)e.addEventListener(`change`,this.listener)}updateMaterial(){let e=new re,t=0;for(let n of this.effects)if(n.blendMode.blendFunction===U.DST)e.attributes|=n.getAttributes()&z.DEPTH;else if((e.attributes&n.getAttributes()&z.CONVOLUTION)!==0)throw Error(`Convolution effects cannot be merged (${n.name})`);else le(`e`+ t++,n,e);let n=e.shaderParts.get(B.FRAGMENT_HEAD),r=e.shaderParts.get(B.FRAGMENT_MAIN_IMAGE),i=e.shaderParts.get(B.FRAGMENT_MAIN_UV),a=/\bblend\b/g;for(let t of e.blendModes.values())n+=t.getShaderCode().replace(a,`blend${t.blendFunction}`)+`
`;(e.attributes&z.DEPTH)===0?this.needsDepthTexture=!1:(e.readDepth&&(r=`float depth = readDepth(UV);

	`+r),this.needsDepthTexture=this.getDepthTexture()===null),e.colorSpace===`srgb`&&(r+=`color0 = sRGBToLinear(color0);
	`),e.uvTransformation?(i=`vec2 transformedUv = vUv;
`+i,e.defines.set(`UV`,`transformedUv`)):e.defines.set(`UV`,`vUv`),e.shaderParts.set(B.FRAGMENT_HEAD,n),e.shaderParts.set(B.FRAGMENT_MAIN_IMAGE,r),e.shaderParts.set(B.FRAGMENT_MAIN_UV,i);for(let[t,n]of e.shaderParts)n!==null&&e.shaderParts.set(t,n.trim().replace(/^#/,`
#`));this.skipRendering=t===0,this.needsSwap=!this.skipRendering,this.fullscreenMaterial.setShaderData(e)}recompile(){this.updateMaterial()}getDepthTexture(){return this.fullscreenMaterial.depthBuffer}setDepthTexture(e,t=y){this.fullscreenMaterial.depthBuffer=e,this.fullscreenMaterial.depthPacking=t;for(let n of this.effects)n.setDepthTexture(e,t)}render(e,t,n,r,i){for(let n of this.effects)n.update(e,t,r);if(!this.skipRendering||this.renderToScreen){let i=this.fullscreenMaterial;i.inputBuffer=t.texture,i.time+=r*this.timeScale,e.setRenderTarget(this.renderToScreen?null:n),e.render(this.scene,this.camera)}}setSize(e,t){this.fullscreenMaterial.setSize(e,t);for(let n of this.effects)n.setSize(e,t)}initialize(e,t,n){this.renderer=e;for(let r of this.effects)r.initialize(e,t,n);this.updateMaterial(),n!==void 0&&n!==1009&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH=`1`)}dispose(){super.dispose();for(let e of this.effects)e.removeEventListener(`change`,this.listener),e.dispose()}handleEvent(e){switch(e.type){case`change`:this.recompile();break}}};new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1]),new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,0,1]),new Float32Array([1,1,1]),new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([1,0,1]),new Float32Array([1,1,1]),new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1]),new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([0,1,1]),new Float32Array([1,1,1]),new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([0,1,1]),new Float32Array([1,1,1]),new Float32Array([0,-.25,.25,-.125,.125,-.375,.375]),new Float32Array([0,0]),new Float32Array([.25,-.25]),new Float32Array([-.25,.25]),new Float32Array([.125,-.125]),new Float32Array([-.125,.125]),new Uint8Array([0,0]),new Uint8Array([3,0]),new Uint8Array([0,3]),new Uint8Array([3,3]),new Uint8Array([1,0]),new Uint8Array([4,0]),new Uint8Array([1,3]),new Uint8Array([4,3]),new Uint8Array([0,1]),new Uint8Array([3,1]),new Uint8Array([0,4]),new Uint8Array([3,4]),new Uint8Array([1,1]),new Uint8Array([4,1]),new Uint8Array([1,4]),new Uint8Array([4,4]),new Uint8Array([0,0]),new Uint8Array([1,0]),new Uint8Array([0,2]),new Uint8Array([1,2]),new Uint8Array([2,0]),new Uint8Array([3,0]),new Uint8Array([2,2]),new Uint8Array([3,2]),new Uint8Array([0,1]),new Uint8Array([1,1]),new Uint8Array([0,3]),new Uint8Array([1,3]),new Uint8Array([2,1]),new Uint8Array([3,1]),new Uint8Array([2,3]),new Uint8Array([3,3]),X(0,0,0,0),new Float32Array([0,0,0,0]),X(0,0,0,1),new Float32Array([0,0,0,1]),X(0,0,1,0),new Float32Array([0,0,1,0]),X(0,0,1,1),new Float32Array([0,0,1,1]),X(0,1,0,0),new Float32Array([0,1,0,0]),X(0,1,0,1),new Float32Array([0,1,0,1]),X(0,1,1,0),new Float32Array([0,1,1,0]),X(0,1,1,1),new Float32Array([0,1,1,1]),X(1,0,0,0),new Float32Array([1,0,0,0]),X(1,0,0,1),new Float32Array([1,0,0,1]),X(1,0,1,0),new Float32Array([1,0,1,0]),X(1,0,1,1),new Float32Array([1,0,1,1]),X(1,1,0,0),new Float32Array([1,1,0,0]),X(1,1,0,1),new Float32Array([1,1,0,1]),X(1,1,1,0),new Float32Array([1,1,1,0]),X(1,1,1,1),new Float32Array([1,1,1,1]);function Y(e,t,n){return e+(t-e)*n}function X(e,t,n,r){return Y(Y(e,t,.75),Y(n,r,.75),.875)}var Z=e(t(),1),ue=n(),de=()=>{let e=document.createElement(`canvas`);e.width=64,e.height=64;let t=e.getContext(`2d`);if(!t)throw Error(`2D context not available`);t.fillStyle=`black`,t.fillRect(0,0,64,64);let n=new h(e);n.minFilter=d,n.magFilter=d,n.generateMipmaps=!1;let r=[],i=null,a=.1*64,o=()=>{t.fillStyle=`black`,t.fillRect(0,0,64,64)},s=e=>{let n=e.x*64,r=(1-e.y)*64,i=1;i=e.age<64*.3?(e=>Math.sin(e*Math.PI/2))(e.age/(64*.3)):(e=>-e*(e-2))(1-(e.age-64*.3)/(64*.7))||0,i*=e.force;let o=`${(e.vx+1)/2*255}, ${(e.vy+1)/2*255}, ${i*255}`;t.shadowOffsetX=320,t.shadowOffsetY=320,t.shadowBlur=a,t.shadowColor=`rgba(${o},${.22*i})`,t.beginPath(),t.fillStyle=`rgba(255,0,0,1)`,t.arc(n-320,r-320,a,0,Math.PI*2),t.fill()};return{texture:n,addTouch(e){let t=0,n=0,a=0;if(i){let r=e.x-i.x,o=e.y-i.y;if(r===0&&o===0)return;let s=r*r+o*o,c=Math.sqrt(s);n=r/(c||1),a=o/(c||1),t=Math.min(s*1e4,1)}i=e,r.push({...e,age:0,force:t,vx:n,vy:a})},update(){o();for(let e=r.length-1;e>=0;--e){let t=r[e],n=t.force*.015625*(1-t.age/64);t.x+=t.vx*n,t.y+=t.vy*n,t.age+=1,t.age>64&&r.splice(e,1)}r.forEach(s),n.needsUpdate=!0},set radiusScale(e){a=.1*64*e},get radiusScale(){return a/(.1*64)}}},fe=(e,t,n)=>new W(`LiquidEffect`,`
      uniform sampler2D uTexture;
      uniform float uStrength;
      uniform float uTime;
      uniform float uFreq;

      void mainUv(inout vec2 uv) {
        vec4 tex = texture2D(uTexture, uv);
        float vx = tex.r * 2.0 - 1.0;
        float vy = tex.g * 2.0 - 1.0;
        float intensity = tex.b;
        float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);
        uv += vec2(vx, vy) * (uStrength * intensity * wave);
      }
    `,{uniforms:new Map([[`uTexture`,new s(e)],[`uStrength`,new s(t)],[`uTime`,new s(0)],[`uFreq`,new s(n)]])}),pe=e=>new W(`NoiseEffect`,`
      uniform float uTime;
      uniform float uAmount;
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      void mainUv(inout vec2 uv) {}
      void mainImage(
        const in vec4 inputColor,
        const in vec2 uv,
        out vec4 outputColor
      ) {
        float n = hash(floor(uv * vec2(1920.0, 1080.0)) + floor(uTime * 60.0));
        outputColor = inputColor + vec4(vec3((n - 0.5) * uAmount), 0.0);
      }
    `,{uniforms:new Map([[`uTime`,new s(0)],[`uAmount`,new s(e)]])}),Q={square:0,circle:1,triangle:2,diamond:3},me=`
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`,he=`
  precision highp float;

  uniform vec3  uColor;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform float uPixelSize;
  uniform float uScale;
  uniform float uDensity;
  uniform float uPixelJitter;
  uniform int   uEnableRipples;
  uniform float uRippleSpeed;
  uniform float uRippleThickness;
  uniform float uRippleIntensity;
  uniform float uEdgeFade;
  uniform int   uShapeType;

  const int SHAPE_SQUARE = 0;
  const int SHAPE_CIRCLE = 1;
  const int SHAPE_TRIANGLE = 2;
  const int SHAPE_DIAMOND = 3;
  const int MAX_CLICKS = 10;

  uniform vec2 uClickPos[MAX_CLICKS];
  uniform float uClickTimes[MAX_CLICKS];
  out vec4 fragColor;

  float Bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2.0 + a.y * a.y * 0.75);
  }
  #define Bayer4(a) (Bayer2(0.5 * (a)) * 0.25 + Bayer2(a))
  #define Bayer8(a) (Bayer4(0.5 * (a)) * 0.25 + Bayer2(a))
  #define FBM_OCTAVES 5
  #define FBM_LACUNARITY 1.25
  #define FBM_GAIN 1.0

  float hash11(float n) {
    return fract(sin(n) * 43758.5453);
  }

  float vnoise(vec3 p) {
    vec3 ip = floor(p);
    vec3 fp = fract(p);
    float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
    float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
    float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
    float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
    float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
    float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
    float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
    float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
    vec3 w = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);
    float x00 = mix(n000, n100, w.x);
    float x10 = mix(n010, n110, w.x);
    float x01 = mix(n001, n101, w.x);
    float x11 = mix(n011, n111, w.x);
    return mix(mix(x00, x10, w.y), mix(x01, x11, w.y), w.z) * 2.0 - 1.0;
  }

  float fbm2(vec2 uv, float t) {
    vec3 p = vec3(uv * uScale, t);
    float amp = 1.0;
    float freq = 1.0;
    float sum = 1.0;
    for (int i = 0; i < FBM_OCTAVES; ++i) {
      sum += amp * vnoise(p * freq);
      freq *= FBM_LACUNARITY;
      amp *= FBM_GAIN;
    }
    return sum * 0.5 + 0.5;
  }

  float maskCircle(vec2 p, float coverage) {
    float radius = sqrt(coverage) * 0.25;
    float distance = length(p - 0.5) - radius;
    float antialias = 0.5 * fwidth(distance);
    return coverage * (1.0 - smoothstep(-antialias, antialias, distance * 2.0));
  }

  float maskTriangle(vec2 p, vec2 id, float coverage) {
    if (mod(id.x + id.y, 2.0) > 0.5) p.x = 1.0 - p.x;
    float distance = p.y - sqrt(coverage) * (1.0 - p.x);
    return coverage * clamp(0.5 - distance / fwidth(distance), 0.0, 1.0);
  }

  float maskDiamond(vec2 p, float coverage) {
    float radius = sqrt(coverage) * 0.564;
    return step(abs(p.x - 0.49) + abs(p.y - 0.49), radius);
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy - uResolution * 0.5;
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 pixelId = floor(fragCoord / uPixelSize);
    vec2 pixelUV = fract(fragCoord / uPixelSize);
    float cellPixelSize = 8.0 * uPixelSize;
    vec2 cellCoord = floor(fragCoord / cellPixelSize) * cellPixelSize;
    vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

    float base = fbm2(uv, uTime * 0.05) * 0.5 - 0.65;
    float feed = base + (uDensity - 0.5) * 0.3;

    if (uEnableRipples == 1) {
      for (int index = 0; index < MAX_CLICKS; ++index) {
        vec2 position = uClickPos[index];
        if (position.x < 0.0) continue;
        vec2 clickUv =
          ((position - uResolution * 0.5 - cellPixelSize * 0.5) / uResolution) *
          vec2(aspectRatio, 1.0);
        float elapsed = max(uTime - uClickTimes[index], 0.0);
        float radius = distance(uv, clickUv);
        float ring = exp(
          -pow((radius - uRippleSpeed * elapsed) / uRippleThickness, 2.0)
        );
        float attenuation = exp(-elapsed) * exp(-10.0 * radius);
        feed = max(feed, ring * attenuation * uRippleIntensity);
      }
    }

    float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
    float monochrome = step(0.5, feed + bayer);
    float randomValue = fract(
      sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) *
      43758.5453
    );
    float coverage =
      monochrome * (1.0 + (randomValue - 0.5) * uPixelJitter);

    float mask;
    if (uShapeType == SHAPE_CIRCLE) {
      mask = maskCircle(pixelUV, coverage);
    } else if (uShapeType == SHAPE_TRIANGLE) {
      mask = maskTriangle(pixelUV, pixelId, coverage);
    } else if (uShapeType == SHAPE_DIAMOND) {
      mask = maskDiamond(pixelUV, coverage);
    } else {
      mask = coverage;
    }

    if (uEdgeFade > 0.0) {
      vec2 normalized = gl_FragCoord.xy / uResolution;
      float edge = min(
        min(normalized.x, normalized.y),
        min(1.0 - normalized.x, 1.0 - normalized.y)
      );
      mask *= smoothstep(0.0, uEdgeFade, edge);
    }

    vec3 srgbColor = mix(
      uColor * 12.92,
      1.055 * pow(uColor, vec3(1.0 / 2.4)) - 0.055,
      step(0.0031308, uColor)
    );
    fragColor = vec4(srgbColor, mask);
  }
`,$=10;function ge({variant:e=`square`,pixelSize:t=3,color:n=`#B497CF`,className:o,style:s,antialias:c=!0,patternScale:l=2,patternDensity:d=1,liquid:f=!1,liquidStrength:p=.1,liquidRadius:m=1,pixelSizeJitter:h=0,enableRipples:_=!0,rippleIntensityScale:v=1,rippleThickness:y=.1,rippleSpeed:b=.3,liquidWobbleSpeed:x=4.5,autoPauseOffscreen:S=!0,speed:w=.5,transparent:T=!0,edgeFade:E=.5,noiseAmount:D=0}){let O=(0,Z.useRef)(null),k=(0,Z.useRef)(null),A=(0,Z.useRef)(w),j=(0,Z.useRef)({variant:e,pixelSize:t,color:n,patternScale:l,patternDensity:d,liquidStrength:p,liquidRadius:m,pixelSizeJitter:h,enableRipples:_,rippleIntensityScale:v,rippleThickness:y,rippleSpeed:b,liquidWobbleSpeed:x,transparent:T,noiseAmount:D});return(0,Z.useEffect)(()=>{j.current={variant:e,pixelSize:t,color:n,patternScale:l,patternDensity:d,liquidStrength:p,liquidRadius:m,pixelSizeJitter:h,enableRipples:_,rippleIntensityScale:v,rippleThickness:y,rippleSpeed:b,liquidWobbleSpeed:x,transparent:T,noiseAmount:D},A.current=w},[n,_,m,p,x,D,d,l,t,h,v,b,y,w,T,e]),(0,Z.useEffect)(()=>{let e=O.current;if(!e)return;let t=j.current,n;try{n=new ne({antialias:c,alpha:!0,powerPreference:`high-performance`})}catch{e.dataset.pixelBlastState=`unavailable`;return}e.dataset.pixelBlastState=`ready`,n.domElement.style.width=`100%`,n.domElement.style.height=`100%`,n.domElement.setAttribute(`aria-hidden`,`true`);let o=window.matchMedia(`(pointer: coarse)`).matches;n.setPixelRatio(Math.min(window.devicePixelRatio||1,o?1:1.5)),e.appendChild(n.domElement),t.transparent?n.setClearAlpha(0):n.setClearColor(0,1);let s={uResolution:{value:new a(1,1)},uTime:{value:0},uColor:{value:new te(t.color)},uClickPos:{value:Array.from({length:$},()=>new a(-1,-1))},uClickTimes:{value:new Float32Array($)},uShapeType:{value:Q[t.variant]},uPixelSize:{value:t.pixelSize*n.getPixelRatio()},uScale:{value:t.patternScale},uDensity:{value:t.patternDensity},uPixelJitter:{value:t.pixelSizeJitter},uEnableRipples:{value:+!!t.enableRipples},uRippleSpeed:{value:t.rippleSpeed},uRippleThickness:{value:t.rippleThickness},uRippleIntensity:{value:t.rippleIntensityScale},uEdgeFade:{value:E}},l=new g,d=new i(-1,1,1,-1,0,1),p=new r({vertexShader:me,fragmentShader:he,uniforms:s,transparent:!0,depthTest:!1,depthWrite:!1,glslVersion:ee}),m=new C(new u(2,2),p);l.add(m);let h,_,v,y;f&&(_=de(),_.radiusScale=t.liquidRadius,v=fe(_.texture,t.liquidStrength,t.liquidWobbleSpeed),h=new R(n),h.addPass(new G(l,d)),h.addPass(new J(d,v))),D>0&&(h||(h=new R(n),h.addPass(new G(l,d))),y=pe(D),h.addPass(new J(d,y)));let b=()=>{let t=e.clientWidth||1,r=e.clientHeight||1;n.setSize(t,r,!1),s.uResolution.value.set(n.domElement.width,n.domElement.height),s.uPixelSize.value=j.current.pixelSize*n.getPixelRatio(),h?.setSize(t,r),k.current&&(k.current.needsRender=!0)},x=new ResizeObserver(b);x.observe(e),b();let w=window.matchMedia(`(prefers-reduced-motion: reduce)`),T={renderer:n,material:p,quad:m,uniforms:s,resizeObserver:x,composer:h,touch:_,liquidEffect:v,noiseEffect:y,clickIndex:0,elapsed:window.crypto.getRandomValues(new Uint32Array(1))[0]/4294967295*1e3,lastFrame:performance.now(),reducedMotion:w.matches,needsRender:!0,raf:0};k.current=T;let M=e=>{let t=n.domElement.getBoundingClientRect(),r=n.domElement.width/t.width,i=n.domElement.height/t.height;return{x:(e.clientX-t.left)*r,y:(t.height-(e.clientY-t.top))*i,width:n.domElement.width,height:n.domElement.height}},N=e=>{if(T.reducedMotion)return;let t=M(e),n=T.clickIndex;s.uClickPos.value[n].set(t.x,t.y),s.uClickTimes.value[n]=s.uTime.value,T.clickIndex=(n+1)%$},P=e=>{if(!_||T.reducedMotion)return;let t=M(e);_.addTouch({x:t.x/t.width,y:t.y/t.height})},F=()=>{T.reducedMotion=w.matches,T.needsRender=!0,T.lastFrame=performance.now()};window.addEventListener(`pointerdown`,N,{passive:!0}),window.addEventListener(`pointermove`,P,{passive:!0}),w.addEventListener(`change`,F);let I=()=>{T.composer?T.composer.render():n.render(l,d)},L=e=>{let t=S&&document.visibilityState===`hidden`;if(!t&&!T.reducedMotion){let t=Math.min(Math.max((e-T.lastFrame)/1e3,0),.05);T.elapsed+=t*A.current,s.uTime.value=T.elapsed,_?.update();let n=v?.uniforms.get(`uTime`),r=y?.uniforms.get(`uTime`);n&&(n.value=T.elapsed),r&&(r.value=T.elapsed),I()}else !t&&T.needsRender&&(I(),T.needsRender=!1);T.lastFrame=e,T.raf=requestAnimationFrame(L)};return T.raf=requestAnimationFrame(L),()=>{window.removeEventListener(`pointerdown`,N),window.removeEventListener(`pointermove`,P),w.removeEventListener(`change`,F),x.disconnect(),cancelAnimationFrame(T.raf),m.geometry.dispose(),p.dispose(),_?.texture.dispose(),h?.dispose(),n.dispose(),n.forceContextLoss(),n.domElement.parentElement===e&&e.removeChild(n.domElement),k.current===T&&(k.current=null)}},[c,S,E,f,D]),(0,Z.useEffect)(()=>{let r=k.current;if(!r)return;r.uniforms.uShapeType.value=Q[e],r.uniforms.uPixelSize.value=t*r.renderer.getPixelRatio(),r.uniforms.uColor.value.set(n),r.uniforms.uScale.value=l,r.uniforms.uDensity.value=d,r.uniforms.uPixelJitter.value=h,r.uniforms.uEnableRipples.value=+!!_,r.uniforms.uRippleIntensity.value=v,r.uniforms.uRippleThickness.value=y,r.uniforms.uRippleSpeed.value=b,r.uniforms.uEdgeFade.value=E,r.touch&&(r.touch.radiusScale=m);let i=r.liquidEffect?.uniforms.get(`uStrength`),a=r.liquidEffect?.uniforms.get(`uFreq`),o=r.noiseEffect?.uniforms.get(`uAmount`);i&&(i.value=p),a&&(a.value=x),o&&(o.value=D),T?r.renderer.setClearAlpha(0):r.renderer.setClearColor(0,1),r.needsRender=!0},[n,E,_,m,p,x,D,d,l,t,h,v,b,y,T,e]),(0,ue.jsx)(`div`,{ref:O,className:`pixel-blast-container${o?` ${o}`:``}`,style:s,"aria-hidden":`true`})}export{ge as default};