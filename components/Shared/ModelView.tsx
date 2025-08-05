// import React, { useRef, useEffect, useState } from "react";
// import { View, Dimensions } from "react-native";
// import { GLView } from "expo-gl";
// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system";
// import { ExpoWebGLRenderingContext } from "expo-gl";
// import { Renderer } from "expo-three";
// import {
//   PerspectiveCamera,
//   Scene,
//   DirectionalLight,
//   Group,
//   Box3,
//   Vector3,
// } from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import {
//   PanGestureHandler,
//   PinchGestureHandler,
//   GestureHandlerRootView,
// } from "react-native-gesture-handler";

// type ModelProps = {
//   modelUrl: string;
// };

// export default function ModelView({ modelUrl }: ModelProps) {
//   const { width, height } = Dimensions.get("window");
//   const modelRef = useRef<Group | null>(null);

//   const lastRotation = useRef({ x: 0, y: 0 });
//   const [rotation, setRotation] = useState({ x: 0, y: 0 });
//   const [scale, setScale] = useState(1);

//   // 제스처 핸들링
//   const onPanGestureEvent = (event: any) => {
//     const dx = event.nativeEvent.translationX;
//     const dy = event.nativeEvent.translationY;
//     const rotateY = lastRotation.current.y + dx * 0.005;
//     const rotateX = lastRotation.current.x + dy * 0.005;
//     setRotation({ x: rotateX, y: rotateY });
//   };

//   const onPanGestureEnd = () => {
//     lastRotation.current = { ...rotation };
//   };

//   const onPinchGestureEvent = (event: any) => {
//     setScale(Math.min(Math.max(event.nativeEvent.scale, 0.5), 3));
//   };

//   const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
//     console.log("✅ GL context created");

//     const scene = new Scene();
//     const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
//     camera.position.z = 1;

//     const renderer = new Renderer({ gl });
//     renderer.setSize(width, height);

//     const light1 = new DirectionalLight(0xffffff, 1.2);
//     light1.position.set(0, 5, 5);
//     scene.add(light1);

//     try {
//       const asset = Asset.fromURI(modelUrl);
//       await asset.downloadAsync();
//       const fileUri = asset.localUri || asset.uri;

//       const base64 = await FileSystem.readAsStringAsync(fileUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//       const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

//       const loader = new GLTFLoader();
//       loader.parse(
//         binary.buffer,
//         "",
//         (gltf) => {
//           const model = gltf.scene;
//           // 중심 좌표 계산
//           const box = new Box3().setFromObject(model);
//           const center = new Vector3();
//           box.getCenter(center);
//           // 중심을 원점으로 이동
//           model.position.sub(center);

//           // 원하는 위치 조정
//           model.position.z += 0.5;

//           model.scale.set(scale, scale, scale);
//           modelRef.current = model;
//           scene.add(model);
//         },
//         (error) => {
//           console.error("❌ Failed to parse GLB:", error);
//         }
//       );
//     } catch (e) {
//       console.error("❌ Error loading model:", e);
//     }

//     const render = () => {
//       requestAnimationFrame(render);

//       if (modelRef.current) {
//         modelRef.current.rotation.x = rotation.x;
//         modelRef.current.rotation.y = rotation.y;
//         modelRef.current.scale.set(scale, scale, scale);
//       }

//       renderer.render(scene, camera);
//       gl.endFrameEXP();
//     };

//     render();
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
//         <PanGestureHandler
//           onGestureEvent={onPanGestureEvent}
//           onEnded={onPanGestureEnd}
//         >
//           <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
//         </PanGestureHandler>
//       </PinchGestureHandler>
//     </GestureHandlerRootView>
//   );
// }

// ModelView.tsx
import { Canvas } from "@react-three/fiber/native";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";
import { OrbitControls, useGLTF } from "@react-three/drei/native";
import { View } from "tamagui";

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} />;
}

export default function ModelView({ modelUrl }: { modelUrl: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Suspense fallback={<ActivityIndicator size="large" color="gray" />}>
        <Canvas style={{ flex: 1 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[0, 5, 5]} intensity={2} />
          <Model url={modelUrl} />
          <OrbitControls enableZoom enablePan enableRotate />
        </Canvas>
      </Suspense>
    </View>
  );
}
