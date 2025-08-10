import React from "react";

const TILE_SIZE = 1.5;

export default function Vacuum({ position }) {
    return (
        <mesh position={position}>
            <boxGeometry args={[TILE_SIZE * 0.8, 0.5, TILE_SIZE * 0.8]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
}
