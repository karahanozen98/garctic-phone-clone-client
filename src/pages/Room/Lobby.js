import { useEffect } from "react";
import Card from "../../components/Card";
import { useRoomStore } from "../../store/roomStore";
import { socket } from "../../socket";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function Lobby() {
  const roomUpdateEvent = "room-update";
  const room = useRoomStore((state) => state.room);
  const setRoom = useRoomStore((state) => state.setRoom);
  const joinRoom = useRoomStore((state) => state.joinRoom);
  const { id } = useParams();

  useEffect(() => {
    joinRoom(id);

    socket.on(roomUpdateEvent, ({ room: roomData }) => {
      setRoom({ ...roomData });
    });
    return () => {
      socket.off(roomUpdateEvent);
    };
  }, []);

  const handleStartGame = () => {};

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

function ProfileCard({ player, index }) {
  return (
    <div style={{ color: "#333", background: "#fdfdfd", borderRadius: 15 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          margin: 10,
        }}
      >
        <img
          src={`https://garticphone.com/images/avatar/${index}.svg`}
          width={100}
          alt="avatar"
        />
        <h3>{player.username}</h3>
      </div>
    </div>
  );
}
