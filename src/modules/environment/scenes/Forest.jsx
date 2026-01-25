import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect } from "react";
// import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Forest(props) {
  const basePath = window.location.href + "/models/forest1/";
  const { scene } = useGLTF(basePath + "forest1.glb");
  // const videoRef = useRef(null);
  // const videoTextureRef = useRef(null);

  const clonedScene = useMemo(() => {
    return scene ? scene.clone() : null;
  }, [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    // Create video element
    // const video = document.createElement("video");
    // video.src = window.location.href + "video/midjourney/monkey.mp4";
    // video.loop = true;
    // video.muted = true;
    // video.playsInline = true;
    // video.crossOrigin = "anonymous";
    // video.play();
    // videoRef.current = video;

    // Create video texture
    // const videoTexture = new THREE.VideoTexture(video);
    // videoTexture.flipY = false;
    // videoTextureRef.current = videoTexture;

    // Find TV object and apply video to Video material
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Handle shadow settings
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.receiveShadow = true;
          child.castShadow = true;
        }

        // Check if this is the TV object
        // if (child.name === "TV" || child.parent?.name === "TV") {
        //   // Handle both single material and material array
        //   const materials = Array.isArray(child.material)
        //     ? child.material
        //     : [child.material];

        //   materials.forEach((material) => {
        //     if (material && material.name === "Video") {
        //       material.map = videoTexture;
        //       material.emissiveMap = videoTexture;
        //       material.emissive = new THREE.Color(0xffffff);
        //       material.emissiveIntensity = .80;
        //       material.roughness = 0.0; // Low roughness for glossy screen
        //       material.metalness = 0.0; // Screens aren't metallic
        //       material.needsUpdate = true;
        //     }
        //   });
        // }
      }
    });

    // return () => {
    //   // Cleanup
    //   if (videoTextureRef.current) {
    //     videoTextureRef.current.dispose();
    //   }
    //   if (videoRef.current) {
    //     videoRef.current.pause();
    //     videoRef.current.src = "";
    //   }
    // };
  }, [clonedScene]);

  // Update video texture each frame
  // useFrame(() => {
  //   if (videoTextureRef.current && videoRef.current) {
  //     videoTextureRef.current.needsUpdate = true;
  //   }
  // });

  if (!clonedScene) return null;

  return (
    <RigidBody type="fixed" colliders="trimesh" {...props}>
      <primitive object={clonedScene} />
    </RigidBody>
  );
}
