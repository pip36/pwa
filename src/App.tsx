import "./App.css";
import * as Tone from "tone";
import React, { useEffect, useState } from "react";
import Keyboard, { Note } from "./components/Keyboard";

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();
const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, 0.1, time);
  // subdivisions are given as subarrays
}, []).start(0);

const buildSequence = (notes: Note[], transpose: number, octaveRange: number) =>
  new Array(octaveRange)
    .fill(0)
    .map((n, i) => n + i)
    .flatMap((octave) => [
      ...notes.map((n) => n + (transpose + octave).toString()),
    ]);

function App() {
  const [selectedNotes, setSelectedNotes] = useState<Note[]>(["C"]);
  const [tempo, setTempo] = useState<number>(120);
  const [transpose, setTranspose] = useState<number>(4);
  const [octave, setOctave] = useState<number>(1);

  useEffect(() => {
    seq.events = buildSequence(selectedNotes, transpose, octave);
  }, [selectedNotes, transpose, octave]);

  useEffect(() => {
    Tone.getTransport().bpm.set({ value: tempo });
  }, [tempo]);

  return (
    <div className="App">
      <div>
        <Keyboard
          selectedNotes={selectedNotes}
          onKeySelect={(note) => {
            const isSelected = selectedNotes.includes(note);
            if (isSelected) {
              setSelectedNotes((x) => x.filter((n) => n !== note));
            } else {
              setSelectedNotes((x) => [...x, note]);
            }
          }}
        />
        <div>
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
          <label htmlFor="transpose">Transpose</label>
          <input
            id="transpose"
            type="range"
            value={transpose}
            min={1}
            max={6}
            onChange={(e) => {
              setTranspose(Number(e.target.value));
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
              setOctave(Number(e.target.value));
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
