import React from "react";

const CircularProgressWithBackdrop = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="backdrop">
      <div className="circular-progress"></div>
    </div>
  );
};

export default CircularProgressWithBackdrop;
