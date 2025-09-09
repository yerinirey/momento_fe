import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { ActivityIndicator, Alert, StyleSheet, Pressable } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Input,
  Button,
  Avatar,
  ScrollView,
} from "tamagui";
import { router } from "expo-router";
import MCIcon from "@expo/vector-icons/MaterialIcons";

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error, status } = await supabase
      .from("profiles")
      .select(`username, avatar_url`)
      .eq("id", user.id)
      .single();

    if (error && status !== 406) {
      Alert.alert(error.message);
    }

    if (data) {
      setUsername(data.username);
      setAvatarUrl(data.avatar_url);
    }
    setLoading(false);
  }

  async function updateProfile() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const updates = {
      id: user.id,
      username,
      avatar_url: avatarUrl,
      // updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("프로필이 업데이트되었습니다.");
      router.back();
    }
    setLoading(false);
  }

  return (
    <ScrollView
      bg={"$bgColor"}
      contentContainerStyle={{
        alignItems: "center",
        padding: 20,
      }}
    >
      <XStack
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        mb={16}
        mt={20}
      >
        <Pressable onPress={() => router.back()}>
          <MCIcon name="arrow-back" size={24} color={"$gray10"} />
        </Pressable>
        <Text fontSize={24} fontWeight="bold" width={"100%"} ml={10} mb={16}>
          프로필 수정
        </Text>
      </XStack>
      <YStack width="90%" gap={20} p={20} style={s.infoBox}>
        <YStack ai="center" gap={10}>
          <Avatar circular size={100}>
            {avatarUrl ? (
              <Avatar.Image src={avatarUrl} />
            ) : (
              <Avatar.Fallback bg={"$gray10"} />
            )}
          </Avatar>
          {/* 아바타 변경 기능은 추후구현 예정*/}
        </YStack>
        <YStack gap={8} px={0}>
          <Text fontSize={16}>사용자 이름</Text>
          <Input
            size="$4"
            value={username}
            onChangeText={setUsername}
            placeholder="사용자 이름"
            disabled={loading}
          />
        </YStack>

        <YStack>
          <Button
            onPress={updateProfile}
            disabled={loading}
            backgroundColor="$pointColor"
            color="white"
          >
            {loading ? <ActivityIndicator color="white" /> : "업데이트"}
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  infoBox: {
    backgroundColor: "$btnWhiteColor",

    borderColor: "rgba(180, 180, 180, 0.32)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.08,

    elevation: 4,
  },
});
