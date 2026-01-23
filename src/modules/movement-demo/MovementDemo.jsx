import { Grid, KeyboardControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Ecctrl from "ecctrl";
import Floor from "./Floor.jsx";
import Lights from "./Lights.jsx";
import Steps from "./Steps.jsx";
import Slopes from "./Slopes.jsx";
import RoughPlane from "./RoughPlane.jsx";
import RigidObjects from "./RigidObjects.jsx";
import FloatingPlatform from "./FloatingPlatform.jsx";
import DynamicPlatforms from "./DynamicPlatforms.jsx";
import ShotCube from "./ShotCube.jsx";
import { useControls } from "leva";
import CharacterModel from "./CharacterModel.jsx";
import SimpleTree from "../environment/plants/SimpleTree.jsx";
import EffectsV2 from "./EffectsV2.jsx";
import React, { useEffect, useState } from "react";

export default function MovementDemo() {
  /**
   * Delay physics activate
   */
  const [pausedPhysics, setPausedPhysics] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPausedPhysics(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  /**
   * Debug settings
   */
  const { physics, disableControl, disableFollowCam } = useControls("World Settings", {
    physics: false,
    disableControl: false,
    disableFollowCam: false,
  });

  /**
   * Keyboard control preset
   */
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    { name: "action1", keys: ["1"] },
    { name: "action2", keys: ["2"] },
    { name: "action3", keys: ["3"] },
    { name: "action4", keys: ["KeyF"] },
  ];

  return (
    <>
      <Perf position="top-left" minimal />

      <Grid
        args={[300, 300]}
        sectionColor={"lightgray"}
        cellColor={"gray"}
        position={[0, -0.99, 0]}
        userData={{ camExcludeCollision: true }} // this won't be collide by camera ray
      />

      <Lights />

      <Physics debug={physics} timeStep="vary" paused={pausedPhysics}>
        {/* Keyboard preset */}
        <KeyboardControls map={keyboardMap}>
          {/* Character Control */}
          <Ecctrl
            debug
            animated
            followLight
            springK={2}
            dampingC={0.2}
            autoBalanceSpringK={1.2}
            autoBalanceDampingC={0.04}
            autoBalanceSpringOnY={0.7}
            autoBalanceDampingOnY={0.05}
            disableControl={disableControl}
            disableFollowCam={disableFollowCam}
          >
            {/* Replace your model here */}
            <CharacterModel />
          </Ecctrl>
        </KeyboardControls>

        {/* Rough plan */}
        <RoughPlane />

        {/* Slopes and stairs */}
        <Slopes />

        {/* Small steps */}
        <Steps />

        {/* Rigid body objects */}
        <RigidObjects />

        {/* Floating platform */}
        <FloatingPlatform />

        {/* Dynamic platforms */}
        <DynamicPlatforms />

        {/* Floor */}
        <Floor />

        {/* Shoting cubes */}
        <ShotCube />

        {/* Trees */}
        <SimpleTree position={[10, 0, 10]} scale={0.9} />
        <SimpleTree position={[-10, 0, 10]} scale={1.1} />
        <SimpleTree position={[10, 0, -10]} scale={0.8} />
        <SimpleTree position={[-10, 0, -10]} scale={1.2} />
        <SimpleTree position={[15, 0, 5]} scale={0.7} />
        <SimpleTree position={[-15, 0, -5]} scale={1.0} />
        <SimpleTree position={[5, 0, 15]} scale={1.3} />
        <SimpleTree position={[-5, 0, -15]} scale={0.9} />
        <SimpleTree position={[20, 0, 8]} scale={1.1} />
        <SimpleTree position={[-20, 0, 8]} scale={0.8} />
        <SimpleTree position={[20, 0, -8]} scale={1.0} />
        <SimpleTree position={[-20, 0, -8]} scale={1.2} />
        <SimpleTree position={[8, 0, 20]} scale={0.9} />
        <SimpleTree position={[-8, 0, 20]} scale={1.1} />
        <SimpleTree position={[8, 0, -20]} scale={0.7} />
        <SimpleTree position={[-8, 0, -20]} scale={1.3} />
        <SimpleTree position={[12, 0, 12]} scale={1.0} />
        <SimpleTree position={[-12, 0, 12]} scale={0.8} />
        <SimpleTree position={[12, 0, -12]} scale={1.2} />
        <SimpleTree position={[-12, 0, -12]} scale={0.9} />
        <SimpleTree position={[18, 0, 3]} scale={1.1} />
        <SimpleTree position={[-18, 0, 3]} scale={0.7} />
        <SimpleTree position={[18, 0, -3]} scale={1.0} />
        <SimpleTree position={[-18, 0, -3]} scale={1.3} />
        <SimpleTree position={[3, 0, 18]} scale={0.8} />
        <SimpleTree position={[-3, 0, 18]} scale={1.2} />
        <SimpleTree position={[3, 0, -18]} scale={1.1} />
        <SimpleTree position={[-3, 0, -18]} scale={0.9} />
        <SimpleTree position={[25, 0, 0]} scale={1.0} />
        <SimpleTree position={[-25, 0, 0]} scale={0.8} />
      </Physics >

      <EffectsV2 />
    </>
  );
}
