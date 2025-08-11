import React, { useState } from "react";

export default function Controls({
                                     paintMode,
                                     setPaintMode,
                                     selectedObstacle,
                                     setSelectedObstacle,
                                     clearObstacles,
                                     startCleaning,
                                 }) {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => setOpen((o) => !o);

    return (
        <>
            {/* Hamburger visible only on mobile */}
            <button className="hamburger" onClick={toggleOpen} aria-label="Toggle controls">
                ☰
            </button>

            {/* Controls panel: add 'open' class when open */}
            <div className={`control-panel ${open ? "open" : ""}`}>
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
                    <div className="obstacle-dropdown">
                        <select
                            value={selectedObstacle}
                            onChange={(e) => setSelectedObstacle(e.target.value)}
                        >
                            <option value="tv">TV</option>
                            <option value="bed">Bed</option>
                            <option value="couch">Couch</option>
                            <option value="wardrobe">Wardrobe</option>
                            <option value="tableschairs">Tables & Chairs</option>
                        </select>
                    </div>
                )}

                <button onClick={clearObstacles}>Clear Obstacles</button>
                <button onClick={startCleaning}>Start Cleaning</button>
            </div>
        </>
    );
}
