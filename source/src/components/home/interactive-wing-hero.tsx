"use client";

import { PerspectiveCamera, Text, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  Box3,
  FrontSide,
  Group,
  MathUtils,
  Mesh,
  Object3D,
  Vector2,
  Vector3,
} from "three";

const MODEL_URL = "/models/carl-wing-hero.glb";
const HERO_DISPLAY = {
  desktop: {
    displayScale: 1.28,
    positionX: 0,
    positionY: -0.095,
    cameraDistance: 7.2,
    canvasBleedNormalization: 0.86,
  },
  tablet: {
    displayScale: 0.82,
    positionX: 0,
    positionY: 0.04,
    cameraDistance: 7.6,
    canvasBleedNormalization: 1,
  },
  mobile: {
    displayScale: 0.65,
    positionX: 0,
    positionY: 0.03,
    cameraDistance: 8.2,
    canvasBleedNormalization: 1,
  },
} as const;

function getHeroDisplay(width: number) {
  if (width <= 760) return HERO_DISPLAY.mobile;
  if (width <= 1100) return HERO_DISPLAY.tablet;
  return HERO_DISPLAY.desktop;
}

const TEXT_BANDS = {
  bandA: {
    labels: ["PRODUCT", "AI", "SYSTEMS", "DESIGN", "BUILD"],
    repetitions: 3,
    radiusX: 0.37,
    radiusZ: 0.27,
    centerX: 0.035,
    centerY: 0.1,
    tiltXDeg: -4,
    tiltZDeg: 32,
    angularSpeed: 0.023,
    initialRotation: -0.24,
    color: "#b7c2a8",
    opacity: 0.96,
  },
  bandB: {
    labels: ["CURIOSITY", "MUSIC", "GAMES", "READING", "EXPLORE"],
    repetitions: 3,
    radiusX: 0.34,
    radiusZ: 0.25,
    centerX: 0.035,
    centerY: 0.035,
    tiltXDeg: 4,
    tiltZDeg: -31,
    angularSpeed: -0.018,
    initialRotation: 0.34,
    color: "#c0b4c5",
    opacity: 0.82,
  },
  fontSize: 0.027,
} as const;

type TextBandKey = "bandA" | "bandB";

function repeatBandLabels(
  labels: readonly string[],
  repetitions: number,
) {
  return Array.from(
    { length: labels.length * repetitions },
    (_, index) => labels[index % labels.length],
  );
}

class MotionController {
  private dragging = false;
  private lastX = 0;
  private targetY = 0;
  private velocityY = 0;
  private resumeAt = 0;
  private pointer = new Vector2();

  start(clientX: number) {
    this.dragging = true;
    this.lastX = clientX;
    this.velocityY = 0;
    this.resumeAt = performance.now() + 4500;
  }

  move(clientX: number, normalizedX: number, normalizedY: number) {
    this.pointer.set(normalizedX, normalizedY);
    if (!this.dragging) return;
    const rotationDelta = (clientX - this.lastX) * 0.006;
    this.lastX = clientX;
    this.targetY += rotationDelta;
    this.velocityY = rotationDelta * 4;
    this.resumeAt = performance.now() + 4500;
  }

  release() {
    this.dragging = false;
    this.resumeAt = performance.now() + 4500;
  }

  clearPointer() {
    this.pointer.set(0, 0);
  }

  step(delta: number, now: number) {
    if (!this.dragging && Math.abs(this.velocityY) > 0.00002) {
      this.targetY += this.velocityY * delta;
      this.velocityY *= Math.exp(-5 * delta);
    }
    if (!this.dragging && now > this.resumeAt) {
      this.targetY += delta * 0.012;
    }
    return {
      dragging: this.dragging,
      targetY: this.targetY,
      pointerX: this.pointer.x,
      pointerY: this.pointer.y,
    };
  }
}

type ModelInspection = {
  pivot: Vector3;
  size: Vector3;
  span: number;
};

const loggedScenes = new WeakSet<Object3D>();

function inspectModel(scene: Object3D): ModelInspection {
  try {
    const bounds = new Box3().setFromObject(scene);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const span = Math.max(size.x, size.y, size.z, 1);

    if (process.env.NODE_ENV !== "production" && !loggedScenes.has(scene)) {
      loggedScenes.add(scene);
      try {
        let meshCount = 0;
        let nodeCount = 0;
        const materialIds = new Set<string>();

        scene.traverse((object) => {
          nodeCount += 1;
          const mesh = object as Mesh;
          if (!mesh.isMesh) return;
          meshCount += 1;
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          materials.forEach((material) => materialIds.add(material.uuid));
        });

        console.info("[WingHero] model inspection", {
          meshCount,
          materialCount: materialIds.size,
          nodeCount,
          bounds: {
            min: bounds.min.toArray(),
            max: bounds.max.toArray(),
            size: size.toArray(),
          },
          textBandLabels: [
            ...TEXT_BANDS.bandA.labels,
            ...TEXT_BANDS.bandB.labels,
          ],
        });
      } catch (error) {
        console.warn("[WingHero] model inspection failed", error);
      }
    }

    return {
      pivot: center,
      size,
      span,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[WingHero] model bounds failed; using safe fallback", error);
    }
    return {
      pivot: new Vector3(),
      size: new Vector3(1, 1, 1),
      span: 1,
    };
  }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function TextBand({
  bandKey,
  modelSpan,
  reducedMotion,
  onPose,
}: {
  bandKey: TextBandKey;
  modelSpan: number;
  reducedMotion: boolean;
  onPose: (bandKey: TextBandKey, rotationY: number) => void;
}) {
  const orbitRef = useRef<Group>(null);
  const lastPoseReport = useRef(0);
  const band = TEXT_BANDS[bandKey];
  const repeatedLabels = useMemo(
    () => repeatBandLabels(band.labels, band.repetitions),
    [band.labels, band.repetitions],
  );
  const labelSize = modelSpan * TEXT_BANDS.fontSize;
  const radiusX = modelSpan * band.radiusX;
  const radiusZ = modelSpan * band.radiusZ;
  const bandCenter: [number, number, number] = [
    modelSpan * band.centerX,
    modelSpan * band.centerY,
    0,
  ];

  useFrame((_, delta) => {
    const orbit = orbitRef.current;
    if (!orbit) return;
    if (!reducedMotion) {
      orbit.rotation.y += delta * band.angularSpeed;
    }
    if (
      process.env.NODE_ENV !== "production" &&
      performance.now() - lastPoseReport.current > 250
    ) {
      lastPoseReport.current = performance.now();
      onPose(bandKey, orbit.rotation.y);
    }
  });

  return (
    <group
      position={bandCenter}
      rotation={[
        MathUtils.degToRad(band.tiltXDeg),
        0,
        MathUtils.degToRad(band.tiltZDeg),
      ]}
    >
      <group
        ref={orbitRef}
        rotation={[0, band.initialRotation, 0]}
      >
        {repeatedLabels.map((label, index) => {
          const angle = (index / repeatedLabels.length) * Math.PI * 2;
          return (
            <Text
              key={`${bandKey}-${index}-${label}`}
              position={[
                Math.sin(angle) * radiusX,
                0,
                Math.cos(angle) * radiusZ,
              ]}
              rotation={[0, angle, 0]}
              fontSize={labelSize}
              maxWidth={labelSize * 9}
              color={band.color}
              fillOpacity={band.opacity}
              anchorX="center"
              anchorY="middle"
              textAlign="center"
              material-depthTest
              material-depthWrite
              material-side={FrontSide}
              outlineWidth={labelSize * 0.035}
              outlineColor={band.color}
              outlineOpacity={bandKey === "bandA" ? 0.48 : 0.4}
            >
              {label}
            </Text>
          );
        })}
      </group>
    </group>
  );
}

function TextBands({
  modelSpan,
  reducedMotion,
  onPose,
}: {
  modelSpan: number;
  reducedMotion: boolean;
  onPose: (bandKey: TextBandKey, rotationY: number) => void;
}) {
  return (
    <group name="textBandsGroup">
      <TextBand
        bandKey="bandA"
        modelSpan={modelSpan}
        reducedMotion={reducedMotion}
        onPose={onPose}
      />
      <TextBand
        bandKey="bandB"
        modelSpan={modelSpan}
        reducedMotion={reducedMotion}
        onPose={onPose}
      />
    </group>
  );
}

function DemandAnimationDriver({
  visible,
  reducedMotion,
}: {
  visible: boolean;
  reducedMotion: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    let frame = 0;
    const update = () => {
      invalidate();
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [invalidate, reducedMotion, visible]);

  return null;
}

function getCameraFitDistance({
  model,
  scale,
  aspect,
  fov,
}: {
  model: ModelInspection;
  scale: number;
  aspect: number;
  fov: number;
}) {
  const verticalFov = MathUtils.degToRad(fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const rotationRadius = Math.hypot(model.size.x / 2, model.size.z / 2);
  const halfHeight = Math.max(model.size.y / 2, model.span * 0.24);
  const horizontalDistance =
    (rotationRadius * scale) / Math.sin(horizontalFov / 2);
  const verticalDistance =
    rotationRadius * scale +
    (halfHeight * scale) / Math.tan(verticalFov / 2);

  return Math.max(horizontalDistance, verticalDistance) * 1.15;
}

function WingModel({
  controller,
  reducedMotion,
  onReady,
  onPose,
  onBandPose,
  onDisplayScale,
}: {
  controller: MotionController;
  reducedMotion: boolean;
  onReady: (labelCount: number) => void;
  onPose: (rotationY: number) => void;
  onBandPose: (bandKey: TextBandKey, rotationY: number) => void;
  onDisplayScale: (displayScale: number) => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => inspectModel(scene), [scene]);
  const heroTransformRef = useRef<Group>(null);
  const lastPoseReport = useRef(0);
  const { size, invalidate } = useThree();
  const pageWidth =
    typeof window === "undefined" ? size.width : window.innerWidth;
  const display = getHeroDisplay(pageWidth);

  const baseViewport = useMemo(() => {
    const fov = MathUtils.degToRad(32);
    const height = 2 * Math.tan(fov / 2) * display.cameraDistance;
    return {
      width: height * (size.width / Math.max(size.height, 1)),
      height,
    };
  }, [display.cameraDistance, size.height, size.width]);

  const normalizedScale = useMemo(() => {
    const widthScale = baseViewport.width / Math.max(model.size.x, 0.001);
    const heightScale = baseViewport.height / Math.max(model.size.y, 0.001);
    return Math.min(widthScale, heightScale);
  }, [
    baseViewport.height,
    baseViewport.width,
    model.size.x,
    model.size.y,
  ]);
  const finalScale =
    normalizedScale *
    display.displayScale *
    display.canvasBleedNormalization;
  const fittedCameraDistance = useMemo(
    () => Math.max(
      display.cameraDistance,
      getCameraFitDistance({
      model,
      scale: finalScale,
      aspect: size.width / Math.max(size.height, 1),
        fov: 32,
      }),
    ),
    [
      display.cameraDistance,
      finalScale,
      model,
      size.height,
      size.width,
    ],
  );

  useEffect(() => {
    onReady(
      TEXT_BANDS.bandA.labels.length * TEXT_BANDS.bandA.repetitions +
        TEXT_BANDS.bandB.labels.length * TEXT_BANDS.bandB.repetitions,
    );
    onDisplayScale(display.displayScale);
    invalidate();
  }, [display.displayScale, invalidate, onDisplayScale, onReady]);

  useFrame((_, delta) => {
    const group = heroTransformRef.current;
    if (!group) return;

    if (reducedMotion) {
      group.rotation.set(0, 0, 0);
      return;
    }

    const now = performance.now();
    const interaction = controller.step(delta, now);

    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      interaction.targetY + interaction.pointerX * 0.045,
      interaction.dragging ? 15 : 5,
      delta,
    );
    group.rotation.x = MathUtils.damp(
      group.rotation.x,
      -interaction.pointerY * 0.025,
      5,
      delta,
    );

    if (
      process.env.NODE_ENV !== "production" &&
      now - lastPoseReport.current > 250
    ) {
      lastPoseReport.current = now;
      onPose(group.rotation.y);
    }

  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, fittedCameraDistance]}
        fov={32}
        near={0.1}
        far={100}
      />
      <group
        ref={heroTransformRef}
        name="heroTransformGroup"
        scale={finalScale}
        position={[
          baseViewport.width * display.positionX,
          baseViewport.height * display.positionY,
          0,
        ]}
      >
        <group name="normalizedModelGroup">
          <primitive
            object={scene}
            position={[-model.pivot.x, -model.pivot.y, -model.pivot.z]}
          />
        </group>
        <TextBands
          modelSpan={model.span}
          reducedMotion={reducedMotion}
          onPose={onBandPose}
        />
      </group>
    </>
  );
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[WingHero] 3D layer unavailable:", error);
    }
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function InteractiveWingHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [modelAvailable, setModelAvailable] = useState(false);
  const [labelCount, setLabelCount] = useState(0);
  const reducedMotion = useReducedMotion();
  const controller = useMemo(() => new MotionController(), []);

  useEffect(() => {
    const request = new AbortController();
    fetch(MODEL_URL, {
      method: "HEAD",
      cache: "no-store",
      signal: request.signal,
    })
      .then((response) => {
        if (response.ok) {
          setModelAvailable(true);
        } else {
          setFailed(true);
        }
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setFailed(true);
        }
      });
    return () => request.abort();
  }, []);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const markReady = useCallback((count: number) => {
    setLabelCount(count);
    setReady(true);
  }, []);
  const markFailed = useCallback(() => setFailed(true), []);
  const reportPose = useCallback((rotationY: number) => {
    if (wrapperRef.current) {
      wrapperRef.current.dataset.rotationY = rotationY.toFixed(3);
    }
  }, []);
  const reportBandPose = useCallback(
    (bandKey: TextBandKey, rotationY: number) => {
    if (wrapperRef.current) {
        wrapperRef.current.dataset[
          bandKey === "bandA"
            ? "bandARotationY"
            : "bandBRotationY"
        ] = rotationY.toFixed(3);
    }
    },
    [],
  );
  const reportDisplayScale = useCallback((displayScale: number) => {
    if (wrapperRef.current) {
      wrapperRef.current.dataset.displayScale = displayScale.toFixed(2);
    }
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    controller.start(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const normalizedX = MathUtils.clamp(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -1,
      1,
    );
    const normalizedY = MathUtils.clamp(
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      -1,
      1,
    );
    controller.move(event.clientX, normalizedX, normalizedY);
  };

  const releasePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    controller.release();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`wing-hero-interactive-region${ready ? " is-ready" : ""}`}
      data-model-state={failed ? "failed" : ready ? "ready" : "loading"}
      data-label-count={labelCount}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onPointerLeave={() => controller.clearPointer()}
    >
      {!failed && modelAvailable ? (
        <ModelErrorBoundary onError={markFailed}>
          <Canvas
            frameloop="demand"
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 7.5], fov: 32, near: 0.1, far: 100 }}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            style={{ background: "transparent" }}
          >
            <DemandAnimationDriver
              visible={visible}
              reducedMotion={reducedMotion}
            />
            <ambientLight intensity={0.68} />
            <hemisphereLight args={["#eee9dd", "#151812", 0.78]} />
            <directionalLight position={[2.5, 4, 6]} intensity={2.7} color="#fff4df" />
            <directionalLight position={[-5, 1, 2]} intensity={1.7} color="#9a70bd" />
            <directionalLight position={[5, 0, 1]} intensity={1.55} color="#78c9b2" />
            <Suspense fallback={null}>
              <WingModel
                controller={controller}
                reducedMotion={reducedMotion}
                onReady={markReady}
                onPose={reportPose}
                onBandPose={reportBandPose}
                onDisplayScale={reportDisplayScale}
              />
            </Suspense>
          </Canvas>
        </ModelErrorBoundary>
      ) : null}
    </div>
  );
}
