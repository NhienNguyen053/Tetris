import { useEffect, useState } from "react";
import { TetrisBoard } from "./components/TetrisBoard";
import { Grid, Tetromino, TETROMINOES } from "./Types";
import { createEmptyGrid, COLS, checkForCells, filterPositions, getRandomTetrominoKey } from "./utils";

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

  const moveTetromino = (direction: 'down' | 'left' | 'right') => {
    const currentPosition = tetrominoPositions;
    const directionPositions = filterPositions(currentPosition, direction);
    const isBlocked = checkForCells(directionPositions, grid, direction);
    if (!isBlocked) {
      const newPositions = tetrominoPositions.map((position) => {
        let newRow = position.row;
        let newCol = position.col;
        if (direction === "down") {
          newRow = position.row + 1;
        } else if (direction === "left") {
          newCol = position.col - 1;
        } else if (direction === "right") {
          newCol = position.col + 1;
        }
        return {
          row: newRow,
          col: newCol,
        };
      });

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
      setTetrominoPositions([]);
      insertTetromino();
      setTetrominoAtBottom(true);
    }
  };

  const runGame = () => {
    if (tetrominoAtBottom) {
      insertTetromino();
    } else {
      moveTetromino('down');
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isRunning) return;

    switch (event.key) {
      case 'ArrowDown':
        moveTetromino('down');
        break;
      case 'ArrowLeft':
        moveTetromino('left');
        break;
      case 'ArrowRight':
        moveTetromino('right');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, grid, tetrominoPositions]);

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
