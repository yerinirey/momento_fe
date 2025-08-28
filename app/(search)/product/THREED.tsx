import { useLocalSearchParams } from "expo-router";
import useControls from "r3f-native-orbitcontrols";
import { Suspense, useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Canvas } from "@react-three/fiber";
import Model from "@/components/3dModel/Model";

export default function THREEDScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl: string }>();
  const [OrbitControls, events] = useControls();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
  }, [modelUrl]);

  return (
    <SafeAreaView>
      <View style={{ height: "100%" }} {...events}>
        <Canvas events={null as any}>
          <OrbitControls enablePan={false} />
          <directionalLight position={[1, 0, 0]} args={["white", 1]} />
          <directionalLight position={[-1, 0, 0]} args={["white", 1]} />
          <directionalLight position={[0, 0, 1]} args={["white", 1]} />
          <directionalLight position={[0, 0, -1]} args={["white", 1]} />
          <directionalLight position={[0, 1, 0]} args={["white", 1]} />
          <directionalLight position={[0, -1, 0]} args={["white", 1]} />

          <Suspense fallback={null}>
            <Model
              key={modelUrl}
              modelUrl={modelUrl}
              onLoaded={() => setLoading(false)}
            />
          </Suspense>
        </Canvas>
        {/* 로딩 인디케이터 */}
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.12)",
  },
});
