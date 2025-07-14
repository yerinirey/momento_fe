import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet } from "react-native";
import { Button, Image, ScrollView, Text, View } from "tamagui";
import Icon from "@expo/vector-icons/Ionicons";
import TiltIndicator from "@/components/Camera/TiltIndicator";
import { CameraSceneButton } from "@/components/Shared/CameraSceneButton";

export default function CameraScreen() {
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedUris, setCapturedUris] = useState<string[]>([]);

  /* 권한 설정 */
  const checkPermissions = async () => {
    if (!cameraPermission) return;
    if (cameraPermission.status !== "granted") {
      if (!cameraPermission.canAskAgain) {
        Alert.alert(
          "카메라 접근 권한을 허용해주세요.",
          "앱 설정에서 변경할 수 있습니다.",
          [
            { text: "취소", style: "cancel" },
            {
              text: "설정",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        requestCameraPermission(); // 권한 재요청
      }
    }
  };

  /* 사진 촬영 */
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) setCapturedUris((prev) => [...prev, photo.uri]);
      } catch (error) {
        console.error("Photo capture failed:", error);
      }
    }
  };

  const handleDone = () => {
    if (capturedUris.length >= 1) {
      const jsonUris = encodeURIComponent(JSON.stringify(capturedUris)); // 문자열로 encode
      router.replace({
        pathname: "/(tabs)/scan",
        params: { capturedUris: jsonUris },
      });
    } else {
      Alert.alert("사진을 최소 10장 이상 촬영해주세요.");
    }
  };

  useEffect(() => {
    checkPermissions();
    setIsCameraActive(true);
  }, [cameraPermission]);

  return (
    <>
      {isCameraActive && cameraPermission?.granted && (
        <View style={styles.container}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            flash="off"
            animateShutter
          />
          <TiltIndicator />

          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{capturedUris.length} / 10</Text>
          </View>
          <View style={styles.controls}>
            <CameraSceneButton onPress={handleDone} iconName="checkmark" />
            <CameraSceneButton
              onPress={takePhoto}
              iconName="camera-outline"
              bgColor="#FED2E2"
            />
            <CameraSceneButton
              onPress={() => router.back()}
              iconName="close-outline"
            />
          </View>
          {capturedUris.length > 0 && (
            <ScrollView
              horizontal
              style={{ position: "absolute", bottom: 100 }}
            >
              {capturedUris.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={{ width: 80, height: 80, margin: 5, borderRadius: 10 }}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  counterContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 4,
  },
  counterText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
