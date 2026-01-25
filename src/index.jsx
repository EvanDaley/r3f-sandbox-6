import * as THREE from "three";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Configure KTX2 IMMEDIATELY - before any other imports
const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath("https://cdn.jsdelivr.net/npm/three@0.177.0/examples/jsm/libs/basis/");

// Patch GLTFLoader constructor to always set KTX2
const OriginalGLTFLoader = GLTFLoader;
function PatchedGLTFLoader() {
  const loader = new OriginalGLTFLoader();
  loader.setKTX2Loader(ktx2Loader);
  return loader;
}
PatchedGLTFLoader.prototype = OriginalGLTFLoader.prototype;
Object.setPrototypeOf(PatchedGLTFLoader, OriginalGLTFLoader);
Object.keys(OriginalGLTFLoader).forEach(key => {
  PatchedGLTFLoader[key] = OriginalGLTFLoader[key];
});

// Replace in THREE namespace if it exists
if (THREE.GLTFLoader) {
  THREE.GLTFLoader = PatchedGLTFLoader;
}

import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas, useThree } from "@react-three/fiber";
import MovementDemo from "./modules/movement-demo/MovementDemo.jsx";
import { Leva } from "leva";
import { EcctrlJoystick } from "ecctrl";
import { Suspense, useEffect, useState } from "react";
import { Bvh, useGLTF } from "@react-three/drei";

// Clear drei's loader cache and patch it
if (useGLTF.preload && useGLTF.preload.cache) {
  useGLTF.preload.cache.clear();
}

// Component to detect WebGL support for KTX2
function KTX2Setup() {
  const { gl } = useThree();
  useEffect(() => {
    if (gl) ktx2Loader.detectSupport(gl);
  }, [gl]);
  return null;
}

const root = ReactDOM.createRoot(document.querySelector("#root"));

const EcctrlJoystickControls = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false)
  useEffect(() => {
    // Check if using a touch control device, show/hide joystick
    if (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0)) {
      setIsTouchScreen(true)
    } else {
      setIsTouchScreen(false)
    }
  }, [])
  return (
    <>
      {isTouchScreen && <EcctrlJoystick buttonNumber={5} />}
    </>
  )
}

root.render(
  <>
    <Leva collapsed />
    <EcctrlJoystickControls />
    <Canvas
      shadows
      camera={{
        fov: 65,
        near: 0.1,
        far: 1000,
      }}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse') {
          e.target.requestPointerLock()
        }
      }}
    >
      <KTX2Setup />
      <Suspense fallback={null}>
        <Bvh firstHitOnly>
          <MovementDemo />
        </Bvh>
      </Suspense>
    </Canvas>
  </>
);
