"use client";

import { Line, PerspectiveCamera as DreiPerspectiveCamera, RoundedBox, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import {
  AdditiveBlending,
  Box3,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Vector3,
} from "three";

export type SpatialBranch = "projects" | "skills" | "systems" | "education" | "about";

const MODEL_URL = "/models/carl-wing-hero.glb";

const NETWORK_POINTS: Record<SpatialBranch, [number, number, number]> = {
  projects: [-4.15, 1.65, 1.25],
  skills: [3.5, 2.2, -0.45],
  systems: [4.35, 0.15, 0.8],
  education: [-3.7, -2.15, -0.8],
  about: [3.2, -2.2, 0.2],
};

const LABEL_ZONES: Record<SpatialBranch, [number, number, number, number]> = {
  projects: [0.18, 0.285, 0.17, 0.105],
  skills: [0.765, 0.225, 0.12, 0.075],
  systems: [0.825, 0.49, 0.14, 0.085],
  education: [0.275, 0.735, 0.14, 0.08],
  about: [0.76, 0.735, 0.12, 0.09],
};

const SECONDARY_POINTS: Array<[number, number, number]> = [
  [-5.7, 2.55, -1.4], [-5.9, 0.75, -2.1], [-4.9, -0.2, 0.2],
  [-2.6, 2.9, -2.4], [-2.25, -2.95, -1.4], [-1.2, 2.65, -3.1],
  [1.35, 2.95, -2.6], [2.2, 1.15, -2.2], [5.3, 2.7, -1.8],
  [5.65, 1.15, -2.8], [5.8, -0.9, -1.4], [4.9, -2.95, -2.5],
  [1.3, -3.05, -2.8], [-1.1, -2.75, -3.4], [0.2, 0.55, -3.8],
];

const SECONDARY_EDGES: Array<[number, number]> = [
  [0, 1], [0, 3], [1, 2], [1, 4], [2, 4], [3, 5], [3, 6],
  [5, 6], [5, 7], [6, 8], [7, 9], [8, 9], [8, 10], [9, 11],
  [10, 11], [10, 12], [11, 13], [12, 13], [12, 14], [13, 14],
];

const HERO_NETWORK_POINTS: Array<[number, number, number]> = [
  [-7.5, 3.25, -5.8], [-6.0, 1.45, -3.2], [-7.4, -0.65, -4.5], [-5.35, -2.75, -3.7],
  [-3.85, 3.75, -4.7], [-3.25, 1.65, -6.1], [-3.7, -2.15, -5.2], [-2.2, -3.65, -4.1],
  [2.35, 3.65, -5.5], [3.55, 1.8, -4.1], [3.25, -1.8, -5.9], [2.4, -3.6, -4.5],
  [5.35, 2.75, -3.4], [6.9, 1.15, -5.1], [5.8, -1.0, -3.0], [7.45, -2.75, -5.5],
  [-0.9, 4.25, -6.7], [0.7, 3.25, -3.8], [-0.55, -3.4, -6.4], [1.1, -4.2, -3.6],
];

const HERO_NETWORK_EDGES: Array<[number, number]> = [
  [0, 1], [0, 4], [1, 2], [1, 4], [1, 5], [2, 3], [2, 6], [3, 6], [3, 7],
  [4, 5], [4, 16], [5, 16], [5, 17], [6, 7], [6, 18], [7, 18], [7, 19],
  [8, 9], [8, 12], [8, 17], [9, 12], [9, 14], [10, 11], [10, 14], [10, 18],
  [11, 15], [11, 19], [12, 13], [12, 14], [13, 14], [13, 15], [14, 15],
  [16, 17], [17, 8], [18, 19], [19, 11], [5, 9], [6, 10],
];

const SCREEN_NETWORK_POINTS: Array<[number, number, number]> = [
  [-3.08, 1.58, 0.43], [-2.2, 0.62, 0.43], [-2.9, -0.72, 0.43], [-1.72, -1.52, 0.43],
  [-1.3, 1.42, 0.43], [-0.72, 0.42, 0.43], [-1.05, -0.92, 0.43], [0.4, 1.62, 0.43],
  [0.78, 0.62, 0.43], [0.48, -0.78, 0.43], [1.62, -1.48, 0.43], [1.82, 1.35, 0.43],
  [2.72, 0.48, 0.43], [2.35, -0.76, 0.43], [3.08, -1.55, 0.43],
];

const SCREEN_NETWORK_EDGES: Array<[number, number]> = [
  [0, 1], [0, 4], [1, 2], [1, 4], [1, 5], [2, 3], [2, 6], [3, 6],
  [4, 5], [4, 7], [5, 6], [5, 7], [5, 8], [6, 9], [6, 10], [7, 8],
  [7, 11], [8, 9], [8, 11], [8, 12], [9, 10], [9, 13], [10, 13], [10, 14],
  [11, 12], [12, 13], [13, 14],
];

function usePageVisibility() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}

function HeroNetworkField({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(time * 0.16) * 0.025;
    group.current.rotation.x = Math.sin(time * 0.11) * 0.012;
    group.current.position.y = Math.sin(time * 0.2) * 0.07;
  });

  return (
    <group ref={group} position={[0, 0, -0.8]}>
      {HERO_NETWORK_EDGES.map(([from, to]) => {
        const depth = Math.abs((HERO_NETWORK_POINTS[from][2] + HERO_NETWORK_POINTS[to][2]) / 2);
        const near = depth < 4.4;
        return (
          <Line
            key={`${from}-${to}`}
            points={[HERO_NETWORK_POINTS[from], HERO_NETWORK_POINTS[to]]}
            color={near ? "#161b1e" : "#6e7477"}
            transparent
            opacity={near ? 0.28 : 0.12}
            lineWidth={near ? 0.72 : 0.38}
          />
        );
      })}
      {HERO_NETWORK_POINTS.map((point, index) => {
        const near = Math.abs(point[2]) < 4.4;
        return (
          <mesh key={index} position={point}>
            {index % 5 === 0
              ? <icosahedronGeometry args={[near ? 0.16 : 0.12, 1]} />
              : <sphereGeometry args={[near ? 0.075 : 0.045, 10, 10]} />}
            <meshBasicMaterial
              color={near ? "#111516" : "#7a7f81"}
              transparent
              opacity={near ? 0.56 : 0.2}
              wireframe={index % 5 === 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function ScreenTopology({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    group.current.position.x = Math.sin(time * 0.13) * 0.045;
    group.current.position.y = Math.cos(time * 0.17) * 0.035;
  });

  return (
    <group ref={group}>
      {SCREEN_NETWORK_EDGES.map(([from, to]) => (
        <Line
          key={`${from}-${to}`}
          points={[SCREEN_NETWORK_POINTS[from], SCREEN_NETWORK_POINTS[to]]}
          color="#14191b"
          transparent
          opacity={(from + to) % 4 === 0 ? 0.25 : 0.12}
          lineWidth={(from + to) % 4 === 0 ? 0.68 : 0.42}
        />
      ))}
      {SCREEN_NETWORK_POINTS.map((point, index) => (
        <mesh key={index} position={point}>
          <circleGeometry args={[index % 6 === 0 ? 0.045 : 0.024, 10]} />
          <meshBasicMaterial color="#101416" transparent opacity={index % 6 === 0 ? 0.48 : 0.24} />
        </mesh>
      ))}
      {[[-2.5, 1.04, 0.435], [1.28, 1.05, 0.435], [2.53, -1.05, 0.435]].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]} rotation={[0, 0, index === 1 ? 0.42 : -0.3]}>
          <circleGeometry args={[index === 1 ? 0.2 : 0.14, 3]} />
          <meshBasicMaterial color="#202628" transparent opacity={0.12} side={2} />
        </mesh>
      ))}
    </group>
  );
}

function BezelTrace({ reducedMotion }: { reducedMotion: boolean }) {
  const trace = useRef<Mesh>(null);

  useFrame((state) => {
    if (!trace.current) return;
    const halfWidth = 3.43;
    const halfHeight = 2.12;
    const centerY = 0.34;
    const horizontal = halfWidth * 2;
    const vertical = halfHeight * 2;
    const perimeter = (horizontal + vertical) * 2;
    const progress = reducedMotion ? 0.12 : (state.clock.elapsedTime * 0.56) % perimeter;
    let cursor = progress;

    if (cursor < horizontal) {
      trace.current.position.set(-halfWidth + cursor, centerY + halfHeight, 0.465);
      trace.current.rotation.z = 0;
    } else if ((cursor -= horizontal) < vertical) {
      trace.current.position.set(halfWidth, centerY + halfHeight - cursor, 0.465);
      trace.current.rotation.z = Math.PI / 2;
    } else if ((cursor -= vertical) < horizontal) {
      trace.current.position.set(halfWidth - cursor, centerY - halfHeight, 0.465);
      trace.current.rotation.z = 0;
    } else {
      cursor -= horizontal;
      trace.current.position.set(-halfWidth, centerY - halfHeight + cursor, 0.465);
      trace.current.rotation.z = Math.PI / 2;
    }
  });

  return (
    <mesh ref={trace}>
      <boxGeometry args={[0.7, 0.022, 0.018]} />
      <meshBasicMaterial color="#dff7ff" transparent opacity={0.66} blending={AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function CarlIdentity({
  activated,
  reducedMotion,
  variant = "hero",
}: {
  activated: boolean;
  reducedMotion: boolean;
  variant?: "hero" | "network";
}) {
  const { scene } = useGLTF(MODEL_URL);
  const { size } = useThree();
  const group = useRef<Group>(null);
  const normalized = useMemo(() => {
    const bounds = new Box3().setFromObject(scene);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        const litMaterial = material as MeshStandardMaterial;
        if (litMaterial.color && !litMaterial.userData.homepagePocDarkened) {
          litMaterial.color.multiplyScalar(0.58);
          litMaterial.userData.homepagePocDarkened = true;
        }
        litMaterial.transparent = false;
        litMaterial.opacity = 1;
        litMaterial.depthWrite = true;
        if (!litMaterial.emissive) return;
        litMaterial.emissive.set("#111719");
        litMaterial.emissiveIntensity = Math.max(litMaterial.emissiveIntensity ?? 0, 0.06);
      });
    });
    return {
      center,
      scale: (variant === "network" ? 2.26 : 2.48) / Math.max(size.x, size.y, size.z, 0.001),
    };
  }, [scene, variant]);

  useFrame((state, delta) => {
    const identity = group.current;
    if (!identity) return;
    if (!reducedMotion) identity.rotation.y -= delta * 0.105;
    const pulse = activated ? 1 + Math.sin(state.clock.elapsedTime * 18) * 0.018 : 1;
    const mobileScale = size.width <= 760 ? (variant === "network" ? 1 : 1.42) : 1;
    identity.scale.setScalar(normalized.scale * pulse * mobileScale);
  });

  const identityPosition: [number, number, number] = variant === "network"
    ? [0, size.width <= 760 ? 0.92 : 0.12, 0.36]
    : [0, 0.48, 0.72];

  return (
    <group position={identityPosition}>
      {variant === "hero" && <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[3.55, 3.28]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={activated ? 0.16 : 0.05} depthWrite={false} />
      </mesh>}
      <group ref={group} scale={normalized.scale} position={[0, 0.05, 0.12]} rotation={[0.02, 0, 0]}>
        <primitive object={scene} position={[-normalized.center.x, -normalized.center.y, -normalized.center.z]} />
      </group>
    </group>
  );
}

function ComputerHardware({ activated, reducedMotion }: { activated: boolean; reducedMotion: boolean }) {
  return (
    <group position={[0, 0.05, 0]}>
      <RoundedBox args={[7.64, 4.98, 0.5]} radius={0.045} smoothness={4} position={[0, 0.34, -0.22]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#858b8d" metalness={0.92} roughness={0.28} clearcoat={0.22} clearcoatRoughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[7.5, 4.84, 0.3]} radius={0.035} smoothness={4} position={[0, 0.34, 0.02]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#d8dbda" metalness={0.78} roughness={0.24} clearcoat={0.34} clearcoatRoughness={0.22} />
      </RoundedBox>
      <RoundedBox args={[6.92, 4.28, 0.055]} radius={0.035} smoothness={3} position={[0, 0.34, 0.38]}>
        <meshStandardMaterial
          color="#eceeeb"
          emissive={activated ? "#d9f7ff" : "#ffffff"}
          emissiveIntensity={activated ? 0.3 : 0.045}
          metalness={0.05}
          roughness={0.52}
        />
      </RoundedBox>
      <mesh position={[0.45, 2.72, 0.3]}><boxGeometry args={[5.92, 0.014, 0.035]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.66} /></mesh>
      <mesh position={[-3.69, 0.05, 0.3]}><boxGeometry args={[0.014, 3.56, 0.035]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.42} /></mesh>
      <mesh position={[-3.48, 2.69, 0.42]}><boxGeometry args={[0.32, 0.045, 0.035]} /><meshBasicMaterial color="#111516" /></mesh>
      <mesh position={[3.5, -1.95, 0.42]}><boxGeometry args={[0.22, 0.045, 0.035]} /><meshBasicMaterial color="#111516" /></mesh>
      <mesh position={[3.62, 2.05, 0.38]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.18, 0.035, 0.035]} /><meshBasicMaterial color="#171b1c" /></mesh>
      <ScreenTopology reducedMotion={reducedMotion} />
      <BezelTrace reducedMotion={reducedMotion} />
      <CarlIdentity activated={activated} reducedMotion={reducedMotion} />
    </group>
  );
}

function HeroCamera({ activated, reducedMotion }: { activated: boolean; reducedMotion: boolean }) {
  const { size } = useThree();
  const cameraRef = useRef<PerspectiveCamera>(null);
  const startedAt = useRef<number | null>(null);
  const start = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const perspective = cameraRef.current;
    if (!perspective) return;
    const mobile = size.width <= 760;
    const pointerX = reducedMotion ? 0 : state.pointer.x * (mobile ? 0.08 : 0.16);
    const pointerY = reducedMotion ? 0 : state.pointer.y * (mobile ? 0.05 : 0.1);
    const resting = mobile ? new Vector3(pointerX, 0.42 + pointerY, 20) : new Vector3(pointerX, 0.48 + pointerY, 10.5);

    if (!activated || reducedMotion) {
      startedAt.current = null;
      perspective.position.x = MathUtils.damp(perspective.position.x, resting.x, 4, delta);
      perspective.position.y = MathUtils.damp(perspective.position.y, resting.y, 4, delta);
      perspective.position.z = MathUtils.damp(perspective.position.z, resting.z, 4, delta);
      look.set(0, 0.28, 0);
      perspective.lookAt(look);
      perspective.fov = MathUtils.damp(perspective.fov, mobile ? 42 : 35, 4, delta);
      perspective.updateProjectionMatrix();
      return;
    }

    if (startedAt.current === null) {
      startedAt.current = state.clock.elapsedTime;
      start.copy(perspective.position);
    }
    const raw = Math.min((state.clock.elapsedTime - startedAt.current) / 1.02, 1);
    const eased = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
    perspective.position.set(
      MathUtils.lerp(start.x, 0, eased),
      MathUtils.lerp(start.y, 0.32, eased),
      MathUtils.lerp(start.z, -2.3, eased),
    );
    look.set(0, MathUtils.lerp(0.28, 0.32, eased), MathUtils.lerp(0, -3.2, eased));
    perspective.lookAt(look);
    perspective.fov = MathUtils.lerp(mobile ? 42 : 35, 48, eased);
    perspective.updateProjectionMatrix();
  });

  return <DreiPerspectiveCamera ref={cameraRef} makeDefault position={[0, 0.48, 10.5]} fov={35} near={0.08} far={40} />;
}

function PhysicalScene({ activated, reducedMotion }: { activated: boolean; reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#efefec"]} />
      <fog attach="fog" args={["#efefec", 14, 42]} />
      <ambientLight intensity={1.25} />
      <hemisphereLight args={["#ffffff", "#aeb2b2", 1.45]} />
      <directionalLight position={[-5, 7, 7]} intensity={2.8} color="#ffffff" castShadow shadow-mapSize={[1536, 1536]} shadow-bias={-0.0004} />
      <spotLight position={[5, 5, 5]} target-position={[0, 0.3, 0]} angle={0.42} penumbra={0.92} intensity={1.35} color="#dff8ff" castShadow />
      <spotLight position={[-6, 3, -1]} target-position={[0, 0.3, 0]} angle={0.5} penumbra={0.96} intensity={0.9} color="#ffffff" />
      <mesh position={[0, 0.4, -7.2]} receiveShadow>
        <boxGeometry args={[24, 12, 0.4]} />
        <meshStandardMaterial color="#eeeeeb" metalness={0.05} roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.25, -1.7]} scale={[1.3, 0.76, 1]}>
        <circleGeometry args={[5.2, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.34} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.45, -5.8]}>
        <circleGeometry args={[6.8, 64]} />
        <meshBasicMaterial color="#7d8587" transparent opacity={0.055} depthWrite={false} />
      </mesh>
      <HeroNetworkField reducedMotion={reducedMotion} />
      <ComputerHardware activated={activated} reducedMotion={reducedMotion} />
      <HeroCamera activated={activated} reducedMotion={reducedMotion} />
    </>
  );
}

export function SpatialComputerScene({ activated, reducedMotion }: { activated: boolean; reducedMotion: boolean }) {
  const visible = usePageVisibility();
  return (
    <Canvas
      shadows
      dpr={[1, 1.45]}
      frameloop={visible && !reducedMotion ? "always" : "demand"}
      camera={{ position: [0, 0.48, 10.5], fov: 35, near: 0.08, far: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <PhysicalScene activated={activated} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}

function Signal({ to, delay = 0 }: { to: [number, number, number]; delay?: number }) {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const progress = ((state.clock.elapsedTime * 0.095 + delay) % 1 + 1) % 1;
    mesh.current.position.set(to[0] * progress, to[1] * progress, to[2] * progress);
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.045, 10, 10]} />
      <meshBasicMaterial color="#8dd7eb" />
    </mesh>
  );
}

function NetworkCamera({ active }: { active: SpatialBranch | null }) {
  const cameraRef = useRef<PerspectiveCamera>(null);
  const look = useMemo(() => new Vector3(), []);
  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!camera) return;
    const target = active ? NETWORK_POINTS[active] : ([0, 0, 0] as [number, number, number]);
    camera.position.x = MathUtils.damp(camera.position.x, active ? target[0] * 0.12 : 0, 3.6, delta);
    camera.position.y = MathUtils.damp(camera.position.y, active ? target[1] * 0.1 : 0, 3.6, delta);
    camera.position.z = MathUtils.damp(camera.position.z, active ? 7.6 : 9.4, 3.6, delta);
    look.set(active ? target[0] * 0.26 : 0, active ? target[1] * 0.22 : 0, active ? target[2] : 0);
    camera.lookAt(look);
  });
  return <DreiPerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 9.4]} fov={44} near={0.1} far={30} />;
}

function NetworkWorld({
  active,
  hovered,
  reducedMotion,
}: {
  active: SpatialBranch | null;
  hovered: SpatialBranch | null;
  reducedMotion: boolean;
}) {
  const activated = hovered ?? active;
  return (
    <>
      <color attach="background" args={["#f1f1ee"]} />
      <fog attach="fog" args={["#f1f1ee", 10, 30]} />
      <ambientLight intensity={1.35} />
      <hemisphereLight args={["#ffffff", "#b7bbbc", 1.25]} />
      <directionalLight position={[-3, 5, 6]} intensity={2.2} color="#ffffff" />
      <pointLight position={[3, 2, 4]} intensity={1.2} distance={12} color="#d9f8ff" />
      <mesh scale={2.05}>
        <sphereGeometry args={[0.92, 32, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.34} depthWrite={false} />
      </mesh>
      <Line points={[[0, 1.72, 0.22], [-1.48, -1.02, 0.22], [1.48, -1.02, 0.22], [0, 1.72, 0.22]]} color="#111516" transparent opacity={0.7} lineWidth={0.85} />
      <Line points={[[0, -1.46, -0.3], [1.24, 0.82, -0.3], [-1.24, 0.82, -0.3], [0, -1.46, -0.3]]} color="#737879" transparent opacity={0.34} lineWidth={0.55} />
      <Line points={[[-1.82, 0.16, -0.1], [-1.35, 0.16, -0.1]]} color="#111516" opacity={0.84} lineWidth={1.4} />
      <Line points={[[1.35, -0.18, -0.1], [1.82, -0.18, -0.1]]} color="#111516" opacity={0.84} lineWidth={1.4} />

      {(Object.entries(NETWORK_POINTS) as Array<[SpatialBranch, [number, number, number]]>).map(([id, point]) => {
        const selected = activated === id;
        const clicked = active === id;
        const dimmed = active && !clicked;
        const scale = id === "projects" ? 0.52 : id === "systems" ? 0.4 : 0.32;
        return (
          <group key={id}>
            <Line points={[[0, 0, 0], point]} color={selected ? "#0b0d0e" : "#4a4e4f"} transparent opacity={dimmed ? 0.08 : selected ? 0.92 : 0.3} lineWidth={selected ? 1.28 : 0.62} />
            <mesh position={point} scale={selected ? (clicked ? 1.1 : 1.065) : 1}>
              <icosahedronGeometry args={[scale, 1]} />
              <meshStandardMaterial
                color={selected ? "#343839" : "#bfc3c3"}
                emissive="#000000"
                emissiveIntensity={0}
                metalness={0.62}
                roughness={0.42}
                transparent
                opacity={dimmed ? 0.1 : 0.88}
              />
            </mesh>
          </group>
        );
      })}

      {SECONDARY_EDGES.map(([from, to]) => (
        <Line
          key={`${from}-${to}`}
          points={[SECONDARY_POINTS[from], SECONDARY_POINTS[to]]}
          color="#34393a"
          transparent
          opacity={active ? 0.05 : 0.18}
          lineWidth={0.5}
        />
      ))}
      {SECONDARY_POINTS.map((point, index) => (
        <group key={index}>
          <mesh position={point}>
            <sphereGeometry args={[index % 4 === 0 ? 0.075 : 0.045, 8, 8]} />
            <meshBasicMaterial color="#191d1e" transparent opacity={active ? 0.08 : 0.46} />
          </mesh>
        </group>
      ))}
      {!reducedMotion && <>
        <Signal to={NETWORK_POINTS.projects} />
        <Signal to={NETWORK_POINTS.skills} delay={0.38} />
        <Signal to={NETWORK_POINTS.systems} delay={0.72} />
      </>}
      <NetworkCamera active={active} />
    </>
  );
}

export function SpatialNetworkScene({
  active,
  hovered,
  reducedMotion,
}: {
  active: SpatialBranch | null;
  hovered: SpatialBranch | null;
  reducedMotion: boolean;
}) {
  const visible = usePageVisibility();
  return (
    <Canvas
      dpr={[1, 1.35]}
      frameloop={visible && !reducedMotion ? "always" : "demand"}
      camera={{ position: [0, 0, 9.4], fov: 44, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <NetworkWorld active={active} hovered={hovered} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

type AmbientPoint = {
  origin: [number, number, number];
  affinity: SpatialBranch | null;
  strength: number;
  hop: number;
  phase: number;
  speed: number;
  amplitude: number;
  drift: [number, number, number];
  anchor: boolean;
};

type AmbientEdge = {
  from: number;
  to: number;
  affinity: SpatialBranch | null;
  strength: number;
  hop: number;
};

const BRANCH_POLYGON_SIDES: Record<SpatialBranch, 3 | 4 | 5> = {
  projects: 5,
  skills: 5,
  systems: 4,
  education: 4,
  about: 3,
};

function createAmbientMesh() {
  const points: AmbientPoint[] = [];
  const forcedEdges: AmbientEdge[] = [];
  const paths = {} as Record<SpatialBranch, number[][]>;
  const polygonPoints = {} as Record<SpatialBranch, number[]>;
  const branches = (Object.entries(NETWORK_POINTS) as Array<[SpatialBranch, [number, number, number]]>)
    .filter(([branch]) => branch === "projects" || branch === "skills");

  branches.forEach(([affinity, anchor], branchIndex) => {
    const sides = BRANCH_POLYGON_SIDES[affinity];
    const radius = affinity === "projects" ? 0.82 : affinity === "skills" ? 0.74 : 0.66;
    const anchorAngle = anchor[0] < 0 ? Math.PI : 0;
    const centerX = anchor[0] - Math.cos(anchorAngle) * radius;
    const centerY = anchor[1] - Math.sin(anchorAngle) * radius * 0.72;
    const anchorIndex = points.length;
    points.push({
      origin: anchor,
      affinity,
      strength: 0.72,
      hop: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0,
      amplitude: 0,
      drift: [0, 0, 0],
      anchor: true,
    });
    const polygon = [anchorIndex];
    for (let vertex = 1; vertex < sides; vertex += 1) {
      const angle = anchorAngle + vertex * Math.PI * 2 / sides;
      const vertexIndex = points.length;
      points.push({
        origin: [
          centerX + Math.cos(angle) * radius * (0.92 + Math.random() * 0.14),
          centerY + Math.sin(angle) * radius * 0.72 * (0.92 + Math.random() * 0.14),
          anchor[2] - 0.16 + Math.random() * 0.32 + branchIndex * 0.006,
        ],
        affinity,
        strength: 0.54 + Math.random() * 0.2,
        hop: 1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.08 + Math.random() * 0.05,
        amplitude: 0.04 + Math.random() * 0.03,
        drift: [0.72, 0.62, 0.34],
        anchor: false,
      });
      polygon.push(vertexIndex);
    }
    polygon.forEach((from, index) => {
      const to = polygon[(index + 1) % polygon.length];
      forcedEdges.push({ from, to, affinity, strength: 0.74, hop: 1 });
    });
    polygonPoints[affinity] = polygon;
    paths[affinity] = [[...polygon, anchorIndex]];
  });

  const ambientStart = points.length;
  const columns = 12;
  const rows = 7;
  const minX = -6.65;
  const maxX = 6.65;
  const minY = -3.45;
  const maxY = 3.45;
  const cellWidth = (maxX - minX) / columns;
  const cellHeight = (maxY - minY) / rows;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = minX + (column + 0.5 + (Math.random() - 0.5) * 0.56) * cellWidth;
      const y = minY + (row + 0.5 + (Math.random() - 0.5) * 0.5) * cellHeight;
      const nearBranch = branches.some(([, anchor]) => Math.hypot(x - anchor[0], (y - anchor[1]) * 1.25) < 1.12);
      const nearIdentity = Math.pow(x / 1.2, 2) + Math.pow(y / 0.62, 2) < 1;
      if (nearBranch || nearIdentity) continue;
      points.push({
        origin: [x, y, -4.2 + Math.random() * 4.8],
        affinity: null,
        strength: 0.3 + Math.random() * 0.38,
        hop: 8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.11 + Math.random() * 0.09,
        amplitude: 0.08 + Math.random() * 0.06,
        drift: [0.65 + Math.random() * 0.25, 0.58 + Math.random() * 0.24, 0.25 + Math.random() * 0.3],
        anchor: false,
      });
    }
  }

  const edges: AmbientEdge[] = [...forcedEdges];
  const used = new Set<string>();
  forcedEdges.forEach(({ from, to }) => used.add(from < to ? `${from}-${to}` : `${to}-${from}`));
  points.slice(ambientStart).forEach((point, localIndex) => {
    const from = ambientStart + localIndex;
    const nearest = points.slice(ambientStart)
      .map((candidate, to) => ({
        to: ambientStart + to,
        distance: ambientStart + to === from ? Number.POSITIVE_INFINITY : Math.hypot(
          point.origin[0] - candidate.origin[0],
          point.origin[1] - candidate.origin[1],
          (point.origin[2] - candidate.origin[2]) * 0.3,
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, Math.random() > 0.64 ? 2 : 1);

    nearest.forEach(({ to, distance }) => {
      if (distance > 1.46) return;
      const key = from < to ? `${from}-${to}` : `${to}-${from}`;
      if (used.has(key)) return;
      used.add(key);
      edges.push({
        from,
        to,
        affinity: null,
        strength: Math.max(0.2, 1 - distance / 2.2),
        hop: 8,
      });
    });
  });

  branches.forEach(([affinity]) => {
    const polygon = polygonPoints[affinity];
    const outerVertex = polygon[Math.floor(polygon.length / 2)];
    const source = points[outerVertex];
    const nearestAmbient = points
      .slice(ambientStart)
      .map((candidate, index) => ({
        to: ambientStart + index,
        distance: Math.hypot(source.origin[0] - candidate.origin[0], source.origin[1] - candidate.origin[1]),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
    if (nearestAmbient && nearestAmbient.distance < 2.15) {
      edges.push({ from: outerVertex, to: nearestAmbient.to, affinity, strength: 0.44, hop: 2 });
    }
  });

  return { points, edges, paths };
}

function AnchorPulse({
  point,
  delay,
  reducedMotion,
}: {
  point: [number, number, number];
  delay: number;
  reducedMotion: boolean;
}) {
  const orbit = useRef<Group>(null);
  const pulse = useRef<Mesh>(null);
  const trail = useRef<Mesh>(null);

  useFrame((state) => {
    if (!pulse.current || !orbit.current) return;
    const time = state.clock.elapsedTime;
    const drift = reducedMotion ? [0, 0] : getAnchorDrift(time, delay);
    orbit.current.position.set(point[0] + drift[0], point[1] + drift[1], point[2]);
    if (trail.current) {
      trail.current.visible = !reducedMotion;
      const angle = time * 0.24 + delay * Math.PI * 2;
      const vx = Math.cos(angle) * 0.13;
      const vy = -Math.sin(angle) * 0.085;
      trail.current.position.set(-vx * 1.25, -vy * 1.25, -0.01);
      trail.current.rotation.z = Math.atan2(vy, vx);
      trail.current.scale.set(1, 0.28, 1);
    }
    if (reducedMotion) {
      pulse.current.scale.setScalar(1);
      const material = pulse.current.material as MeshStandardMaterial;
      material.opacity = 0.12;
      return;
    }
    const cycle = (state.clock.elapsedTime * 0.085 + delay) % 1;
    const wave = cycle < 0.2 ? Math.sin((cycle / 0.2) * Math.PI) : 0;
    pulse.current.scale.setScalar(0.92 + wave * 1.08);
    const material = pulse.current.material as MeshStandardMaterial;
    material.opacity = 0.16 + wave * 0.4;
  });

  return (
    <group ref={orbit} position={point}>
      <mesh ref={trail} renderOrder={28}>
        <circleGeometry args={[0.13, 48]} />
        <meshBasicMaterial color="#c8edf8" transparent opacity={0.16} blending={AdditiveBlending} depthWrite={false} depthTest={false} fog={false} toneMapped={false} />
      </mesh>
      <mesh renderOrder={30}>
        <circleGeometry args={[0.068, 64]} />
        <meshBasicMaterial color="#fbfeff" transparent opacity={1} depthWrite={false} depthTest={false} fog={false} toneMapped={false} />
      </mesh>
      <mesh ref={pulse} renderOrder={29}>
        <circleGeometry args={[0.11, 64]} />
        <meshBasicMaterial color="#dff7ff" transparent opacity={0.16} blending={AdditiveBlending} depthWrite={false} depthTest={false} fog={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function getAnchorDrift(time: number, delay: number): [number, number] {
  const angle = time * 0.24 + delay * Math.PI * 2;
  return [Math.sin(angle) * 0.13, Math.cos(angle) * 0.085];
}

function distanceToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Math.hypot(px - ax, py - ay);
  const t = MathUtils.clamp(((px - ax) * dx + (py - ay) * dy) / lengthSquared, 0, 1);
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function DynamicAmbientMesh({
  mesh,
  hovered,
  reducedMotion,
  cursor,
  onAnchorChange,
}: {
  mesh: ReturnType<typeof createAmbientMesh>;
  hovered: SpatialBranch | null;
  reducedMotion: boolean;
  cursor: MutableRefObject<{ x: number; y: number; active: boolean }>;
  onAnchorChange: (branch: SpatialBranch | null) => void;
}) {
  const { camera, size } = useThree();
  const pointGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(mesh.points.length * 3), 3));
    geometry.setAttribute("color", new Float32BufferAttribute(new Float32Array(mesh.points.length * 3), 3));
    return geometry;
  }, [mesh]);
  const edgeGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(mesh.edges.length * 6), 3));
    geometry.setAttribute("color", new Float32BufferAttribute(new Float32Array(mesh.edges.length * 6), 3));
    return geometry;
  }, [mesh]);
  const currentPositions = useRef(new Float32Array(mesh.points.length * 3));
  const screenPositions = useRef(new Float32Array(mesh.points.length * 2));
  const nodeInstances = useRef<InstancedMesh>(null);
  const reveal = useRef(0);
  const pointerActivity = useRef(0);
  const previousBranch = useRef<SpatialBranch | null>(null);
  const reportedBranch = useRef<SpatialBranch | null>(null);
  const projected = useMemo(() => new Vector3(), []);
  const nodeTransform = useMemo(() => new Object3D(), []);
  const idleEdgeColor = useMemo(() => new Color("#05080b"), []);

  useEffect(() => () => {
    pointGeometry.dispose();
    edgeGeometry.dispose();
  }, [pointGeometry, edgeGeometry]);

  useFrame((state, delta) => {
    if (previousBranch.current !== hovered) {
      reveal.current = 0;
      previousBranch.current = hovered;
    }
    reveal.current = MathUtils.damp(reveal.current, hovered ? 1 : 0, 2.7, delta);
    pointerActivity.current = MathUtils.damp(pointerActivity.current, cursor.current.active ? 1 : 0, 3.4, delta);
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    const cursorX = cursor.current.x * size.width;
    const cursorY = cursor.current.y * size.height;
    const radius = size.width < 760 ? 145 : 220;
    const pointPositions = pointGeometry.getAttribute("position") as Float32BufferAttribute;
    const pointColors = pointGeometry.getAttribute("color") as Float32BufferAttribute;
    let closestAnchor: SpatialBranch | null = null;
    let closestAnchorDistance = Number.POSITIVE_INFINITY;

    mesh.points.forEach((point, index) => {
      const anchorDrift = !reducedMotion && point.anchor && point.affinity
        ? getAnchorDrift(time, point.affinity === "skills" ? 0.2 : 0)
        : [0, 0];
      const globalHoverMotion = reducedMotion ? 0 : pointerActivity.current;
      const localHoverMotion = hovered && point.affinity === hovered ? reveal.current : 0;
      const hoverPhase = time * 0.86 + point.phase + point.hop * 0.38 + index * 0.045;
      const x = point.origin[0]
        + anchorDrift[0]
        + Math.sin(time * point.speed + point.phase) * point.amplitude * point.drift[0]
        + Math.sin(hoverPhase) * (0.052 * globalHoverMotion + 0.04 * localHoverMotion);
      const y = point.origin[1]
        + anchorDrift[1]
        + Math.cos(time * point.speed * 0.83 + point.phase * 1.17) * point.amplitude * point.drift[1]
        + Math.cos(hoverPhase * 0.86) * (0.038 * globalHoverMotion + 0.032 * localHoverMotion);
      const z = point.origin[2]
        + Math.sin(time * point.speed * 0.61 + point.phase * 0.74) * point.amplitude * point.drift[2]
        + Math.sin(hoverPhase * 0.64) * (0.04 * globalHoverMotion + 0.036 * localHoverMotion);
      currentPositions.current.set([x, y, z], index * 3);
      pointPositions.setXYZ(index, x, y, z);

      projected.set(x, y, z).project(camera);
      const screenX = (projected.x * 0.5 + 0.5) * size.width;
      const screenY = (1 - (projected.y * 0.5 + 0.5)) * size.height;
      screenPositions.current.set([screenX, screenY], index * 2);
      const cursorDistance = cursor.current.active
        ? Math.hypot(screenX - cursorX, screenY - cursorY)
        : Number.POSITIVE_INFINITY;
      const flashlight = 1 - MathUtils.smoothstep(cursorDistance, radius * 0.08, radius * 1.28);
      const zone = hovered ? LABEL_ZONES[hovered] : null;
      const inLabelZone = zone
        ? Math.pow((screenX / size.width - zone[0]) / zone[2], 2)
          + Math.pow((screenY / size.height - zone[1]) / zone[3], 2) < 1
        : false;
      const constellation = hovered && point.affinity === hovered
        ? reveal.current * (inLabelZone ? 0.5 : 1)
        : 0;
      const activation = Math.max(flashlight, constellation);
      const visibleActivation = point.anchor
        ? 0
        : MathUtils.smoothstep(activation, 0.018, 0.16);
      pointColors.setXYZ(index, 1, 1, 1);
      if (nodeInstances.current) {
        nodeTransform.position.set(x, y, z);
        nodeTransform.scale.setScalar(visibleActivation * 0.038);
        nodeTransform.updateMatrix();
        nodeInstances.current.setMatrixAt(index, nodeTransform.matrix);
      }

      if (point.anchor && point.affinity && cursorDistance < closestAnchorDistance) {
        closestAnchorDistance = cursorDistance;
        closestAnchor = point.affinity;
      }
    });
    pointPositions.needsUpdate = true;
    pointColors.needsUpdate = true;
    if (nodeInstances.current) {
      nodeInstances.current.instanceMatrix.needsUpdate = true;
    }

    const edgePositions = edgeGeometry.getAttribute("position") as Float32BufferAttribute;
    const edgeColors = edgeGeometry.getAttribute("color") as Float32BufferAttribute;
    mesh.edges.forEach((edge, index) => {
      const fromOffset = edge.from * 3;
      const toOffset = edge.to * 3;
      edgePositions.setXYZ(index * 2, currentPositions.current[fromOffset], currentPositions.current[fromOffset + 1], currentPositions.current[fromOffset + 2]);
      edgePositions.setXYZ(index * 2 + 1, currentPositions.current[toOffset], currentPositions.current[toOffset + 1], currentPositions.current[toOffset + 2]);
      const fromScreen = edge.from * 2;
      const toScreen = edge.to * 2;
      const cursorDistance = cursor.current.active
        ? distanceToSegment(
          cursorX,
          cursorY,
          screenPositions.current[fromScreen],
          screenPositions.current[fromScreen + 1],
          screenPositions.current[toScreen],
          screenPositions.current[toScreen + 1],
        )
        : Number.POSITIVE_INFINITY;
      const flashlight = 1 - MathUtils.smoothstep(cursorDistance, radius * 0.18, radius);
      const midpointX = (screenPositions.current[fromScreen] + screenPositions.current[toScreen]) / 2 / size.width;
      const midpointY = (screenPositions.current[fromScreen + 1] + screenPositions.current[toScreen + 1]) / 2 / size.height;
      const zone = hovered ? LABEL_ZONES[hovered] : null;
      const inLabelZone = zone
        ? Math.pow((midpointX - zone[0]) / zone[2], 2) + Math.pow((midpointY - zone[1]) / zone[3], 2) < 1
        : false;
      const localDensity = hovered && edge.affinity !== hovered && index % 4 !== 0 ? 0.13 : 1;
      const cleanFactor = inLabelZone ? 0.16 : localDensity;
      const constellation = hovered && edge.affinity === hovered
        ? reveal.current * (inLabelZone ? 0.2 : 1) * (0.68 + edge.strength * 0.22)
        : 0;
      const activation = Math.max(flashlight * cleanFactor * 0.275, constellation * 0.32);
      const value = MathUtils.clamp(activation * (0.78 + edge.strength * 0.2), 0, 1);
      const red = MathUtils.lerp(idleEdgeColor.r, 1, value);
      const green = MathUtils.lerp(idleEdgeColor.g, 1, value);
      const blue = MathUtils.lerp(idleEdgeColor.b, 1, value);
      edgeColors.setXYZ(index * 2, red, green, blue);
      edgeColors.setXYZ(index * 2 + 1, red, green, blue);
    });
    edgePositions.needsUpdate = true;
    edgeColors.needsUpdate = true;

    const discovered = cursor.current.active && closestAnchorDistance < (size.width < 760 ? 74 : 110)
      ? closestAnchor
      : null;
    if (reportedBranch.current !== discovered) {
      reportedBranch.current = discovered;
      onAnchorChange(discovered);
    }

  });

  return (
    <group>
      <lineSegments geometry={edgeGeometry} renderOrder={10}>
        <lineBasicMaterial vertexColors transparent opacity={1} depthWrite={false} toneMapped={false} fog={false} />
      </lineSegments>
      <instancedMesh ref={nodeInstances} args={[undefined, undefined, mesh.points.length]} frustumCulled={false} renderOrder={20}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.29} depthWrite={false} depthTest={false} fog={false} />
      </instancedMesh>
    </group>
  );
}

function LivingNetworkCamera() {
  const { size } = useThree();
  return (
    <DreiPerspectiveCamera
      makeDefault
      position={[0, 0, size.width / size.height < 0.72 ? 14.2 : 9.4]}
      fov={44}
      near={0.1}
      far={30}
    />
  );
}

function LivingNetworkFog() {
  const { size } = useThree();
  const mobile = size.width / size.height < 0.72;
  return <fog attach="fog" args={["#05080b", mobile ? 10 : 8, mobile ? 29 : 21]} />;
}

function LivingNetworkWorld({
  hovered,
  reducedMotion,
  cursor,
  onAnchorChange,
}: {
  hovered: SpatialBranch | null;
  reducedMotion: boolean;
  cursor: MutableRefObject<{ x: number; y: number; active: boolean }>;
  onAnchorChange: (branch: SpatialBranch | null) => void;
}) {
  const ambientMesh = useMemo(() => createAmbientMesh(), []);

  return (
    <>
      <color attach="background" args={["#05080b"]} />
      <LivingNetworkFog />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#d8e1e4", "#020304", 0.55]} />
      <directionalLight position={[-3, 5, 5]} intensity={1.7} color="#edf3f4" />
      <pointLight position={[3, 2, 4]} intensity={0.55} distance={10} color="#bcdde5" />

      <group>
        <DynamicAmbientMesh
          mesh={ambientMesh}
          hovered={hovered}
          reducedMotion={reducedMotion}
          cursor={cursor}
          onAnchorChange={onAnchorChange}
        />

        <AnchorPulse point={NETWORK_POINTS.projects} delay={0} reducedMotion={reducedMotion} />
        <AnchorPulse point={NETWORK_POINTS.skills} delay={0.2} reducedMotion={reducedMotion} />
      </group>

      <LivingNetworkCamera />
    </>
  );
}

export function LivingNetworkScene({
  enabled = true,
  hovered,
  reducedMotion,
  cursor,
  onAnchorChange,
}: {
  enabled?: boolean;
  hovered: SpatialBranch | null;
  reducedMotion: boolean;
  cursor: MutableRefObject<{ x: number; y: number; active: boolean }>;
  onAnchorChange: (branch: SpatialBranch | null) => void;
}) {
  const visible = usePageVisibility();
  return (
    <Canvas
      dpr={[1, 1.35]}
      frameloop={visible && enabled ? "always" : "demand"}
      camera={{ position: [0, 0, 9.4], fov: 44, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <LivingNetworkWorld
        hovered={hovered}
        reducedMotion={reducedMotion}
        cursor={cursor}
        onAnchorChange={onAnchorChange}
      />
    </Canvas>
  );
}
