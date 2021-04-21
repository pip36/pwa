export const modes = [
  "ionian",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "aeolian",
  "locarian",
] as const;
export type Mode = typeof modes[number];

export const degrees = [1, 2, 3, 4, 5, 6, 7] as const;
export type Degree = typeof degrees[number];

export const notes = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
] as const;

export type Note = typeof notes[number];
export type Octave = 2 | 3 | 4 | 5 | 6 | 7;

export type Chord = Note[];

export type Pitch = `${Note}${Octave}`;

const CHROMATIC_SHARPS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

const CHROMATIC_FLATS = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

const flatMajors = ["Db", "Eb", "F", "Ab", "Bb"];

type NoteMap = Partial<{ [Property in Note]: Note }>;
const swapEnharmonic = (mode: Mode): NoteMap => {
  switch (mode) {
    case "ionian":
      return ionianSwapEnharmonic;
    case "dorian":
      return dorianSwapEnharmonic;
    default:
      return ionianSwapEnharmonic;
  }
};

const ionianSwapEnharmonic: NoteMap = {
  "C#": "Db",
  Gb: "F#",
  "G#": "Ab",
  "D#": "Eb",
};
const dorianSwapEnharmonic: NoteMap = {
  Db: "C#",
  Gb: "F#",
  Ab: "G#",
  "D#": "Eb",
  "A#": "Bb",
};

const modePatterns: { [Property in Mode]: string } = {
  ionian: "TTSTTTS",
  dorian: "TSTTTST",
  phrygian: "STTTSTT",
  lydian: "TTTSTTS",
  mixolydian: "TTSTTST",
  aeolian: "TSTTSTT",
  locarian: "STTSTTT",
};

export const buildScale = (mode: Mode, tonic: Note) => {
  const swapTonic = swapEnharmonic(mode)[tonic];
  if (swapTonic !== undefined) {
    tonic = swapTonic;
  }
  const pattern = modePatterns[mode];
  const NOTES = flatMajors.includes(tonic) ? CHROMATIC_FLATS : CHROMATIC_SHARPS;
  const intervals = pattern.split("").map((x) => (x === "T" ? 2 : 1));
  let currIndex = NOTES.findIndex((x: Note) => x === tonic);
  const result: Note[] = [];

  intervals.forEach((interval) => {
    result.push(NOTES[currIndex]);
    currIndex += interval;
    currIndex = currIndex % NOTES.length;
  });

  return result;
};

type BuildSequenceOptions = {
  length?: number;
  startOctave?: Octave;
  tonic?: Note;
  degree?: Degree;
  mode: Mode;
};

export const buildSequence = ({
  length = 3,
  startOctave = 3,
  tonic = "C",
  degree = 1,
  mode,
}: BuildSequenceOptions) => {
  const result: string[] = [];

  const scale = buildScale(mode, tonic);

  let i = 0;
  let noteIndex = degree - 1;
  let octaveModifier = 0;
  while (result.length < length) {
    const note = scale[i % scale.length];

    if ((i > 0 || mode !== "ionian") && note[0] === "C") {
      octaveModifier++;
    }

    if (i === noteIndex) {
      result.push(note + (startOctave + octaveModifier));
      noteIndex += 2;
      if (result.length % 3 === 0) {
        noteIndex += 1;
      }
    }

    i++;
  }

  return result;
};
