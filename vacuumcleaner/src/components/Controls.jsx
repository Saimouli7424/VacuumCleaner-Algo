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

    // Close menu helper
    const closeMenu = () => setOpen(false);

    return (
        <>
            {/* Hamburger visible only on mobile */}
            <button className="hamburger" onClick={toggleOpen} aria-label="Toggle controls">
                ☰
            </button>

            {/* Controls panel: add 'open' class when open */}
            <div className={`control-panel ${open ? "open" : ""}`}>
                <button
                    onClick={() => {
                        setPaintMode("start");
                        closeMenu();
                    }}
                    className={paintMode === "start" ? "active" : ""}
                >
                    Set Start
                </button>
                <button
                    onClick={() => {
                        setPaintMode("dirt");
                        closeMenu();
                    }}
                    className={paintMode === "dirt" ? "active" : ""}
                >
                    Add Dirt
                </button>

                <button
                    onClick={() => {
                        setPaintMode("obstacle");
                        closeMenu();
                    }}
                    className={paintMode === "obstacle" ? "active" : ""}
                >
                    Add Obstacle
                </button>

                {paintMode === "obstacle" && (
                    <div className="obstacle-dropdown">
                        <select
                            value={selectedObstacle}
                            onChange={(e) => {
                                setSelectedObstacle(e.target.value);
                                closeMenu();
                            }}
                        >
                            <option value="tv">TV</option>
                            <option value="bed">Bed</option>
                            <option value="couch">Couch</option>
                            <option value="wardrobe">Wardrobe</option>
                            <option value="tableschairs">Tables & Chairs</option>
                        </select>
                    </div>
                )}

                <button
                    onClick={() => {
                        clearObstacles();
                        closeMenu();
                    }}
                >
                    Clear Obstacles
                </button>
                <button
                    onClick={() => {
                        startCleaning();
                        closeMenu();
                    }}
                >
                    Start Cleaning
                </button>
            </div>
        </>
    );
}
