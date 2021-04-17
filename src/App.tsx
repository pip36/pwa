import "./App.css";
import * as Tone from "tone";
import { useEffect, useState } from "react";

const notes: string[] = [
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
];

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();
const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, 0.1, time);
  // subdivisions are given as subarrays
}, []).start(0);

function App() {
  const [selectedNotes, setSelectedNotes] = useState<string[]>(["C"]);
  const [tempo, setTempo] = useState<number>(120);

  useEffect(() => {
    seq.events = [...selectedNotes.map((n) => n + "4"), selectedNotes[0] + "5"];
  }, [selectedNotes]);

  useEffect(() => {
    Tone.getTransport().bpm.set({ value: tempo });
  }, [tempo]);

  return (
    <div className="App">
      <label htmlFor="tempo">Tempo</label>
      <input
        id="tempo"
        type="number"
        value={tempo}
        onChange={(e) => {
          setTempo(Number(e.target.value));
        }}
      />
      <button
        onClick={async () => {
          await Tone.start();
          Tone.Transport.start();
        }}
      >
        init
      </button>
      {notes.map((note) => (
        <button
          onClick={() => {
            const isSelected = selectedNotes.includes(note);
            if (isSelected) {
              setSelectedNotes((x) => x.filter((n) => n !== note));
            } else {
              setSelectedNotes((x) => [...x, note]);
            }
          }}
        >
          {note} {selectedNotes.includes(note) && "✔"}
        </button>
      ))}
    </div>
  );
}

export default App;
