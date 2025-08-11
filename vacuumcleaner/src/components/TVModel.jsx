import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useOBJLoader } from "../hooks/useOBJLoader";
import { useFrame } from "@react-three/fiber";

export default function TVModel({ position, ...props }) {
    const obj = useOBJLoader("/models/TV.obj", "/models/TV.mtl");
    const ref = useRef();
    const modelRef = useRef(); // store processed model

    // Process model once when loaded
    useEffect(() => {
        if (obj && ref.current) {
            modelRef.current = obj.clone();

            // Get bounding box & center
            const box = new THREE.Box3().setFromObject(modelRef.current);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Center the model
            modelRef.current.position.sub(center);

            // Rotate if needed (initial orientation)
            modelRef.current.rotation.set(0, Math.PI, 0);

            // Lift so base is at Y=0
            modelRef.current.position.y += size.y / 2 + 0.2;

            // Add model to group
            ref.current.add(modelRef.current);
        }
    }, [obj]);

    // Only update position when tile changes
    useEffect(() => {
        if (ref.current && position) {
            ref.current.position.set(position[0], position[1], position[2]);
        }
    }, [position]);

    // Continuous rotation animation
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * (Math.PI / 2);
            // π/2 radians per second → 90°/sec → full 360° in 4 sec
        }
    });

    if (!obj) return null;

    return (
        <group ref={ref} scale={[0.1, 0.1, 0.1]} {...props}>
            {/* Model is added once in useEffect */}
        </group>
    );
}
