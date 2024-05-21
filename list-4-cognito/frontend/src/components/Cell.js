import React from "react";

function Cell({ index, onCellClick, content }) {
  return <div className="cell" onClick={() => onCellClick(index)}>
    {content}
  </div>;
}

export default Cell;
