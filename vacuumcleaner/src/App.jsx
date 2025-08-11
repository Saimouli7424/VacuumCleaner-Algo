import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Grid from "./components/Grid";
import Vacuum from "./components/Vacuum";
import Controls from "./components/Controls";
import "./App.css";

const TILE_SIZE = 1.5;
const GRID_SIZE = 10;

// Simple priority queue implementation using a binary heap
class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }
  enqueue(element, priority) {
    this.heap.push({ element, priority });
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.heap.length - 1;
    const element = this.heap[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.heap[parentIdx];
      if (element.priority >= parent.priority) break;
      this.heap[idx] = parent;
      this.heap[parentIdx] = element;
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }
  sinkDown(idx) {
    const length = this.heap.length;
    const element = this.heap[idx];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let swap = null;
      if (leftChildIdx < length) {
        if (this.heap[leftChildIdx].priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        if (
            (swap === null && this.heap[rightChildIdx].priority < element.priority) ||
            (swap !== null && this.heap[rightChildIdx].priority < this.heap[leftChildIdx].priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      this.heap[swap] = element;
      idx = swap;
    }
  }
  isEmpty() {
    return this.heap.length === 0;
  }
}

// Dijkstra algorithm for grid pathfinding
function dijkstra(start, target, grid) {
  const [sx, sy] = start;
  const [tx, ty] = target;
  const dist = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(Infinity));
  dist[sy][sx] = 0;

  const prev = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null));

  const pq = new MinPriorityQueue();
  pq.enqueue([sx, sy], 0);

  const inBounds = (x, y) => x >= 0 && y >= 0 && x < GRID_SIZE && y < GRID_SIZE;

  while (!pq.isEmpty()) {
    const { element: [x, y] } = pq.dequeue();

    if (x === tx && y === ty) {
      // Reconstruct path from target to start
      const path = [];
      let cx = x,
          cy = y;
      while (cx !== null && cy !== null) {
        path.unshift([cx, cy]);
        const p = prev[cy][cx];
        if (!p) break;
        [cx, cy] = p;
      }
      return path;
    }

    for (const [nx, ny] of [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]) {
      if (inBounds(nx, ny) && grid[ny][nx].type !== "obstacle") {
        const cost = dist[y][x] + 1; // uniform cost; update if variable cost needed
        if (cost < dist[ny][nx]) {
          dist[ny][nx] = cost;
          prev[ny][nx] = [x, y];
          pq.enqueue([nx, ny], cost);
        }
      }
    }
  }
  return null; // no path found
}

export default function App() {
  const [grid, setGrid] = useState(
      Array(GRID_SIZE)
          .fill(null)
          .map(() =>
              Array(GRID_SIZE)
                  .fill(null)
                  .map(() => ({ type: "empty" }))
          )
  );

  const [paintMode, setPaintMode] = useState("start");
  const [selectedObstacle, setSelectedObstacle] = useState("bed");
  const [startPos, setStartPos] = useState(null);
  const [vacuumPos, setVacuumPos] = useState([0, 0.25, 0]);
  const [vacuumTarget, setVacuumTarget] = useState([0, 0.25, 0]);
  const [vacuumPath, setVacuumPath] = useState([]);
  const [vacuumIndex, setVacuumIndex] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleCellClick = (x, y) => {
    setGrid((prevGrid) => {
      let newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));

      if (paintMode === "start") {
        newGrid = newGrid.map((row) =>
            row.map((cell) => (cell.type === "start" ? { type: "empty" } : cell))
        );
        newGrid[y][x] = { type: "start" };
        setStartPos([x, y]);
        setVacuumPos([x * TILE_SIZE, 0.25, y * TILE_SIZE]);
      } else if (paintMode === "dirt") {
        newGrid[y][x] = { type: "dirt" };
      } else if (paintMode === "obstacle") {
        newGrid[y][x] = { type: "obstacle", obstacleType: selectedObstacle };
      } else if (paintMode === "empty") {
        newGrid[y][x] = { type: "empty" };
      }

      return newGrid;
    });
  };

  const clearObstacles = () => {
    setGrid((prev) =>
        prev.map((row) =>
            row.map((cell) => (cell.type === "obstacle" ? { type: "empty" } : cell))
        )
    );
  };

  const startCleaning = () => {
    if (!startPos) {
      alert("Please set a start position first!");
      return;
    }

    const dirtTiles = [];
    grid.forEach((row, y) =>
        row.forEach((cell, x) => {
          if (cell.type === "dirt") dirtTiles.push([x, y]);
        })
    );

    if (dirtTiles.length === 0) {
      alert("No dirt to clean!");
      return;
    }

    let fullPath = [];
    let current = startPos;

    for (const target of dirtTiles) {
      const segment = dijkstra(current, target, grid);
      if (!segment) {
        alert(`No path to dirt at (${target[0]}, ${target[1]}). Please check obstacles.`);
        setIsCleaning(false);
        return;
      }
      fullPath = fullPath.concat(segment.slice(1));
      current = target;
    }

    const returnSegment = dijkstra(current, startPos, grid);
    if (!returnSegment) {
      alert("No path to return to start!");
      setIsCleaning(false);
      return;
    }
    fullPath = fullPath.concat(returnSegment.slice(1));

    setVacuumPath(fullPath);
    setVacuumIndex(0);
    setIsCleaning(true);
  };

  useEffect(() => {
    if (!isCleaning) return;

    if (vacuumIndex >= vacuumPath.length) {
      setIsCleaning(false);
      return;
    }

    const [x, y] = vacuumPath[vacuumIndex];
    setVacuumTarget([x * TILE_SIZE, 0.25, y * TILE_SIZE]);

    setGrid((prev) => {
      const newGrid = prev.map((row) => row.map((cell) => ({ ...cell })));
      if (newGrid[y][x].type === "dirt") newGrid[y][x].type = "empty";
      return newGrid;
    });

    const timeout = setTimeout(() => {
      setVacuumIndex((i) => i + 1);
    }, 600);

    return () => clearTimeout(timeout);
  }, [isCleaning, vacuumIndex, vacuumPath]);

  useEffect(() => {
    if (!isCleaning) return;

    const interval = setInterval(() => {
      setVacuumPos((prev) => {
        const speed = 0.15;
        const lerp = (start, end, t) => start + (end - start) * t;
        const newX = lerp(prev[0], vacuumTarget[0], speed);
        const newY = lerp(prev[1], vacuumTarget[1], speed);
        const newZ = lerp(prev[2], vacuumTarget[2], speed);
        return [newX, newY, newZ];
      });
    }, 16);

    return () => clearInterval(interval);
  }, [vacuumTarget, isCleaning]);

  return (
      <>
        <Controls
            paintMode={paintMode}
            setPaintMode={setPaintMode}
            selectedObstacle={selectedObstacle}
            setSelectedObstacle={setSelectedObstacle}
            clearObstacles={clearObstacles}
            startCleaning={startCleaning}
        />
        <Canvas style={{ height: "100vh", width: "100vw" }} camera={{ position: [15, 25, 15], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 20, 10]} />
          <OrbitControls />

          <Grid grid={grid} onCellClick={handleCellClick} />
          <Vacuum position={vacuumPos} />
        </Canvas>
      </>
  );
}
