import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { useRoomStore } from "../../store/roomStore";
import { useParams } from "react-router-dom";
import ProfileCard from "./ProfileCard";

export default function UserEntry() {
  const [sentence, setSentence] = useState();
  const room = useRoomStore((state) => state.room);
  const joinRoom = useRoomStore((state) => state.joinRoom);
  const sendSentence = useRoomStore((state) => state.sendSentence);
  const { id } = useParams();

  useEffect(() => {
    joinRoom(id);
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
          {room.players.map((player, index) => (
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
              <label htmlFor="username">
                Enter Your Sentence, this is what your friends will draw
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
