import { useGLTF } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";
import * as THREE from "three";
import { Text } from "tamagui";
type ModelProps = {
  modelUrl: string;
};
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

const Model = ({ modelUrl, ...props }: ModelProps) => {
  useGLTF.preload(modelUrl); // 미리 fetching, parsing - 렌더 부하 줄임
  const model = useGLTF(modelUrl);
  const { nodes, materials } = useGLTF(modelUrl) as GLTFResult;
  console.log("found glb: \nNODES:", nodes, "\nMATERIALS:", materials);
  return (
    // <group {...props} dispose={null} scale={7} position={[0, -1.4, 0]}>
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     // geometry={nodes.pasted__model1.geometry}
    //     material={materials.koltuk}
    //   />
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     // // geometry={nodes.pasted__model2.geometry}
    //     material={materials.siyah}
    //   />
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     // // geometry={nodes.pasted__model3.geometry}
    //     material={materials.metal}
    //   />
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     // // geometry={nodes.pasted__model4.geometry}
    //     material={materials.siyah}
    //   />
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     // // geometry={nodes.pasted__model5.geometry}
    //     material={materials.siyah}
    //   />
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     // // geometry={nodes.pasted__model6.geometry}
    //     material={materials.altin}
    //   />
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     // // geometry={nodes.pasted__model7.geometry}
    //     material={materials.koltuk}
    //   />
    // </group>
    <group {...props} dispose={null} position={[0, -0.5, 0]} scale={4}>
      <primitive {...props} object={model.scene} />
    </group>
  );
};

export default Model;
