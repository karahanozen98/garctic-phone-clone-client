import { useRoomStore } from "../../store/roomStore";

export default function CanvasHeader() {
  const quest = useRoomStore((state) => state.quest);

  return (
    <>
      {quest?.type === 0 ? (
        <div style={{ color: "white", fontWeight: "bold", padding: 10 }}>
          <h2 style={{ color: "#40E0D0" }}>HEY IT'S TIME TO DRAW!</h2>
          <h1>{quest?.content?.toUpperCase()}</h1>
        </div>
      ) : (
        <div style={{ color: "white", fontWeight: "bold", padding: 10 }}>
          <h2 style={{ color: "#40E0D0" }}>
            HEY IT'S TIME TO GUESS THE DRAWING!
          </h2>
        </div>
      )}
    </>
  );
}
