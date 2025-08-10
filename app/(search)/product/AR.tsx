import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text as RNText,
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroClickStateTypes,
} from "@reactvision/react-viro";
import { useLocalSearchParams } from "expo-router";
import { Viro3DPoint } from "@reactvision/react-viro/dist/components/Types/ViroUtils";

/** 회전(각도)에서 카메라 전방 벡터 추정 */
function forwardFromRotationDeg(rot: number[]): Viro3DPoint {
  // rot = [x(pitch), y(yaw), z(roll)] in degrees (일반적으로)
  const rx = (rot[0] ?? 0) * (Math.PI / 180);
  const ry = (rot[1] ?? 0) * (Math.PI / 180);
  // Z(roll)는 전방 계산에 크게 영향 없음
  // 추정식: y축(yaw), x축(pitch)
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  // 화면을 기준으로 "앞"을 -Z로 보고, yaw/pitch를 적용
  // 이 근사치는 Viro의 좌표계에서 잘 작동함
  const fx = -sy * cx;
  const fy = sx;
  const fz = -cy * cx;
  return [fx, fy, fz];
}

type SceneBridgeProps = {
  modelUrl: string;
  placedPosition: Viro3DPoint | null;
  onRequestPlaceAt: (p: Viro3DPoint) => void;
  onModelLoadStart: () => void;
  onModelLoadEnd: () => void;
};

const Scene: React.FC<any> = (props) => {
  const {
    modelUrl,
    placedPosition,
    onRequestPlaceAt,
    onModelLoadStart,
    onModelLoadEnd,
  } = props.sceneNavigator.viroAppProps as SceneBridgeProps;

  const sceneRef = useRef<any>(null);

  // 최근 카메라 포즈 저장
  const lastCam = useRef<{ position: Viro3DPoint; forward: Viro3DPoint }>({
    position: [0, 0, 0],
    forward: [0, 0, -1],
  });

  // 카메라 포즈 갱신
  const onCameraTransformUpdate = (e: {
    position?: Viro3DPoint;
    rotation?: number[]; // [x,y,z] degrees
    forward?: Viro3DPoint;
  }) => {
    if (Array.isArray(e.position) && e.position.length === 3) {
      lastCam.current.position = [
        Number(e.position[0]) || 0,
        Number(e.position[1]) || 0,
        Number(e.position[2]) || 0,
      ];
    }
    if (Array.isArray(e.forward) && e.forward.length === 3) {
      lastCam.current.forward = [
        Number(e.forward[0]) || 0,
        Number(e.forward[1]) || 0,
        Number(e.forward[2]) || -1,
      ];
    } else if (Array.isArray(e.rotation) && e.rotation.length >= 2) {
      lastCam.current.forward = forwardFromRotationDeg(e.rotation);
    }
  };

  // 탭 → 카메라 전방 1m에 배치 (히트테스트 없이)
  const placeInFront = (distance = 1.0) => {
    const { position, forward } = lastCam.current;
    const target: Viro3DPoint = [
      position[0] + forward[0] * distance,
      position[1] + forward[1] * distance,
      position[2] + forward[2] * distance,
    ];
    console.log("[AR] place using camera pose →", target);
    onRequestPlaceAt(target);
  };

  return (
    <ViroARScene
      ref={sceneRef}
      onCameraTransformUpdate={onCameraTransformUpdate}
      onClick={() => placeInFront(1.0)}
      onClickState={(state: number) => {
        if (state === ViroClickStateTypes.CLICKED) placeInFront(1.0);
      }}
    >
      <ViroAmbientLight color="white" />
      {placedPosition && (
        <Viro3DObject
          source={{ uri: modelUrl }}
          type="GLB"
          position={placedPosition}
          scale={[0.1, 0.1, 0.1]}
          onLoadStart={onModelLoadStart}
          onLoadEnd={onModelLoadEnd}
          onError={(e) => console.log("[AR] model error", e.nativeEvent)}
        />
      )}
    </ViroARScene>
  );
};

export default function ARScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(true);
  const [placedPosition, setPlacedPosition] = useState<Viro3DPoint | null>(
    null
  );

  // 토스트
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const showPlacementToast = () => {
    setShowToast(true);
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowToast(false));
    }, 1000);
  };

  const onRequestPlaceAt = (pos: Viro3DPoint) => {
    console.log("[AR] place at", pos);
    setPlacedPosition(pos);
    showPlacementToast();
  };

  const viroAppProps = useMemo<SceneBridgeProps>(
    () => ({
      modelUrl,
      placedPosition,
      onRequestPlaceAt,
      onModelLoadStart: () => setIsLoading(true),
      onModelLoadEnd: () => setIsLoading(false),
    }),
    [modelUrl, placedPosition]
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header} pointerEvents="box-none">
        <RNText numberOfLines={1} style={styles.headerText}>
          {modelUrl}
        </RNText>
      </View>

      <ViroARSceneNavigator
        initialScene={{ scene: Scene as unknown as () => JSX.Element }}
        viroAppProps={viroAppProps}
        autofocus
      />

      {isLoading && (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" />
          <RNText style={styles.overlayText}>모델 로딩 중…</RNText>
        </View>
      )}

      <Modal
        visible={showGuideModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuideModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <RNText style={styles.modalTitle}>배치 안내</RNText>
            <RNText style={styles.modalBody}>
              화면을 탭하면 현재 카메라 전방 1m 지점에 모델을 배치합니다.
            </RNText>
            <Pressable
              style={styles.modalBtn}
              onPress={() => setShowGuideModal(false)}
            >
              <RNText style={styles.modalBtnText}>OK</RNText>
            </Pressable>
          </View>
        </View>
      </Modal>

      {showToast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastContainer,
            {
              opacity: toastOpacity,
              transform: [
                {
                  translateY: toastOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <RNText style={styles.toastText}>
            평면 클릭 인식됨. 모델을 배치합니다.
          </RNText>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerText: { color: "white" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingBottom: 60,
  },
  overlayText: { marginTop: 12, color: "white", fontSize: 16 },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "82%",
    borderRadius: 16,
    backgroundColor: "white",
    padding: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  modalBody: { fontSize: 16, marginBottom: 14 },
  modalBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#333",
  },
  modalBtnText: { color: "white", fontWeight: "600" },

  toastContainer: {
    position: "absolute",
    bottom: 60,
    left: "10%",
    right: "10%",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  toastText: { color: "white", fontSize: 14, textAlign: "center" },
});
