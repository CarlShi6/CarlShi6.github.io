import {noiseGLSL} from '../dark-motion-c/shaders';
export {screenVertex} from '../dark-motion-c/shaders';
// The annular bed and incoming ribbons share a generated painterly texture.
// Incoming meshes themselves continue around the horizon without a material swap.
// The old rotating halo image is deliberately not sampled here. The same
// fine-grain filament material continues along every incoming mesh and around
// the horizon. This dim annular bed fills gaps; it never supplies separate lobes.
const accretionGLSL=/* glsl */`
vec4 accretion(vec2 p){
 float r=length(p),a=atan(p.y,p.x);
 float flow=a/6.2831853*2.-uTime*.035;
 float y=clamp(.46+(r-1.)*1.12,0.,1.);
 vec4 material=texture2D(uFlow,vec2(fract(flow),y));
 vec4 alternate=texture2D(uFlow,vec2(fract(flow+.5),y));
 material=mix(alternate,material,pow(sin(flow*3.14159265),2.));
 float grain=noise(vec2(a*17.-uTime*.12,r*110.));
 float sector=.48+.78*pow(.5+.5*cos(a*2.+1.3),1.5);
 float core=exp(-abs(r-1.016)*85.)*(.55+.45*grain);
 vec3 col=mix(material.rgb*.68,vec3(2.1,1.23,.61),core*.7);
 float alpha=(material.a*.38*(1.-smoothstep(1.12,1.4,r))+core*.75)*smoothstep(.987,1.008,r);
 return vec4(col*sector,alpha);
}
`;
export const fieldFragment=/* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D uFlow;
uniform vec2 uSize,uCenter;
uniform float uRadius,uBirth,uFormation,uTime;
${noiseGLSL}
${accretionGLSL}
void main(){
 vec2 pixel=vec2(vUv.x,1.-vUv.y)*uSize;
 vec2 p=(pixel-uCenter)/max(1.,uRadius*max(.025,uBirth));
 float r=length(p),a=atan(p.y,p.x);
 vec4 material=accretion(p);
 float assembly=smoothstep(.0,.28,uFormation-(.5+.5*sin(a*2.-uTime*.45))*.35-max(0.,r-1.)*.55);
 float hole=1.-smoothstep(.985,1.003,r);
 // Faint stable grain in the near-black core; no moving texture over the text.
 float grain=hash(floor(pixel))*.00018;
 vec3 color=mix(material.rgb,vec3(.0014,.0021,.0034)+grain,hole);
 gl_FragColor=vec4(color,max(material.a*assembly,hole));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;
export const atmosphereFragment=/* glsl */`
precision highp float;
varying vec2 vUv;uniform vec2 uSize,uCenter;uniform float uRadius;
${noiseGLSL}
void main(){
 vec2 pixel=vec2(vUv.x,1.-vUv.y)*uSize;
 vec2 q=(pixel-uCenter)/max(uSize.y,1.);
 // Anisotropic pigment and fine mineral grain, not a blurred image or a
 // glowing gradient. This field is time-independent and therefore never flickers.
 vec2 bent=vec2(q.x*1.1+q.y*.44,q.y-q.x*.27);
 float broad=fbm(bent*3.3+7.);
 float veils=fbm(bent*vec2(7.,28.)+broad*2.4);
 float streak=smoothstep(.34,.78,veils)*(.35+.65*fbm(bent*vec2(25.,14.)));
 float fleck=noise(bent*vec2(90.,250.));
 float grain=hash(floor(pixel));
 float vignette=1.-smoothstep(.35,1.3,length(q));
 vec3 col=vec3(.0023,.004,.0065);
 col+=vec3(.003,.0055,.008)*(broad*.22+streak*.48)*vignette;
 col+=vec3(.0022,.003,.004)*fleck*streak;
 col+=(grain-.5)*.0018;
 vec2 cell=floor(pixel/9.),inCell=fract(pixel/9.)-.5;
 float star=step(.9975,hash(cell))*max(0.,1.-length(inCell)*6.);
 col+=vec3(.11,.14,.17)*star;
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;
// Shared CSS-pixel deformation. s=0 is fixed to the moving planet/rock group;
// Each path stops deforming at its merger coordinate, keeping the rim fixed.
const couplingGLSL=/* glsl */`
uniform vec2 uAnchor,uObject,uCenter;
uniform float uObjectScale,uRadius,uBirth,uSourceProgress,uCouplingEnd;
vec2 coupled(vec2 p,float s){
 float weight=1.-smoothstep(0.,uCouplingEnd,mix(uSourceProgress,1.,s));
 return p+((p-uAnchor)*(uObjectScale-1.)+uObject-uAnchor)*weight;
}
`;
const horizonGLSL=/* glsl */`
uniform vec2 uCenter;
uniform float uRadius,uBirth;
varying vec2 vWorld;
float horizonMask(){return smoothstep(.995,1.035,length(vWorld-uCenter)/max(1.,uRadius*uBirth));}
`;
export const ribbonVertex=/* glsl */`
varying vec2 vUv;varying vec2 vWorld;
uniform float uTime,uSeed;
${couplingGLSL}
void main(){
 vUv=uv;
 vec3 p=position;
 float arc=mix(uSourceProgress,1.,uv.x);
 float drift=sin(arc*20.-uTime*.2+uSeed)*pow(sin(arc*3.14159),2.)*.85;
 p.xy=coupled(p.xy,uv.x);p.y+=drift;
 vWorld=p.xy;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}
`;
export const ribbonFragment=/* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D uFlow;
uniform float uTime,uReveal,uSeed,uStrength,uFree,uJoin,uReverse;
${horizonGLSL}
${noiseGLSL}
${accretionGLSL}
void main(){
 float s=vUv.x,v=vUv.y;
 // Positive arc coordinate runs from the parent surface into the horizon.
 float flow=s*1.05+(uReverse*2.-1.)*uTime*.035+uSeed*.19;
 float warp=sin(s*11.+uSeed)*.012+sin(s*23.-uTime*.18)*.006;
 float shear=(noise(vec2(s*27.-uTime*.09,v*7.+uSeed))-.5)*.047;
 float y=clamp(v+warp+shear,0.,1.);
 // Follow the authored strip's centreline before bending the mesh. Without
 // this, its painted S wave becomes an unrelated second orbit around the hole.
 float x1=fract(flow),x2=fract(flow+.5);
 float centre1=.49+.09*cos(x1*6.2831853-.25);
 float centre2=.49+.09*cos(x2*6.2831853-.25);
 vec4 first=texture2D(uFlow,vec2(x1,clamp(y+centre1-.5,0.,1.)));
 vec4 second=texture2D(uFlow,vec2(x2,clamp(y+centre2-.5,0.,1.)));
 // Each texture wrap is hidden by the other sample; no hard repeating seam.
 float blend=pow(sin(flow*3.14159265),2.);
 vec4 ink=mix(second,first,blend);
 float reveal=1.-smoothstep(uReveal-.065,uReveal+.015,s);
 float edge=smoothstep(0.,.13,v)*(1.-smoothstep(.87,1.,v));
 float tail=(1.-smoothstep(mix(.96,.58,uFree),1.,s))*mix(1.,smoothstep(0.,.14,s),uFree);
 float pigment=noise(vec2(s*155.-uTime*.31,v*113.+uSeed));
 float broken=.42+.58*smoothstep(.12,.74,pigment);
 vec3 color=ink.rgb*vec3(2.15,1.73,1.43)*broken;
 // A restrained blue-grey veil occupies the same flowing material, outside
 // the bright mineral fibres. It is not a screen-space blur or a second ring.
 float smoke=fbm(vec2(s*31.-uTime*.12,v*19.+shear*8.+uSeed));
 float veil=ink.a*pow(sin(v*3.14159265),2.)*smoothstep(.36,.72,smoke)*.10;
 color+=vec3(.055,.11,.18)*veil;
 float a=atan(vWorld.y-uCenter.y,vWorld.x-uCenter.x);
 float sector=.48+.78*pow(.5+.5*cos(a*2.+1.3),1.5);
 color*=mix(1.,sector,smoothstep(uJoin*.65,uJoin,s)*(1.-uFree));
 float grainGate=.76+.24*noise(vec2(s*39.-uTime*.35,v*31.+uSeed));
 float detail=.32+.68*smoothstep(.09,.58,max(ink.r,max(ink.g,ink.b)));
 float alpha=detail*pow(ink.a,1.12)*edge*tail*reveal*uStrength*grainGate*horizonMask()*mix(.82,1.,smoothstep(1.04,1.36,length(vWorld-uCenter)/uRadius));
 // Nothing switches materials at the inlet: the SAME UV strip continues
 // around 264 degrees of the rim. Only overlap density is reduced smoothly.
 alpha*=mix(1.,.64,smoothstep(min(uJoin,.999),1.,s)*(1.-uFree));
 gl_FragColor=vec4(color,alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;
export const spriteVertex=/* glsl */`
varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
export const spriteFragment=/* glsl */`
varying vec2 vUv;
uniform sampler2D uMap;
uniform vec2 uOffset,uRepeat;
uniform float uOpacity,uMoon,uFlip,uLight;
void main(){
 vec2 uv=vUv;
 if(uFlip>0.)uv.x=1.-uv.x;
 if(uMoon>0.){
  float d=length(uv-.5);if(d>.495)discard;
  uv=.5+(uv-.5)*vec2(.436,.65);
 }
 vec4 c=texture2D(uMap,uOffset+uv*uRepeat);
 c.a*=uOpacity;
 if(uMoon>0.)c.a*=1.-smoothstep(.475,.495,length(vUv-.5));
 gl_FragColor=vec4(c.rgb*uLight,c.a);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;

export const filamentFragment=/* glsl */`
precision highp float;
varying vec2 vUv;uniform float uTime,uReveal,uSeed,uFree;
${horizonGLSL}
${noiseGLSL}
void main(){
 float s=vUv.x,k=floor(vUv.y*42.);
 float edge=pow(sin(fract(vUv.y*42.)*3.14159),.6);
 float grain=noise(vec2(s*90.-uTime*.6,k*13.+uSeed));
 float gate=smoothstep(.17,.55,noise(vec2(s*13.-uTime*.09,k*7.)));
 float reveal=1.-smoothstep(uReveal-.04,uReveal+.01,s);
 vec3 col=mix(vec3(.16,.26,.34),vec3(.9,.59,.29),step(.55,fract(k*.618+uSeed)));
 float alpha=edge*grain*grain*gate*.30*reveal*(1.-smoothstep(mix(.96,.5,uFree),1.,s))*mix(1.,smoothstep(0.,.12,s)*.6,uFree)*horizonMask();
 gl_FragColor=vec4(col,alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;
export const dustVertex=/* glsl */`
attribute vec2 aDirection;attribute vec3 aParams;
uniform float uTime,uReveal,uRatio,uFree,uReverse;varying float vAlpha,vGold;varying vec2 vWorld;
${couplingGLSL}
void main(){
 float age=fract(aParams.y+uTime*.026);
 vec3 p=position;p.xy=coupled(p.xy,aParams.x);
 p.xy+=aDirection*(age-.5)*32.*(1.-2.*uReverse)*sin(aParams.x*3.14159);
 vWorld=p.xy;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
 gl_PointSize=(1.05+pow(aParams.z,4.)*2.1)*uRatio;
 vAlpha=sin(age*3.14159)*(.36+aParams.z*.64)*(1.-smoothstep(uReveal-.04,uReveal+.01,aParams.x));vAlpha*=mix(1.,smoothstep(0.,.12,aParams.x)*(1.-smoothstep(.55,1.,aParams.x)),uFree);vGold=aParams.z;
}
`;
export const dustFragment=/* glsl */`
varying float vAlpha,vGold;
${horizonGLSL}
void main(){
 vec2 p=gl_PointCoord-.5;float edge=1.-smoothstep(.18,.5,max(abs(p.x),abs(p.y)));
 vec3 color=mix(vec3(.20,.31,.43),vec3(.95,.56,.24),step(.35,vGold));
 color=mix(color,vec3(1.,.91,.72),smoothstep(.94,1.,vGold));
 gl_FragColor=vec4(color,edge*vAlpha*horizonMask());
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;

export const wakeDebrisVertex=dustVertex.replace('(1.05+pow(aParams.z,4.)*2.1)', '(3.+pow(aParams.z,2.)*10.)');
export const wakeDebrisFragment=/* glsl */`
precision highp float;
varying float vAlpha,vGold;uniform sampler2D uMap;uniform float uTime;
${horizonGLSL}
void main(){
 float tile=floor(vGold*5.999),column=mod(tile,3.);
 float left=column<.5?0.:column<1.5?550.:1060.;
 float width=column<.5?550.:column<1.5?510.:476.;
 float angle=vGold*6.283+uTime*.022;
 vec2 p=gl_PointCoord-.5;
 p=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p+.5;
 if(min(p.x,p.y)<0.||max(p.x,p.y)>1.)discard;
 vec2 uv=vec2((left+p.x*width)/1536.,(tile<3.?.5:0.)+(1.-p.y)*.5);
 vec4 rock=texture2D(uMap,uv);
 gl_FragColor=vec4(rock.rgb*.8,rock.a*vAlpha*horizonMask());
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;
