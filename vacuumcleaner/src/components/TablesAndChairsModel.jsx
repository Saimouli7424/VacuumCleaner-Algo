import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useOBJLoader } from "../hooks/useOBJLoader";
import * as THREE from "three";

export default function TablesAndChairsModel(props) {
    const obj = useOBJLoader(
        "/models/Table_and_Chairs.obj",
        "/models/Table_and_Chairs.mtl"
    );
    const ref = useRef();

    useEffect(() => {
        if (ref.current && obj) {
            // Initial rotation to face correct direction
            ref.current.rotation.set(0, Math.PI, 0);
            ref.current.updateMatrixWorld(true);

            // Compute bounding box to lift it so it sits on the ground/tile
            const box = new THREE.Box3().setFromObject(ref.current);
            const heightOffset = -box.min.y;
            ref.current.position.y = heightOffset + 0.1; // small lift above tile
        }
    }, [obj]);

    // Optional continuous rotation
    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.01;
        }
    });

    return obj ? (
        <primitive
            object={obj}
            ref={ref}
            scale={[0.005, 0.005, 0.005]}
            // adjust until it fits your tile size
            {...props} // position={...} will come from your tile selection
        />
    ) : null;
}
