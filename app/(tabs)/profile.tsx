import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/supabase";
import Icon from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { useModelGeneration } from "@/context/ModelGenerationProvider";
import { Pressable, StyleSheet } from "react-native";
import {
  Avatar,
  Button,
  Image,
  ScrollView,
  Sheet,
  Text,
  XStack,
  YStack,
} from "tamagui";

export default function Profile() {
  const { session } = useAuth();
  const { generatingModels } = useModelGeneration();
  const createdAt = session?.user.created_at
    ? new Date(session.user.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) + " 가입"
    : "";
  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)");
  };

  return (
    <>
      <ScrollView
        bg={"$bgColor"}
        contentContainerStyle={{
          alignItems: "center", // x축 중앙 정렬 (flex레이아웃이 아니라고 함)
        }}
      >
        {/* 내 정보 */}
        <YStack
          style={s.infoBox}
          jc={"flex-start"}
          // ai={"center"}
          p={20}
          gap={20}
          width="90%"
          mt={14}
        >
          {/* 아이콘 | 이름,이메일,가입정보 */}
          <XStack jc={"flex-start"} ai={"center"} gap={20}>
            <Avatar circular size={60}>
              <Avatar.Fallback bg={"gray"} />
            </Avatar>
            <YStack>
              <Text fos={22} fow={"bold"}>
                UserName
              </Text>
              <Text fos={18}>{session?.user.email}</Text>
              <Text>{createdAt}</Text>
            </YStack>
          </XStack>
          {/* 중앙선 */}
          <XStack
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: "rgba(180, 180, 180, 1)",
              paddingRight: 8,
              marginRight: 8,
              width: "100%",
            }}
          />
          <XStack jc={"space-around"}>
            <YStack jc={"center"} ai={"center"}>
              <Text color={"blue"} fontWeight={"bold"} fontSize={24}>
                0
              </Text>
              <Text>Models</Text>
            </YStack>
            <YStack jc={"center"} ai={"center"}>
              <Text color={"red"} fontWeight={"bold"} fontSize={24}>
                0
              </Text>
              <Text>Likes</Text>
            </YStack>
            <YStack jc={"center"} ai={"center"}>
              <Text color={"purple"} fontWeight={"bold"} fontSize={24}>
                0
              </Text>
              <Text>Bookmarks</Text>
            </YStack>
          </XStack>
        </YStack>
        {/* 내가 생성한 모델들 영역 */}
        <YStack p={20} gap={20}>
          <Text fos={20} fow={"bold"}>
            내 모멘토
          </Text>
          {generatingModels.length === 0 ? (
            <Text color="$gray10">생성한 모멘토가 없습니다.</Text>
          ) : (
            generatingModels.map((model) => (
              <YStack
                key={model.id}
                bg={"#f0f0f0"}
                borderRadius={10}
                p={15}
                ai={"center"}
                gap={10}
              >
                <Image
                  source={{ uri: model.thumbnailUri }}
                  width={100}
                  height={100}
                  borderRadius={5}
                />
                <Text fos={16} fow={"bold"}>
                  모멘토 생성중
                </Text>
                <Text fos={14} color={"gray"}>
                  생성이 완료되면 알려드릴게요.
                </Text>
              </YStack>
            ))
          )}
        </YStack>
      </ScrollView>
      {/* <Sheet
        modal
        open={sheetOpen}
        onOpenChange={(open: boolean) => setSheetOpen(open)}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame p={20} gap={20} minHeight={120}>
          <Text>{session?.user.email}</Text>
          <Button textProps={{ fos: 18 }} bg={"#d35313"} onPress={signOut}>
            로그아웃
          </Button>
        </Sheet.Frame>
      </Sheet> */}
    </>
  );
}

const s = StyleSheet.create({
  infoBox: {
    borderColor: "rgba(180, 180, 180, 0.32)",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,

    // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    // boxShadow는 RN네이티브에서 사용 불가능, 대체
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.08,

    // android Shadow
    elevation: 4,
  },
});
