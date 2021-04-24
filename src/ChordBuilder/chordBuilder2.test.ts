import { buildSequence, buildTriad, toNote, toPitch } from "./chordBuilder";

// Given a pitch return a Note (all flats) e.g. 0 = C1 , 1 = Db1, 12 = C2
describe("toNote()", () => {
  test.each`
    input | expected
    ${0}  | ${"C1"}
    ${1}  | ${"Db1"}
    ${10} | ${"Bb1"}
    ${11} | ${"B1"}
    ${12} | ${"C2"}
    ${23} | ${"B2"}
    ${24} | ${"C3"}
    ${35} | ${"B3"}
    ${36} | ${"C4"}
  `("Converts $input to note $expected", ({ input, expected }) => {
    expect(toNote(input)).toEqual(expected);
  });
});

describe("toPitch()", () => {
  test.each`
    input    | expected
    ${"C1"}  | ${0}
    ${"Db1"} | ${1}
    ${"Bb1"} | ${10}
    ${"B1"}  | ${11}
    ${"C2"}  | ${12}
    ${"B2"}  | ${23}
    ${"C3"}  | ${24}
    ${"B3"}  | ${35}
    ${"C4"}  | ${36}
  `("Converts $input to pitch $expected", ({ input, expected }) => {
    expect(toPitch(input)).toEqual(expected);
  });
});

// Given tonic, octave, mode and degree return pitches representing chord
describe("buildTriad()", () => {
  test.each`
    tonic  | mode        | degree | octave | expected
    ${"C"} | ${"ionian"} | ${1}   | ${1}   | ${[toPitch("C1"), toPitch("E1"), toPitch("G1")]}
    ${"C"} | ${"ionian"} | ${2}   | ${1}   | ${[toPitch("D1"), toPitch("F1"), toPitch("A1")]}
    ${"C"} | ${"ionian"} | ${7}   | ${1}   | ${[toPitch("B1"), toPitch("D2"), toPitch("F2")]}
    ${"D"} | ${"ionian"} | ${1}   | ${1}   | ${[toPitch("D1"), toPitch("Gb1"), toPitch("A1")]}
    ${"D"} | ${"ionian"} | ${7}   | ${1}   | ${[toPitch("Db2"), toPitch("E2"), toPitch("G2")]}
    ${"B"} | ${"ionian"} | ${1}   | ${1}   | ${[toPitch("B1"), toPitch("Eb2"), toPitch("Gb2")]}
    ${"B"} | ${"ionian"} | ${1}   | ${2}   | ${[toPitch("B2"), toPitch("Eb3"), toPitch("Gb3")]}
    ${"D"} | ${"dorian"} | ${1}   | ${1}   | ${[toPitch("D1"), toPitch("F1"), toPitch("A1")]}
    ${"D"} | ${"dorian"} | ${7}   | ${3}   | ${[toPitch("C4"), toPitch("E4"), toPitch("G4")]}
  `(
    "Tonic: $tonic, mode: $mode, degree: $degree, octave: $octave",
    ({ tonic, mode, degree, octave, expected }) => {
      expect(buildTriad({ tonic, mode, degree, octave })).toEqual(expected);
    }
  );
});

describe("buildSequence()", () => {
  test.each`
    tonic  | mode        | degree | startOctave | length | expected
    ${"C"} | ${"ionian"} | ${1}   | ${1}        | ${6}   | ${["C1", "E1", "G1", "C2", "E2", "G2"]}
  `(
    "Tonic: $tonic, mode: $mode, degree: $degree, octave: $startOctave",
    ({ tonic, mode, degree, startOctave, length, expected }) => {
      expect(
        buildSequence({ tonic, mode, degree, startOctave, length })
      ).toEqual(expected);
    }
  );
});
