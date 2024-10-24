import { useState } from "react";
import { useRoomStore } from "../../store/roomStore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useIsMobile } from "../../hooks";

export function DrawGuessInput() {
  const { id } = useParams();
  const [sentence, setSentence] = useState("");
  const sendSentence = useRoomStore((state) => state.sendSentence);
  const isMobile = useIsMobile();
  const fontSize = isMobile ? "1rem" : "1.5rem";
  const iconSize = isMobile ? "sm" : "2xl";

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
      onSubmit={handleSendSentence}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        margin: 10,
      }}
    >
      <input
        type="text"
        placeholder="Enter what you see in this picture"
        minLength={2}
        value={sentence}
        style={{
          fontSize,
          border: "none",
          padding: 20,
          flex: 10,
        }}
        onChange={(e) => setSentence(e.target.value)}
        required
      />
      <button
        type="submit"
        className="primary bold"
        style={{ fontSize, padding: 10, flex: 2 }}
      >
        <i
          className={`fa-solid fa-check fa-${iconSize}`}
          style={{ color: "#63E6BE" }}
        ></i>
        {" DONE!"}
      </button>
    </form>
  );
}
