import balloon from "./balloon.gif";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div>
        <img width={300} src={balloon} alt="balloon" />
        <img width={300} src={balloon} alt="balloon" />
        <img width={300} src={balloon} alt="balloon" />
      </div>
    </div>
  );
}

export default App;
