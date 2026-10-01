import type { NodeType } from "../types/Node";

function getNeighbors(node: NodeType, grid: NodeType[][]) {
  const neighbors: NodeType[] = [];

  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1],  // right
  ];

  for (const [rowChange, colChange] of directions) {
    const newRow = node.row + rowChange;
    const newCol = node.col + colChange;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length
    ) {
      const neighbor = grid[newRow][newCol];

      if (!neighbor.isWall) {
        neighbors.push(neighbor);
      }
    }
  }

  return neighbors;
}

export function bfs(
  grid: NodeType[][],
  startNode: NodeType,
  finishNode: NodeType
) {
  const queue: NodeType[] = [];
  const visited = new Set<string>();
  const visitedNodesInOrder: NodeType[] = [];
  const previous = new Map<string, NodeType>();

  queue.push(startNode);
  visited.add(`${startNode.row}-${startNode.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;

    visitedNodesInOrder.push(current);

    if (
      current.row === finishNode.row &&
      current.col === finishNode.col
    ) {
      break;
    }

    const neighbors = getNeighbors(current, grid);

    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;

      if (!visited.has(key)) {
        visited.add(key);
        previous.set(key, current);
        queue.push(neighbor);
      }
    }
  }

  const finishKey = `${finishNode.row}-${finishNode.col}`;
  const shortestPath: NodeType[] = [];

  // Check if the finish node was actually reached
  if (visited.has(finishKey)) {
    let current: NodeType | undefined = finishNode;

    while (current) {
      shortestPath.unshift(current);

      if (
        current.row === startNode.row &&
        current.col === startNode.col
      ) {
        break;
      }

      current = previous.get(`${current.row}-${current.col}`);
    }
  }

  return {
    visitedNodesInOrder,
    shortestPath,
  };
}