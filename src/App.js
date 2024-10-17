import "./App.css";
import { useEffect, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, MODES } from "./constants";
import { useWindowSize } from "./hooks";
import Canvas from "./Canvas";
import { socket } from "./socket";

function App() {
  const [painting, setPainting] = useState();
  const settings = useRef({
    stroke: 5,
    color: "#000000",
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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);
    // socket.on("painting", (data) => {
    //   setPainting(data.painting);
    //   settings.current = { ...settings.current, drawing: data.drawing };
    // });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);

  return (
    <div className="app">
      <div
        className="canvas-container"
        style={{
          margin: "auto",
          transform: `scale(${size.scale})`,
          background: "#332344",
          borderRadius: 15,
          padding: 15,
        }}
      >
        <div
          style={{
            backgroundColor: "#332344",
            color: "white",
            fontWeight: "bold",
            padding: 10,
          }}
        >
          <h1>A cat eating icecream</h1>
        </div>
        <div>
          <Canvas
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            settings={settings}
            scale={size.scale}
            painting={painting}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
