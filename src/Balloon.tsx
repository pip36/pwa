import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import balloon from "./balloon.gif";

const useStyles = createUseStyles({
  balloon: {
    position: "absolute",
    img: {},
  },
});

export interface BalloonProps {
  y: number;
  color: string;
}

export const Balloon = ({ y, color }: BalloonProps) => {
  const classes = useStyles();

  const [x, setX] = useState("-1000px");

  useEffect(() => {
    setX(randomLeft());
  }, []);

  return (
    <div className={classes.balloon} style={{ left: x, bottom: y }}>
      <img width={300} src={balloon} alt="balloon" style={{ filter: color }} />
    </div>
  );
};

const random = (max: number) => Math.floor(Math.random() * max);

const randomLeft = () => random(80).toString() + "vw";
