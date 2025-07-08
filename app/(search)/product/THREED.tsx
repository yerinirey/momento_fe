import FloatingBackButton from "@/components/Shared/FloatingBackButton";
import ModelView from "@/components/Shared/ModelView";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function ThreeDScreen() {
  const { modelUrl } = useLocalSearchParams<{ modelUrl?: string }>();
  const safeModelUrl = modelUrl || "";
  // console.log("??");
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <FloatingBackButton onPress={() => router.back()} />
      <ModelView modelUrl={safeModelUrl} />
    </View>
  );
}
