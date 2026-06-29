import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader, OrthographicCamera } from "@react-three/drei";
import { Scene } from "./scene/mySence.jsx";

export default function App() {
  const pointerActive = useRef(false);
  const hiddenRef = useRef(null);

  useEffect(() => {
    async function getOrientation() {
      if (
        !window.DeviceOrientationEvent ||
        !window.DeviceOrientationEvent.requestPermission
      ) {
        console.log(
          "Your current device does not have access to the DeviceOrientation event",
        );
        return;
      }

      const permission =
        await window.DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") {
        console.log(
          "You must grant access to the device's sensor for this demo",
        );
        return;
      }
    }

    void getOrientation();

    window.addEventListener("deviceorientation", function (e) {
      console.log("deviceorientation:", `${e.alpha} : ${e.beta} : ${e.gamma}`);

      // let requestBtn = document.querySelector("#get-orientation");
      // if (requestBtn) {
      //   requestBtn.remove();
      // }

      // document.getElementById("alpha").innerHTML = e?.alpha?.toFixed(1) + "°"; //angle of motion around the Z axis
      // document.getElementById("beta").innerHTML = e?.beta?.toFixed(1) + "°"; //angle of motion around the X axis
      // document.getElementById("gamma").innerHTML = e?.gamma?.toFixed(1) + "°"; //angle of motion around the Y axis
      // document.getElementById("orientation").innerHTML =
      //   Math.abs(e?.beta) > Math.abs(e?.gamma) ? "portrait" : "landscape";
    });

    setTimeout(() => {
      if (hiddenRef.current) {
        hiddenRef.current.classList.add("hidden-active");
      }
    }, 1000);
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
          <Scene pointerActive={pointerActive} />
        </Suspense>
      </Canvas>

      <Loader />
    </main>
  );
}
