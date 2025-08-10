import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Grid from "./components/Grid";
import Vacuum from "./components/Vacuum";
import Controls from "./components/Controls";
import "./App.css";

const TILE_SIZE = 1.5;
const GRID_SIZE = 10;

function bfs(start, target, grid) {
  const [sx, sy] = start;
  const [tx, ty] = target;
  const visited = new Set();
  const queue = [[sx, sy, []]];
  const inBounds = (x, y) => x >= 0 && y >= 0 && x < GRID_SIZE && y < GRID_SIZE;

  while (queue.length) {
    const [x, y, path] = queue.shift();
    if (x === tx && y === ty) return [...path, [x, y]];

    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    for (const [nx, ny] of [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]) {
      if (
          inBounds(nx, ny) &&
          !visited.has(`${nx},${ny}`) &&
          grid[ny][nx].type !== "obstacle"
      ) {
        queue.push([nx, ny, [...path, [x, y]]]);
      }
    }
  }
  return null;
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

  // Handle clicks from Grid: (x = col, y = row)
  const handleCellClick = (x, y) => {
    setGrid(prevGrid => {
      let newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));

      if (paintMode === "start") {
        // Remove previous start tile if exists
        newGrid = newGrid.map(row =>
            row.map(cell => (cell.type === "start" ? { type: "empty" } : cell))
        );

        // Set new start position tile
        newGrid[y][x] = { type: "start" };
        setStartPos([x, y]);

        // Move vacuum to start position immediately
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
      const segment = bfs(current, target, grid);
      if (!segment) {
        alert(
            `No path to dirt at (${target[0]}, ${target[1]}). Please check obstacles.`
        );
        setIsCleaning(false);
        return;
      }
      fullPath = fullPath.concat(segment.slice(1));
      current = target;
    }

    const returnSegment = bfs(current, startPos, grid);
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
        <Canvas
            style={{ height: "100vh", width: "100vw" }}
            camera={{ position: [15, 25, 15], fov: 50 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 20, 10]} />
          <OrbitControls />

          <Grid grid={grid} onCellClick={handleCellClick} />
          <Vacuum position={vacuumPos} />
        </Canvas>
      </>
  );
}
