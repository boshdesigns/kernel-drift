import { ScreenBounds } from "../components/screenbounds";
import { Physics } from "@react-three/rapier";
import Objects from "../components/instancedRigidBodies";
import { TiltGravityController } from "../utils/rapierGravity";

export const Scene = ({ pointerActive, motionGravity, motionEnabled }) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[5, 8, 4]}
        intensity={2.5}
        shadow-mapSize={[2048, 2048]}
      />
      <Physics gravity={[0, -9.81, 0]} debug={false}>
        <ScreenBounds />
        <Objects pointerActive={pointerActive} />
        <TiltGravityController
          gravity={motionGravity}
          enabled={motionEnabled}
        />
      </Physics>
    </>
  );
};
