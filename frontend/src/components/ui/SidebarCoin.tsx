import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center } from '@react-three/drei';
import type { Group } from 'three';

function CoinModel() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF('/model.glb');

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.55;
    }
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} scale={1.3} />
      </Center>
    </group>
  );
}

export function SidebarCoin() {
  return (
    <div className="w-full" style={{ height: 200 }}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.6} />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#818cf8" />
        <pointLight position={[0, 2, 2]} intensity={1.2} color="#fbbf24" />

        <Suspense fallback={null}>
          <CoinModel />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
