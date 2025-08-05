import { router, useLocalSearchParams } from "expo-router";
import useControls from "r3f-native-orbitcontrols";
import { Suspense, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Canvas } from "@react-three/fiber";
import Trigger from "@/components/3dModel/Trigger";
import Model from "@/components/3dModel/Model";

export default function THREEDScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl: string }>();
  const [OrbitControls, events] = useControls();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <SafeAreaView>
      <View style={{ height: "80%" }} {...events}>
        <Canvas events={null as any}>
          <OrbitControls enablePan={false} />
          <directionalLight position={[1, 0, 0]} args={["white", 5]} />
          {/* <directionalLight position={[-1, 0, 0]} args={["white", 5]} /> */}
          <directionalLight position={[0, 0, 1]} args={["white", 5]} />
          <directionalLight position={[0, 0, -1]} args={["white", 5]} />
          {/* <directionalLight position={[0, 1, 0]} args={["white", 5]} /> */}
          {/* <directionalLight position={[0, -1, 0]} args={["white", 5]} /> */}
          <Suspense fallback={<Trigger setLoading={setLoading} />}>
            <Model modelUrl={modelUrl} />
          </Suspense>
        </Canvas>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log("?");
            // navigation.goBack();
          }}
        >
          <Text style={styles.textButton}>Buy Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3F6900",
    padding: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  textButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
