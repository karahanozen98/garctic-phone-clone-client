import { useRoomStore } from "../../store/roomStore";

export default function ProfileCard({
  player,
  avatarSize = 100,
  padding = 10,
  margin = 10,
  gap = 10,
  showIsReadyView,
}) {
  const room = useRoomStore((state) => state.room);
  const pfpIndex = room ? room.players.findIndex((p) => p.id === player.id) : 0;

  return (
    <div style={{ color: "#333", background: "#fdfdfd", borderRadius: 15 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding,
          margin,
          gap,
        }}
      >
        <img
          src={`https://garticphone.com/images/avatar/${pfpIndex}.svg`}
          width={avatarSize}
          alt="avatar"
        />
        <h3>{player.username}</h3>
        {showIsReadyView &&
          (player.isReady ? (
            <i
              className="fa-solid fa-check fa-2xl"
              style={{ color: "#63E6BE" }}
            ></i>
          ) : (
            <i
              className="fa-solid fa-hourglass-start fa-xl"
              style={{ animation: `spin ${3}s linear infinite` }}
            ></i>
          ))}
      </div>
    </div>
  );
}
