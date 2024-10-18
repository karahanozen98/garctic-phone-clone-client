import React, { useEffect, useState } from "react";

const ColorPalette = ({ value, onSelectColor }) => {
  const colors = [
    "#FF5733", // Red
    "#33FF57", // Green
    "#3357FF", // Blue
    "#FF33A1", // Pink
    "#33FFF9", // Aqua
    "#FFC300", // Yellow
    "#900C3F", // Purple
    "#DAF7A6", // Light Green
    "#581845", // Dark Purple
    "#FF8C00", // Orange
  ];

  const [selectedColor, setSelectedColor] = useState(value);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    onSelectColor(color); // Pass the selected color to the parent component
  };

  const handleColorPicker = (e) => {
    setSelectedColor(e.target.value);
    onSelectColor(e.target.value); // Pass the selected color to the parent component
  };

  useEffect(() => {
    setSelectedColor(value);
  }, [value]);

  return (
    <div
      style={{
        padding: "10px",
        background: "#332344",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto",
        }}
      >
        {colors.map((color, index) => (
          <div
            key={index}
            onClick={() => handleColorClick(color)}
            style={{
              backgroundColor: color,
              width: "20px",
              height: "20px",
              cursor: "pointer",
              margin: 10,
              border:
                selectedColor === color ? "3px solid #fff" : "1px solid #ccc",
              borderRadius: 5,
            }}
          ></div>
        ))}
      </div>
      <input
        type="color"
        title="Select color"
        value={selectedColor}
        style={{
          width: "40px",
          height: "40px",
          margin: "5px",
          borderRadius: "50%",
        }}
        onChange={handleColorPicker}
      />
    </div>
  );
};

export default ColorPalette;
