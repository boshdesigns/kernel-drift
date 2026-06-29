import { useEffect, useRef, useState } from "react";

export function useDeviceTiltGravity(strength = 12) {
  const gravity = useRef([0, -9.81, 0]);

  const neutral = useRef(null);

  const [supported, setSupported] = useState(
    window && "DeviceOrientationEvent" in window,
  );
  const [enabled, setEnabled] = useState(false);

  async function requestPermission() {
    if (!supported) return;

    const DeviceOrientation = DeviceOrientationEvent;

    if (typeof DeviceOrientation.requestPermission === "function") {
      const result = await DeviceOrientation.requestPermission();

      if (result !== "granted") return;
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

      const maxTilt = 35;

      const x = Math.max(-1, Math.min(1, gammaDelta / maxTilt));
      const y = Math.max(-1, Math.min(1, betaDelta / maxTilt));

      const targetX = x * strength;
      const targetY = -y * strength;

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
    supported,
    enabled,
    gravity,
    requestPermission,
    recalibrate,
  };
}
