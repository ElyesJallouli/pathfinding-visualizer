export interface NodeType {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isFinish: boolean;
  isVisited: boolean;
  isPath: boolean;
  weight: number;
}