export type Cell = {
    value: number;
    color: string; 
};
  
export type Grid = Cell[][];

export type Tetromino = {
  shape: number[][] | number[][][][];
  color: string;
};

export const TETROMINOES: Record<string, Tetromino> = {
    T: { 
        shape: [[0, 1, 0], [1, 1, 1]],
        color: "purple"
    },
    I: {
        shape: [[1], [1], [1], [1]],
        color: "blue"
    }
};