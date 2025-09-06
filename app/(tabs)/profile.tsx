import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/supabase";
import Icon from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useModelGeneration } from "@/context/ModelGenerationProvider";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
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
import { Product } from "@/types/product";
import { ProductCard } from "@/components/Screens/home/ProductCard";

export default function Profile() {
  const { session } = useAuth();

  const [loading, setLoading] = useState(true);
  const [myModels, setMyModels] = useState<Product[]>([]);
  const [totals, setTotals] = useState({ models: 0, likes: 0, bookmarks: 0 });
  const [displayName, setDisplayName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const createdAt = session?.user.created_at
    ? new Date(session.user.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) + " 가입"
    : "";
  console.log(session);
  async function loadProfileData() {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMyModels([]);
        setTotals({ models: 0, likes: 0, bookmarks: 0 });
        return;
      }
      // 0) 내 정보 가져오기
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (profileErr) console.log("profile select error:", profileErr.message);

      // 이름/아바타 상태 반영
      setDisplayName(profile?.username ?? user.email?.split("@")[0] ?? "user");
      setAvatarUrl(profile?.avatar_url ?? null);

      // 1) 내 모델들
      const { data: modelsData, error: modelsErr } = await supabase
        .from("models")
        .select("id, name, description, model_url, thumbnail_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (modelsErr) throw modelsErr;

      const items = (modelsData ?? []) as Product[];
      setMyModels(items);

      // 2) 총 좋아요/북마크 (내 모델 id 집합으로 in() 집계)
      const ids = items.map((m) => m.id);
      let likes = 0,
        bms = 0;

      if (ids.length) {
        const [
          { count: likeCnt, error: likeErr },
          { count: bmCnt, error: bmErr },
        ] = await Promise.all([
          supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .in("model_id", ids),
          supabase
            .from("bookmarks")
            .select("*", { count: "exact", head: true })
            .in("model_id", ids),
        ]);
        if (likeErr) throw likeErr;
        if (bmErr) throw bmErr;
        likes = likeCnt ?? 0;
        bms = bmCnt ?? 0;
      }

      setTotals({ models: items.length, likes, bookmarks: bms });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      channel = supabase
        .channel("my-profile")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          () => loadProfileData()
        )
        .subscribe();
    })();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // const signOut = async () => {
  //   await supabase.auth.signOut();
  //   router.replace("/(auth)");
  // };

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
          backgroundColor={"$btnWhiteColor"}
        >
          {/* 아이콘 | 이름,이메일,가입정보 */}
          <XStack jc={"flex-start"} ai={"center"} gap={20}>
            <Avatar circular size={60}>
              {avatarUrl ? (
                <Avatar.Image src={avatarUrl} />
              ) : (
                <Avatar.Fallback bg={"gray"} />
              )}
            </Avatar>
            <YStack>
              <Text fos={22} fow={"bold"}>
                {displayName || "User"}
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
                {totals.models}
              </Text>
              <Text>Models</Text>
            </YStack>
            <YStack jc={"center"} ai={"center"}>
              <Text color={"red"} fontWeight={"bold"} fontSize={24}>
                {totals.likes}
              </Text>
              <Text>Likes</Text>
            </YStack>
            <YStack jc={"center"} ai={"center"}>
              <Text color={"purple"} fontWeight={"bold"} fontSize={24}>
                {totals.bookmarks}
              </Text>
              <Text>Bookmarks</Text>
            </YStack>
          </XStack>
        </YStack>
        {/* 내가 생성한 모델들 영역 */}
        <YStack p={20} gap={20} ai={"flex-start"} w={"100%"}>
          <Text fos={20} fow={"bold"}>
            내 모멘토
          </Text>

          {loading ? (
            <ActivityIndicator />
          ) : myModels.length === 0 ? (
            <Text color="$gray10">생성한 모멘토가 없습니다.</Text>
          ) : (
            <YStack gap={12} w="100%">
              {myModels.map((model) => (
                <ProductCard
                  key={model.id}
                  product={model}
                  variant="list"
                  onPress={() => router.push(`/product/${model.id}`)}
                />
              ))}
            </YStack>
          )}
          {/* {generatingModels.length === 0 ? (
            <Text color="$gray10">생성한 모멘토가 없습니다.</Text>
          ) : (
            generatingModels.map((model) => (
              <YStack
                key={model.id}
                bg={"$bgColor"}
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
          )} */}
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
