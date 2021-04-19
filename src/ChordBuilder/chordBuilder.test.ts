import { getChord, buildSequence } from "./chordBuilder";

describe("ChordBuilder", () => {
  describe("getChord()", () => {
    describe("Major Mode", () => {
      test.each`
        key    | degree | expected
        ${"C"} | ${1}   | ${["C", "E", "G"]}
        ${"C"} | ${2}   | ${["D", "F", "A"]}
        ${"C"} | ${3}   | ${["E", "G", "B"]}
        ${"C"} | ${4}   | ${["F", "A", "C"]}
        ${"C"} | ${5}   | ${["G", "B", "D"]}
        ${"C"} | ${6}   | ${["A", "C", "E"]}
        ${"C"} | ${7}   | ${["B", "D", "F"]}
      `(
        "Key of $key, degree: $degree = $expected",
        ({ key, degree, expected }) => {
          const actual = getChord(key, "major", degree);
          expect(actual).toEqual(expected);
        }
      );
    });
  });

  describe("buildSequence()", () => {
    test.each`
      chord              | length       | expected
      ${["C", "E", "G"]} | ${undefined} | ${["C3", "E3", "G3"]}
      ${["C", "E", "G"]} | ${1}         | ${["C3"]}
      ${["C", "E", "G"]} | ${2}         | ${["C3", "E3"]}
      ${["C", "E", "G"]} | ${3}         | ${["C3", "E3", "G3"]}
      ${["C", "E", "G"]} | ${6}         | ${["C3", "E3", "G3", "C4", "E4", "G4"]}
      ${["C", "E", "G"]} | ${10}        | ${["C3", "E3", "G3", "C4", "E4", "G4", "C5", "E5", "G5", "C6"]}
    `(
      "Chord $chord of length $length returns $expected",
      ({ chord, length, expected }) => {
        const actual = buildSequence(chord, { length });
        expect(actual).toEqual(expected);
      }
    );

    test.each`
      chord                | tonic  | expected
      ${["C", "E", "G"]}   | ${"C"} | ${["C3", "E3", "G3"]}
      ${["D", "F", "A"]}   | ${"C"} | ${["D3", "F3", "A3"]}
      ${["E", "G", "B"]}   | ${"C"} | ${["E3", "G3", "B3"]}
      ${["F", "A", "C"]}   | ${"C"} | ${["F3", "A3", "C4"]}
      ${["G", "B", "D"]}   | ${"C"} | ${["G3", "B3", "D4"]}
      ${["A", "C", "E"]}   | ${"C"} | ${["A3", "C4", "E4"]}
      ${["B", "D", "F"]}   | ${"C"} | ${["B3", "D4", "F4"]}
      ${["D", "F#", "A"]}  | ${"D"} | ${["D3", "F#3", "A3"]}
      ${["E", "G", "B"]}   | ${"D"} | ${["E3", "G3", "B3"]}
      ${["F#", "A", "C#"]} | ${"D"} | ${["F#3", "A3", "C#4"]}
      ${["G", "B", "D"]}   | ${"D"} | ${["G3", "B3", "D4"]}
      ${["A", "C#", "E"]}  | ${"D"} | ${["A3", "C#4", "E4"]}
      ${["B", "D", "F#"]}  | ${"D"} | ${["B3", "D4", "F#4"]}
      ${["C", "E", "G"]}   | ${"D"} | ${["C4", "E4", "G4"]}
    `(
      "Handles triads at all degrees of scale, degree: $degree -> $expected",
      ({ chord, tonic, expected }) => {
        const actual = buildSequence(chord, { tonic });
        expect(actual).toEqual(expected);
      }
    );

    test.each`
      chord              | startOctave | expected
      ${["C", "E", "G"]} | ${2}        | ${["C2", "E2", "G2", "C3", "E3", "G3"]}
      ${["D", "F", "A"]} | ${4}        | ${["D4", "F4", "A4", "D5", "F5", "A5"]}
    `(
      "Can change start octave to $startOctave",
      ({ chord, startOctave, expected }) => {
        const actual = buildSequence(chord, { length: 6, startOctave });
        expect(actual).toEqual(expected);
      }
    );
  });
});
