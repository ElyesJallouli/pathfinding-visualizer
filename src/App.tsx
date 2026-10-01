import { useState } from "react";
import Grid from "./components/Grid";
import Controls from "./components/Controls";
import type { NodeType } from "./types/Node";
import { bfs } from "./algorithms/bfs";
import { dijkstra } from "./algorithms/dijkstra";
import { astar } from "./algorithms/astar";

const ROWS = 20;
const COLS = 40;

function createGrid(): NodeType[][] {
  const grid: NodeType[][] = [];

  for (let row = 0; row < ROWS; row++) {
    const currentRow: NodeType[] = [];

    for (let col = 0; col < COLS; col++) {
      currentRow.push({
        row,
        col,
        isWall: false,
        isStart: row === 10 && col === 5,
        isFinish: row === 10 && col === 35,
        isVisited: false,
        isPath: false,
        weight: 1,
      });
    }

    grid.push(currentRow);
  }

  return grid;
}

function App() {
  const [grid, setGrid] = useState<NodeType[][]>(createGrid());
  const [algorithm, setAlgorithm] = useState("bfs");
  const [status, setStatus] = useState("Ready");
  const [visitedCount, setVisitedCount] = useState(0);
  const [pathLength, setPathLength] = useState<number | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);

  function handleNodeClick(row: number, col: number) {
    if (isVisualizing) {
      return;
    }

    const newGrid = grid.map(currentRow =>
      currentRow.map(node => {
        if (node.row === row && node.col === col) {
          if (node.isStart || node.isFinish) {
            return node;
          }

          return {
            ...node,
            isWall: !node.isWall,
          };
        }

        return node;
      })
    );

    setGrid(newGrid);
  }

  function handleNodeRightClick(row: number, col: number) {
    if (isVisualizing) {
      return;
    }

    const newGrid = grid.map(currentRow =>
      currentRow.map(node => {
        if (node.row === row && node.col === col) {
          if (node.isStart || node.isFinish || node.isWall) {
            return node;
          }

          return {
            ...node,
            weight: node.weight === 1 ? 5 : 1,
          };
        }

        return node;
      })
    );

    setGrid(newGrid);
  }

  function visualize() {
    if (isVisualizing) {
      return;
    }

    setIsVisualizing(true);
    setStatus(`Visualizing ${algorithm.toUpperCase()}...`);
    setVisitedCount(0);
    setPathLength(null);

    const startNode = grid[10][5];
    const finishNode = grid[10][35];

    let result;

    if (algorithm === "bfs") {
      result = bfs(grid, startNode, finishNode);
    } else if (algorithm === "dijkstra") {
      result = dijkstra(grid, startNode, finishNode);
    } else {
      result = astar(grid, startNode, finishNode);
    }

    const { visitedNodesInOrder, shortestPath } = result;

    visitedNodesInOrder.forEach((node, index) => {
      setTimeout(() => {
        setVisitedCount(index + 1);

        setGrid(currentGrid =>
          currentGrid.map(row =>
            row.map(currentNode => {
              if (
                currentNode.row === node.row &&
                currentNode.col === node.col
              ) {
                return {
                  ...currentNode,
                  isVisited: true,
                };
              }

              return currentNode;
            })
          )
        );
      }, 20 * index);
    });

    const pathStartTime = visitedNodesInOrder.length * 20;

    shortestPath.forEach((node, index) => {
      setTimeout(() => {
        setGrid(currentGrid =>
          currentGrid.map(row =>
            row.map(currentNode => {
              if (
                currentNode.row === node.row &&
                currentNode.col === node.col
              ) {
                return {
                  ...currentNode,
                  isPath: true,
                };
              }

              return currentNode;
            })
          )
        );
      }, pathStartTime + 50 * index);
    });

    setTimeout(() => {
      if (shortestPath.length > 0) {
        setStatus("Path found");
        setPathLength(shortestPath.length);
      } else {
        setStatus("No path found");
        setPathLength(null);
      }

      setIsVisualizing(false);
    }, pathStartTime + 50 * shortestPath.length);
  }
function generateRandomWalls() {
  if (isVisualizing) {
    return;
  }

  setGrid(currentGrid =>
    currentGrid.map(row =>
      row.map(node => {
        if (node.isStart || node.isFinish) {
          return {
            ...node,
            isWall: false,
          };
        }

        return {
          ...node,
          isWall: Math.random() < 0.25,
          isVisited: false,
          isPath: false,
        };
      })
    )
  );

  setStatus("Random walls generated");
  setVisitedCount(0);
  setPathLength(null);
}
  function clearPath() {
    if (isVisualizing) {
      return;
    }

    setGrid(currentGrid =>
      currentGrid.map(row =>
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
        }))
      )
    );

    setStatus("Ready");
    setVisitedCount(0);
    setPathLength(null);
  }

  function clearBoard() {
    if (isVisualizing) {
      return;
    }

    setGrid(createGrid());
    setStatus("Ready");
    setVisitedCount(0);
    setPathLength(null);
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Pathfinding Visualizer</h1>
          <p>
            Explore how pathfinding algorithms find the shortest path.
          </p>
        </div>
      </header>

      <main>
        <div className="stats">
          <div>
            Status: <strong>{status}</strong>
          </div>

          <div>
            Visited: <strong>{visitedCount}</strong>
          </div>

          <div>
            Path length: <strong>{pathLength ?? "-"}</strong>
          </div>
        </div>

        <Controls
          algorithm={algorithm}
          isVisualizing={isVisualizing}
          onAlgorithmChange={setAlgorithm}
          onVisualize={visualize}
          onClearPath={clearPath}
          onClearBoard={clearBoard}
          onGenerateWalls={generateRandomWalls}
        />

        <div className="legend">
          <div className="legend-item">
            <span className="legend-node start"></span>
            Start
          </div>

          <div className="legend-item">
            <span className="legend-node finish"></span>
            Finish
          </div>

          <div className="legend-item">
            <span className="legend-node wall"></span>
            Wall
          </div>

          <div className="legend-item">
            <span className="legend-node weighted"></span>
            Weighted
          </div>

          <div className="legend-item">
            <span className="legend-node visited"></span>
            Visited
          </div>

          <div className="legend-item">
            <span className="legend-node path"></span>
            Shortest Path
          </div>
        </div>

        <div className="grid-container">
          <Grid
            grid={grid}
            onNodeClick={handleNodeClick}
            onNodeRightClick={handleNodeRightClick}
          />
        </div>
      </main>
    </div>
  );
}

export default App;