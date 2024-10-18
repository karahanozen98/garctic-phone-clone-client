import React from "react";

const Card = ({ style, children }) => {
  return (
    <div className="card-container">
      <div className="card" style={style}>
        {children}
      </div>
    </div>
  );
};

export default Card;
