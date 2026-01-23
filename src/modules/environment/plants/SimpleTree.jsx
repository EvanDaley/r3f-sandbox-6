import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

export default function SimpleTree(props) {
  const basePath = window.location.href + "/models/";
  const { scene } = useGLTF(basePath + "tree.glb");

  const clonedScene = useMemo(() => {
    return scene ? scene.clone() : null;
  }, [scene]);

  if (!clonedScene) return null;

  return <primitive object={clonedScene} {...props} />;
}
