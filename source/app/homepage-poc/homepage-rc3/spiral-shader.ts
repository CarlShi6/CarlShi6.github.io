export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Concept and field structure adapted from Codrops Interlude's MIT-licensed
// spiral transition (Copyright (c) 2026 Codrops). See docs/third-party/interlude-spiral-license.md.
export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution; uniform vec2 uOrigin;
  uniform float uProgress;
  uniform float uReveal;
  uniform float uTime;
  uniform float uAlpha;
  uniform vec3 uCover;
  uniform vec3 uRing;
  uniform vec3 uHot;

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

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.54;
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(1.7, -1.2);
      amplitude *= 0.48;
    }
    return value;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 origin = uOrigin;
    vec2 p = vUv - origin;
    p.x *= aspect;
    float reach = length(vec2(max(origin.x,1.0-origin.x)*aspect,max(origin.y,1.0-origin.y)));
    float distance = length(p) / max(reach, 0.001);
    float angle = atan(p.y, p.x);
    float turned = angle + uTime * 0.31 + 1.28 / (distance + 0.21);
    vec2 smokeUv = vec2(cos(turned), sin(turned)) * distance * 3.25 + vec2(uTime * 0.035);
    float smoke = fbm(smokeUv);
    float field = distance + (smoke - 0.48) * 0.07 + sin(turned * 3.0) * 0.13;

    float coverLevel = mix(-0.28, 1.32, uProgress);
    float revealLevel = mix(1.32, -0.28, uProgress);
    float level = mix(coverLevel, revealLevel, uReveal);
    float inside = 1.0 - smoothstep(level - 0.012, level + 0.012, field);
    float covered = mix(inside, 1.0 - inside, uReveal);
    float outside = max(mix(field - level, level - field, uReveal), 0.0);

    float envelope = smoothstep(0.0, 0.1, uProgress) * smoothstep(0.0, 0.12, 1.0 - uProgress);
    float side = cos(angle - 0.55 + uTime * 0.22) * 0.18 + 0.82;
    float streaks = sin(turned * 6.0 - outside * 34.0) * 0.16 + 0.84;
    float ring = exp(-outside / 0.042) + exp(-outside / 0.18) * 0.12;
    float light = clamp(ring * side * streaks * envelope * 0.72, 0.0, 1.0);
    float hotLine = exp(-outside / 0.010);
    vec3 edge = mix(uRing, uHot, hotLine);
    vec3 color = mix(uCover, edge, light * (1.0 - covered));
    float alpha = clamp((covered + light * (1.0 - covered)) * uAlpha, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
  }
`;
