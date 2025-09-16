import { useLocalSearchParams } from "expo-router";
import useControls from "r3f-native-orbitcontrols";
import { Suspense, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { Canvas, useThree } from "@react-three/fiber";
import Model from "@/components/3dModel/Model";
import Slider from "@react-native-community/slider";
import * as THREE from "three";

export default function THREEDScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl: string }>();
  const [OrbitControls, events] = useControls();
  const [loading, setLoading] = useState<boolean>(true);
  const [keyIntensity, setKeyIntensity] = useState(1.2);
  const [fillIntensity, setFillIntensity] = useState(0.6);
  const [topIntensity, setTopIntensity] = useState(0.8);
  const [uiInteracting, setUiInteracting] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [miniOpen, setMiniOpen] = useState(true);
  const [miniTab, setMiniTab] = useState<"lights" | "colors">("lights");
  const panelMaxHeight = useMemo(() => {
    const { height } = Dimensions.get("window");
    return Math.round(height * 0.55);
  }, []);
  const [ambientIntensity, setAmbientIntensity] = useState(0.2);
  const [hemiIntensity, setHemiIntensity] = useState(0.3);
  const [keyAzimuthDeg, setKeyAzimuthDeg] = useState(45); // 0~360
  const [keyElevationDeg, setKeyElevationDeg] = useState(30); // 0~90
  const [keyColor, setKeyColor] = useState<string>("#ffffff");
  const [fillColor, setFillColor] = useState<string>("#ffffff");
  const [topColor, setTopColor] = useState<string>("#ffffff");

  useEffect(() => {
    setLoading(true);
  }, [modelUrl]);

  const keyPosition = useMemo(() => {
    // Spherical to Cartesian with radius r
    const r = 3;
    const az = (keyAzimuthDeg * Math.PI) / 180; // around Y
    const el = (keyElevationDeg * Math.PI) / 180; // from horizon
    const y = r * Math.sin(el);
    const horiz = r * Math.cos(el);
    const x = horiz * Math.cos(az);
    const z = horiz * Math.sin(az);
    return [x, y, z] as [number, number, number];
  }, [keyAzimuthDeg, keyElevationDeg]);

  const resetLighting = () => {
    setKeyIntensity(1.2);
    setFillIntensity(0.6);
    setTopIntensity(0.8);
    setAmbientIntensity(0.2);
    setHemiIntensity(0.3);
    setKeyAzimuthDeg(45);
    setKeyElevationDeg(30);
    setKeyColor("#ffffff");
    setFillColor("#ffffff");
    setTopColor("#ffffff");
  };

  return (
    <SafeAreaView>
      <View style={{ height: "100%" }}>
        <View style={{ flex: 1 }} {...events}>
          <Canvas events={null as any}>
            <OrbitControls enablePan={false} enabled={!uiInteracting} />

            {/* Radial gradient background */}
            <RadialBackground />

            {/* Ambient & Hemisphere lights */}
            <ambientLight args={["white", ambientIntensity]} />
            <hemisphereLight args={["#cfe9ff", "#444444", hemiIntensity]} />

            {/* Key / Fill / Top lights */}
            <directionalLight
              position={keyPosition}
              args={[keyColor, keyIntensity]}
            />
            <directionalLight
              position={[-2, 0.5, -2]}
              args={[fillColor, fillIntensity]}
            />
            <directionalLight
              position={[0, 3, 0]}
              args={[topColor, topIntensity]}
            />

            <Suspense fallback={null}>
              <Model
                key={modelUrl}
                modelUrl={modelUrl}
                onLoaded={() => setLoading(false)}
              />
            </Suspense>
          </Canvas>
        </View>
        {/* 로딩 인디케이터 */}
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {/* Floating mini controls (top-right) */}
        <View
          style={{ position: "absolute", top: 12, right: 12 }}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={() => setMiniOpen((v) => !v)}
            onPressIn={() => setUiInteracting(true)}
            onPressOut={() => setUiInteracting(false)}
            style={{
              alignSelf: "flex-end",
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>☼</Text>
          </Pressable>
          {miniOpen && (
            <View
              style={{
                marginTop: 8,
                width: 260,
                maxHeight: 360,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.97)",
                padding: 10,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
              }}
              pointerEvents="auto"
              onStartShouldSetResponder={() => true}
              onResponderGrant={() => setUiInteracting(true)}
              onResponderRelease={() => setUiInteracting(false)}
            >
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                <Pressable
                  onPress={() => setMiniTab("lights")}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: miniTab === "lights" ? "#222" : "#eee",
                  }}
                >
                  <Text
                    style={{ color: miniTab === "lights" ? "#fff" : "#333" }}
                  >
                    Lights
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setMiniTab("colors")}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: miniTab === "colors" ? "#222" : "#eee",
                  }}
                >
                  <Text
                    style={{ color: miniTab === "colors" ? "#fff" : "#333" }}
                  >
                    Colors
                  </Text>
                </Pressable>
              </View>
              {miniTab === "lights" ? (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  style={{ maxHeight: 300 }}
                  contentContainerStyle={{ paddingBottom: 8 }}
                >
                  <View style={{ marginVertical: 6 }}>
                    <Text style={{ marginBottom: 4 }}>
                      Key: {keyIntensity.toFixed(2)}
                    </Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={3}
                      step={0.05}
                      value={keyIntensity}
                      onValueChange={setKeyIntensity}
                      minimumTrackTintColor="#f99101"
                      maximumTrackTintColor="#999"
                      onSlidingStart={() => setUiInteracting(true)}
                      onSlidingComplete={() => setUiInteracting(false)}
                    />
                  </View>
                  <View style={{ marginVertical: 6 }}>
                    <Text style={{ marginBottom: 4 }}>
                      Fill: {fillIntensity.toFixed(2)}
                    </Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={3}
                      step={0.05}
                      value={fillIntensity}
                      onValueChange={setFillIntensity}
                      minimumTrackTintColor="#f99101"
                      maximumTrackTintColor="#999"
                      onSlidingStart={() => setUiInteracting(true)}
                      onSlidingComplete={() => setUiInteracting(false)}
                    />
                  </View>
                  <View style={{ marginVertical: 6 }}>
                    <Text style={{ marginBottom: 4 }}>
                      Top: {topIntensity.toFixed(2)}
                    </Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={3}
                      step={0.05}
                      value={topIntensity}
                      onValueChange={setTopIntensity}
                      minimumTrackTintColor="#f99101"
                      maximumTrackTintColor="#999"
                      onSlidingStart={() => setUiInteracting(true)}
                      onSlidingComplete={() => setUiInteracting(false)}
                    />
                  </View>
                  <View style={{ marginVertical: 6 }}>
                    <Text style={{ marginBottom: 4 }}>
                      Ambient: {ambientIntensity.toFixed(2)}
                    </Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={2}
                      step={0.05}
                      value={ambientIntensity}
                      onValueChange={setAmbientIntensity}
                      minimumTrackTintColor="#f99101"
                      maximumTrackTintColor="#999"
                      onSlidingStart={() => setUiInteracting(true)}
                      onSlidingComplete={() => setUiInteracting(false)}
                    />
                  </View>
                  <View style={{ marginVertical: 6 }}>
                    <Text style={{ marginBottom: 4 }}>
                      Hemi: {hemiIntensity.toFixed(2)}
                    </Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={2}
                      step={0.05}
                      value={hemiIntensity}
                      onValueChange={setHemiIntensity}
                      minimumTrackTintColor="#f99101"
                      maximumTrackTintColor="#999"
                      onSlidingStart={() => setUiInteracting(true)}
                      onSlidingComplete={() => setUiInteracting(false)}
                    />
                  </View>
                  <View style={{ marginVertical: 8 }}>
                    <Text style={{ marginBottom: 4 }}>Azimuth/Elevation</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Pressable
                        onPress={() => setKeyAzimuthDeg((v) => (v + 355) % 360)}
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          backgroundColor: "#eee",
                          borderRadius: 8,
                        }}
                      >
                        <Text>◀</Text>
                      </Pressable>
                      <Text style={{ width: 70, textAlign: "center" }}>
                        {keyAzimuthDeg}°
                      </Text>
                      <Pressable
                        onPress={() => setKeyAzimuthDeg((v) => (v + 5) % 360)}
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          backgroundColor: "#eee",
                          borderRadius: 8,
                        }}
                      >
                        <Text>▶</Text>
                      </Pressable>
                      <View style={{ width: 10 }} />
                      <Pressable
                        onPress={() =>
                          setKeyElevationDeg((v) => Math.max(0, v - 5))
                        }
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          backgroundColor: "#eee",
                          borderRadius: 8,
                        }}
                      >
                        <Text>▼</Text>
                      </Pressable>
                      <Text style={{ width: 60, textAlign: "center" }}>
                        {keyElevationDeg}°
                      </Text>
                      <Pressable
                        onPress={() =>
                          setKeyElevationDeg((v) => Math.min(90, v + 5))
                        }
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          backgroundColor: "#eee",
                          borderRadius: 8,
                        }}
                      >
                        <Text>▲</Text>
                      </Pressable>
                    </View>
                  </View>
                </ScrollView>
              ) : (
                <View>
                  <View
                    style={{
                      marginVertical: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={{ marginRight: 8 }}>Key:</Text>
                    {["#ffffff", "#ffd7b3", "#bbddff"].map((c) => (
                      <Pressable
                        key={c}
                        onPress={() => setKeyColor(c)}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          backgroundColor: c,
                          borderWidth: keyColor === c ? 2 : 1,
                          borderColor: keyColor === c ? "#222" : "#aaa",
                        }}
                      />
                    ))}
                  </View>
                  <View
                    style={{
                      marginVertical: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={{ marginRight: 8 }}>Fill:</Text>
                    {["#ffffff", "#ffe9cc", "#d5e8ff"].map((c) => (
                      <Pressable
                        key={c}
                        onPress={() => setFillColor(c)}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          backgroundColor: c,
                          borderWidth: fillColor === c ? 2 : 1,
                          borderColor: fillColor === c ? "#222" : "#aaa",
                        }}
                      />
                    ))}
                  </View>
                  <View
                    style={{
                      marginVertical: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={{ marginRight: 8 }}>Top:</Text>
                    {["#ffffff", "#fff0cc", "#e1efff"].map((c) => (
                      <Pressable
                        key={c}
                        onPress={() => setTopColor(c)}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          backgroundColor: c,
                          borderWidth: topColor === c ? 2 : 1,
                          borderColor: topColor === c ? "#222" : "#aaa",
                        }}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
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

// Radial background helper for Three.js scene
function RadialBackground() {
  const { scene } = useThree();
  const texture = useMemo(() => {
    const size = 512;
    const data = new Uint8Array(size * size * 4);
    const inner = { r: 245, g: 247, b: 251 }; // #f5f7fb
    const outer = { r: 230, g: 233, b: 242 }; // #e6e9f2
    const cx = size / 2;
    const cy = size / 2;
    const maxR = Math.sqrt(cx * cx + cy * cy);
    let i = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const t = Math.min(1, Math.sqrt(dx * dx + dy * dy) / maxR);
        const r = Math.round(inner.r + (outer.r - inner.r) * t);
        const g = Math.round(inner.g + (outer.g - inner.g) * t);
        const b = Math.round(inner.b + (outer.b - inner.b) * t);
        data[i++] = r;
        data[i++] = g;
        data[i++] = b;
        data[i++] = 255;
      }
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.needsUpdate = true;
    // @ts-ignore - type versions can differ
    tex.colorSpace =
      (THREE as any).SRGBColorSpace ?? (THREE as any).sRGBEncoding;
    return tex;
  }, []);

  useEffect(() => {
    const prev = scene.background as THREE.Texture | null;
    scene.background = texture;
    return () => {
      scene.background = prev;
      texture.dispose();
    };
  }, [scene, texture]);

  return null;
}
