"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Group, Vector3 } from "three";

const MODEL_URL = "/models/carl-wing-hero.glb";

function LauncherObject({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<Group>(null);
  const normalized = useMemo(() => {
    const bounds = new Box3().setFromObject(scene);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    return {
      center,
      scale: 2.25 / Math.max(size.x, size.y, size.z, 0.001),
    };
  }, [scene]);

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y -= delta * 0.105;
  });

  return (
    <group ref={group} scale={normalized.scale} position={[0, -0.42, 0]} rotation={[0.02, -0.2, 0]}>
      <primitive
        object={scene}
        position={[-normalized.center.x, -normalized.center.y, -normalized.center.z]}
      />
    </group>
  );
}

export function CarlLauncherModel({ reducedMotion }: { reducedMotion: boolean }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      aria-label="Slowly rotating three-dimensional Carl Shi identity model"
      camera={{ position: [0, 0.05, 4.8], fov: 31, near: 0.1, far: 30 }}
      dpr={[1, 1.5]}
      frameloop={visible && !reducedMotion ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.05} />
      <hemisphereLight args={["#f8fbff", "#111821", 1.35]} />
      <directionalLight position={[3, 5, 5]} intensity={4.2} color="#ffffff" />
      <directionalLight position={[-4, 1, 2]} intensity={2.1} color="#b9dbed" />
      <Suspense fallback={null}>
        <LauncherObject reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
