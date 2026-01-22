import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import * as THREE from "three";

export default function RoughPlane() {
  const { scene } = useGLTF("/models/examples/roughPlane.glb");
  
  // Clone the scene and use static materials
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    
    const cloned = scene.clone();
    const staticMaterial = new THREE.MeshStandardMaterial({ color: "#8a8a8a" });
    
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Use static material instead of original materials
        // if (child.material) {
        //   const materials = Array.isArray(child.material) ? child.material : [child.material];
        //   child.material = materials.map((mat) => {
        //     // If material doesn't have onBuild, convert to MeshStandardMaterial
        //     if (mat && typeof mat.onBuild !== 'function') {
        //       const standardMat = new THREE.MeshStandardMaterial();
        //       if (mat.color) standardMat.color.copy(mat.color);
        //       if (mat.map) standardMat.map = mat.map;
        //       if (mat.normalMap) standardMat.normalMap = mat.normalMap;
        //       if (mat.roughness !== undefined) standardMat.roughness = mat.roughness;
        //       if (mat.metalness !== undefined) standardMat.metalness = mat.metalness;
        //       standardMat.transparent = mat.transparent || false;
        //       standardMat.opacity = mat.opacity !== undefined ? mat.opacity : 1;
        //       return standardMat;
        //     }
        //     return mat.clone();
        //   });
        //   
        //   if (Array.isArray(child.material) && child.material.length === 1) {
        //     child.material = child.material[0];
        //   }
        // }
        child.material = staticMaterial;
      }
    });
    return cloned;
  }, [scene]);

  if (!clonedScene) return null;

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={clonedScene} />
    </RigidBody>
  );
}

useGLTF.preload("/models/examples/roughPlane.glb");
