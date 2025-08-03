// import ModelWebView from "@/components/3dModel/ModelWebView";
import FloatingBackButton from "@/components/Shared/FloatingBackButton";
import ModelView from "@/components/Shared/ModelView";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "tamagui";

export default function ThreeDScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl?: string }>();
  // const safeModelUrl = modelUrl ? decodeURIComponent(modelUrl) : "";
  const safeModelUrl =
    typeof modelUrl === "string" && modelUrl.trim() !== ""
      ? decodeURIComponent(modelUrl)
      : null;
  // console.log("??");
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <FloatingBackButton onPress={() => router.back()} />
      {safeModelUrl ? (
        <ModelView modelUrl={safeModelUrl} />
      ) : (
        <Text>error:모델 URL이 제공되지 않았습니다.</Text>
      )}
      {/* <ModelWebView modelUrl={safeModelUrl} /> */}
    </View>
  );
}
