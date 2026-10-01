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

export function dijkstra(
  grid: NodeType[][],
  startNode: NodeType,
  finishNode: NodeType
) {
  const distances = new Map<string, number>();
  const previous = new Map<string, NodeType>();
  const unvisited: NodeType[] = [];
  const visitedNodesInOrder: NodeType[] = [];

  for (const row of grid) {
    for (const node of row) {
      distances.set(`${node.row}-${node.col}`, Infinity);
      unvisited.push(node);
    }
  }

  distances.set(`${startNode.row}-${startNode.col}`, 0);

  while (unvisited.length > 0) {
    unvisited.sort(
      (a, b) =>
        distances.get(`${a.row}-${a.col}`)! -
        distances.get(`${b.row}-${b.col}`)!
    );

    const current = unvisited.shift()!;

    if (distances.get(`${current.row}-${current.col}`) === Infinity) {
      break;
    }

    visitedNodesInOrder.push(current);

    if (
      current.row === finishNode.row &&
      current.col === finishNode.col
    ) {
      break;
    }

    const neighbors = getNeighbors(current, grid);

    for (const neighbor of neighbors) {
      const currentDistance =
        distances.get(`${current.row}-${current.col}`)!;

      const newDistance = currentDistance + neighbor.weight;

      const neighborKey = `${neighbor.row}-${neighbor.col}`;

      if (newDistance < distances.get(neighborKey)!) {
        distances.set(neighborKey, newDistance);
        previous.set(neighborKey, current);
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