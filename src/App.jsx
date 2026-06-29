import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader, OrthographicCamera } from "@react-three/drei";
import { Scene } from "./scene/mySence.jsx";
import { useMotionGravity } from "./hooks/useMotionGravity.js";
import { isDesktop } from "./utils/deviceDetection";

export default function App() {
  const pointerActive = useRef(false);
  const hiddenRef = useRef(null);
  const motion = useMotionGravity();

  console.log("isDesktop()", isDesktop());

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (hiddenRef.current) {
        hiddenRef.current.classList.add("hidden-active");
      }
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="app">
      <header className="hidden" id="hidden" ref={hiddenRef}>
        <p className="eyebrow">HELLO</p>
      </header>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        onPointerDown={() => {
          pointerActive.current = true;
        }}
        onPointerUp={() => {
          pointerActive.current = false;
        }}
        onPointerLeave={() => {
          pointerActive.current = false;
        }}
      >
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={80} />
        <Suspense fallback={null}>
          <Scene
            pointerActive={pointerActive}
            motionGravity={motion.gravity}
            motionEnabled={motion.status === "active"}
          />
        </Suspense>
      </Canvas>

      {isDesktop() !== "desktop" && (
        <div className="motion-control">
          <button
            className="motion-button"
            type="button"
            onClick={motion.toggle}
            disabled={motion.status === "requesting"}
            aria-pressed={motion.status === "active"}
          >
            {motion.label}
          </button>
          {motion.message && (
            <p className="motion-message" role="status">
              {motion.message}
            </p>
          )}
        </div>
      )}

      <Loader />
    </main>
  );
}
