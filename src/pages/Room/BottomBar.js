import { useRoomStore } from "../../store/roomStore";
import { useParams } from "react-router-dom";
import ThicknessSelector from "./ThicknessSelector";
import { useIsMobile } from "../../hooks";
import { toast } from "react-toastify";

export function BottomBar({ settings, history }) {
  const { id } = useParams();
  const sendDrawing = useRoomStore((state) => state.sendDrawing);
  const isMobile = useIsMobile();

  const handleSendDrawing = () => {
    if (history.current.length <= 0) {
      toast.warn("You haven't drawn anything");
      return;
    }

    const canvasState = history.current;

    if (history.current.length > 0) {
      sendDrawing(id, { drawing: canvasState });
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
