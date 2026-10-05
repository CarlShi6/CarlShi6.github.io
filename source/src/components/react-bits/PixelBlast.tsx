"use client";

import {
  Effect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";
import {
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import * as THREE from "three";
import "./PixelBlast.css";

type PixelVariant = "square" | "circle" | "triangle" | "diamond";

type PixelBlastProps = {
  variant?: PixelVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
};

type TouchPoint = {
  x: number;
  y: number;
  age: number;
  force: number;
  vx: number;
  vy: number;
};

type TouchTexture = {
  texture: THREE.Texture;
  addTouch: (point: { x: number; y: number }) => void;
  update: () => void;
  radiusScale: number;
};

type PixelUniforms = {
  uResolution: { value: THREE.Vector2 };
  uTime: { value: number };
  uColor: { value: THREE.Color };
  uClickPos: { value: THREE.Vector2[] };
  uClickTimes: { value: Float32Array };
  uShapeType: { value: number };
  uPixelSize: { value: number };
  uScale: { value: number };
  uDensity: { value: number };
  uPixelJitter: { value: number };
  uEnableRipples: { value: number };
  uRippleSpeed: { value: number };
  uRippleThickness: { value: number };
  uRippleIntensity: { value: number };
  uEdgeFade: { value: number };
};

type PixelRuntime = {
  renderer: THREE.WebGLRenderer;
  material: THREE.ShaderMaterial;
  quad: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  uniforms: PixelUniforms;
  resizeObserver: ResizeObserver;
  composer?: EffectComposer;
  touch?: TouchTexture;
  liquidEffect?: Effect;
  noiseEffect?: Effect;
  clickIndex: number;
  elapsed: number;
  lastFrame: number;
  reducedMotion: boolean;
  needsRender: boolean;
  raf: number;
};

const createTouchTexture = (): TouchTexture => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D context not available");

  context.fillStyle = "black";
  context.fillRect(0, 0, size, size);

  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const trail: TouchPoint[] = [];
  let last: { x: number; y: number } | null = null;
  const maxAge = 64;
  const trailSpeed = 1 / maxAge;
  let radius = 0.1 * size;

  const clear = () => {
    context.fillStyle = "black";
    context.fillRect(0, 0, size, size);
  };

  const drawPoint = (point: TouchPoint) => {
    const x = point.x * size;
    const y = (1 - point.y) * size;
    let intensity = 1;
    const easeOutSine = (value: number) =>
      Math.sin((value * Math.PI) / 2);
    const easeOutQuad = (value: number) => -value * (value - 2);

    if (point.age < maxAge * 0.3) {
      intensity = easeOutSine(point.age / (maxAge * 0.3));
    } else {
      intensity =
        easeOutQuad(
          1 - (point.age - maxAge * 0.3) / (maxAge * 0.7),
        ) || 0;
    }
    intensity *= point.force;

    const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    context.shadowOffsetX = offset;
    context.shadowOffsetY = offset;
    context.shadowBlur = radius;
    context.shadowColor = `rgba(${color},${0.22 * intensity})`;
    context.beginPath();
    context.fillStyle = "rgba(255,0,0,1)";
    context.arc(x - offset, y - offset, radius, 0, Math.PI * 2);
    context.fill();
  };

  return {
    texture,
    addTouch(point) {
      let force = 0;
      let vx = 0;
      let vy = 0;
      if (last) {
        const dx = point.x - last.x;
        const dy = point.y - last.y;
        if (dx === 0 && dy === 0) return;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);
        vx = dx / (distance || 1);
        vy = dy / (distance || 1);
        force = Math.min(distanceSquared * 10000, 1);
      }
      last = point;
      trail.push({ ...point, age: 0, force, vx, vy });
    },
    update() {
      clear();
      for (let index = trail.length - 1; index >= 0; index -= 1) {
        const point = trail[index];
        const force =
          point.force *
          trailSpeed *
          (1 - point.age / maxAge);
        point.x += point.vx * force;
        point.y += point.vy * force;
        point.age += 1;
        if (point.age > maxAge) trail.splice(index, 1);
      }
      trail.forEach(drawPoint);
      texture.needsUpdate = true;
    },
    set radiusScale(value: number) {
      radius = 0.1 * size * value;
    },
    get radiusScale() {
      return radius / (0.1 * size);
    },
  };
};

const createLiquidEffect = (
  texture: THREE.Texture,
  strength: number,
  frequency: number,
) =>
  new Effect(
    "LiquidEffect",
    `
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
    `,
    {
      uniforms: new Map<string, THREE.Uniform<unknown>>([
        ["uTexture", new THREE.Uniform(texture)],
        ["uStrength", new THREE.Uniform(strength)],
        ["uTime", new THREE.Uniform(0)],
        ["uFreq", new THREE.Uniform(frequency)],
      ]),
    },
  );

const createNoiseEffect = (amount: number) =>
  new Effect(
    "NoiseEffect",
    `
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
    `,
    {
      uniforms: new Map([
        ["uTime", new THREE.Uniform(0)],
        ["uAmount", new THREE.Uniform(amount)],
      ]),
    },
  );

const SHAPE_MAP: Record<PixelVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
};

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
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
`;

const MAX_CLICKS = 10;

export default function PixelBlast({
  variant = "square",
  pixelSize = 3,
  color = "#B497CF",
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  liquid = false,
  liquidStrength = 0.1,
  liquidRadius = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5,
  autoPauseOffscreen = true,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  noiseAmount = 0,
}: PixelBlastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<PixelRuntime | null>(null);
  const speedRef = useRef(speed);
  const configRef = useRef({
    variant,
    pixelSize,
    color,
    patternScale,
    patternDensity,
    liquidStrength,
    liquidRadius,
    pixelSizeJitter,
    enableRipples,
    rippleIntensityScale,
    rippleThickness,
    rippleSpeed,
    liquidWobbleSpeed,
    transparent,
    noiseAmount,
  });

  useEffect(() => {
    configRef.current = {
      variant,
      pixelSize,
      color,
      patternScale,
      patternDensity,
      liquidStrength,
      liquidRadius,
      pixelSizeJitter,
      enableRipples,
      rippleIntensityScale,
      rippleThickness,
      rippleSpeed,
      liquidWobbleSpeed,
      transparent,
      noiseAmount,
    };
    speedRef.current = speed;
  }, [
    color,
    enableRipples,
    liquidRadius,
    liquidStrength,
    liquidWobbleSpeed,
    noiseAmount,
    patternDensity,
    patternScale,
    pixelSize,
    pixelSizeJitter,
    rippleIntensityScale,
    rippleSpeed,
    rippleThickness,
    speed,
    transparent,
    variant,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const config = configRef.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      container.dataset.pixelBlastState = "unavailable";
      return;
    }

    container.dataset.pixelBlastState = "ready";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.setAttribute("aria-hidden", "true");
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, hasCoarsePointer ? 1 : 1.5),
    );
    container.appendChild(renderer.domElement);
    if (config.transparent) renderer.setClearAlpha(0);
    else renderer.setClearColor(0x000000, 1);

    const uniforms: PixelUniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(config.color) },
      uClickPos: {
        value: Array.from(
          { length: MAX_CLICKS },
          () => new THREE.Vector2(-1, -1),
        ),
      },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: SHAPE_MAP[config.variant] },
      uPixelSize: {
        value: config.pixelSize * renderer.getPixelRatio(),
      },
      uScale: { value: config.patternScale },
      uDensity: { value: config.patternDensity },
      uPixelJitter: { value: config.pixelSizeJitter },
      uEnableRipples: {
        value: config.enableRipples ? 1 : 0,
      },
      uRippleSpeed: { value: config.rippleSpeed },
      uRippleThickness: { value: config.rippleThickness },
      uRippleIntensity: {
        value: config.rippleIntensityScale,
      },
      uEdgeFade: { value: edgeFade },
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0,
      1,
    );
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      glslVersion: THREE.GLSL3,
    });
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      material,
    );
    scene.add(quad);

    let composer: EffectComposer | undefined;
    let touch: TouchTexture | undefined;
    let liquidEffect: Effect | undefined;
    let noiseEffect: Effect | undefined;

    if (liquid) {
      touch = createTouchTexture();
      touch.radiusScale = config.liquidRadius;
      liquidEffect = createLiquidEffect(
        touch.texture,
        config.liquidStrength,
        config.liquidWobbleSpeed,
      );
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new EffectPass(camera, liquidEffect));
    }

    if (noiseAmount > 0) {
      if (!composer) {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
      }
      noiseEffect = createNoiseEffect(noiseAmount);
      composer.addPass(new EffectPass(camera, noiseEffect));
    }

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height,
      );
      uniforms.uPixelSize.value =
        configRef.current.pixelSize * renderer.getPixelRatio();
      composer?.setSize(width, height);
      if (runtimeRef.current) {
        runtimeRef.current.needsRender = true;
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const runtime: PixelRuntime = {
      renderer,
      material,
      quad,
      uniforms,
      resizeObserver,
      composer,
      touch,
      liquidEffect,
      noiseEffect,
      clickIndex: 0,
      elapsed: window.crypto.getRandomValues(new Uint32Array(1))[0] /
        0xffffffff *
        1000,
      lastFrame: performance.now(),
      reducedMotion: motionQuery.matches,
      needsRender: true,
      raf: 0,
    };
    runtimeRef.current = runtime;

    const mapPointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const scaleX = renderer.domElement.width / rect.width;
      const scaleY = renderer.domElement.height / rect.height;
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (rect.height - (event.clientY - rect.top)) * scaleY,
        width: renderer.domElement.width,
        height: renderer.domElement.height,
      };
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (runtime.reducedMotion) return;
      const pointer = mapPointer(event);
      const index = runtime.clickIndex;
      uniforms.uClickPos.value[index].set(pointer.x, pointer.y);
      uniforms.uClickTimes.value[index] = uniforms.uTime.value;
      runtime.clickIndex = (index + 1) % MAX_CLICKS;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!touch || runtime.reducedMotion) return;
      const pointer = mapPointer(event);
      touch.addTouch({
        x: pointer.x / pointer.width,
        y: pointer.y / pointer.height,
      });
    };

    const handleMotionChange = () => {
      runtime.reducedMotion = motionQuery.matches;
      runtime.needsRender = true;
      runtime.lastFrame = performance.now();
    };

    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    motionQuery.addEventListener("change", handleMotionChange);

    const render = () => {
      if (runtime.composer) runtime.composer.render();
      else renderer.render(scene, camera);
    };

    const animate = (now: number) => {
      const pageHidden =
        autoPauseOffscreen && document.visibilityState === "hidden";
      if (!pageHidden && !runtime.reducedMotion) {
        const delta = Math.min(
          Math.max((now - runtime.lastFrame) / 1000, 0),
          0.05,
        );
        runtime.elapsed += delta * speedRef.current;
        uniforms.uTime.value = runtime.elapsed;
        touch?.update();
        const liquidTime =
          liquidEffect?.uniforms.get("uTime");
        const noiseTime = noiseEffect?.uniforms.get("uTime");
        if (liquidTime) liquidTime.value = runtime.elapsed;
        if (noiseTime) noiseTime.value = runtime.elapsed;
        render();
      } else if (!pageHidden && runtime.needsRender) {
        render();
        runtime.needsRender = false;
      }
      runtime.lastFrame = now;
      runtime.raf = requestAnimationFrame(animate);
    };

    runtime.raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      motionQuery.removeEventListener("change", handleMotionChange);
      resizeObserver.disconnect();
      cancelAnimationFrame(runtime.raf);
      quad.geometry.dispose();
      material.dispose();
      touch?.texture.dispose();
      composer?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      if (runtimeRef.current === runtime) runtimeRef.current = null;
    };
  }, [antialias, autoPauseOffscreen, edgeFade, liquid, noiseAmount]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;

    runtime.uniforms.uShapeType.value = SHAPE_MAP[variant];
    runtime.uniforms.uPixelSize.value =
      pixelSize * runtime.renderer.getPixelRatio();
    runtime.uniforms.uColor.value.set(color);
    runtime.uniforms.uScale.value = patternScale;
    runtime.uniforms.uDensity.value = patternDensity;
    runtime.uniforms.uPixelJitter.value = pixelSizeJitter;
    runtime.uniforms.uEnableRipples.value =
      enableRipples ? 1 : 0;
    runtime.uniforms.uRippleIntensity.value =
      rippleIntensityScale;
    runtime.uniforms.uRippleThickness.value = rippleThickness;
    runtime.uniforms.uRippleSpeed.value = rippleSpeed;
    runtime.uniforms.uEdgeFade.value = edgeFade;
    if (runtime.touch) {
      runtime.touch.radiusScale = liquidRadius;
    }
    const liquidStrengthUniform =
      runtime.liquidEffect?.uniforms.get("uStrength");
    const liquidFrequencyUniform =
      runtime.liquidEffect?.uniforms.get("uFreq");
    const noiseAmountUniform =
      runtime.noiseEffect?.uniforms.get("uAmount");
    if (liquidStrengthUniform) {
      liquidStrengthUniform.value = liquidStrength;
    }
    if (liquidFrequencyUniform) {
      liquidFrequencyUniform.value = liquidWobbleSpeed;
    }
    if (noiseAmountUniform) {
      noiseAmountUniform.value = noiseAmount;
    }
    if (transparent) runtime.renderer.setClearAlpha(0);
    else runtime.renderer.setClearColor(0x000000, 1);
    runtime.needsRender = true;
  }, [
    color,
    edgeFade,
    enableRipples,
    liquidRadius,
    liquidStrength,
    liquidWobbleSpeed,
    noiseAmount,
    patternDensity,
    patternScale,
    pixelSize,
    pixelSizeJitter,
    rippleIntensityScale,
    rippleSpeed,
    rippleThickness,
    transparent,
    variant,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pixel-blast-container${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    />
  );
}
