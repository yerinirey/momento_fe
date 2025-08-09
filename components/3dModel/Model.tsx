import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";
import { GroupProps } from "@react-three/fiber";
import { Text } from "tamagui";
type GLTFResult = GLTF & {
  nodes: {
    pasted__model1: THREE.Mesh;
    pasted__model2: THREE.Mesh;
    pasted__model3: THREE.Mesh;
    pasted__model4: THREE.Mesh;
    pasted__model5: THREE.Mesh;
    pasted__model6: THREE.Mesh;
    pasted__model7: THREE.Mesh;
  };
  materials: {
    koltuk: THREE.MeshStandardMaterial;
    siyah: THREE.MeshStandardMaterial;
    metal: THREE.MeshStandardMaterial;
    altin: THREE.MeshStandardMaterial;
  };
};
interface ModelProps extends GroupProps {
  modelUrl: string;
}

export default function Model({ modelUrl, ...props }: ModelProps) {
  const { scene } = useGLTF(modelUrl);
  const [ready, setReady] = useState(false);
  const patched = useRef(false);

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
  }, [scene]);

  return ready ? (
    <primitive object={scene} scale={7} position={[0, -1.4, 0]} {...props} />
  ) : (
    <></>
  );
}
