import { useGLTF } from "@react-three/drei/native";
import { GLTF, GLTFLoader } from "three-stdlib";
import * as THREE from "three";
import { Text } from "tamagui";
import { useLoader } from "@react-three/fiber/native";
type ModelProps = {
  modelUrl: string;
};

const Model = ({ modelUrl, ...props }: ModelProps) => {
  useGLTF.preload(modelUrl); // 미리 fetching, parsing - 렌더 부하 줄임
  const model = useGLTF(modelUrl);
  console.log("nodes: ", model.nodes);
  console.log("material: ", model.materials);
  console.log("scene:", model.scene);
  console.log("scenes:", model.scenes);
  if (!model || !model.scene) {
    return <Text>Error model: {model}</Text>;
  }
  return (
    <group {...props} dispose={null} position={[0, -0.5, 0]} scale={4}>
      <primitive {...props} object={model.scene} />
    </group>
  );
};

export default Model;
