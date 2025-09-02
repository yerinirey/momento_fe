import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Easing,
  useWindowDimensions,
  View,
} from "react-native";
import { Image, ScrollView, Text } from "tamagui";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import TiltIndicator from "@/components/Camera/TiltIndicator";
import { CameraSceneButton } from "@/components/Camera/CameraSceneButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// rad ↔ deg
const rad2deg = (r: number) => (r * 180) / Math.PI;

export default function CameraScreenNoTF() {
  const cameraRef = useRef<CameraView>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableW = width;
  const usableH = height - insets.top - insets.bottom;
  const guideSize = usableW * 0.55;
  const guideTop = insets.top + usableH * 0.35; // 기존 '35%'를 안전영역 포함 계산으로

  const [capturing, setCapturing] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedUris, setCapturedUris] = useState<string[]>([]);

  // 안정도/각도 체크용
  const [monitoring, setMonitoring] = useState(false);
  const baselineRef = useRef<{ roll: number; pitch: number } | null>(null);
  const stableSinceRef = useRef<number | null>(null);
  const motionSubRef = useRef<any>(null);

  // 카운트다운
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 안내 오버레이 애니메이션
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // 파라미터
  const DEG_SOFT = 5; // ±5 이내
  const STABLE_WINDOW_MS = 800; // 이 시간 동안 흔들림 낮아야 함
  const MOTION_RATE_MAX = 45; // 임계치: 이보다 작아야 안정적

  // 권한
  const checkPermissions = async () => {
    if (!cameraPermission) return;
    if (cameraPermission.status !== "granted") {
      if (!cameraPermission.canAskAgain) {
        Alert.alert(
          "카메라 접근 권한을 허용해주세요.",
          "앱 설정에서 변경할 수 있습니다.",
          [
            { text: "취소", style: "cancel" },
            { text: "설정", onPress: () => Linking.openSettings() },
          ],
          { cancelable: false }
        );
      } else {
        requestCameraPermission();
      }
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) return;
    try {
      setCapturing(true);

      // 1) 촬영 순간 JS 부하 줄이기: 센서 잠깐 중지
      if (motionSubRef.current) {
        motionSubRef.current.remove();
        motionSubRef.current = null;
      }

      // 2) 빠른 촬영 옵션
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6, // 0~1 (0.6~0.8 추천, 더 낮추면 더 빠름)
        base64: false, // 인코딩 비용 줄이기
        exif: false, // 메타 쓰기 비용 줄이기
        skipProcessing: true, // 후처리 끄기 → 가장 큰 체감 향상
      });

      if (photo?.uri) {
        // UI 즉시 반응
        setCapturedUris((prev) => [photo.uri, ...prev]);
      }
    } catch (error) {
      console.error("Photo capture failed:", error);
    } finally {
      setCapturing(false);

      // 3) 센서 재개
      if (!motionSubRef.current) {
        motionSubRef.current = DeviceMotion.addListener(onMotion);
        DeviceMotion.setUpdateInterval(120);
      }
    }
  };

  const handleDone = () => {
    if (capturedUris.length >= 1) {
      const jsonUris = encodeURIComponent(JSON.stringify(capturedUris));
      router.replace({
        pathname: "/(tabs)/scan",
        params: { capturedUris: jsonUris },
      });
    } else {
      Alert.alert("사진을 최소 10장 이상 촬영해주세요.");
    }
  };

  const stopMonitor = () => {
    if (motionSubRef.current) {
      motionSubRef.current.remove();
      motionSubRef.current = null;
    }
    setMonitoring(false);
    stableSinceRef.current = null;

    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // 센서 콜백: 중앙/수평 + 안정도 판별
  const onMotion = (data: DeviceMotionMeasurement) => {
    const rollDeg = rad2deg(data.rotation?.gamma ?? 0); // 좌우
    const pitchDeg = rad2deg(data.rotation?.beta ?? 0); // 앞뒤
    // 회전 속도(안정도)
    const rr = data.rotationRate; // deg/s
    const rateMag = Math.sqrt(
      Math.pow(rr?.alpha ?? 0, 2) +
        Math.pow(rr?.beta ?? 0, 2) +
        Math.pow(rr?.gamma ?? 0, 2)
    );

    // 첫 샘플을 중심(베이스라인)으로
    if (!baselineRef.current) {
      baselineRef.current = { roll: rollDeg, pitch: pitchDeg };
      return;
    }

    const adjRoll = rollDeg - baselineRef.current.roll;
    const adjPitch = pitchDeg - baselineRef.current.pitch;

    const angleOk =
      Math.abs(adjRoll) <= DEG_SOFT && Math.abs(adjPitch) <= DEG_SOFT;
    const motionOk = rateMag <= MOTION_RATE_MAX;

    const now = Date.now();
    if (angleOk && motionOk) {
      // 안정 구간 시작/유지
      if (stableSinceRef.current == null) {
        stableSinceRef.current = now;
      }
      const stableMs = now - stableSinceRef.current;
      if (stableMs >= STABLE_WINDOW_MS) {
        // 조건 충족 → 카운트다운 시작
        stopMonitor();
        beginCountdownAndShoot();
      }
    } else {
      // 조건 깨지면 타이머 리셋
      stableSinceRef.current = null;
    }
  };

  const beginCountdownAndShoot = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    let c = 3;
    setCountdown(c);
    countdownTimerRef.current = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        clearInterval(countdownTimerRef.current as NodeJS.Timeout);
        countdownTimerRef.current = null;
        setCountdown(null);
        takePhoto();
      } else {
        setCountdown(c);
      }
    }, 1000);
  };

  useEffect(() => {
    checkPermissions();
    setIsCameraActive(true);
    return () => {
      if (motionSubRef.current) motionSubRef.current.remove();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [cameraPermission]);

  return (
    <>
      {isCameraActive && cameraPermission?.granted && (
        <View style={styles.container}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
            flash="off"
          />

          {/* 상단: 각도 보정/토스트 인디케이터 */}
          <TiltIndicator />

          {/* 중앙 고정 가이드 박스 */}
          <View
            pointerEvents="none"
            style={[styles.centerGuide, { top: guideTop }]}
          >
            <View
              style={[
                styles.centerBox,
                { width: guideSize, height: guideSize },
              ]}
            />
            <Text style={styles.centerHint}>
              가이드 박스에 피사체를 맞춰주세요
            </Text>
          </View>

          {/* 이미지 카운터 */}
          <View style={[styles.counterContainer, { top: insets.top + 8 }]}>
            <Text style={styles.counterText}>{capturedUris.length} / 20</Text>
          </View>
          {/* 하단 컨트롤 */}
          <View style={[styles.controls, { bottom: insets.bottom + 20 }]}>
            <CameraSceneButton onPress={handleDone} iconName="checkmark" />
            <CameraSceneButton
              onPress={() => {
                // 수동 촬영
                if (countdown !== null || capturing) return;
                takePhoto();
              }}
              iconName="camera-outline"
              bgColor="$pointColor"
            />
            <CameraSceneButton
              onPress={() => router.back()}
              iconName="close-outline"
            />
          </View>

          {/* 썸네일 스트립 */}
          {capturedUris.length > 0 && (
            <ScrollView
              horizontal
              style={{ position: "absolute", bottom: insets.bottom + 100 }}
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
  container: { flex: 1, position: "relative", backgroundColor: "black" },

  camera: { ...StyleSheet.absoluteFillObject },

  controls: {
    position: "absolute",
    left: 0,
    right: 0,
    // width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    zIndex: 20,
  },

  counterContainer: {
    position: "absolute",
    left: 24,
    paddingVertical: 4,
    zIndex: 20,
  },
  counterText: { color: "white", fontSize: 14, fontWeight: "bold" },

  // 중앙 가이드
  centerGuide: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 8,
  },
  centerBox: {
    position: "relative",
    // width: SCREEN_W * 0.55,
    // height: SCREEN_W * 0.55,
    borderWidth: 2,
    borderColor: "#f99101",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  centerHint: {
    marginTop: 8,
    color: "white",
    fontSize: 12,
    opacity: 0.85,
  },
});
