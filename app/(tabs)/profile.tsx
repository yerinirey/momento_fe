import Logo from "@/assets/logo.png";
import { DefaultButton } from "@/components/Shared/DefaultButton";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/supabase";
import Icon from "@expo/vector-icons/Ionicons";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useModelGeneration } from "@/context/ModelGenerationProvider";
import { Pressable } from "react-native";
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
  const [sheetOpen, setSheetOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSheetOpen(false);
    router.replace("/(auth)");
  };

  return (
    <>
      <ScrollView bg={"white"}>
        <XStack jc={"space-between"} p={20} gap={20}>
          <Pressable onPress={() => setSheetOpen((prev) => !prev)}>
            <XStack jc={"flex-start"} ai={"center"} gap={10}>
              <Avatar circular size={30}>
                <Avatar.Fallback bg={"gray"} />
              </Avatar>
              <Text fos={18}>{session?.user.email}</Text>
              <Icon name="chevron-down" size={20} />
            </XStack>
          </Pressable>
          <XStack gap={25} jc={"flex-end"} ai={"center"}>
            <Icon name="settings-outline" size={20} />
            <Icon name="search-sharp" size={20} />
          </XStack>
        </XStack>

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
      <Sheet
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
      </Sheet>
    </>
  );
}
