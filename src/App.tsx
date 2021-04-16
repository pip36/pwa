import { useState } from "react";
import "./App.css";
import { Balloon, BalloonProps } from "./Balloon";
import { useAnimationFrame } from "./useAnimationFrame";

function App() {
  const [balloons, setBalloons] = useState<BalloonProps[]>([
    {
      y: -1000,
      color: "sepia(100%) saturate(300%) brightness(70%) hue-rotate(0deg)",
    },
    {
      y: -800,
      color: "sepia(100%) saturate(300%) brightness(70%) hue-rotate(90deg)",
    },
    {
      y: -1200,
      color: "sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg)",
    },
    {
      y: -500,
      color: "sepia(100%) saturate(300%) brightness(70%) hue-rotate(270deg)",
    },
    {
      y: -200,
      color: "sepia(100%) saturate(300%) brightness(70%) hue-rotate(320deg)",
    },
  ]);

  useAnimationFrame((deltaTime: number) => {
    setBalloons((prevBalloons) =>
      prevBalloons.map((b) => ({ ...b, y: getWrapPosition(b.y, deltaTime) }))
    );
  });

  return (
    <div className="App">
      <div style={{ opacity: 0 }}>.</div>

      {balloons.map(({ y, color }, i) => (
        <Balloon key={i} y={y} color={color} />
      ))}
    </div>
  );
}

const getWrapPosition = (yPos: number, deltaTime: number) => {
  const newPos = yPos + deltaTime * 0.3;
  return newPos > 1000 ? -300 : newPos;
};

export default App;
