import { useThree } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export const ScreenBounds = () => {
  const { viewport } = useThree();

  const thickness = 1;
  const width = viewport.width;
  const height = viewport.height;

  return (
    <>
      {/* Floor */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[width / 2, thickness / 2, thickness / 2]}
          position={[0, -height / 2 - thickness / 2, 0]}
        />
      </RigidBody>

      {/* Ceiling */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[width / 2, thickness / 2, thickness / 2]}
          position={[0, height / 2 + thickness / 2, 0]}
        />
      </RigidBody>

      {/* Left wall */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[thickness / 2, height / 2, thickness / 2]}
          position={[-width / 2 - thickness / 2, 0, 0]}
        />
      </RigidBody>

      {/* Right wall */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[thickness / 2, height / 2, thickness / 2]}
          position={[width / 2 + thickness / 2, 0, 0]}
        />
      </RigidBody>
    </>
  );
};
