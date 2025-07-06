import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import Model from "../3dModel/Model";
type ModelProps = {
  modelUrl: string;
};

export default function ModelView({ modelUrl }: ModelProps) {
  const [canLoad, setCanLoad] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanLoad(true);
    }, 5000); // 5초 후 로딩 허용

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {canLoad ? (
        <Canvas
          style={{ flex: 1, backgroundColor: "brown" }}
          frameloop="demand"
        >
          <OrbitControls enablePan={false} enableZoom={false} />
          <directionalLight position={[1, 0, 0]} args={["white", 2]} />
          <directionalLight position={[-1, 0, 0]} args={["white", 2]} />
          <directionalLight position={[0, 0, 1]} args={["white", 2]} />
          <directionalLight position={[0, 0, -1]} args={["white", 2]} />
          <directionalLight position={[0, 1, 0]} args={["white", 15]} />
          <directionalLight position={[0, -1, 0]} args={["white", 2]} />
          <Suspense>
            <Model modelUrl={modelUrl} />
          </Suspense>
        </Canvas>
      ) : (
        <ActivityIndicator
          size="large"
          color="white"
          style={{ flex: 1, backgroundColor: "black" }}
        />
      )}
    </>
  );
}
