import { useRoomStore } from "../../store/roomStore";
import { useParams } from "react-router-dom";
import ThicknessSelector from "./ThicknessSelector";
import { useIsMobile } from "../../hooks";

export function BottomBar({ settings, history }) {
  const { id } = useParams();
  const sendDrawing = useRoomStore((state) => state.sendDrawing);
  const quest = useRoomStore((state) => state.quest);
  const isMobile = useIsMobile();

  const handleSendDrawing = () => {
    const canvasState = history.current;

    if (history.current.length > 0) {
      sendDrawing(id, { quest, drawing: canvasState });
    }
  };

  return (
    <div
      id="save-drawing"
      style={{
        display: "flex",
        margin: "20px",
        justifyContent: "space-evenly",
        gap: 10,
      }}
    >
      <ThicknessSelector setting={settings} />
      {!isMobile ? (
        <button
          className="primary bold"
          style={{ width: 200, fontSize: "1.1rem" }}
          onClick={handleSendDrawing}
        >
          <i
            className="fa-solid fa-check fa-2xl"
            style={{ color: "#63E6BE", marginRight: 5 }}
          ></i>
          DONE
        </button>
      ) : (
        <button
          className="primary bold"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleSendDrawing}
        >
          <i
            className="fa-solid fa-check fa-md"
            style={{ color: "#63E6BE", marginRight: 5 }}
          ></i>
          DONE
        </button>
      )}
    </div>
  );
}
