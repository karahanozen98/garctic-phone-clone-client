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
        }}
      >
        <img
          src={`https://garticphone.com/images/avatar/${index}.svg`}
          width={100}
          alt="avatar"
        />
        <h3>{player.username}</h3>
      </div>
    </div>
  );
}
