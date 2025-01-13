import { Grid, TETROMINOES } from "./Types";

export const ROWS = 20;
export const COLS = 10;

export const getRandomTetrominoKey = () => {
  const keys = Object.keys(TETROMINOES) as (keyof typeof TETROMINOES)[];
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
};

export const createEmptyGrid = (): Grid => {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ value: 0, color: "" }))
  );
};

export const filterPositions = (positions: { row: number; col: number }[]) => {
  const sortedPositions = positions.sort((a, b) => {
    if (a.row === b.row) {
      return a.col - b.col;
    }
    return a.row - b.row;
  });

  const filteredPositions = sortedPositions.filter((current, _, arr) => {
    const isAboveAny = arr.some(
      (other) => other.row > current.row && other.col === current.col
    );
    return !isAboveAny;
  });

  return filteredPositions;
};

export const checkForCellBelow = (bottomPositions: { row: number; col: number }[], grid: Grid) => {
  for (const position of bottomPositions) {
    const { row, col } = position;
    const belowRow = row + 1;
    if (belowRow < ROWS) {
      const cellBelow = grid[belowRow][col];
      if (cellBelow.value === 1) {
        return true;
      }
    } else {
      return true; 
    }
  }
  return false;
};

