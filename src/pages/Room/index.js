import { useEffect, useRef } from "react";
import { GAME_STATUS, MODES } from "../../constants";
import { useWindowSize } from "../../hooks";
import Canvas from "./Canvas";
import { useParams } from "react-router-dom";
import { useRoomStore } from "../../store/roomStore";
import Lobby from "./Lobby";
import { socket } from "../../socket";
import UserEntry from "./UserEntry";
import { useAppStore } from "../../store/appStore";
import SoundPlayer from "../../components/SoundPlayer";
import { DrawingShowcase } from "./DrawingShowcase";

function RoomPage() {
  const params = useParams();
  const roomUpdateEvent = `room-update-${params.id}`;
  const isLoading = useAppStore((state) => state.isLoading);
  const room = useRoomStore((state) => state.room);
  const setRoom = useRoomStore((state) => state.setRoom);
  const getRoomById = useRoomStore((state) => state.getRoomById);
  const getMyQuest = useRoomStore((state) => state.getMyQuest);
  const quest = useRoomStore((state) => state.quest);
  const setBgPrimary = useAppStore((state) => state.setBgPrimary);
  const setBgSecondary = useAppStore((state) => state.setBgSecondary);
  const previousGameStatus = useRef();
  const gameStartAudioRef = useRef();
  const gameDrawingAudioRef = useRef();
  const gameSentenceAudioRef = useRef();
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
    if (!room) {
      return;
    }
    if (room.status === GAME_STATUS.WaitingForDrawings) {
      setBgPrimary();
      getMyQuest(params.id);
    } else if (room.status === GAME_STATUS.WaitingForSentences) {
      setBgSecondary();
      getMyQuest(params.id);
    } else if (room.status === GAME_STATUS.DrawingShowcase) {
      setBgPrimary();
    }
    // if game status changes play bgm
    if (previousGameStatus.current !== room.status) {
      playGameStatusChangeSounds(room.status);
    }

    previousGameStatus.current = room.status;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, getMyQuest, params.id]);

  useEffect(() => {
    socket.on(roomUpdateEvent, ({ room: roomData }) => {
      setRoom({ ...roomData });
    });
    return () => {
      socket.off(roomUpdateEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playGameStatusChangeSounds = (status) => {
    switch (status) {
      case GAME_STATUS.WaitingForInitialSentences:
        gameStartAudioRef.current?.play();
        break;
      case GAME_STATUS.WaitingForDrawings:
        gameDrawingAudioRef.current?.play();
        break;
      case GAME_STATUS.WaitingForSentences:
        gameSentenceAudioRef.current?.play();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {!isLoading && !room && (
        <div style={{ color: "#fff" }}>
          <h1>Room not found, you may want to go back</h1>
          <a style={{ color: "#fff" }} href="/">
            Home
          </a>
        </div>
      )}
      {room?.status === GAME_STATUS.WaitingForStart && <Lobby />}
      {room?.status === GAME_STATUS.WaitingForInitialSentences && <UserEntry />}
      {room?.status === GAME_STATUS.WaitingForDrawings && quest && (
        <Canvas settings={settings} scale={size.scale} />
      )}
      {room?.status === GAME_STATUS.WaitingForSentences && quest && (
        <Canvas
          settings={settings}
          scale={size.scale}
          content={quest.content}
          readonly
          hideToolbar
          hideLeftMenu
          hideColorPalette
          showGuessInput
        />
      )}
      {room?.status === GAME_STATUS.DrawingShowcase && <DrawingShowcase />}
      {room?.status === GAME_STATUS.Finished && (
        <div style={{ color: "#fff" }}>
          <h1>Game is ended, you may want to go back to home page</h1>
          <a style={{ color: "#fff" }} href="/">
            Home
          </a>
        </div>
      )}

      <div id="game-bgm">
        <SoundPlayer src="/bgm/game-start.mp3" ref={gameStartAudioRef} />
        <SoundPlayer src="/bgm/game-bonus.mp3" ref={gameDrawingAudioRef} />
        <SoundPlayer src="/bgm/game-sentence.mp3" ref={gameSentenceAudioRef} />
      </div>
    </>
  );
}

export default RoomPage;
