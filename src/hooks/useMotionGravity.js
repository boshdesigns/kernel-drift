import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_GRAVITY = Object.freeze({ x: 0, y: -9.81, z: 0 });
const SIDEWAYS_GRAVITY = 14;

function shortestAngle(from, to) {
  return ((to - from + 540) % 360) - 180;
}

function getScreenRoll(event) {
  const angle = screen.orientation?.angle ?? window.orientation ?? 0;

  if (angle === 90) return event.beta;
  if (angle === 270 || angle === -90) return -event.beta;
  if (Math.abs(angle) === 180) return -event.gamma;
  return event.gamma;
}

export function useMotionGravity() {
  const gravity = useRef({ ...DEFAULT_GRAVITY });
  const neutralRoll = useRef(null);
  const listening = useRef(false);
  const [status, setStatus] = useState("idle");

  const handleOrientation = useCallback((event) => {
    const roll = getScreenRoll(event);
    if (!Number.isFinite(roll)) return;

    if (neutralRoll.current === null) neutralRoll.current = roll;

    const tilt = shortestAngle(neutralRoll.current, roll);
    const radians = (tilt * Math.PI) / 180;

    gravity.current.x = Math.sin(radians) * SIDEWAYS_GRAVITY;
    gravity.current.y = DEFAULT_GRAVITY.y * Math.cos(radians);
    gravity.current.z = 0;
  }, []);

  const stop = useCallback(() => {
    if (listening.current) {
      window.removeEventListener("deviceorientation", handleOrientation);
      listening.current = false;
    }

    neutralRoll.current = null;
    Object.assign(gravity.current, DEFAULT_GRAVITY);
    setStatus("idle");
  }, [handleOrientation]);

  const start = useCallback(async () => {
    if (!("DeviceOrientationEvent" in window)) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");

    try {
      const requestPermission = window.DeviceOrientationEvent.requestPermission;

      if (typeof requestPermission === "function") {
        const permission = await requestPermission.call(
          window.DeviceOrientationEvent,
        );

        if (permission !== "granted") {
          setStatus("denied");
          return;
        }
      }

      neutralRoll.current = null;
      window.addEventListener("deviceorientation", handleOrientation);
      listening.current = true;
      setStatus("active");
    } catch (error) {
      console.error("Could not enable the motion effect", error);
      setStatus("error");
    }
  }, [handleOrientation]);

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
