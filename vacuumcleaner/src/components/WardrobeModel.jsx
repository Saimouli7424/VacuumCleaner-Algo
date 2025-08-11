import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOBJLoader } from "../hooks/useOBJLoader";

export default function WardrobeModel(props) {
    const obj = useOBJLoader("/models/wardrobe.obj", "/models/wardrobe.mtl");
    const ref = useRef();

    // Base rotation so wardrobe faces desired direction initially
    const baseRotation = { x: 0, y: Math.PI / 2, z: 0 };

    useEffect(() => {
        if (ref.current && obj) {
            ref.current.rotation.set(baseRotation.x, baseRotation.y, baseRotation.z);
            ref.current.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(ref.current);
            const heightOffset = -box.min.y;
            ref.current.position.y = heightOffset + 0.1;
        }
    }, [obj]);

    useFrame(() => {
        if (ref.current) {
            // Continuously rotate horizontally (around Y axis)
            ref.current.rotation.y += 0.01; // Adjust speed here
        }
    });

    return obj ? (
        <primitive
            object={obj}
            ref={ref}
            scale={[0.7, 0.7, 0.5]}
            {...props}
        />
    ) : null;
}
