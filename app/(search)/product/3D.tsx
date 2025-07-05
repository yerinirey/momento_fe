import FloatingBackButton from "@/components/Shared/FloatingBackButton";
// import ModelView from "@/components/Shared/ModelView";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

// export default function ProductARScreen() {
//   const { modelUrl } = useLocalSearchParams<{ modelUrl: string }>();
//   return (
//     <View>
//       <Canvas camera={{ position: [-2, 2.5, 5], fov: 30 }}>
//         <color attach={"background"} args={["#512DA8"]} />
//         <mesh>
//           <boxGeometry args={[1, 1, 1]} />
//           <meshBasicMaterial color={new Color('hotpink')} />
//         </mesh>
//       </Canvas>
//       <Text>Hello World!</Text>
//       <Button>Press me</Button>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

export default function ThreeDScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl: string }>();
  // console.log("??");
  return (
    <View style={{ flex: 1 }}>
      <FloatingBackButton onPress={() => router.back()} />
      {/* <ModelView modelUrl={modelUrl} /> */}
    </View>
  );
}
