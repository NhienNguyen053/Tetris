import { useEffect, useState } from "react";
import { TetrisBoard } from "./components/TetrisBoard";
import { Grid, Tetromino, TETROMINOES } from "./Types";
import { createEmptyGrid, COLS, checkForCellBelow, filterPositions, getRandomTetrominoKey } from "./utils";

function Tetris() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [isRunning, setIsRunning] = useState(false);
  const [tetromino, setTetromino] = useState<Tetromino>(TETROMINOES["I"]);
  const [tetrominoPositions, setTetrominoPositions] = useState<{ row: number; col: number }[]>([]);
  const [tetrominoAtBottom, setTetrominoAtBottom] = useState(true);

  const insertTetromino = () => {
    const randomTetrominoKey = getRandomTetrominoKey();
    const tetromino = TETROMINOES[randomTetrominoKey];
    setTetromino(tetromino);
    const shape = tetromino.shape;

    const startRow = 0;
    const startCol = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);

    const newGrid = grid.map((row) => [...row]);

    const tetrominoPositions: { row: number; col: number }[] = [];

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          const gridRow = startRow + rowIndex;
          const gridCol = startCol + colIndex;

          newGrid[gridRow][gridCol].value = 1;
          newGrid[gridRow][gridCol].color = tetromino.color;

          tetrominoPositions.push({ row: gridRow, col: gridCol });
        }
      });
    });

    setTetrominoPositions(tetrominoPositions);
    setGrid(newGrid);
    setTetrominoAtBottom(false); // This is only temporary for now
  };

  const moveTetrominoDown = () => {
    const currentPosition = tetrominoPositions;
    const bottomPositions = filterPositions(currentPosition);
    const isBlocked = checkForCellBelow(bottomPositions, grid);
    if (!isBlocked) {
      const newPositions = tetrominoPositions.map((position) => ({
        row: position.row + 1,
        col: position.col,
      }));

      const newGrid = grid.map((row) => [...row]);

      tetrominoPositions.forEach((position) => {
        const { row, col } = position;
        newGrid[row][col].value = 0;
        newGrid[row][col].color = '';
      });

      newPositions.forEach((position) => {
        const { row, col } = position;
        newGrid[row][col].value = 1;
        newGrid[row][col].color = tetromino.color;
      });
      setGrid(newGrid);
      setTetrominoPositions(newPositions);
      setTetrominoAtBottom(false);
    } else {
      insertTetromino();
      setTetrominoAtBottom(true);
    }
  };

  const runGame = () => {
    if (tetrominoAtBottom) {
      insertTetromino();
    } else {
      moveTetrominoDown();
    }
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        runGame();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRunning, grid]);

  const startGame = () => {
    setIsRunning(true);
  };

  const stopGame = () => {
    setIsRunning(false);
  };

  return (
    <div className="container">
      <TetrisBoard grid={grid} />
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <button onClick={startGame} disabled={isRunning}>
          Start Game
        </button>
        <button onClick={stopGame} disabled={!isRunning}>
          Stop Game
        </button>
      </div>
    </div>
  );
}

export default Tetris;
