import { useRef } from "react";
import { Float, Grid } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";

function BouncyCube() {
  const body = useRef();

  function bounce(event) {
    event.stopPropagation();
    body.current?.applyImpulse({ x: 0, y: 5, z: 0 }, true);
    body.current?.applyTorqueImpulse({ x: 0.5, y: 0.8, z: 0.2 }, true);
  }

  return (
    <RigidBody
      ref={body}
      position={[0, 3, 0]}
      restitution={0.65}
      friction={0.7}
      colliders="cuboid"
    >
      <mesh castShadow onClick={bounce}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial color="#ff7a59" roughness={0.35} />
      </mesh>
    </RigidBody>
  );
}

function Ground() {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -0.15, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[16, 0.3, 16]} />
        <meshStandardMaterial color="#151a22" roughness={0.9} />
      </mesh>
    </RigidBody>
  );
}

export function Scene() {
  return (
    <>
      <color attach="background" args={["#0a0d12"]} />
      <fog attach="fog" args={["#0a0d12", 11, 24]} />

      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[5, 8, 4]}
        intensity={2.5}
        shadow-mapSize={[2048, 2048]}
      />

      <Physics gravity={[0, -9.81, 0]}>
        <BouncyCube />
        <Ground />
      </Physics>

      <Float speed={2} rotationIntensity={0.25} floatIntensity={0.4}>
        <mesh position={[-3, 2.2, -2]} castShadow>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial
            color="#59d9c2"
            roughness={0.25}
            metalness={0.1}
          />
        </mesh>
      </Float>

      <Grid
        position={[0, 0.01, 0]}
        args={[16, 16]}
        cellColor="#27303d"
        sectionColor="#506176"
        fadeDistance={16}
        infiniteGrid
      />
    </>
  );
}
