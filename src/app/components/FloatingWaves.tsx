"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WavePlane({
  position,
  rotation,
  color,
  speed,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3.2, 2, 32, 24);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 1.5) * 0.2 + Math.cos(y * 1.2) * 0.15);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.15;
    meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.03;
    meshRef.current.rotation.y = rotation[1] + Math.cos(t * 0.4) * 0.04;

    if (materialRef.current) {
      materialRef.current.opacity = 0.55 + Math.sin(t * 0.7) * 0.15;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      geometry={geometry}
    >
      <meshPhysicalMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.6}
        transmission={0.4}
        roughness={0.25}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FloatingFrame({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.08;
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.2) * 0.02;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <torusGeometry args={[2.3, 0.035, 16, 64]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#a855f7"
        emissiveIntensity={0.25}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function Particles() {
  const count = 80;
  const points = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#ff7a5c"),
      new THREE.Color("#a855f7"),
      new THREE.Color("#ec4899"),
      new THREE.Color("#3b82f6"),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.getElapsedTime() * 0.05;
    points.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -2, -5]} intensity={1} color="#ec4899" />
      <pointLight position={[5, -3, 2]} intensity={0.8} color="#3b82f6" />

      <FloatingFrame position={[0, 0.8, 0]} rotation={[0.3, 0.2, 0.1]} />
      <WavePlane
        position={[0, 0.35, 0]}
        rotation={[0.25, 0.15, 0]}
        color="#ff7a5c"
        speed={0.7}
      />
      <WavePlane
        position={[0, 0, 0.2]}
        rotation={[0.3, -0.1, 0]}
        color="#a855f7"
        speed={0.9}
      />
      <WavePlane
        position={[0, -0.35, 0.4]}
        rotation={[0.35, 0.05, 0]}
        color="#3b82f6"
        speed={0.6}
      />
      <FloatingFrame position={[0, -0.9, 0.2]} rotation={[0.4, -0.2, -0.1]} />

      <Particles />
    </>
  );
}

export default function FloatingWaves() {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
