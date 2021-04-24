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
  // const swapTonic = swapEnharmonic(mode)[tonic];
  // if (swapTonic !== undefined) {
  //   tonic = swapTonic;
  // }
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

/* 
  Convert numerical representation of a pitch to a note.
  Always converts accidentals to flat.
  e.g.
    0 -> "C1"
    12 -> "C2"
    13 -> "Db2"
*/
export const toNote = (n: number) =>
  CHROMATIC_FLATS[n % CHROMATIC_FLATS.length] +
  Math.floor(n / CHROMATIC_FLATS.length + 1);

export const toPitch = (n: string) =>
  CHROMATIC_FLATS.findIndex((x) => n.startsWith(x)) +
  CHROMATIC_FLATS.length * (Number(n[n.length - 1]) - 1);

type BuildTriadProps = {
  tonic: Note;
  mode: Mode;
  degree: Degree;
  octave: number;
};

export const buildTriad = ({
  tonic,
  mode,
  degree,
  octave,
}: BuildTriadProps) => {
  const pattern = modePatterns[mode];
  const intervals = pattern.split("").map((x) => (x === "T" ? 2 : 1));

  let startPitch = toPitch(tonic + octave);
  for (let i = 0; i < degree - 1; i++) {
    startPitch += intervals[i];
  }

  const root = startPitch;
  const third =
    root +
    intervals[(0 + degree - 1) % intervals.length] +
    intervals[(1 + degree - 1) % intervals.length];
  const fifth =
    third +
    intervals[(2 + degree - 1) % intervals.length] +
    intervals[(3 + degree - 1) % intervals.length];

  return [root, third, fifth];
};

export const buildSequence = ({
  length = 3,
  startOctave = 3,
  tonic = "C",
  degree = 1,
  mode,
}: BuildSequenceOptions) => {
  const triad = buildTriad({ tonic, mode, degree, octave: startOctave });
  const result = [];
  for (let i = 0; i < length; i++) {
    const octaveModifier: number = Math.floor(result.length / 3) * 12;
    result.push(triad[i % triad.length] + octaveModifier);
  }
  return result.map(toNote);
};

export const buildSequence2 = ({
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
