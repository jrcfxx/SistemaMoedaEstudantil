import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { Group } from 'three';

function Model() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF('/model.glb');

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.8} position={[0, -1, 0]} />
    </group>
  );
}

function Fallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

export default function ModelViewer() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#818cf8" />
        <pointLight position={[0, 3, 0]} intensity={0.8} color="#fbbf24" />

        <Suspense fallback={<Fallback />}>
          <Model />
          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.35}
            scale={8}
            blur={2}
            far={4}
            color="#1e1b4b"
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/model.glb');
