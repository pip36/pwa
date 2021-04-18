import { createUseStyles } from "react-jss";

export type Note =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

const whiteKeyWidth = 25;
const blackKeyWidth = 10;

const useStyles = createUseStyles({
  keyboard: {
    display: "flex",
    justifyContent: "center",
  },
  white: {
    background: "white",
    width: whiteKeyWidth + "px",
    height: "100px",
    border: "1px solid black",
  },
  black: {
    width: blackKeyWidth + "px",
    marginLeft: `-${blackKeyWidth / 2 + 1}px`,
    marginRight: `-${blackKeyWidth / 2 + 1}px`,
    background: "black",
    height: "60px",
    color: "white",
    border: "1px solid black",
    zIndex: 10,
  },
  selected: {
    background: "#23c723",
    opacity: 0.7,
  },
});

interface KeyboardProps {
  selectedNotes: Note[];
  onKeySelect(note: Note): void;
}

const Keyboard = ({ selectedNotes, onKeySelect }: KeyboardProps) => {
  const classes = useStyles();

  const keys: { color: "black" | "white"; note: Note }[] = [
    {
      note: "C",
      color: "white",
    },
    {
      note: "C#",
      color: "black",
    },
    {
      note: "D",
      color: "white",
    },
    {
      note: "D#",
      color: "black",
    },
    {
      note: "E",
      color: "white",
    },
    {
      note: "F",
      color: "white",
    },
    {
      note: "F#",
      color: "black",
    },
    {
      note: "G",
      color: "white",
    },
    {
      note: "G#",
      color: "black",
    },
    {
      note: "A",
      color: "white",
    },
    {
      note: "A#",
      color: "black",
    },
    {
      note: "B",
      color: "white",
    },
  ];

  return (
    <div className={classes.keyboard}>
      {keys.map(({ color, note }) => (
        <div
          key={note}
          className={
            classes[color] +
            ` ${selectedNotes.includes(note) && classes.selected}`
          }
          onClick={() => onKeySelect(note)}
        ></div>
      ))}
    </div>
  );
};

export default Keyboard;
