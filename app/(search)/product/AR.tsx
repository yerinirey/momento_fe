// import {
//   ViroARScene,
//   ViroARSceneNavigator,
//   Viro3DObject,
//   ViroARPlane,
//   ViroAmbientLight,
//   ViroMaterials,
//   ViroQuad,
// } from "@reactvision/react-viro";
// import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text } from "tamagui";

// // ✅ 재질 정의 (광원 무시하는 평면 재질)
// ViroMaterials.createMaterials({
//   quad: {
//     lightingModel: "Constant",
//     diffuseColor: "#aaaaaa",
//   },
// });

// // ✅ AR 씬 정의
// function MyARScene({ modelUrl }: { modelUrl: string }) {
//   const [position, setPosition] = useState<[number, number, number] | null>(
//     null
//   );

//   return (
//     <ViroARScene>
//       <ViroAmbientLight color="white" />

//       <ViroARPlane dragType="FixedToWorld">
//         {/* 3D 오브젝트: 클릭 위치에 배치 */}
//         <Viro3DObject
//           visible={!!position}
//           position={position ?? [0, 0, 0]}
//           scale={[0.1, 0.1, 0.1]}
//           source={{ uri: modelUrl }}
//           type="GLB"
//           // dragType="FixedToWorld"
//         />

//         {/* 바닥 평면: 클릭 위치 지정용 */}
//         <ViroQuad
//           visible={!position}
//           position={[0, 0, 0]}
//           width={1}
//           height={1}
//           rotation={[-90, 0, 0]}
//           materials="quad"
//           onClickState={(state, pos) => {
//             if (state === 2) {
//               setPosition(pos);
//             }
//           }}
//         />
//       </ViroARPlane>
//     </ViroARScene>
//   );
// }

// // ✅ ARScreen 컴포넌트: ViroARSceneNavigator 사용
export default function ARScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl: string }>();

  return <Text>{modelUrl}</Text>;
}
