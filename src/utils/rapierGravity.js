import { useRef } from "react";
import { useBeforePhysicsStep } from "@react-three/rapier";

const DEFAULT_GRAVITY = { x: 0, y: -9.81, z: 0 };

export function TiltGravityController({ gravity, enabled }) {
  const smoothed = useRef({ ...DEFAULT_GRAVITY });

  useBeforePhysicsStep((world) => {
    const target = enabled ? gravity.current : DEFAULT_GRAVITY;

    smoothed.current.x += (target.x - smoothed.current.x) * 0.12;
    smoothed.current.y += (target.y - smoothed.current.y) * 0.12;
    smoothed.current.z = 0;

    world.gravity = smoothed.current;
  });

  return null;
}
