export type Scale = "major";

export const degrees = [1, 2, 3, 4, 5, 6, 7] as const;
export type Degree = typeof degrees[number];

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
export type Octave = 2 | 3 | 4 | 5 | 6 | 7;

export type Chord = Note[];

export type Pitch = `${Note}${Octave}`;

const C_MAJOR_SCALE: Note[] = ["C", "D", "E", "F", "G", "A", "B"];
const D_MAJOR_SCALE: Note[] = ["D", "E", "F#", "G", "A", "B", "C#"];

const scaleByTonic: { [key: string]: Note[] } = {
  C: C_MAJOR_SCALE,
  D: D_MAJOR_SCALE,
};

export const getChord = (key: Note, scale: Scale, degree: Degree): Chord => {
  const startIndex = degree - 1;
  const noteIndexes = [startIndex, startIndex + 2, startIndex + 4].map(
    (n) => n % C_MAJOR_SCALE.length
  );
  return noteIndexes.map((n) => C_MAJOR_SCALE[n]);
};

type BuildSequenceOptions = {
  length?: number;
  startOctave?: Octave;
  tonic?: Note;
};

export const buildSequence = (
  chord: Chord,
  { length = chord.length, startOctave = 3, tonic = "C" }: BuildSequenceOptions
) => {
  const result = new Array(length).fill("");
  let noteIndex = 0;
  let octaveModifier = 0;

  result.forEach((_, i) => {
    const note = chord[i % chord.length];
    const newNoteIndex = C_MAJOR_SCALE.indexOf(note[0] as Note);
    if (newNoteIndex < noteIndex) {
      octaveModifier += 1;
    }
    noteIndex = newNoteIndex;
    result[i] = note + (startOctave + octaveModifier);
  });
  return result;
};
