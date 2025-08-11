import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useOBJLoader } from "../hooks/useOBJLoader";
import * as THREE from "three";

export default function BedModel(props) {
    const obj = useOBJLoader("/models/bed.obj", "/models/bed.mtl");
    const ref = useRef();

    useEffect(() => {
        if (ref.current && obj) {
            // Initial rotation to face the right way
            ref.current.rotation.set(Math.PI/2, Math.PI, 0);
            ref.current.updateMatrixWorld(true);

            // Lift so the bed sits on the tile instead of intersecting it
            const box = new THREE.Box3().setFromObject(ref.current);
            const heightOffset = -box.min.y;
            ref.current.position.y = heightOffset + 0.1;
        }
    }, [obj]);

    // Optional continuous rotation (can be disabled)


    return obj ? (
        <primitive
            object={obj}
            ref={ref}
            scale={[0.0075, 0.0075, 0.0075]} // small enough for tile
            {...props} // pass position={[x, y, z]} from tile selection
        />
    ) : null;
}
