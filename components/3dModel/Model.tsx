import * as THREE from "three";
import React, { JSX, useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei/native";

type PrimitiveProps = JSX.IntrinsicElements["primitive"];

interface ModelProps extends Omit<PrimitiveProps, "object"> {
  modelUrl: string;
  onLoaded?: () => void;
}

export default function Model({ modelUrl, onLoaded, ...props }: ModelProps) {
  const { scene } = useGLTF(modelUrl);
  const [ready, setReady] = useState(false);
  const patched = useRef(false);

  useEffect(() => {
    patched.current = false;
    setReady(false);
  }, [modelUrl]);

  useEffect(() => {
    if (patched.current) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material;

        if (Array.isArray(material)) {
          material.forEach((m, i) => {
            if (!m.name || typeof m.name !== "string") {
              m.name = `Material_${i}`;
            }
          });
        } else {
          if (!material.name || typeof material.name !== "string") {
            material.name = `DefaultMaterial`;
          }
        }
      }
    });

    patched.current = true;
    setReady(true);
    onLoaded?.();
  }, [scene, onLoaded]);

  return ready ? (
    <primitive object={scene} scale={3} position={[0, -1.4, 0]} {...props} />
  ) : (
    <></>
  );
}
