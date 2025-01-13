import React from "react";
import "../index.scss";
import { Grid } from "../Types";

type TetrisBoardProps = {
  grid: Grid;
};

export const TetrisBoard: React.FC<TetrisBoardProps> = ({ grid }) => {
  return (
    <div className="tetris-board">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((column, colIndex) => (
            <div
              key={colIndex}
              className={`column ${column.value !== 0 ? "filled" : ""}`}
              style={{ backgroundColor: column.color ? column.color : undefined }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};
