import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useOBJLoader } from "../hooks/useOBJLoader";
import * as THREE from "three";

export default function CouchModel(props) {
    const obj = useOBJLoader("/models/couch.obj", "/models/couch.mtl");
    const ref = useRef();

    useEffect(() => {
        if (ref.current && obj) {
            ref.current.rotation.set(0, Math.PI, 0); // initial rotation
            ref.current.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(ref.current);
            const heightOffset = -box.min.y;
            ref.current.position.y = heightOffset + 0.1; // raise above ground
        }
    }, [obj]);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.01; // spin horizontally on Y axis
        }
    });

    return obj ? (
        <primitive
            object={obj}
            ref={ref}
            scale={[0.7, 0.7, 0.5]} // adjust scale if needed
            {...props}
        />
    ) : null;
}
