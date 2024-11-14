import { useEffect } from "react";
import { useRoomStore } from "../../store/roomStore";
import ProfileCard from "./ProfileCard";
import { socket } from "../../socket";
import { useParams } from "react-router-dom";

export default function CanvasPlayerList() {
  const { id } = useParams();
  const players = useRoomStore((state) => state.players);
  const updatePlayers = useRoomStore((state) => state.updatePlayers);
  const playerUpdateEvent = `player-update-${id}`;

  useEffect(() => {
    socket.on(playerUpdateEvent, ({ players }) => {
      updatePlayers([...players]);
    });
    return () => {
      socket.off(playerUpdateEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        color: "#fff",
        padding: 10,
        borderRadius: 15,
        maxHeight: 500,
        overflow: "auto",
        marginBottom: 15,
        backgroundImage:
          "linear-gradient(215deg, rgb(116, 84, 249) 0%, rgb(115, 17, 176) 85%)",
      }}
    >
      {players.map((player, index) => (
        <ProfileCard key={player.id} player={player} showIsReadyView />
      ))}
    </div>
  );
}
