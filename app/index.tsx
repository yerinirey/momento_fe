// app/index.tsx
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>홈 화면</Text>

      <Pressable
        onPress={() => {
          console.log("📦 버튼 눌림 → /3d로 이동");
          router.push("/3d");
        }}
        style={{
          padding: 12,
          backgroundColor: "#abcdef",
          borderRadius: 8,
        }}
      >
        <Text>3D 모델 보기</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          console.log("📦 버튼 눌림 → /AR로 이동");
        }}
        style={{
          padding: 12,
          backgroundColor: "#abcdef",
          borderRadius: 8,
        }}
      >
        <Text>AR 모델 보기</Text>
      </Pressable>
    </View>
  );
}
