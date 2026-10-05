"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import "./CircularGallery.css";

type GL = Renderer["gl"];
type GalleryItem = { image: string; text: string };
type Direction = "left" | "right";

type CircularGalleryProps = {
  items: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  fontUrl?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  onIndexChange?: (index: number) => void;
  onActivate?: (index: number) => void;
};

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

const GALLERY_REPETITIONS = 3;
const MEDIA_WIDTH = 760;
const MEDIA_GAP = 1.35;

async function resolveFont(font: string, fontUrl?: string, signal?: AbortSignal) {
  if (!fontUrl || typeof FontFace === "undefined") return font;

  const timeoutController = new AbortController();
  const timeout = window.setTimeout(() => timeoutController.abort(), 1200);
  const abort = () => timeoutController.abort();
  signal?.addEventListener("abort", abort, { once: true });

  try {
    const response = await fetch(fontUrl, { signal: timeoutController.signal });
    if (!response.ok) return font;
    const stylesheet = await response.text();
    const blocks = stylesheet.match(/@font-face\s*{[^}]*}/g) ?? [];
    let family = "Roboto Mono";

    await Promise.allSettled(
      blocks.map(async (block) => {
        const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/);
        const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
        if (!familyMatch || !urlMatch) return;
        family = familyMatch[1].trim();
        const weight = block.match(/font-weight:\s*([^;]+);/)?.[1].trim();
        const style = block.match(/font-style:\s*([^;]+);/)?.[1].trim();
        const face = new FontFace(family, `url(${urlMatch[1]})`, { weight, style });
        await face.load();
        document.fonts.add(face);
      }),
    );

    const prefix = font.match(/^\s*(.*?\d+px)/)?.[1].trim() ?? "600 28px";
    const resolved = `${prefix} "${family}"`;
    await document.fonts.load(resolved);
    return resolved;
  } catch {
    return font;
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}

function textTexture(gl: GL, text: string, font: string, color: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("CircularGallery could not create its text layer.");
  context.font = font;
  const fontSize = Number(font.match(/(\d+)px/)?.[1] ?? 28);
  canvas.width = Math.ceil(context.measureText(text).width) + 32;
  canvas.height = Math.ceil(fontSize * 1.35) + 20;
  context.font = font;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

function estimateImageLuminance(image: HTMLImageElement) {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return 0.5;

    canvas.width = 16;
    canvas.height = 16;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let total = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      total += (pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114) / 255;
    }

    return total / (pixels.length / 4);
  } catch {
    return 0.5;
  }
}

class GalleryMedia {
  extra = 0;
  x = 0;
  width = 0;
  widthTotal = 0;
  private wrapIndex = 0;
  plane: Mesh;
  title: Mesh;
  private program: Program;
  private titleProgram: Program;
  private viewport: { width: number; height: number };
  private screen: { width: number; height: number };
  private baseScaleX = 1;
  private baseScaleY = 1;

  constructor(
    private config: {
      gl: GL;
      geometry: Plane;
      scene: Transform;
      item: GalleryItem;
      index: number;
      length: number;
      bend: number;
      textColor: string;
      borderRadius: number;
      font: string;
      screen: { width: number; height: number };
      viewport: { width: number; height: number };
    },
  ) {
    this.screen = config.screen;
    this.viewport = config.viewport;
    const texture = new Texture(config.gl, { generateMipmaps: true });
    this.program = new Program(config.gl, {
      depthTest: false,
      depthWrite: false,
      transparent: true,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5)
            * (0.1 + min(abs(uSpeed), 0.18) * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uEmphasis;
        uniform float uImageLuminance;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 imageUv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, imageUv);
          float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          float sideExposure = mix(0.84, 0.68, clamp(uImageLuminance, 0.0, 1.0));
          vec3 subdued = mix(vec3(luminance), color.rgb, 0.84) * sideExposure;
          color.rgb = mix(subdued, color.rgb, uEmphasis);
          float distance = roundedBoxSDF(
            vUv - 0.5,
            vec2(0.5 - uBorderRadius),
            uBorderRadius
          );
          float alpha = 1.0 - smoothstep(-0.002, 0.002, distance);
          gl_FragColor = vec4(color.rgb, alpha * mix(0.76, 1.0, uEmphasis));
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: config.borderRadius },
        uEmphasis: { value: 1 },
        uImageLuminance: { value: 0.5 },
      },
    });
    this.plane = new Mesh(config.gl, { geometry: config.geometry, program: this.program });
    this.plane.setParent(config.scene);
    this.onResize();

    const titleData = textTexture(config.gl, config.item.text, config.font, config.textColor);
    this.titleProgram = new Program(config.gl, {
      transparent: true,
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        uniform float uEmphasis;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = vec4(color.rgb, color.a * mix(0.62, 1.0, uEmphasis));
        }
      `,
      uniforms: {
        tMap: { value: titleData.texture },
        uEmphasis: { value: 1 },
      },
    });
    this.title = new Mesh(config.gl, { geometry: new Plane(config.gl), program: this.titleProgram });
    this.title.setParent(this.plane);
    this.resizeTitle(titleData.width / titleData.height);

    const image = new Image();
    image.src = config.item.image;
    image.onload = () => {
      texture.image = image;
      this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
      this.program.uniforms.uImageLuminance.value = estimateImageLuminance(image);
    };
  }

  private resizeTitle(aspect: number) {
    const height = this.plane.scale.y * 0.11;
    this.title.scale.set(height * aspect, height, 1);
    this.title.position.y = -this.plane.scale.y * 0.5 - height * 0.7;
  }

  onResize(
    screen = this.screen,
    viewport = this.viewport,
  ) {
    this.screen = screen;
    this.viewport = viewport;
    const scale = screen.height / 1500;
    this.baseScaleY = (viewport.height * (900 * scale)) / screen.height;
    this.baseScaleX = (viewport.width * (MEDIA_WIDTH * scale)) / screen.width;
    this.plane.scale.set(this.baseScaleX, this.baseScaleY, 1);
    this.program.uniforms.uPlaneSizes.value = [this.baseScaleX, this.baseScaleY];
    this.width = this.baseScaleX + MEDIA_GAP;
    this.widthTotal = this.width * this.config.length;
    this.x = this.width * this.config.index;
    this.extra = this.wrapIndex * this.widthTotal;
  }

  update(scroll: { current: number; last: number }, direction: Direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const halfWidth = this.viewport.width / 2;
    const bend = Math.abs(this.config.bend);
    const radius = (halfWidth * halfWidth + bend * bend) / (2 * bend);
    const effectiveX = Math.min(Math.abs(x), halfWidth);
    const arc = radius - Math.sqrt(Math.max(radius * radius - effectiveX * effectiveX, 0));
    this.plane.position.y = this.config.bend > 0 ? -arc : arc;
    this.plane.rotation.z =
      (this.config.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / radius);
    const speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = speed;
    const edgeDistance = Math.min(Math.abs(x) / Math.max(halfWidth, 0.001), 1);
    const emphasis = Math.pow(Math.max(0, 1 - edgeDistance), 1.15);
    const displayScale = 0.95 + emphasis * 0.1;
    this.plane.scale.set(
      this.baseScaleX * displayScale,
      this.baseScaleY * displayScale,
      1,
    );
    this.program.uniforms.uEmphasis.value = emphasis * emphasis;
    this.titleProgram.uniforms.uEmphasis.value = emphasis;

    const planeOffset = this.baseScaleX / 2;
    const before = this.plane.position.x + planeOffset < -halfWidth;
    const after = this.plane.position.x - planeOffset > halfWidth;
    if (direction === "right" && before) {
      this.wrapIndex -= 1;
      this.extra = this.wrapIndex * this.widthTotal;
    }
    if (direction === "left" && after) {
      this.wrapIndex += 1;
      this.extra = this.wrapIndex * this.widthTotal;
    }
  }
}

class GalleryApp {
  private renderer: Renderer;
  private gl: GL;
  private camera: Camera;
  private scene = new Transform();
  private medias: GalleryMedia[] = [];
  private frame = 0;
  private resizeObserver: ResizeObserver;
  private isDragging = false;
  private dragStart = 0;
  private dragOrigin = 0;
  private moved = 0;
  private activeIndex = -1;
  private scroll = { ease: 0.08, current: 0, target: 0, last: 0 };

  constructor(
    private container: HTMLDivElement,
    private items: GalleryItem[],
    private options: Required<
      Pick<CircularGalleryProps, "bend" | "textColor" | "borderRadius" | "font" | "scrollSpeed" | "scrollEase">
    > & {
      onIndexChange?: (index: number) => void;
      onActivate?: (index: number) => void;
    },
  ) {
    this.scroll.ease = options.scrollEase;
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
    this.createMedias();
    this.onResize();
    this.addListeners();
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(container);
    this.update();
  }

  private createMedias() {
    const geometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
    const repeated = Array.from(
      { length: GALLERY_REPETITIONS },
      () => this.items,
    ).flat();
    const screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    const viewport = { width: 1, height: 1 };
    this.medias = repeated.map(
      (item, index) =>
        new GalleryMedia({
          gl: this.gl,
          geometry,
          scene: this.scene,
          item,
          index,
          length: repeated.length,
          bend: this.options.bend,
          textColor: this.options.textColor,
          borderRadius: this.options.borderRadius,
          font: this.options.font,
          screen,
          viewport,
        }),
    );
  }

  private onResize = () => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.perspective({ aspect: width / height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const viewportHeight = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const viewport = { width: viewportHeight * this.camera.aspect, height: viewportHeight };
    const screen = { width, height };
    this.medias.forEach((media) => media.onResize(screen, viewport));
  };

  private snap = () => {
    const width = this.medias[0]?.width;
    if (!width) return;
    this.scroll.target = Math.round(this.scroll.target / width) * width;
  };

  private pointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    this.isDragging = true;
    this.dragStart = event.clientX;
    this.dragOrigin = this.scroll.target;
    this.moved = 0;
    this.container.setPointerCapture?.(event.pointerId);
  };

  private pointerMove = (event: PointerEvent) => {
    if (!this.isDragging) return;
    const distance = this.dragStart - event.clientX;
    this.moved = Math.max(this.moved, Math.abs(distance));
    this.scroll.target = this.dragOrigin + distance * (this.options.scrollSpeed * 0.025);
  };

  private pointerUp = (event: PointerEvent) => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.releasePointerCapture?.(event.pointerId);
    if (event.type === "pointerup" && this.moved < 6 &&
      event.clientX > this.container.clientWidth * 0.3 &&
      event.clientX < this.container.clientWidth * 0.7) {
      this.options.onActivate?.(this.activeIndex);
    }
    this.snap();
  };

  private wheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    this.scroll.target += Math.sign(event.deltaX) * this.options.scrollSpeed * 0.2;
    this.snap();
  };

  private keyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const width = this.medias[0]?.width ?? 1;
    this.scroll.target += event.key === "ArrowRight" ? width : -width;
  };

  private addListeners() {
    this.container.addEventListener("pointerdown", this.pointerDown);
    this.container.addEventListener("pointermove", this.pointerMove);
    this.container.addEventListener("pointerup", this.pointerUp);
    this.container.addEventListener("pointercancel", this.pointerUp);
    this.container.addEventListener("wheel", this.wheel, { passive: true });
    this.container.addEventListener("keydown", this.keyDown);
  }

  private update = () => {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction: Direction = this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias.forEach((media) => media.update(this.scroll, direction));
    const width = this.medias[0]?.width;
    if (width) {
      const next = ((Math.round(this.scroll.current / width) % this.items.length) + this.items.length) %
        this.items.length;
      if (next !== this.activeIndex) {
        this.activeIndex = next;
        this.options.onIndexChange?.(next);
      }
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.frame = window.requestAnimationFrame(this.update);
  };

  destroy() {
    window.cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.container.removeEventListener("pointerdown", this.pointerDown);
    this.container.removeEventListener("pointermove", this.pointerMove);
    this.container.removeEventListener("pointerup", this.pointerUp);
    this.container.removeEventListener("pointercancel", this.pointerUp);
    this.container.removeEventListener("wheel", this.wheel);
    this.container.removeEventListener("keydown", this.keyDown);
    this.gl.canvas.remove();
  }
}

export function CircularGallery({
  items,
  bend = 6,
  textColor = "#ffffff",
  borderRadius = 0.1,
  font = '600 28px "Roboto Mono"',
  fontUrl = "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500;600&display=swap",
  scrollSpeed = 1.6,
  scrollEase = 0.08,
  onIndexChange,
  onActivate,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indexCallbackRef = useRef(onIndexChange);
  const activateCallbackRef = useRef(onActivate);

  useEffect(() => {
    indexCallbackRef.current = onIndexChange;
    activateCallbackRef.current = onActivate;
  }, [onIndexChange, onActivate]);

  useEffect(() => {
    const container = containerRef.current;
    if (
      !container ||
      window.matchMedia("(max-width: 760px), (prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let app: GalleryApp | undefined;
    let mounted = true;
    let starting = false;
    const abortController = new AbortController();

    const startGallery = async () => {
      if (
        !mounted ||
        starting ||
        app ||
        container.clientWidth < 2 ||
        container.clientHeight < 2
      ) {
        return;
      }

      starting = true;
      const resolvedFont = await resolveFont(font, fontUrl, abortController.signal);
      starting = false;
      if (!mounted || abortController.signal.aborted || app) return;

      try {
        app = new GalleryApp(container, items, {
          bend,
          textColor,
          borderRadius,
          font: resolvedFont,
          scrollSpeed,
          scrollEase,
          onIndexChange: (index) => indexCallbackRef.current?.(index),
          onActivate: (index) => activateCallbackRef.current?.(index),
        });
      } catch (error) {
        console.warn("[CircularGallery] WebGL initialization failed", error);
      }
    };

    const startupObserver = new ResizeObserver(() => {
      void startGallery();
    });
    startupObserver.observe(container);
    void startGallery();

    return () => {
      mounted = false;
      abortController.abort();
      startupObserver.disconnect();
      app?.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, fontUrl, scrollSpeed, scrollEase]);

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Featured project gallery. Drag horizontally or use the Left and Right Arrow keys."
    />
  );
}
