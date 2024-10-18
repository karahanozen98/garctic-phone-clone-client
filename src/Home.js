import { useState } from "react";
import Dialog from "./components/Dialog";
import { httpClient } from "./httpClient";
import { useAuthSore } from "./store/authStore";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const user = useAuthSore((state) => state.user);
  const [isCreateRoomDialogOpen, setIsCreateRoomDialogOpen] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [numberOfTurns, setNumberOfTurns] = useState(10);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data: room } = await httpClient.post("/room", {
      maxPlayers,
      numberOfTurns,
    });

    navigate(`/room/${room.id}`);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-card">
      <img
        src="https://garticphone.com/images/avatar/1.svg"
        alt="avatar"
        width={100}
      />
      <h2>Welcome back {user.username}</h2>
      <h3>How would you like to play</h3>
      <div style={{ display: "flex", gap: 10, margin: 10 }}>
        <button
          className="primary"
          onClick={() => setIsCreateRoomDialogOpen(true)}
        >
          Create a Room
        </button>
        <button className="primary" onClick={handleJoin}>
          Join a Room
        </button>
      </div>
      <Dialog
        title={"Create New Room"}
        isOpen={isCreateRoomDialogOpen}
        onClose={() => setIsCreateRoomDialogOpen(false)}
      >
        <form onSubmit={handleCreate} style={{ padding: 15 }}>
          <div className="input-group">
            <label htmlFor="username">Max Players?</label>
            <input
              type="number"
              id="maxPlayers"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">How Many Turns?</label>
            <input
              type="number"
              id="numberOfTurns"
              value={numberOfTurns}
              onChange={(e) => setNumberOfTurns(e.target.value)}
              required
            />
          </div>
          <button className="primary" type="submit">
            Create
          </button>
        </form>
      </Dialog>
    </div>
  );
}