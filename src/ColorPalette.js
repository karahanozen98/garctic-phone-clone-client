import React, { useEffect, useState } from "react";
import { useIsMobile } from "./hooks";

const ColorPalette = ({ value, onSelectColor }) => {
  const isMobile = useIsMobile();
  const colors = [
    "#000", // Red
    "#555", // Red
    "#FF0000", // Red
    "#22FF00", // Green
    "#2222FF", // Blue
    "#FF33A1", // Pink
    "#33FFF9", // Aqua
    "#FFFF00", // Yellow
    "#FF8C00", // Orange
    "#900C3F", // Purple
    "#DAF7A6", // Light Green
    "#581845", // Dark Purple
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
          gridTemplateColumns: "auto auto auto",
        }}
      >
        {colors.map((color, index) => (
          <div
            key={index}
            onClick={() => handleColorClick(color)}
            style={{
              backgroundColor: color,
              width: isMobile ? 20 : 30,
              height: isMobile ? 20 : 30,
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
        className="color-input"
        type="color"
        title="Select color"
        value={selectedColor}
        onChange={handleColorPicker}
      />
    </div>
  );
};

export default ColorPalette;
