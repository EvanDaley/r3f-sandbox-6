import {
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useGame } from "ecctrl";
import { BallCollider } from "@react-three/rapier";

export default function CharacterModel(props) {
  const group = useRef();
  const { nodes, animations } = useGLTF("/models/examples/FloatingCharacter.glb");
  const { actions } = useAnimations(animations, group);

  /**
   * Prepare hands ref for attack action
   */
  const rightHandRef = useRef();
  const rightHandColliderRef = useRef();
  const leftHandRef = useRef();
  const leftHandColliderRef = useRef();
  const rightHandPos = useMemo(() => new THREE.Vector3(), []);
  const leftHandPos = useMemo(() => new THREE.Vector3(), []);
  const bodyPos = useMemo(() => new THREE.Vector3(), []);
  const bodyRot = useMemo(() => new THREE.Quaternion(), []);
  let rightHand = null;
  let leftHand = null;
  let mugModel = null;

  /**
   * Character animations setup
   */
  const curAnimation = useGame((state) => state.curAnimation);
  const resetAnimation = useGame((state) => state.reset);
  const initializeAnimationSet = useGame(
    (state) => state.initializeAnimationSet
  );

  // Rename your character animations here
  const animationSet = {
    idle: "Idle",
    walk: "Walk",
    run: "Run",
    jump: "Jump_Start",
    jumpIdle: "Jump_Idle",
    jumpLand: "Jump_Land",
    fall: "Climbing", // This is for falling from high sky
    action1: "Wave",
    action2: "Dance",
    action3: "Cheer",
    action4: "Attack(1h)",
  };

  useEffect(() => {
    // Initialize animation set
    initializeAnimationSet(animationSet);
  }, []);

  useEffect(() => {
    if (group.current) {
      group.current.traverse((obj) => {
        // Prepare both hands bone object
        if (obj instanceof THREE.Bone) {
          if (obj.name === "handSlotRight") rightHand = obj;
          if (obj.name === "handSlotLeft") leftHand = obj;
        }
        // Prepare mug model for cheer action
        if (obj.name === "mug") {
          mugModel = obj;
          if (mugModel) mugModel.visible = false;
        }
      });
    }
  });

  useEffect(() => {
    // Play animation
    const action = actions[curAnimation ? curAnimation : animationSet.jumpIdle];
    if (!action) return;

    // For jump and jump land animation, only play once and clamp when finish
    if (
      curAnimation === animationSet.jump ||
      curAnimation === animationSet.jumpLand ||
      curAnimation === animationSet.action1 ||
      curAnimation === animationSet.action2 ||
      curAnimation === animationSet.action3 ||
      curAnimation === animationSet.action4
    ) {
      action
        .reset()
        .fadeIn(0.2)
        .setLoop(THREE.LoopOnce, undefined)
        .play();
      action.clampWhenFinished = true;
      // Only show mug during cheer action
      if (curAnimation === animationSet.action3 && mugModel) {
        mugModel.visible = true;
      } else if (mugModel) {
        mugModel.visible = false;
      }
    } else {
      action.reset().fadeIn(0.2).play();
      if (mugModel) mugModel.visible = false;
    }

    // When any action is clamp and finished reset animation
    action._mixer.addEventListener("finished", () => resetAnimation());

    return () => {
      // Fade out previous action
      action.fadeOut(0.2);

      // Clean up mixer listener
      action._mixer.removeEventListener("finished", () =>
        resetAnimation()
      );
      if (action._mixer._listeners) {
        action._mixer._listeners = [];
      }
    };
  }, [curAnimation, actions, animationSet, resetAnimation]);

  return (
    <Suspense fallback={null}>
      {/* Head collider */}
      <BallCollider args={[0.5]} position={[0, 0.45, 0]} />
      
      {/* Right hand collider */}
      <group ref={rightHandRef} />
      <BallCollider args={[0.1]} ref={rightHandColliderRef} />

      {/* Left hand collider */}
      <group ref={leftHandRef} />
      <BallCollider args={[0.1]} ref={leftHandColliderRef} />
      
      {/* Character model */}
      <group ref={group} {...props} dispose={null}>
        {nodes.Scene ? (
          <primitive object={nodes.Scene} />
        ) : (
          Object.keys(nodes).map((key) => {
            const node = nodes[key];
            if (node && (node.type === "SkinnedMesh" || node.type === "Mesh" || node.isGroup)) {
              return <primitive key={key} object={node} />;
            }
            return null;
          }).filter(Boolean)
        )}
      </group>
    </Suspense>
  );
}

// Preload the character model
useGLTF.preload("/models/examples/Floating Character.glb");
