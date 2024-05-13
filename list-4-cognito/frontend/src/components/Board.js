import React from "react";
import Cell from "./Cell";

function Board({ board, handleMove }) {

  const renderCells = () => {
    return board.map((_, index) => (
      <Cell key={index} index={index} onCellClick={handleMove} content={board[index]}/>
    ));
  };

  return <div className="gameBoard">{renderCells()}</div>;
}

export default Board;
