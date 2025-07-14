import useControls from "r3f-native-orbitcontrols";
import { Canvas } from "@react-three/fiber/native";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
// import { OrbitControls } from "@react-three/drei/native";
import Model from "../3dModel/Model";
import { View } from "tamagui";
type ModelProps = {
  modelUrl: string;
};

export default function ModelView({ modelUrl }: ModelProps) {
  const [OrbitControls, events] = useControls();
  // const [canLoad, setCanLoad] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setCanLoad(true);
  //   }, 3000); // 5초 후 로딩 허용

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      {/* {canLoad ? ( */}
      <View style={{ flex: 1 }} {...events}>
        <Suspense
          fallback={<ActivityIndicator size={"large"} color={"white"} />}
        >
          <Canvas
            style={{ flex: 1, backgroundColor: "black" }}
            frameloop="demand"
          >
            <OrbitControls />
            <directionalLight position={[1, 0, 0]} args={["white", 2]} />
            <directionalLight position={[-1, 0, 0]} args={["white", 2]} />
            {/* <directionalLight position={[0, 0, 1]} args={["white", 2]} /> */}
            <directionalLight position={[0, 0, -1]} args={["white", 2]} />
            {/* <directionalLight position={[0, 1, 0]} args={["white", 6]} /> */}
            <directionalLight position={[0, -1, 0]} args={["white", 2]} />

            <Model modelUrl={modelUrl} />
          </Canvas>
        </Suspense>
      </View>
      {/* ) : (
        <ActivityIndicator
          size="large"
          color="white"
          style={{ flex: 1, backgroundColor: "black" }}
        />
      )} */}
    </>
  );
}
