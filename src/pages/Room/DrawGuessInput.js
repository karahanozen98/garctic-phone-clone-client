import { useState } from "react";
import { useRoomStore } from "../../store/roomStore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function DrawGuessInput() {
  const { id } = useParams();
  const [sentence, setSentence] = useState("");
  const sendSentence = useRoomStore((state) => state.sendSentence);

  const handleSendSentence = (e) => {
    e.preventDefault();

    if (sentence.length < 2) {
      toast.warn("You sentence looks to short!");
      return;
    }

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
        maxWidth: "800px",
      }}
    >
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter what you see in this picture"
          minLength={2}
          value={sentence}
          style={{ fontSize: "1.5rem" }}
          onChange={(e) => setSentence(e.target.value)}
          required
        />
      </div>
      <div>
        <button
          className="primary bold"
          style={{ fontSize: "1.2rem" }}
          onClick={handleSendSentence}
        >
          DONE!
        </button>
      </div>
    </form>
  );
}
