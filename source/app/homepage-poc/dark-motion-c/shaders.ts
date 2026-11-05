// All lighting is computed in linear space. Three's output chunk converts once.
export const screenVertex = /* glsl */ `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}
`;

export const ribbonVertex=/* glsl */ `
varying vec2 vUv;varying float vBend;attribute float bend;
void main(){vUv=uv;vBend=bend;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;

export const ribbonFragment=/* glsl */ `
precision highp float;
varying vec2 vUv;varying float vBend;
uniform float uFlowTime,uTime,uReveal,uSpeed,uSeed,uIntensity,uMerge;
float hashR(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noiseR(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hashR(i),hashR(i+vec2(1,0)),f.x),mix(hashR(i+vec2(0,1)),hashR(i+1.),f.x),f.y);}
void main(){
  float s=vUv.x,v=vUv.y*2.-1.;
  // q is monotonic with arc length. Constant q-speed yields increasing ds/dt
  // toward the horizon. q - speed*time transports features INWARD (+s).
  float q=log(1.+3.*s)/log(4.);
  float advect=q-uFlowTime*uSpeed;
  float noise=noiseR(vec2(advect*17.+uSeed,v*7.+uSeed));
  float texture=noiseR(vec2(advect*39.+uSeed,v*19.));
  float warp=.18*sin(s*13.+v*3.+uSeed)+.06*sin(s*31.+uSeed)*vBend;
  float lane=v+warp;
  float striation=pow(.5+.5*sin(lane*40.+noise*8.+s*9.),6.);
  float fine=pow(.5+.5*sin(lane*103.+texture*7.),14.);
  float pulses=pow(.5+.5*cos(advect*37.7+v*3.+uSeed),3.);
  float feather=pow(max(0.,1.-v*v),2.5);
  float core=exp(-abs(lane)*4.5);
  float reveal=1.-smoothstep(uReveal-.055,uReveal+.025,s);
  float taper=1.-smoothstep(.94,1.,s);
  float merge=mix(1.,.53,smoothstep(uMerge-.05,uMerge+.05,s));
  float energy=(.15*core+.55*striation+.18*fine)*(.55+pulses*.65)*(.6+texture*.7);
  vec3 color=mix(vec3(.20,.38,.62),vec3(1.,.78,.48),smoothstep(.3,.9,noise+.24*core));
  color*=energy*1.8*uIntensity;
  float alpha=feather*(.52+.4*noise)*reveal*taper*merge;
  gl_FragColor=vec4(color,alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const noiseGLSL = /* glsl */ `
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){return .57*noise(p)+.28*noise(p*2.03+11.)+.15*noise(p*4.11+27.);}
`;

export const diskFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uSize;
uniform vec2 uCenter;
uniform float uRadius,uHorizon,uPhoton,uFormation,uSpin,uTime,uDensity,uIntensity,uDistortion;
${noiseGLSL}
const float TAU=6.28318530718;
void main(){
  vec2 p=(vec2(vUv.x,1.-vUv.y)*uSize-uCenter)/uRadius;
  float r=length(p),a=atan(p.y,p.x);
  float h=max(.018,uHorizon);
  float edge=r-h;
  // A strictly circular occulting horizon; this boundary never uses noise.
  float hole=1.-smoothstep(-.006,.002,edge);
  float ring=exp(-abs(edge-.014)*190.)*uPhoton;
  float light=0.;
  float blue=0.;
  // Differential rotation and independent angular fragments, rather than a
  // uniformly scaled completed ring. Cartesian angular sampling has no seam.
  for(int i=0;i<7;i++){
    float k=float(i);
    float orbit=a-uSpin*(.22+k*.027)+uDistortion*.055/max(r-h+.12,.1);
    vec2 angular=vec2(cos(orbit),sin(orbit));
    float grain=fbm(angular*(3.+k*.55)+vec2(r*8.,k*17.));
    float bend=sin(orbit*3.+k*2.)*.026+sin(orbit*7.-k)*.013;
    float lane=h+.028+k*.033+bend*(.3+k*.18)*uDistortion;
    float warp=(grain-.5)*(.018+k*.007);
    float d=r-lane-warp;
    float thread=exp(-abs(d)*(120.-k*10.));
    float veil=exp(-abs(d)*30.)*.22;
    float threshold=.08+k*.063+(.5+.5*sin(orbit*2.+k*2.7))*.32;
    float forming=smoothstep(threshold,threshold+.18,uFormation);
    float torn=.20+.80*pow(grain,1.2);
    float filament=thread*(.45+.55*pow(.5+.5*sin(r*360.+grain*12.+orbit*5.),3.));
    float emission=(filament+veil)*torn*forming*(1.-k*.085);
    light+=emission;
    blue+=emission*k/6.;
  }
  // Sheared outer wisps share differential rotation; the center stays quiet.
  vec2 swirl=vec2(cos(a-uSpin*.17-r*4.),sin(a-uSpin*.17-r*4.));
  float cloud=fbm(swirl*6.+r*17.);
  float outer=exp(-pow((r-h-.17)/.24,2.))*smoothstep(.4,.82,cloud)*.22;
  light+=outer*uFormation;
  float shadow=.65+.35*sin(a+.6);
  vec3 ivory=vec3(1.,.72,.37),ice=vec3(.25,.48,.78);
  vec3 color=mix(ivory,ice,clamp(blue/max(light,.001)*.85,0.,1.))*light*shadow*uDensity*2.4;
  color+=vec3(1.,.89,.65)*ring*.65;
  color*=uIntensity*(.98+.02*sin(uTime*.7));
  color*=smoothstep(-.002,.009,edge);
  float alpha=max(hole,clamp(light*1.8+ring,0.,1.));
  alpha*=1.-smoothstep(h+.52,h+.8,r);
  gl_FragColor=vec4(color,alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
