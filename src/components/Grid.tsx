import Node from "./Node";
import type { NodeType } from "../types/Node";

interface GridProps {
  grid: NodeType[][];
  onNodeClick: (row: number, col: number) => void;
  onNodeRightClick: (row: number, col: number) => void;
}

function Grid({
  grid,
  onNodeClick,
  onNodeRightClick,
}: GridProps) {
  return (
    <div className="grid">
      {grid.map(row =>
        row.map(node => (
          <Node
            key={`${node.row}-${node.col}`}
            node={node}
            onClick={onNodeClick}
            onRightClick={onNodeRightClick}
          />
        ))
      )}
    </div>
  );
}

export default Grid;