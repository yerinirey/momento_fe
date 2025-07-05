import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { useRef } from "react";
import { View } from "react-native";

type ModelProps = {
  modelUrl: string;
};

function Model({ modelUrl }: ModelProps) {
  const ref = useRef<any>(null);
  const { scene } = useGLTF(modelUrl);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return <primitive object={scene} ref={ref} scale={5} />;
}

export default function ModelView({ modelUrl }: ModelProps) {
  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1, backgroundColor: "black" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 3]} intensity={1} />
        <pointLight position={[-3, 2, 2]} intensity={0.8} />
        <Model modelUrl={modelUrl} />
      </Canvas>
    </View>
  );
}
