import { useGLTF } from "@react-three/drei";

type ModelProps = {
  modelUrl: string;
};

const Model = ({ modelUrl, ...props }: ModelProps) => {
  // useGLTF.preload(modelUrl); // 미리 fetching, parsing - 렌더 부하 줄임
  const model = useGLTF(modelUrl);
  //   const { actions } = useAnimations(animations, group);
  console.log("found glb: ", model);
  return (
    <group {...props} dispose={null} position={[0, -0.5, 0]} scale={1}>
      <primitive {...props} object={model.scene} />
    </group>
  );
};

export default Model;
