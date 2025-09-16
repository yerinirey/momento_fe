import React, { useEffect, useRef, useState } from "react";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
  Platform,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";

type TiltProps = {
  mode?: "full" | "bubble-only"; // ← 추가
};

const rad2deg = (r: number) => (r * 180) / Math.PI;
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const degreeSoft = 5;
const degreeHard = 12;

export default function TiltIndicator({ mode = "full" }: TiltProps) {
  // baseline (calibrated x)
  const baseline = useRef<{ roll: number; pitch: number }>({
    roll: 0,
    pitch: 0,
  });
  const [rollDegRaw, setRollDegRaw] = useState(0);
  const [pitchDegRaw, setPitchDegRaw] = useState(0);

  const [rollDeg, setRollDeg] = useState(0);
  const [pitchDeg, setPitchDeg] = useState(0);

  const bubbleX = useRef(new Animated.Value(0)).current;
  const bubbleY = useRef(new Animated.Value(0)).current;

  // 토스트 비슷한 알림
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const lastToastAtRef = useRef<number>(0);
  type TimeoutHandle = ReturnType<typeof setTimeout>;
  const toastTimerRef = useRef<TimeoutHandle | null>(null);
  const toastDurationMs = 1200;
  const toastCooldownMs = 2500;

  const initializedRef = useRef(false);

  useEffect(() => {
    const sub = DeviceMotion.addListener((data: DeviceMotionMeasurement) => {
      const roll = rad2deg(data.rotation?.gamma ?? 0);
      const pitch = rad2deg(data.rotation?.beta ?? 0);

      setRollDegRaw(roll);
      setPitchDegRaw(pitch);

      // 첫 이벤트를 기준 각도로 채택
      if (!initializedRef.current) {
        baseline.current = { roll, pitch };
        initializedRef.current = true;
      }

      const adjRoll = roll - baseline.current.roll;
      const adjPitch = pitch - baseline.current.pitch;

      setRollDeg(adjRoll);
      setPitchDeg(adjPitch);

      // 버블 이동
      const normX = clamp(adjRoll / 20, -1, 1);
      const normY = clamp(adjPitch / 20, -1, 1);
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

      // 과도 기울기 경고
      const tooTilted =
        Math.abs(adjRoll) > degreeHard || Math.abs(adjPitch) > degreeHard;
      const now = Date.now();
      if (tooTilted && now - lastToastAtRef.current > toastCooldownMs) {
        lastToastAtRef.current = now;
        triggerToast();
      }
    });

    DeviceMotion.setUpdateInterval(120);
    return () => {
      sub.remove();
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
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
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    toastTimerRef.current = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setShowToast(false));
    }, toastDurationMs);
  };

  const calibrateNow = () => {
    baseline.current = { roll: rollDegRaw, pitch: pitchDegRaw };
  };

  const absR = Math.abs(rollDeg);
  const absP = Math.abs(pitchDeg);
  let statusText = "수평";
  let statusColor = "#22c55e";
  if (absR > degreeSoft || absP > degreeSoft) {
    statusText = "기울어짐";
    statusColor = "#f59e0b";
  }
  if (absR > degreeHard || absP > degreeHard) {
    statusText = "너무 기울어짐";
    statusColor = "#ef4444";
  }

  const guideRotate = `${clamp(rollDeg, -25, 25)}deg`;
  const circleRadius = 40;
  const bubbleTranslate = (v: Animated.Value) =>
    v.interpolate({
      inputRange: [-1, 1],
      outputRange: [-circleRadius * 0.9, circleRadius * 0.9],
    });

  return (
    <>
      {/* 상단 상태 카드 + 중심 재설정 */}
      <View style={styles.topCard}>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>
        <Text style={styles.subText}>
          roll {rollDeg.toFixed(1)}° · pitch {pitchDeg.toFixed(1)}°
        </Text>
        <Pressable onPress={calibrateNow} style={styles.calibBtn}>
          <Icon name="locate-outline" size={16} color="#fff" />
          <Text style={styles.calibText}>현재 각도를 중심으로 재설정</Text>
        </Pressable>
      </View>

      {/* 버블 */}
      <View style={styles.centerWrap} pointerEvents="none">
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
      {/* 토스트 */}
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
            품질 저하를 방지하려면 기울기를 줄여주세요
          </Text>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  topCard: {
    position: "absolute",
    top: 16,
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
  calibBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  calibText: { color: "white", fontSize: 12, fontWeight: "700" },

  centerWrap: {
    position: "absolute",
    top: "50%",
    bottom: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9,
  },

  bubbleWrap: { alignItems: "center", justifyContent: "center" },
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
    backgroundColor: "#f99101",
  },
  bubbleHint: { marginTop: 6, color: "white", fontSize: 12, opacity: 0.85 },

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
