import React, { useState, useEffect, useRef } from "react";
import { getRotationDegrees } from "../utils";
import { RotationContainer } from "./styles";

interface Props {
  mustStartSpinning: boolean;
  prizeNumber: number;
  onStopSpinning?: () => any;
}

const STARTED_SPINNING = "started-spinning";

const START_SPINNING_TIME = 800;
const CONTINUE_SPINNING_TIME = 400;
const STOP_SPINNING_TIME = 4000;

export const Wheel = ({
  mustStartSpinning,
  prizeNumber,
  onStopSpinning = () => null
}: Props) => {
  const [startRotationDegrees, setStartRotationDegrees] = useState(0);
  const [finalRotationDegrees, setFinalRotationDegrees] = useState(0);
  const [hasStartedSpinning, setHasStartedSpinning] = useState(false);
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState(false);
  const [isCurrentlySpinning, setIsCurrentlySpinning] = useState(false);
  const mustStopSpinning = useRef<boolean>(false);

  const startSpinning = () => {
    setHasStartedSpinning(true);
    setHasStoppedSpinning(false);
    mustStopSpinning.current = true;
    setTimeout(() => {
      if (mustStopSpinning.current) {
        mustStopSpinning.current = false;
        setHasStartedSpinning(false);
        setHasStoppedSpinning(true);
        onStopSpinning();
      }
    }, START_SPINNING_TIME + CONTINUE_SPINNING_TIME + STOP_SPINNING_TIME - 300);
  };

  useEffect(() => {
    if (mustStartSpinning && !isCurrentlySpinning) {
      setIsCurrentlySpinning(true);
      startSpinning();
      const finalRotationDegreesCalculated = getRotationDegrees(prizeNumber, 8);
      setFinalRotationDegrees(finalRotationDegreesCalculated);
    }
  }, [mustStartSpinning]);

  useEffect(() => {
    if (hasStoppedSpinning) {
      setIsCurrentlySpinning(false);
      setStartRotationDegrees(finalRotationDegrees);
    }
  }, [hasStoppedSpinning]);

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return STARTED_SPINNING;
    }
    return "";
  };

  return (
    <>
      <RotationContainer
        className={getRouletteClass()}
        startSpinningTime={START_SPINNING_TIME}
        continueSpinningTime={CONTINUE_SPINNING_TIME}
        stopSpinningTime={STOP_SPINNING_TIME}
        startRotationDegrees={startRotationDegrees}
        finalRotationDegrees={finalRotationDegrees}
      >
        <img
          src="assets/roullette.png"
          alt="wheel"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            margin: "0 auto",
            //transform: `rotate(22.5deg)`
          }}
        />
      </RotationContainer>
      <img
        src="assets/marker.png"
        alt="marker"
        style={{
          position: "absolute",
          width: "3em",
          left: "8.5em",
          top: "-1em",
          zIndex: 2
        }}
      />
    </>
  );
};
