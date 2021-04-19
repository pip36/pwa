import "./App.css";
import * as Tone from "tone";
import React, { useEffect, useState } from "react";
import Keyboard from "./components/Keyboard";
import {
  buildSequence,
  Degree,
  degrees,
  getChord,
  Note,
  Octave,
} from "./ChordBuilder/chordBuilder";

const synth = new Tone.Synth().toDestination();
const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, 0.1, time);
}, []).start(0);

function App() {
  const mode = "major";

  const [key, setKey] = useState<Note>("C");
  const [degree, setDegree] = useState<Degree>(1);
  const [tempo, setTempo] = useState<number>(180);
  const [sequenceLength, setSequenceLength] = useState<number>(9);
  const [octave, setOctave] = useState<Octave>(2);

  useEffect(() => {
    seq.events = buildSequence(getChord(key, mode, degree), {
      length: sequenceLength,
      startOctave: octave,
      degree,
    });
  }, [key, degree, sequenceLength, octave]);

  useEffect(() => {
    Tone.getTransport().bpm.set({ value: tempo });
  }, [tempo]);

  return (
    <div className="App">
      <div>
        <div>
          <div>
            {degrees.map((x) => {
              return (
                <>
                  <input
                    type="radio"
                    id={x.toString()}
                    name="degree"
                    value={x}
                    onChange={() => setDegree(x)}
                    checked={x === degree}
                  />

                  <label htmlFor={x.toString()}>{x}</label>
                </>
              );
            })}
          </div>

          <label htmlFor="tempo">Tempo</label>
          <input
            id="tempo"
            type="range"
            value={tempo}
            min={40}
            max={360}
            onChange={(e) => {
              setTempo(Number(e.target.value));
            }}
          />
        </div>
        <div>
          <label htmlFor="sequenceLength">Length</label>
          <input
            id="sequenceLength"
            type="range"
            value={sequenceLength}
            min={1}
            max={12}
            onChange={(e) => {
              setSequenceLength(Number(e.target.value));
            }}
          />
        </div>
        <div>
          <label htmlFor="octave">Octave</label>
          <input
            id="octave"
            type="range"
            value={octave}
            min={1}
            max={4}
            onChange={(e) => {
              setOctave(Number(e.target.value) as Octave);
            }}
          />
        </div>
      </div>

      <button
        onClick={async () => {
          await Tone.start();
          Tone.Transport.start();
        }}
      >
        init
      </button>
    </div>
  );
}

export default App;
