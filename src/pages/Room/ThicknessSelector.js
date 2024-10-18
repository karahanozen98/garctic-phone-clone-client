export default function ThicknessSelector({ setting }) {
  const sizes = [3, 5, 10, 15, 20];

  const handleClick = (size) => {
    setting.current.stroke = size;
  };

  return (
    <div
      id="pen-thickness"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        padding: 10,
        background: "#222",
        borderRadius: 10,
      }}
    >
      {sizes.map((size) => (
        <div
          id={size}
          key={size}
          className="pen-thickness-outer-dot"
          style={{
            width: 30,
            height: 30,
          }}
          onClick={() => handleClick(size)}
        >
          <div
            className="pen-thickness-inner-dot"
            style={{ width: size, height: size }}
            onClick={() => handleClick(size)}
          ></div>
        </div>
      ))}
    </div>
  );
}
