import { useState, useEffect } from 'react';
import Node from './Node';
import bfs from '../algorithms/bfs';
import dfs from '../algorithms/dfs';
import dijkstra from '../algorithms/dijkstra';
import AStar from '../algorithms/astar';

export default function Grid() {
  const [grid, setGrid] = useState([]);
  const [mousePress, setmousePress] = useState(false);
  const [selectMode, setSelectMode] = useState(null);
  const [start, setStart] = useState({ row: 5, col: 5 });
  const [end, setEnd] = useState({ row: 5, col: 25 });
  const [selAlgo, setselAlgo] = useState('BFS');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setGrid(initialize());
  }, [start, end]);

  function initialize() {
    const rows = [];
    for (let row = 0; row < 15; row++) {
      const currentRow = [];
      for (let col = 0; col < 35; col++) {
        currentRow.push(createNode(row, col));
      }
      rows.push(currentRow);
    }
    return rows;
  }

  function createNode(row, col) {
    return {
      row,
      col,
      isStart: row === start.row && col === start.col,
      isEnd: row === end.row && col === end.col,
      isWall: false,
      isVisited: false,
      distance: Infinity,
      previousNode: null,
    };
  }

  function toggleWall(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return newGrid;
    const newNode = { ...node, isWall: !node.isWall };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  function handleMouseDown(row, col) {
    if (isRunning) return;

    if (selectMode === 'start') {
      setStart({ row, col });
      setSelectMode(null);
    } else if (selectMode === 'end') {
      setEnd({ row, col });
      setSelectMode(null);
    } else {
      const newGrid = toggleWall(grid, row, col);
      setGrid(newGrid);
      setmousePress(true);
    }
  }

  function handleMouseEnter(row, col) {
    if (!mousePress || selectMode || isRunning) return;
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
  }

  function handleMouseUp() {
    setmousePress(false);
  }

  function clearGrid() {
    if (isRunning) return;
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 35; col++) {
        const element = document.getElementById(`node-${row}-${col}`);
        if (element) {
          element.classList.remove('node-visited', 'node-path');
          element.style.backgroundColor = '';
        }
      }
    }
    setGrid(initialize());
  }

  function clearPath() {
    if (isRunning) return;
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 35; col++) {
        const element = document.getElementById(`node-${row}-${col}`);
        if (element) {
          element.classList.remove('node-visited', 'node-path');
          element.style.backgroundColor = '';
        }
      }
    }
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...createNode(node.row, node.col),
        isWall: node.isWall,
      }))
    );
    setGrid(newGrid);
  }

  function animate(visitedNodes, path = []) {
    setIsRunning(true);
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => animatePath(path), 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          element.classList.add('node-visited');
          element.style.backgroundColor = 'skyblue';
        }
      }, 10 * i);
    }
  }

  function animatePath(path) {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const node = path[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          element.classList.add('node-path');
          element.style.backgroundColor = '#fbbf24';
        }
      }, 50 * i);
    }
    setTimeout(() => setIsRunning(false), 50 * path.length);
  }

  function getShortestPath(endNode) {
    const path = [];
    let current = endNode;
    while (current !== null) {
      path.unshift(current);
      current = current.previousNode;
    }
    return path;
  }

  function visualize() {
    if (isRunning) return;

    clearPath();
    const newGrid = initializeWall();
    const startNode = newGrid[start.row][start.col];
    const endNode = newGrid[end.row][end.col];
    let visitedNodes = [];

    if (selAlgo === 'BFS') {
      visitedNodes = bfs(newGrid, startNode, endNode);
    } else if (selAlgo === 'DFS') {
      visitedNodes = dfs(newGrid, startNode, endNode);
    } else if (selAlgo === 'Dijkstra') {
      visitedNodes = dijkstra(newGrid, startNode, endNode);
    }
    else if (selAlgo === 'A*') {
  visitedNodes = AStar(newGrid, startNode, endNode);
}


    const path = getShortestPath(endNode);
    animate(visitedNodes, path);
  }

  function initializeWall() {
    return grid.map(row =>
      row.map(node => ({
        ...createNode(node.row, node.col),
        isWall: node.isWall,
      }))
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-center gap-4 mb-4">
          {['BFS', 'DFS', 'Dijkstra','A*'].map(algo => (
            <button
              key={algo}
              onClick={() => setselAlgo(algo)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selAlgo === algo
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => setSelectMode('start')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectMode === 'start'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          disabled={isRunning}
        >
          Set Start
        </button>

        <button
          onClick={() => setSelectMode('end')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectMode === 'end'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
          disabled={isRunning}
        >
          Set End
        </button>

        <button
          onClick={visualize}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md disabled:opacity-50"
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : `Visualize ${selAlgo}`}
        </button>

        <button
          onClick={clearPath}
          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-all duration-200 disabled:opacity-50"
          disabled={isRunning}
        >
          Clear Path
        </button>

        <button
          onClick={clearGrid}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
          disabled={isRunning}
        >
          Clear Grid
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
        <Legend color="green-500" label="Start Node" />
        <Legend color="red-500" label="End Node" />
        <Legend color="gray-800" label="Wall" />
        <Legend color="blue-400" label="Visited" />
        <Legend color="yellow-400" label="Path" />
      </div>

      <div className="text-center text-sm text-gray-600 mb-6">
        Click and drag to draw walls • Click "Set Start" or "Set End" then click on the grid to place nodes
      </div>

      <div className="flex justify-center">
        <div
          className="inline-block bg-white p-4 rounded-lg shadow-lg border"
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((node, nodeIdx) => (
                <Node
                  key={nodeIdx}
                  {...node}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={handleMouseEnter}
                  onMouseUp={handleMouseUp}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 bg-${color} rounded`}></div>
      <span>{label}</span>
    </div>
  );
}
