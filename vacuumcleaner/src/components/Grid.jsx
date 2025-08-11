import React from "react";
import * as THREE from "three";
import BedModel from "./BedModel";
import CouchModel from "./CouchModel";
import WardrobeModel from "./WardrobeModel";

const TILE_SIZE = 1.5;

function ObstacleModel({ type, position }) {
    switch (type) {
        case "bed":
            return <BedModel position={position} />;
        case "couch":
            return <CouchModel position={position} />;
        case "wardrobe":
          return <WardrobeModel position={position} />;
        default:
            return null;
    }
}

export default function Grid({ grid, onCellClick }) {
    return (
        <>
            {grid.map((row, y) =>
                row.map((cell, x) => {
                    const position = [x * TILE_SIZE, 0, y * TILE_SIZE];

                    if (cell.type === "obstacle") {
                        return (
                            <group
                                key={`${x}-${y}`}
                                position={position}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCellClick(x, y);
                                }}
                            >
                                <ObstacleModel type={cell.obstacleType} position={[0, 0, 0]} />
                                {/* Optional: base plane with border */}
                                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                                    <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
                                    <meshStandardMaterial color="#999" />
                                    <lineSegments>
                                        <edgesGeometry args={[new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE)]} />
                                        <lineBasicMaterial color="#333" />
                                    </lineSegments>
                                </mesh>
                            </group>
                        );
                    }

                    let color = "#eee"; // default empty cell color
                    if (cell.type === "dirt") color = "orange";
                    else if (cell.type === "start") color = "green";

                    return (
                        <mesh
                            key={`${x}-${y}`}
                            position={position}
                            onClick={(e) => {
                                e.stopPropagation();
                                onCellClick(x, y);
                            }}
                        >
                            <boxGeometry args={[TILE_SIZE, 0.2, TILE_SIZE]} />
                            <meshStandardMaterial color={color} />
                            <lineSegments>
                                <edgesGeometry args={[new THREE.BoxGeometry(TILE_SIZE, 0.2, TILE_SIZE)]} />
                                <lineBasicMaterial color="#333" />
                            </lineSegments>
                        </mesh>
                    );
                })
            )}
        </>
    );
}
