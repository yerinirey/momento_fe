import React, { useEffect, useRef, useState } from "react";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from "react-native";

/** 라디안 ↔ 도 */
const rad2deg = (r: number) => (r * 180) / Math.PI;
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * UI/로직 파라미터
 * - degreeSoft: 살짝 기울어짐 판단(도)
 * - degreeHard: "너무 기울어짐" 토스트 임계값(도)
 */
const degreeSoft = 5; // ±5°
const degreeHard = 12; // ±12°
const toastDurationMs = 1200;
const toastCooldownMs = 2500;

export default function TiltIndicator() {
  const [rollDeg, setRollDeg] = useState(0); // 좌/우 기울기
  const [pitchDeg, setPitchDeg] = useState(0); // 앞/뒤 기울기

  // 버블 포지션(원 내부 이동) 애니메이션 값
  const bubbleX = useRef(new Animated.Value(0)).current;
  const bubbleY = useRef(new Animated.Value(0)).current;

  // 토스트 상태
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const lastToastAtRef = useRef<number>(0);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 센서 구독
    const sub = DeviceMotion.addListener((data: DeviceMotionMeasurement) => {
      // expo-sensors 기준: rotation(beta=Pitch, gamma=Roll) — radians
      const pitch = data.rotation?.beta ?? 0; // X축 회전
      const roll = data.rotation?.gamma ?? 0; // Y축 회전

      const rDeg = rad2deg(roll);
      const pDeg = rad2deg(pitch);

      setRollDeg(rDeg);
      setPitchDeg(pDeg);

      // 버블 이동(원 안에서 위치)
      // roll -> x, pitch -> y 로 매핑. -20°~20° 사이 정규화해서 0.9 radius 범위로 이동
      const normX = clamp(rDeg / 20, -1, 1);
      const normY = clamp(pDeg / 20, -1, 1);

      Animated.timing(bubbleX, {
        toValue: normX,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      Animated.timing(bubbleY, {
        toValue: normY,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      // 과도한 기울기 → 토스트 (쿨다운 적용)
      const tooTilted =
        Math.abs(rDeg) > degreeHard || Math.abs(pDeg) > degreeHard;
      const now = Date.now();
      if (tooTilted && now - lastToastAtRef.current > toastCooldownMs) {
        lastToastAtRef.current = now;
        triggerToast();
      }
    });

    DeviceMotion.setUpdateInterval(120); // 120ms
    return () => {
      sub.remove();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const triggerToast = () => {
    setShowToast(true);
    toastOpacity.setValue(0);
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setShowToast(false));
    }, toastDurationMs);
  };

  // 상태 라벨/색
  const absR = Math.abs(rollDeg);
  const absP = Math.abs(pitchDeg);

  let statusText = "수평";
  let statusColor = "#22c55e"; // green
  if (absR > degreeSoft || absP > degreeSoft) {
    statusText = "기울어짐";
    statusColor = "#f59e0b"; // amber
  }
  if (absR > degreeHard || absP > degreeHard) {
    statusText = "너무 기울어짐";
    statusColor = "#ef4444"; // red
  }

  // 중앙 수평 가이드 라인의 회전(roll 반영)
  const guideRotate = `${clamp(rollDeg, -25, 25)}deg`;

  // 원형 버블 컨테이너 내 이동 거리(px)
  const circleRadius = 40; // 컨테이너 80px
  const bubbleTranslate = (v: Animated.Value) =>
    v.interpolate({
      inputRange: [-1, 1],
      outputRange: [-circleRadius * 0.9, circleRadius * 0.9],
    });

  return (
    <>
      {/* 상단 상태 카드 */}
      <View style={styles.topCard}>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>
        <Text style={styles.subText}>
          roll {rollDeg.toFixed(1)}° · pitch {pitchDeg.toFixed(1)}°
        </Text>
      </View>

      {/* 중앙 수평 가이드 + 버블 레벨 */}
      <View style={styles.centerWrap} pointerEvents="none">
        {/* 수평 가이드 라인 */}
        <View style={styles.guideLineWrapper}>
          <View
            style={[
              styles.guideLine,
              {
                transform: [{ rotateZ: guideRotate }],
                backgroundColor:
                  absR < degreeSoft
                    ? "rgba(34,197,94,0.9)"
                    : "rgba(239,68,68,0.9)",
              },
            ]}
          />
        </View>

        {/* 버블 레벨 */}
        <View style={styles.bubbleWrap}>
          <View style={styles.bubbleCircle}>
            <Animated.View
              style={[
                styles.bubbleDot,
                {
                  transform: [
                    { translateX: bubbleTranslate(bubbleX) },
                    { translateY: bubbleTranslate(bubbleY) },
                  ],
                },
              ]}
            />
          </View>
          <Text style={styles.bubbleHint}>수평을 맞춰주세요</Text>
        </View>
      </View>

      {/* 과도한 기울기 토스트 */}
      {showToast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              opacity: toastOpacity,
              transform: [
                {
                  translateY: toastOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.toastText}>수평 및 높이를 유지해주세요</Text>
          <Text style={[styles.toastText, { opacity: 0.8, fontSize: 12 }]}>
            (카메라를 너무 기울이면 품질이 떨어질 수 있어요)
          </Text>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // 상단 카드
  topCard: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 10,
  },
  statusText: { fontSize: 16, fontWeight: "800" },
  subText: { marginTop: 2, color: "white", fontSize: 12, opacity: 0.95 },

  // 중앙 안내
  centerWrap: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9,
  },
  guideLineWrapper: {
    width: "86%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  guideLine: {
    width: "100%",
    height: 2,
    borderRadius: 1,
  },

  // 버블 레벨
  bubbleWrap: {
    alignItems: "center",
  },
  bubbleCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(0,0,0,0.25)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#C68EFD", // 포인트 컬러
  },
  bubbleHint: {
    marginTop: 6,
    color: "white",
    fontSize: 12,
    opacity: 0.85,
  },

  // 토스트
  toast: {
    position: "absolute",
    bottom: Platform.select({ ios: 90, android: 90 }),
    left: "10%",
    right: "10%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.88)",
    alignItems: "center",
    zIndex: 20,
  },
  toastText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
