import { useEffect, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, MODES } from "../../constants";
import { useWindowSize } from "../../hooks";
import Canvas from "../../Canvas";
import { useParams } from "react-router-dom";
import { useRoomStore } from "../../store/roomStore";
import Lobby from "./Lobby";
import { PageWrapper } from "../../components/PageWrapper";
import { socket } from "../../socket";
import UserEntry from "./UserEntry";

function RoomPage() {
  const roomUpdateEvent = "room-update";
  const [painting, setPainting] = useState();
  const params = useParams();
  const room = useRoomStore((state) => state.room);
  const setRoom = useRoomStore((state) => state.setRoom);
  const getRoomById = useRoomStore((state) => state.getRoomById);
  const getMyQuest = useRoomStore((state) => state.getMyQuest);
  const settings = useRef({
    stroke: 5,
    color: "#000000",
    mode: MODES.PEN,
  });
  const size = useWindowSize();

  useEffect(() => {
    getRoomById(params.id);
  }, [params.id, getRoomById]);

  useEffect(() => {
    if ((room && room?.status === 2) || room?.status === 3) {
      getMyQuest(params.id);
    }
  }, [room, getMyQuest, params.id]);

  useEffect(() => {
    socket.on(roomUpdateEvent, ({ room: roomData }) => {
      setRoom({ ...roomData });
    });
    return () => {
      socket.off(roomUpdateEvent);
    };
  }, []);

  return (
    <PageWrapper>
      {!room && (
        <div style={{ color: "#fff" }}>
          <h1>Room not found, you may want to go back</h1>
          <a href="/">Home</a>
        </div>
      )}
      {room?.status === 0 && <Lobby />}
      {room?.status === 1 && <UserEntry />}
      {room?.status === 2 && (
        <Canvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          settings={settings}
          scale={size.scale}
          painting={painting}
        />
      )}
      {room?.status === 3 && (
        <Canvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          settings={settings}
          scale={size.scale}
          painting={painting}
          readonly
        />
      )}
    </PageWrapper>
  );
}

export default RoomPage;
