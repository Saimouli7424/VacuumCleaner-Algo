import React from "react";

export default function Controls({
                                     paintMode,
                                     setPaintMode,
                                     clearObstacles,
                                     startCleaning,
                                 }) {
    return (
        <div className="control-panel">
            {["start", "dirt", "obstacle"].map((mode) => (
                <button
                    key={mode}
                    onClick={() => setPaintMode(mode)}
                    className={paintMode === mode ? "active" : ""}
                >
                    {mode === "start"
                        ? "Set Start"
                        : mode === "dirt"
                            ? "Add Dirt"
                            : "Add Obstacle"}
                </button>
            ))}
            <button onClick={clearObstacles} className="clear-obstacles-btn">
                Clear Obstacles
            </button>
            <button onClick={startCleaning} className="start-cleaning-btn">
                Start Cleaning
            </button>
        </div>
    );
}
