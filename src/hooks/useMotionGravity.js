import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_GRAVITY = Object.freeze({ x: 0, y: -9.81, z: 0 });
const GRAVITY_SCALE = 14 / 9.81;

function toScreenCoordinates(x, y) {
  const angle = screen.orientation?.angle ?? window.orientation ?? 0;

  if (angle === 90) return { x: -y, y: x };
  if (angle === 270 || angle === -90) return { x: y, y: -x };
  if (Math.abs(angle) === 180) return { x: -x, y: -y };
  return { x, y };
}

export function useMotionGravity() {
  const gravity = useRef({ ...DEFAULT_GRAVITY });
  const listening = useRef(false);
  const [status, setStatus] = useState("idle");

  const handleMotion = useCallback((event) => {
    const acceleration = event.accelerationIncludingGravity;
    if (
      !acceleration ||
      !Number.isFinite(acceleration.x) ||
      !Number.isFinite(acceleration.y)
    ) {
      return;
    }

    const screenGravity = toScreenCoordinates(acceleration.x, acceleration.y);

    // accelerationIncludingGravity is the support force (opposite gravity),
    // so invert it before applying it to the 2D Rapier world.
    gravity.current.x = -screenGravity.x * GRAVITY_SCALE;
    gravity.current.y = -screenGravity.y * GRAVITY_SCALE;
    gravity.current.z = 0;
  }, []);

  const stop = useCallback(() => {
    if (listening.current) {
      window.removeEventListener("devicemotion", handleMotion);
      listening.current = false;
    }

    Object.assign(gravity.current, DEFAULT_GRAVITY);
    setStatus("idle");
  }, [handleMotion]);

  const start = useCallback(async () => {
    if (!("DeviceMotionEvent" in window)) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");

    try {
      const requestPermission = window.DeviceMotionEvent.requestPermission;

      if (typeof requestPermission === "function") {
        const permission = await requestPermission.call(
          window.DeviceMotionEvent,
        );

        if (permission !== "granted") {
          setStatus("denied");
          return;
        }
      }

      window.addEventListener("devicemotion", handleMotion);
      listening.current = true;
      setStatus("active");
    } catch (error) {
      console.error("Could not enable the motion effect", error);
      setStatus("error");
    }
  }, [handleMotion]);

  const toggle = useCallback(() => {
    if (status === "active") {
      stop();
    } else {
      void start();
    }
  }, [start, status, stop]);

  useEffect(() => stop, [stop]);

  const copy = useMemo(
    () => ({
      idle: ["Motion effect", ""],
      requesting: ["Requesting…", "Check your browser's permission prompt."],
      active: ["Motion on", "Tilt your phone left and right."],
      denied: ["Try motion again", "Motion access was not allowed."],
      unsupported: ["Motion unavailable", "This browser does not expose orientation sensors."],
      error: ["Try motion again", "Motion could not be enabled. Use HTTPS and check browser settings."],
    }),
    [],
  );

  return {
    gravity,
    status,
    toggle,
    label: copy[status][0],
    message: copy[status][1],
  };
}
