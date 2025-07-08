import useControls from "r3f-native-orbitcontrols";
import { Canvas } from "@react-three/fiber/native";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import Model from "../3dModel/Model";
import { View } from "tamagui";
type ModelProps = {
  modelUrl: string;
};

export default function ModelView({ modelUrl }: ModelProps) {
  const [canLoad, setCanLoad] = useState(false);
  const [OrbitControls, events] = useControls();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanLoad(true);
    }, 5000); // 5초 후 로딩 허용

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {canLoad ? (
        <View style={{ flex: 1 }} {...events}>
          <Canvas
            style={{ flex: 1, backgroundColor: "brown" }}
            frameloop="demand"
          >
            <OrbitControls />
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
        </View>
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
