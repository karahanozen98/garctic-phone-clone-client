import { useState } from "react";
import { useRoomStore } from "../../store/roomStore";
import { useParams } from "react-router-dom";

export function DrawGuessInput() {
  const { id } = useParams();
  const [sentence, setSentence] = useState("");
  const sendSentence = useRoomStore((state) => state.sendSentence);

  const handleSendSentence = (e) => {
    e.preventDefault();
    sendSentence(id, sentence);
  };

  return (
    <form
      onSubmit={() => {}}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#fff",
        margin: "20px auto",
        padding: 50,
        borderRadius: 15,
        maxWidth: "500px",
      }}
    >
      <div className="input-group">
        <label htmlFor="username">Enter what you see in this drawing</label>
        <input
          type="text"
          placeholder="For example a cat eating ice cream"
          minLength={2}
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          required
        />
      </div>
      <div>
        <button className="primary bold" onClick={handleSendSentence}>
          DONE!
        </button>
      </div>
    </form>
  );
}
