import { RigidBody } from "@react-three/rapier";

export default function Steps() {
  // Small steps for testing
  const steps = [
    { position: [5, 0.5, 0], size: [2, 1, 2], color: "#ff6b35" },
    { position: [-5, 0.5, 5], size: [2, 1, 2], color: "#4ecdc4" },
    { position: [0, 0.5, -5], size: [3, 1, 3], color: "#95e1d3" },
    { position: [8, 1, -8], size: [2, 2, 2], color: "#f38181" },
    { position: [-8, 1.5, -8], size: [1.5, 3, 1.5], color: "#a8e6cf" },
  ];

  return (
    <>
      {steps.map((step, index) => (
        <RigidBody key={index} type="fixed" colliders="cuboid">
          <mesh position={step.position} castShadow receiveShadow>
            <boxGeometry args={step.size} />
            <meshStandardMaterial color={step.color} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
