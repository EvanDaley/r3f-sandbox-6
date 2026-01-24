import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect } from "react";
import * as THREE from "three";

export default function Forest(props) {
  const basePath = window.location.href + "/models/forest1/";
  const { scene } = useGLTF(basePath + "forest1.glb");

  const clonedScene = useMemo(() => {
    return scene ? scene.clone() : null;
  }, [scene]);

  useEffect(() => {
    if (!clonedScene) return;
    // Receive Shadows
    clonedScene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
  }, [clonedScene]);

  if (!clonedScene) return null;

  return (
    <RigidBody type="fixed" colliders="trimesh" {...props}>
      <primitive object={clonedScene} />
    </RigidBody>
  );
}
