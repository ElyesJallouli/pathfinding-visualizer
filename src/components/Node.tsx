import type { NodeType } from "../types/Node";

interface NodeProps {
  node: NodeType;
  onClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
}

function Node({ node, onClick, onRightClick }: NodeProps) {
  let extraClass = "";

  if (node.isStart) {
    extraClass = "start";
  } else if (node.isFinish) {
    extraClass = "finish";
  } else if (node.isWall) {
    extraClass = "wall";
  } else if (node.isPath) {
  extraClass = "path";
} else if (node.isVisited && node.weight > 1) {
  extraClass = "weighted visited-weighted";
} else if (node.isVisited) {
  extraClass = "visited";
} else if (node.weight > 1) {
  extraClass = "weighted";
}

  return (
    <div
      className={`node ${extraClass}`}
      onClick={() => onClick(node.row, node.col)}
      onContextMenu={event => {
        event.preventDefault();
        onRightClick(node.row, node.col);
      }}
    />
  );
}

export default Node;