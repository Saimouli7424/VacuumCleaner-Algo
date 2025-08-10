import React from "react";
import * as THREE from "three";

const TILE_SIZE = 1.5;

export default function Grid({ grid, onCellClick }) {
    return (
        <>
            {grid.map((row, y) =>
                row.map((cell, x) => {
                    let color = "#eee"; // empty
                    if (cell.type === "dirt") color = "orange";
                    else if (cell.type === "obstacle") color = "gray";
                    else if (cell.type === "start") color = "green";

                    return (
                        <mesh
                            key={`${x}-${y}`}
                            position={[x * TILE_SIZE, 0, y * TILE_SIZE]}
                            onClick={(e) => {
                                e.stopPropagation();
                                onCellClick(x, y);
                            }}
                        >
                            <boxGeometry args={[TILE_SIZE, 0.2, TILE_SIZE]} />
                            <meshStandardMaterial color={color} />
                            {/*<lineSegments>*/}
                            {/*    <edgesGeometry args={[new THREE.BoxGeometry(TILE_SIZE, 0.2, TILE_SIZE)]} />*/}
                            {/*    <lineBasicMaterial color="#333" />*/}
                            {/*</lineSegments>*/}
                        </mesh>
                    );
                })
            )}
        </>
    );
}
