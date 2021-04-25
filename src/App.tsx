import "./App.css";
import * as Tone from "tone";
import { useEffect, useState } from "react";
import {
  buildSequence,
  Degree,
  Mode,
  modes,
  Note,
  notes,
  Octave,
} from "./ChordBuilder/chordBuilder";

const synth = new Tone.Synth().toDestination();
const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, 0.1, time);
}, []).start(0);

function App() {
  const [key, setKey] = useState<Note>("C");
  const [mode, setMode] = useState<Mode>("ionian");
  const [degrees, setDegrees] = useState<Degree[]>([1, 2, 3, 4, 5, 6, 7, 1]);
  const [tempo, setTempo] = useState<number>(180);
  const [sequenceLength, setSequenceLength] = useState<number>(9);
  const [octave, setOctave] = useState<Octave>(2);

  useEffect(() => {
    seq.events = degrees.flatMap((degree) =>
      buildSequence({
        length: sequenceLength,
        startOctave: octave,
        degree,
        tonic: key,
        mode,
      })
    );
  }, [mode, key, degrees, sequenceLength, octave]);

  useEffect(() => {
    Tone.getTransport().bpm.set({ value: tempo });
  }, [tempo]);

  return (
    <div className="App">
      <div>
        <div>
          <div>
            <div>
              {notes.map((note) => (
                <button onClick={() => setKey(note)}>{note}</button>
              ))}
            </div>
            <div>
              {modes.map((mode) => (
                <button onClick={() => setMode(mode)}>{mode}</button>
              ))}
            </div>

            {degrees.map((x, i) => {
              return (
                <>
                  <select
                    key="x"
                    name="degree"
                    id="degree"
                    value={x}
                    onChange={(e) => {
                      const selected = e.target.value;
                      console.log("SELECTED", selected);
                      let newDegrees = [...degrees];
                      newDegrees[i] = Number(selected) as Degree;
                      setDegrees(newDegrees);
                    }}
                  >
                    {degrees.map((_, i) => (
                      <option value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
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
