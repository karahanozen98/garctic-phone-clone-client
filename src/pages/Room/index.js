import { useEffect, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, MODES } from "../../constants";
import { useWindowSize } from "../../hooks";
import Canvas from "../../Canvas";
import { useParams } from "react-router-dom";
import { useRoomStore } from "../../store/roomStore";
import Lobby from "./Lobby";
import { PageWrapper } from "../../components/PageWrapper";

function RoomPage() {
  const [painting, setPainting] = useState();
  const params = useParams();
  const room = useRoomStore((state) => state.room);
  const getRoomById = useRoomStore((state) => state.getRoomById);
  const settings = useRef({
    stroke: 5,
    color: "#000000",
    mode: MODES.PEN,
  });
  const size = useWindowSize();

  useEffect(() => {
    getRoomById(params.id);
  }, [params.id, getRoomById]);

  return (
    <PageWrapper>
      {!room && (
        <div>
          <h1>Room not found, you may want to go back</h1>
          <a href="/">Home</a>
        </div>
      )}
      {room?.status === 1 && <Lobby />}
      {room?.status === 0 && (
        <div
          className="canvas-container"
          style={{
            margin: "auto",
            transform: `scale(${size.scale})`,
          }}
        >
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
      )}
    </PageWrapper>
  );
}

export default RoomPage;
