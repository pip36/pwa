export type Scale = "major";

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

const swapEnharmonic: Partial<{ [Property in Note]: Note }> = {
  "C#": "Db",
  Gb: "F#",
  "G#": "Ab",
};

export const buildScale = (scale: Scale, tonic: Note) => {
  const swapTonic = swapEnharmonic[tonic];
  if (swapTonic !== undefined) {
    tonic = swapTonic;
  }
  const majorPattern = "TTSTTTS";
  const NOTES = flatMajors.includes(tonic) ? CHROMATIC_FLATS : CHROMATIC_SHARPS;
  const intervals = majorPattern.split("").map((x) => (x === "T" ? 2 : 1));
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
};

export const buildSequence = ({
  length = 3,
  startOctave = 3,
  tonic = "C",
  degree = 1,
}: BuildSequenceOptions) => {
  const result: string[] = [];

  const scale = buildScale("major", tonic);

  let i = 0;
  let noteIndex = degree - 1;
  let octaveModifier = 0;
  while (result.length < length) {
    const note = scale[i % scale.length];

    if (i > 0 && note[0] === "C") {
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
