interface ControlsProps {
  algorithm: string;
  isVisualizing: boolean;
  onAlgorithmChange: (algorithm: string) => void;
  onVisualize: () => void;
  onClearPath: () => void;
  onClearBoard: () => void;
  onGenerateWalls: () => void;
}

function Controls({
  algorithm,
  isVisualizing,
  onAlgorithmChange,
  onVisualize,
  onClearPath,
  onClearBoard,
  onGenerateWalls,
}: ControlsProps) {
  return (
    <div className="controls">
      <select
        value={algorithm}
        disabled={isVisualizing}
        onChange={event => onAlgorithmChange(event.target.value)}
      >
        <option value="bfs">BFS</option>
        <option value="dijkstra">Dijkstra</option>
        <option value="astar">A*</option>
      </select>

      <button onClick={onVisualize} disabled={isVisualizing}>
        Visualize {algorithm.toUpperCase()}
      </button>

      <button onClick={onGenerateWalls} disabled={isVisualizing}>
        Random Walls
      </button>

      <button onClick={onClearPath} disabled={isVisualizing}>
        Clear Path
      </button>

      <button onClick={onClearBoard} disabled={isVisualizing}>
        Clear Board
      </button>
    </div>
  );
}

export default Controls;