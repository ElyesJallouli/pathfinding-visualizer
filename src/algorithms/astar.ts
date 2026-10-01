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

function heuristic(node: NodeType, finishNode: NodeType) {
  return (
    Math.abs(node.row - finishNode.row) +
    Math.abs(node.col - finishNode.col)
  );
}

export function astar(
  grid: NodeType[][],
  startNode: NodeType,
  finishNode: NodeType
) {
  const distances = new Map<string, number>();
  const previous = new Map<string, NodeType>();
  const openSet: NodeType[] = [];
  const visited = new Set<string>();
  const visitedNodesInOrder: NodeType[] = [];

  for (const row of grid) {
    for (const node of row) {
      distances.set(`${node.row}-${node.col}`, Infinity);
    }
  }

  distances.set(`${startNode.row}-${startNode.col}`, 0);
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => {
      const scoreA =
        distances.get(`${a.row}-${a.col}`)! +
        heuristic(a, finishNode);

      const scoreB =
        distances.get(`${b.row}-${b.col}`)! +
        heuristic(b, finishNode);

      return scoreA - scoreB;
    });

    const current = openSet.shift()!;
    const currentKey = `${current.row}-${current.col}`;

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
    visitedNodesInOrder.push(current);

    if (
      current.row === finishNode.row &&
      current.col === finishNode.col
    ) {
      break;
    }

    const neighbors = getNeighbors(current, grid);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;

      if (visited.has(neighborKey)) {
        continue;
      }

      const newDistance =
  distances.get(currentKey)! + neighbor.weight;

      if (newDistance < distances.get(neighborKey)!) {
        distances.set(neighborKey, newDistance);
        previous.set(neighborKey, current);
        openSet.push(neighbor);
      }
    }
  }

  const shortestPath: NodeType[] = [];

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

  return {
    visitedNodesInOrder,
    shortestPath,
  };
}