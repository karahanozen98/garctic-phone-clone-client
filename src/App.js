import { useEffect, useRef } from "react";
import "./App.css";
import { MODES } from "./constants";
import { useWindowSize } from "./hooks";
import Canvas from "./canvas";
import { socket } from "./socket";

function App() {
  const settings = useRef({
    stroke: 3,
    color: "#000",
    mode: MODES.PEN,
  });

  const size = useWindowSize();

  useEffect(() => {
    function onConnect() {
      console.log(true);
    }

    function onDisconnect() {
      console.log(true);
    }

    function onFooEvent(value) {
      console.log(true);
    }

    fetch("http://localhost:4000").then((data) =>
      data.json().then((json) => console.log(json))
    );

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);

  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas width={500} height={500} settings={settings} />
      </div>
    </div>
  );
}

export default App;
