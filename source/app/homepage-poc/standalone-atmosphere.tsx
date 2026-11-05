"use client";
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Vector2 } from 'three';
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const atmosphereShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform vec2 uResolution;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + 1.0), f.x), f.y);
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 q = vUv - 0.5;
    q.x *= aspect;
    float cloud = noise(q * 2.4 + noise(q * 5.3));
    float veil = smoothstep(0.54, 0.92, cloud) * 0.075;
    float star = step(0.9986, hash21(floor((q + 2.0) * 98.0)));
    star *= 1.0 - smoothstep(0.02, 0.14, length(fract((q + 2.0) * 98.0) - 0.5));
    vec3 ground = vec3(0.001, 0.0045, 0.010);
    vec3 navy = vec3(0.025, 0.085, 0.145);
    vec3 color = ground + navy * veil + vec3(0.72, 0.82, 0.92) * star * 0.26;
    float vignette = 1.0 - smoothstep(0.58, 1.18, length(q * vec2(0.62, 1.0)));
    color *= 0.74 + 0.26 * vignette;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function AtmosphereField() {
  const { size, invalidate } = useThree();
  const uniforms = useMemo(() => ({ uResolution: { value: new Vector2(1, 1) } }), []);
  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
    invalidate();
  }, [invalidate, size.height, size.width, uniforms]);
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={atmosphereShader} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export default function StandaloneAtmosphere(){
 return <Canvas frameloop="demand" dpr={[1,1.2]} gl={{antialias:false,alpha:false,powerPreference:"high-performance"}}><AtmosphereField/></Canvas>;
}
