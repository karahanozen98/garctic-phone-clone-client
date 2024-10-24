export default function ProfileCard({ player, index }) {
  return (
    <div style={{ color: "#333", background: "#fdfdfd", borderRadius: 15 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          margin: 10,
          gap: 10,
        }}
      >
        <img
          src={`https://garticphone.com/images/avatar/${index}.svg`}
          width={100}
          alt="avatar"
        />
        <h3>{player.username}</h3>
        {player.isReady ? (
          <i
            className="fa-solid fa-check fa-2xl"
            style={{ color: "#63E6BE" }}
          ></i>
        ) : (
          <i
            className="fa-solid fa-hourglass-start fa-xl"
            style={{ animation: `spin ${3}s linear infinite` }}
          ></i>
        )}
      </div>
    </div>
  );
}
