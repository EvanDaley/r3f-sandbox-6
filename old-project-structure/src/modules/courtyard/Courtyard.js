import React, { useEffect, useState } from "react";
import { Grid, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ecctrl from "ecctrl";
import Floor from "./components/Floor";
import Lights from "./components/Lights";
import Steps from "./components/Steps";
import Slopes from "./components/Slopes";
import RoughPlane from "./components/RoughPlane";
import CharacterModel from "./components/CharacterModel";

export default function Courtyard() {
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
      <Grid
        args={[300, 300]}
        sectionColor={"lightgray"}
        cellColor={"gray"}
        position={[0, -0.99, 0]}
        userData={{ camExcludeCollision: true }} // this won't be collide by camera ray
      />

      <Lights />

      <Physics timeStep="vary" paused={pausedPhysics} gravity={[0, -9.81, 0]}>
        {/* Keyboard preset */}
        <KeyboardControls map={keyboardMap}>
          {/* Character Control */}
          <Ecctrl
            animated
            followLight
            springK={2}
            dampingC={0.2}
            autoBalanceSpringK={1.2}
            autoBalanceDampingC={0.04}
            autoBalanceSpringOnY={0.7}
            autoBalanceDampingOnY={0.05}
          >
            {/* Character Model */}
            <CharacterModel />
          </Ecctrl>
        </KeyboardControls>

        {/* Rough plane */}
        <RoughPlane />

        {/* Slopes and stairs */}
        <Slopes />

        {/* Small steps */}
        <Steps />

        {/* Floor */}
        <Floor />
      </Physics>
    </>
  );
}

