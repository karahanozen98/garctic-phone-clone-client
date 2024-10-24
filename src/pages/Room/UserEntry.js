import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { useRoomStore } from "../../store/roomStore";
import { useParams } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import { socket } from "../../socket";

export default function UserEntry() {
  const { id } = useParams();
  const [sentence, setSentence] = useState();
  const players = useRoomStore((state) => state.players);
  const updatePlayers = useRoomStore((state) => state.updatePlayers);
  const joinRoom = useRoomStore((state) => state.joinRoom);
  const sendSentence = useRoomStore((state) => state.sendSentence);
  const playerUpdateEvent = `player-update-${id}`;

  useEffect(() => {
    joinRoom(id);

    socket.on(playerUpdateEvent, ({ players }) => {
      updatePlayers([...players]);
    });
    return () => {
      socket.off(playerUpdateEvent);
    };
  }, []);

  const handleSaveSentence = (event) => {
    event.preventDefault();
    sendSentence(id, sentence);
  };

  return (
    <Card
      style={{
        color: "#fff",
        backgroundImage:
          "linear-gradient(215deg, rgb(116, 84, 249) 0%, rgb(115, 17, 176) 85%)",
      }}
    >
      <h1>Write Your Sentence</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "stretch",
          flexWrap: "wrap-reverse",
          gap: 10,
          marginTop: 10,
        }}
      >
        <div style={{ padding: 10, flex: 1 }}>
          {players.map((player, index) => (
            <ProfileCard key={player.id} index={index} player={player} />
          ))}
        </div>
        <div
          style={{
            color: "#333",
            background: "#fff",
            borderRadius: 10,
            padding: 50,
            flex: 2,
          }}
        >
          <form
            onSubmit={() => {}}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="input-group">
              <label htmlFor="sentence">
                Enter Your Sentence, this is what your friends will try to draw
              </label>
              <input
                type="text"
                placeholder="A Cat eating ice cream"
                minLength={2}
                onChange={(e) => setSentence(e.target.value)}
                required
              />
            </div>
            <div>
              <button className="primary bold" onClick={handleSaveSentence}>
                DONE!
              </button>
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
}
