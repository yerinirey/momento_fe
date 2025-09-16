import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text as RNText,
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { Dimensions } from "react-native";
import Slider from "@react-native-community/slider";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroClickStateTypes,
} from "@reactvision/react-viro";
import { ViroQuad } from "@reactvision/react-viro";
import { ViroMaterials } from "@reactvision/react-viro";
import { useLocalSearchParams } from "expo-router";
import { Viro3DPoint } from "@reactvision/react-viro/dist/components/Types/ViroUtils";

/** 회전(각도)에서 카메라 전방 벡터 추정 */
function forwardFromRotationDeg(rot: number[]): Viro3DPoint {
  const rx = (rot[0] ?? 0) * (Math.PI / 180);
  const ry = (rot[1] ?? 0) * (Math.PI / 180);
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const fx = -sy * cx;
  const fy = sx;
  const fz = -cy * cx;
  return [fx, fy, fz];
}

type SceneBridgeProps = {
  modelUrl: string;
  placedPosition: Viro3DPoint | null;
  onRequestPlaceAt: (p: Viro3DPoint, opts?: { silent?: boolean }) => void;
  onModelLoadStart: () => void;
  onModelLoadEnd: () => void;
  scale: number;
  onPinchStart?: () => void;
};

const Scene: React.FC<any> = (props) => {
  const PINCH_SENSITIVITY = 0.25; // 0.0~1.0 (작을수록 덜 민감)
  const {
    modelUrl,
    placedPosition,
    onRequestPlaceAt,
    onModelLoadStart,
    onModelLoadEnd,
    scale,
  } = props.sceneNavigator.viroAppProps as SceneBridgeProps;

  const lastCam = useRef<{ position: Viro3DPoint; forward: Viro3DPoint }>({
    position: [0, 0, 0],
    forward: [0, 0, -1],
  });

  // Ref to ViroARScene to perform hit-tests
  const sceneRef = useRef<any>(null);

  // Reticle state based on plane hit-test at screen center
  const [reticlePos, setReticlePos] = useState<Viro3DPoint | null>(null);
  const [reticleVisible, setReticleVisible] = useState(false);

  // Suppress click while dragging to avoid accidental placements/toasts
  const draggingRef = useRef(false);
  const dragResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markDragging = () => {
    draggingRef.current = true;
    if (dragResetTimer.current) clearTimeout(dragResetTimer.current);
    dragResetTimer.current = setTimeout(() => {
      draggingRef.current = false;
    }, 150);
  };

  const onCameraTransformUpdate = (e: {
    position?: Viro3DPoint;
    rotation?: number[];
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
    // Run a lightweight, throttled center hit-test to update reticle
    // Note: some platforms require pixel coords
    const { width, height } = Dimensions.get("window");
    try {
      sceneRef.current
        ?.performARHitTestWithPoint?.(width / 2, height / 2)
        ?.then?.((results: any[]) => {
          if (!Array.isArray(results) || results.length === 0) {
            setReticleVisible(false);
            return;
          }
          // Prefer plane result if available; otherwise pick first
          const plane = results.find((r) =>
            r?.type?.includes?.("ExistingPlaneUsingExtent")
          );
          const best = plane ?? results[0];
          const hitPos = best?.transform?.position ?? best?.position;
          if (Array.isArray(hitPos) && hitPos.length === 3) {
            setReticlePos([
              Number(hitPos[0]) || 0,
              Number(hitPos[1]) || 0,
              Number(hitPos[2]) || 0,
            ]);
            setReticleVisible(true);
          } else {
            setReticleVisible(false);
          }
        })
        .catch(() => setReticleVisible(false));
    } catch {
      /* noop */
    }
  };

  const placeInFront = (distance = 1.0) => {
    const { position, forward } = lastCam.current;
    const target: Viro3DPoint = [
      position[0] + forward[0] * distance,
      position[1] + forward[1] * distance,
      position[2] + forward[2] * distance,
    ];
    if (__DEV__) console.log("[AR] place using camera pose →", target);
    onRequestPlaceAt(target);
  };

  return (
    <ViroARScene
      ref={sceneRef}
      onCameraTransformUpdate={onCameraTransformUpdate}
      onClick={() => {
        if (draggingRef.current) return;
        // Prefer placing at reticle when available; fallback to 1m in front
        if (reticleVisible && reticlePos) onRequestPlaceAt(reticlePos);
        else placeInFront(1.0);
      }}
      onClickState={(state: number) => {
        if (draggingRef.current) return;
        if (state === ViroClickStateTypes.CLICKED) {
          if (reticleVisible && reticlePos) onRequestPlaceAt(reticlePos);
          else placeInFront(1.0);
        }
      }}
    >
      <ViroAmbientLight color="white" />
      {/* Reticle to indicate a detected plane position */}
      {reticleVisible && reticlePos && !placedPosition && (
        <ViroQuad
          position={reticlePos}
          rotation={[-90, 0, 0]}
          width={0.12}
          height={0.12}
          arShadowReceiver
          materials={["reticleMaterial"]}
          opacity={0.7}
        />
      )}
      {placedPosition && (
        <Viro3DObject
          source={{ uri: modelUrl }}
          type="GLB"
          position={placedPosition}
          scale={[scale, scale, scale]}
          rotation={[
            0,
            (props.sceneNavigator.viroAppProps as any)?.rotationY ?? 0,
            0,
          ]}
          onLoadStart={onModelLoadStart}
          onLoadEnd={onModelLoadEnd}
          onError={(e) => console.error("[AR] model error", e.nativeEvent)}
          dragType="FixedDistance"
          onDrag={(dragToPos: Viro3DPoint) => {
            markDragging();
            onRequestPlaceAt(dragToPos, { silent: true });
          }}
          onPinch={(pinchState: number, scaleFactor: number) => {
            // 1: start, 2: move, 3: end
            const appProps = props.sceneNavigator.viroAppProps as any;
            if (pinchState === 1) {
              appProps.onPinchStart?.();
              return;
            }
            if (pinchState === 2 || pinchState === 3) {
              const adjusted = 1 + (scaleFactor - 1) * PINCH_SENSITIVITY;
              // base scale is stored in parent on pinch start
              const base = appProps.baseScale ?? appProps.scale;
              const next = base * adjusted;
              appProps.onPinchScale?.(next);
            }
          }}
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
  const [rotationY, setRotationY] = useState(0);

  // 🔹 모델 스케일 상태
  const [scale, setScale] = useState(0.1);
  const minScale = 0.01;
  const maxScale = 2.0;
  const step = 0.01;
  const baseScaleRef = useRef(scale);
  const pinchBaseRef = useRef<number | null>(null);

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

  const onRequestPlaceAt = (pos: Viro3DPoint, opts?: { silent?: boolean }) => {
    if (__DEV__) console.log("[AR] place at", pos);
    setPlacedPosition(pos);
    if (!opts?.silent) showPlacementToast();
  };

  // Callbacks consumed by Scene via viroAppProps to update scale/rotation from gestures
  const onPinchScale = (nextScale: number) => {
    setScale((prev) => {
      const clamped = Math.min(
        maxScale,
        Math.max(minScale, +nextScale.toFixed(3))
      );
      baseScaleRef.current = clamped;
      return clamped;
    });
  };
  const onPinchStart = () => {
    pinchBaseRef.current = baseScaleRef.current;
    // expose to Scene via app props
    (viroAppProps as any).baseScale = pinchBaseRef.current;
  };
  const onRotateYBy = (deltaDeg: number) => {
    setRotationY((prev) => prev + deltaDeg);
  };

  // Long-press continuous rotation
  const rotateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRotateHold = (dir: 1 | -1) => {
    if (rotateIntervalRef.current) return;
    rotateIntervalRef.current = setInterval(() => {
      onRotateYBy(dir * 5);
    }, 80);
  };
  const stopRotateHold = () => {
    if (rotateIntervalRef.current) {
      clearInterval(rotateIntervalRef.current);
      rotateIntervalRef.current = null;
    }
  };
  useEffect(() => {
    return () => stopRotateHold();
  }, []);

  const viroAppProps = useMemo<SceneBridgeProps>(
    () =>
      ({
        modelUrl,
        placedPosition,
        onRequestPlaceAt,
        onModelLoadStart: () => setIsLoading(true),
        onModelLoadEnd: () => setIsLoading(false),
        scale,
        onPinchStart,
        // gesture callbacks (as any to avoid leaking into public type)
        onPinchScale,
        rotationY,
      } as any),
    [modelUrl, placedPosition, scale, rotationY]
  );

  // 🔹 버튼 핸들러
  const nudgeScale = (delta: number) => {
    setScale((prev) => {
      const next = Math.min(
        maxScale,
        Math.max(minScale, +(prev + delta).toFixed(2))
      );
      return next;
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* register reticle material once */}
      {(() => {
        try {
          ViroMaterials.createMaterials?.({
            reticleMaterial: {
              diffuseColor: "#00FF88",
            },
          });
        } catch {}
        return null;
      })()}
      {/* 상단 디버그 바 */}
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

      {/* 첫 진입 안내 */}
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
              화면을 탭하면 현재 카메라 전방 지점에 모델을 배치합니다.
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

      {/* 🔹 하단 컨트롤러 (회전 + 스케일) */}
      <View style={styles.scaleBar} pointerEvents="box-none">
        <View style={styles.scaleControls}>
          {/* 회전: 좌 */}
          <Pressable
            style={styles.scaleBtn}
            onPress={() => onRotateYBy(-10)}
            delayLongPress={250}
            onLongPress={() => startRotateHold(-1)}
            onPressOut={stopRotateHold}
          >
            <RNText style={styles.scaleBtnText}>⟲</RNText>
          </Pressable>
          <Pressable style={styles.scaleBtn} onPress={() => nudgeScale(-0.05)}>
            <RNText style={styles.scaleBtnText}>-</RNText>
          </Pressable>

          <View style={styles.sliderWrap}>
            <Slider
              minimumValue={minScale}
              maximumValue={maxScale}
              step={step}
              value={scale}
              onValueChange={setScale}
              minimumTrackTintColor="#f99101"
              maximumTrackTintColor="#999999"
            />
            <RNText style={styles.scaleValue}>{scale.toFixed(2)}x</RNText>
          </View>

          <Pressable style={styles.scaleBtn} onPress={() => nudgeScale(+0.05)}>
            <RNText style={styles.scaleBtnText}>+</RNText>
          </Pressable>
          {/* 회전: 우 */}
          <Pressable
            style={styles.scaleBtn}
            onPress={() => onRotateYBy(+10)}
            delayLongPress={250}
            onLongPress={() => startRotateHold(+1)}
            onPressOut={stopRotateHold}
          >
            <RNText style={styles.scaleBtnText}>⟳</RNText>
          </Pressable>
        </View>
      </View>

      {/* 토스트 */}
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

  // 스케일 컨트롤
  scaleBar: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    zIndex: 15,
    alignItems: "center",
  },
  scaleControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "88%",
  },
  scaleBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  scaleBtnText: { color: "white", fontSize: 22, fontWeight: "700" },
  sliderWrap: { flex: 1, paddingHorizontal: 12 },
  scaleValue: { color: "white", textAlign: "right", marginTop: 6 },

  // 토스트
  toastContainer: {
    position: "absolute",
    bottom: 80,
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
