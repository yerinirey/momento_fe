// ARScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text as RNText,
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroARPlane,
  ViroAmbientLight,
  ViroMaterials,
  ViroQuad,
  ViroClickStateTypes,
} from "@reactvision/react-viro";
import { useLocalSearchParams } from "expo-router";
import { Viro3DPoint } from "@reactvision/react-viro/dist/components/Types/ViroUtils";

/** Scene에 주입되는 prop 타입 */
type SceneBridgeProps = {
  modelUrl: string;
  placementMode: boolean;
  placedPosition: Viro3DPoint | null;
  onModelReady: () => void;
  onRequestPlaceAt: (p: Viro3DPoint) => void;
};

/** Viro가 sceneNavigator를 주입하므로 any로 받아 처리 */
const Scene: React.FC<any> = (props) => {
  const {
    modelUrl,
    placementMode,
    placedPosition,
    onModelReady,
    onRequestPlaceAt,
  } = props.sceneNavigator.viroAppProps as SceneBridgeProps;

  // 가이드용 머티리얼 1회 정의
  useEffect(() => {
    ViroMaterials.createMaterials({
      QuadMaterial: { lightingModel: "Constant", diffuseColor: "#aaaaaa" },
    });
  }, []);

  return (
    <ViroARScene>
      <ViroAmbientLight color="white" />

      {/* 1) 프리로드: 투명 상태로 로드 완료 신호만 받음 */}
      <Viro3DObject
        source={{ uri: modelUrl }}
        type="GLB"
        position={[0, 0, -0.6]}
        scale={[1, 1, 1]}
        opacity={0}
        onLoadEnd={onModelReady}
      />

      {/* 2) 배치 모드일 때: 클릭 가이드(수평 Quad) */}
      {placementMode && (
        <ViroARPlane dragType="FixedToWorld">
          <ViroQuad
            visible
            position={[0, 0, 0]}
            width={1}
            height={1}
            rotation={[-90, 0, 0]}
            materials="QuadMaterial"
            onClickState={(state, pos) => {
              if (state === ViroClickStateTypes.CLICKED) {
                onRequestPlaceAt(pos);
              }
            }}
          />
        </ViroARPlane>
      )}

      {/* 3) 배치 완료 후: 실제 모델 표시(드래그 가능) */}
      {!placementMode && placedPosition && (
        <ViroARPlane dragType="FixedToWorld">
          <Viro3DObject
            source={{ uri: modelUrl }}
            type="GLB"
            position={placedPosition}
            scale={[1, 1, 1]}
            onDrag={() => {}}
          />
        </ViroARPlane>
      )}
    </ViroARScene>
  );
};

export default function ARScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl: string }>();

  // UI / 흐름 상태
  const [isLoading, setIsLoading] = useState(true); // 모델 프리로드 중
  const [showGuideModal, setShowGuideModal] = useState(false); // 안내 모달
  const [placementMode, setPlacementMode] = useState(false); // 배치 모드
  const [placedPosition, setPlacedPosition] = useState<Viro3DPoint | null>(
    null
  );

  // 모델 준비 완료 콜백 (Scene -> ARScreen)
  const onModelReady = () => {
    if (isLoading) {
      setIsLoading(false);
      setShowGuideModal(true);
    }
  };

  // 모달 OK → 배치 모드로 진입(모델 숨김)
  const onPressGuideOK = () => {
    setShowGuideModal(false);
    setPlacedPosition(null);
    setPlacementMode(true);
  };

  // Scene에서 좌표 전달 → 그 위치에 모델 배치
  const onRequestPlaceAt = (pos: Viro3DPoint) => {
    setPlacedPosition(pos);
    setPlacementMode(false);
  };

  // Scene으로 넘길 bridge props
  const viroAppProps = useMemo<SceneBridgeProps>(
    () => ({
      modelUrl,
      placementMode,
      placedPosition,
      onModelReady,
      onRequestPlaceAt,
    }),
    [modelUrl, placementMode, placedPosition]
  );

  return (
    <View style={{ flex: 1 }}>
      {/* 디버그용 상단 바 */}
      <View style={styles.header}>
        <RNText numberOfLines={1} style={styles.headerText}>
          {modelUrl}
        </RNText>
      </View>

      <ViroARSceneNavigator
        // 타입 정의는 () => Element를 요구하므로 캐스팅해 전달
        initialScene={{ scene: Scene as unknown as () => JSX.Element }}
        viroAppProps={viroAppProps}
        autofocus
      />

      {/* 1) 로딩 오버레이 */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" />
          <RNText style={styles.overlayText}>모델 로딩 중…</RNText>
        </View>
      )}

      {/* 2) 안내 모달 */}
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
              원하는 위치를 클릭해서 모델을 배치해보세요!
            </RNText>
            <Pressable style={styles.modalBtn} onPress={onPressGuideOK}>
              <RNText style={styles.modalBtnText}>OK</RNText>
            </Pressable>
          </View>
        </View>
      </Modal>
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
});
