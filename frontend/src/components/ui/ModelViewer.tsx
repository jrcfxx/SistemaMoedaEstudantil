import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei';
import type { Group } from 'three';

function Model() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF('/model.glb');

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} scale={1.1} />
      </Center>
    </group>
  );
}

export default function ModelViewer() {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 7], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 6, 6]} intensity={1.4} castShadow />
      <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#818cf8" />
      <pointLight position={[0, 2, 2]} intensity={1} color="#fbbf24" />

      <Suspense fallback={null}>
        <Model />
        <ContactShadows
          position={[0, -0.75, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={3}
          color="#1e1b4b"
        />
        <Environment preset="city" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}

useGLTF.preload('/model.glb');
