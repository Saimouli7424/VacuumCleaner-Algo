import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOBJLoader } from "../hooks/useOBJLoader";

export default function BedModel(props) {
    const obj = useOBJLoader("/models/bed.obj", "/models/bed.mtl");
    const ref = useRef();
    const baseRotationY = Math.PI; // 180 degrees flip on Y axis

    useEffect(() => {
        if (ref.current) {
            // Lay flat on X axis
            ref.current.rotation.set(Math.PI / 2, baseRotationY, 0);

            ref.current.updateMatrixWorld(true);

            // Adjust vertical position to rest on ground + hover
            const box = new THREE.Box3().setFromObject(ref.current);
            const heightOffset = -box.min.y;
            ref.current.position.y = heightOffset + 0.1;
        }
    }, [obj]);



    return obj ? (
        <primitive
            object={obj}
            ref={ref}
            scale={[0.006, 0.007, 0.008]}
            {...props}
        />
    ) : null;
}
