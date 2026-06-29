import { useFrame } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";

export function TiltGravityController({ gravity, enabled }) {
  const { world } = useRapier();

  useFrame(() => {
    if (!enabled) return;

    const [x, y, z] = gravity.current;

    console.log("gravity", [x, y, z]);

    world.gravity = {
      x,
      y,
      z,
    };
  });

  return null;
}
