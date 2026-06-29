import {
  InstancedRigidBodies,
  RapierRigidBody,
  BallCollider,
} from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

useGLTF.preload("./assets/models/popcorn/popcorn.glb");

export default function Objects({ pointerActive }) {
  const { viewport } = useThree();

  const count = window.innerWidth < 768 ? 100 : 300;

  const gltf = useGLTF("./assets/models/popcorn/popcorn.glb");

  const mesh = gltf.scene.getObjectByProperty("type", "Mesh");

  const geometry = useMemo(() => {
    const cloned = mesh.geometry.clone();

    cloned.computeBoundingBox();

    const box = cloned.boundingBox;
    if (!box) return cloned;

    const center = new THREE.Vector3();
    box.getCenter(center);

    cloned.translate(-center.x, -center.y, -center.z);

    cloned.computeBoundingBox();
    cloned.computeBoundingSphere();

    return cloned;
  }, [mesh.geometry]);

  const material = useMemo(() => {
    const mat = mesh.material.clone();

    mat.color.set("#FFF0A4");
    mat.roughness = 0.85;
    mat.metalness = 0;

    return mat;
  }, [mesh.material]);

  const rigidBodies = useRef([]);

  const modelScale = 3;
  const colliderRadius = 0.035 * modelScale;

  const instances = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      key: `instance-${i}`,
      position: [
        THREE.MathUtils.randFloatSpread(viewport.width * 0.8),
        THREE.MathUtils.randFloatSpread(viewport.height * 0.8),
        0,
      ],
      rotation: [
        THREE.MathUtils.randFloatSpread(Math.PI),
        THREE.MathUtils.randFloatSpread(Math.PI),
        Math.random() * Math.PI,
      ],
      scale: [modelScale, modelScale, modelScale],
    }));
  }, [viewport.width, viewport.height]);

  return (
    <>
      <InstancedRigidBodies
        ref={rigidBodies}
        instances={instances}
        colliders={false}
        colliderNodes={[<BallCollider key="ball" args={[colliderRadius]} />]}
        restitution={0.6}
        friction={0.3}
        linearDamping={1.2}
        angularDamping={0.8}
        enabledTranslations={[true, true, false]}
        enabledRotations={[false, false, true]}
      >
        <instancedMesh args={[geometry, material, count]} receiveShadow />
      </InstancedRigidBodies>

      <PointerRepulsor
        bodies={rigidBodies}
        active={pointerActive}
        radius={3}
        strength={30}
      />
    </>
  );
}

const PointerRepulsor = ({ bodies, active, radius = 2, strength = 60 }) => {
  const { camera, pointer } = useThree();

  const pointerWorld = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!active.current) return;

    pointerWorld.current.set(pointer.x, pointer.y, 0);
    pointerWorld.current.unproject(camera);
    pointerWorld.current.z = 0;

    for (const body of bodies.current) {
      if (!body) continue;

      const pos = body.translation();

      const dx = pos.x - pointerWorld.current.x;
      const dy = pos.y - pointerWorld.current.y;

      const distSq = dx * dx + dy * dy;
      const radiusSq = radius * radius;

      if (distSq <= 0.0001 || distSq > radiusSq) continue;

      const dist = Math.sqrt(distSq);
      const falloff = 1 - dist / radius;

      const nx = dx / dist;
      const ny = dy / dist;

      const impulse = strength * falloff * delta;

      body.applyImpulse(
        {
          x: nx * impulse,
          y: ny * impulse,
          z: 0,
        },
        true,
      );
    }
  });

  return null;
};
