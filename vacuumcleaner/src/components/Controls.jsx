import React from "react";

export default function Controls({
                                     paintMode,
                                     setPaintMode,
                                     selectedObstacle,
                                     setSelectedObstacle,
                                     clearObstacles,
                                     startCleaning,
                                 }) {
    return (
        <div className="control-panel">
            <button
                onClick={() => setPaintMode("start")}
                className={paintMode === "start" ? "active" : ""}
            >
                Set Start
            </button>
            <button
                onClick={() => setPaintMode("dirt")}
                className={paintMode === "dirt" ? "active" : ""}
            >
                Add Dirt
            </button>

            <button
                onClick={() => setPaintMode("obstacle")}
                className={paintMode === "obstacle" ? "active" : ""}
            >
                Add Obstacle
            </button>

            {paintMode === "obstacle" && (
                <select
                    value={selectedObstacle}
                    onChange={(e) => setSelectedObstacle(e.target.value)}
                >
                    <option value="tv">TV</option>
                    <option value="bed">Bed</option>
                    <option value="wardrobe">Wardrobe</option>
                </select>
            )}

            <button onClick={clearObstacles}>Clear Obstacles</button>
            <button onClick={startCleaning}>Start Cleaning</button>
        </div>
    );
}
