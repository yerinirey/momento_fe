// import {
//   ViroARScene,
//   ViroARSceneNavigator,
//   Viro3DObject,
//   ViroARPlane,
//   ViroAmbientLight,
//   ViroMaterials,
//   ViroQuad,
//   ViroClickStateTypes,
// } from "@reactvision/react-viro";
import { useLocalSearchParams } from "expo-router";
import { Text } from "tamagui";
// import { useEffect, useState } from "react";
// import { Viro3DPoint } from "@reactvision/react-viro/dist/components/Types/ViroUtils";

// // AR 씬 정의
// function Scene({ modelUrl }: { modelUrl: string }) {
//   const [position, setPosition] = useState<Viro3DPoint | null>(null);

//   return (
//     <ViroARScene>
//       {/* 기본적인 광원, 씬 전체에 적용 */}
//       <ViroAmbientLight color="white" />
//       {/*  드래그 기능 */}
//       <ViroARPlane dragType="FixedToWorld">
//         <Viro3DObject
//           visible={!!position} // 클릭 시 보이도록 설정
//           source={{ uri: modelUrl }}
//           position={position ?? [0, 0, 0]}
//           scale={[1, 1, 1]}
//           type="GLB"
//           onDrag={() => {}}
//         />
//         <ViroQuad
//           visible={!position} // 클릭하지 않았을 때 보이도록 설정
//           position={[0, 0, 0]}
//           width={1}
//           height={1}
//           rotation={[-90, 0, 0]}
//           materials="QuadMaterial"
//           onClickState={(state, position) => {
//             if (state === ViroClickStateTypes.CLICKED) {
//               setPosition(position);
//             }
//           }}
//         />
//       </ViroARPlane>
//     </ViroARScene>
//   );
// }

export default function ARScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl: string }>();

  // useEffect(() => {
  //   // 재질 정의 (광원 무시하는 평면 재질)
  //   ViroMaterials.createMaterials({
  //     QuadMaterial: {
  //       lightingModel: "Constant",
  //       diffuseColor: "#aaaaaa",
  //     },
  //   });
  // }, []);

  return (
    <>
      <Text>{modelUrl}</Text>
      {/* <ViroARSceneNavigator
        initialScene={{ scene: () => <Scene modelUrl={modelUrl} /> }}
      /> */}
    </>
  );
}
