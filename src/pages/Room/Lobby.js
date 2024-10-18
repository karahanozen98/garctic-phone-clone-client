import { useEffect } from "react";
import Card from "../../components/Card";
import { useRoomStore } from "../../store/roomStore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileCard from "./ProfileCard";

export default function Lobby() {
  const room = useRoomStore((state) => state.room);
  const joinRoom = useRoomStore((state) => state.joinRoom);
  const startGame = useRoomStore((state) => state.startGame);
  const { id } = useParams();

  useEffect(() => {
    joinRoom(id);
  }, []);

  const handleStartGame = () => {
    startGame(id);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy: ", err);
      }
    );
  };

  return (
    <Card
      style={{
        color: "#fff",
        backgroundImage:
          "linear-gradient(215deg, rgb(116, 84, 249) 0%, rgb(115, 17, 176) 85%)",
      }}
    >
      <h1>Get Ready To Draw</h1>
      <div
        id="invite-section"
        style={{
          margin: "30px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <h4 style={{ textWrap: "nowrap" }}>
          Invite your friends using code:
          <button
            className="primary"
            style={{ width: "fit-content", fontWeight: "bold", marginLeft: 3 }}
            onClick={() => handleCopy(id)}
          >
            {id}
          </button>
        </h4>
        <p>or</p>
        <button
          className="primary"
          onClick={() => handleCopy(window.location.href)}
        >
          <i className="fas fa-user-plus"></i> Copy Invite Link
        </button>
      </div>
      <div style={{ padding: 10 }}>
        {room.players.map((player, index) => (
          <ProfileCard key={player.id} index={index} player={player} />
        ))}
      </div>
      <button className="success bold" onClick={handleStartGame}>
        {"Start The Game".toUpperCase()}
      </button>
    </Card>
  );
}
