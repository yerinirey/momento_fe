import * as THREE from "three";
import React, { useEffect, useState } from "react";
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

export default function Model(
  // props: JSX.IntrinsicElements["group"] & {modelUrl: string}
  { modelUrl, ...props }: ModelProps
) {
  const gltf = useGLTF(modelUrl);
  const [readyScene, setReadyScene] = useState<THREE.Group | null>(null);

  // material.name 없으면 발생하는 오류 겪음, 기본 이름을 설정해줘야 three 내부 오류 방지됨
  useEffect(() => {
    const scene = gltf.scene.clone(true);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material;

        if (!material) return;

        if (Array.isArray(material)) {
          material.forEach((m, i) => {
            if (m && (!m.name || typeof m.name !== "string")) {
              m.name = `Material_${i}`;
            }
          });
        } else {
          if (!material.name || typeof material.name !== "string") {
            material.name = "DefaultMaterial";
          }
        }
      }
    });

    // material 배열도 방어
    if (gltf.materials) {
      Object.entries(gltf.materials).forEach(([key, material], idx) => {
        if (!material.name || typeof material.name !== "string") {
          material.name = `MaterialGlobal_${idx}`;
        }
      });
    }

    setReadyScene(scene);
  }, [gltf]);
  if (!readyScene) return null;
  console.log(readyScene);
  return (
    <primitive
      object={readyScene}
      scale={7}
      position={[0, -1.4, 0]}
      {...props}
    />
  );
}
