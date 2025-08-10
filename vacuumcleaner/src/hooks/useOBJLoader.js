// src/hooks/useOBJLoader.js
import { useState, useEffect } from "react";
import { MTLLoader, OBJLoader } from "three-stdlib";

export function useOBJLoader(objPath, mtlPath) {
    const [object, setObject] = useState(null);

    useEffect(() => {
        let isMounted = true;
        new MTLLoader().load(mtlPath, (materials) => {
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(objPath, (obj) => {
                if (isMounted) setObject(obj);
            });
        });

        return () => {
            isMounted = false;
        };
    }, [objPath, mtlPath]);

    return object;
}
