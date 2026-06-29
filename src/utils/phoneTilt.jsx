import { useEffect, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
export function usePhoneTiltGravity(strength = 12) {
  const gravity = useRef([0, -9.81, 0]);
  const neutral = useRef(null);

  const [supported, setSupported] = useState(
    window && "DeviceOrientationEvent" in window,
  );
  const [enabled, setEnabled] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  async function requestPermission() {
    setPermissionDenied(false);

    if (!supported) return;

    const DeviceOrientation = DeviceOrientationEvent;

    if (typeof DeviceOrientation.requestPermission === "function") {
      const result = await DeviceOrientation.requestPermission();

      if (result !== "granted") {
        setPermissionDenied(true);
        return;
      }
    }

    neutral.current = null;
    setEnabled(true);
  }

  function recalibrate() {
    neutral.current = null;
  }

  useEffect(() => {
    if (!enabled) return;

    function handleOrientation(event) {
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      if (!neutral.current) {
        neutral.current = { beta, gamma };
      }

      const betaDelta = beta - neutral.current.beta;
      const gammaDelta = gamma - neutral.current.gamma;

      // Default portrait mapping:
      // gamma = left/right tilt
      // beta = forward/back tilt
      let tiltX = gammaDelta;
      let tiltY = -betaDelta;

      const orientation =
        window.screen.orientation?.angle ??
        // legacy iOS fallback
        window.orientation ??
        0;

      // Adjust axes for landscape/upside-down.
      if (orientation === 90) {
        tiltX = betaDelta;
        tiltY = gammaDelta;
      } else if (orientation === -90 || orientation === 270) {
        tiltX = -betaDelta;
        tiltY = -gammaDelta;
      } else if (orientation === 180) {
        tiltX = -gammaDelta;
        tiltY = betaDelta;
      }

      const maxTilt = 35;

      const normalisedX = clamp(tiltX / maxTilt, -1, 1);
      const normalisedY = clamp(tiltY / maxTilt, -1, 1);

      const targetX = normalisedX * strength;
      const targetY = normalisedY * strength;

      const smoothing = 0.12;

      gravity.current = [
        gravity.current[0] + (targetX - gravity.current[0]) * smoothing,
        gravity.current[1] + (targetY - gravity.current[1]) * smoothing,
        0,
      ];
    }

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [enabled, strength]);

  return {
    gravity,
    supported,
    enabled,
    permissionDenied,
    requestPermission,
    recalibrate,
  };
}
