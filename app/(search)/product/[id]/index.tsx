import { useBookmark } from "@/context/BookmarkProvider";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, Image, ScrollView, Text, XStack, YStack } from "tamagui";
import Icon from "@expo/vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";
export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const modelId = String(id);

  const [product, setProduct] = useState<Product | null>(null);
  // 모델의 좋아요,북마크 체크
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // 토글 및 로딩
  const [loading, setLoading] = useState(true);
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleBookmark, setToggleBookmark] = useState(false);

  const fetchProduct = useCallback(async () => {
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("id", modelId)
      .single();
    if (error || !data) {
      router.back();
      return;
    }
    setProduct(data as Product);
  }, [modelId]);

  const fetchEngagement = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. 내 상태 불러오기
    let liked = false;
    let bookmarked = false;
    if (user) {
      const [{ data: l }, { data: b }] = await Promise.all([
        supabase
          .from("likes")
          .select("user_id")
          .eq("user_id", user.id)
          .eq("model_id", modelId)
          .maybeSingle(),
        supabase
          .from("bookmarks")
          .select("user_id")
          .eq("user_id", user.id)
          .eq("model_id", modelId)
          .maybeSingle(),
      ]);
      liked = !!l;
      bookmarked = !!b;
    }
    setIsLiked(liked);
    setIsBookmarked(bookmarked);

    // 2. 해당 모델의 상태 불러오기 (좋아요 북마크 수 카운트)
    const [{ count: likeCnt }, { count: bmCnt }] = await Promise.all([
      supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("model_id", modelId),
      supabase
        .from("bookmarks")
        .select("*", { count: "exact", head: true })
        .eq("model_id", modelId),
    ]);
    setLikeCount(likeCnt ?? 0);
    setBookmarkCount(bmCnt ?? 0);
  }, [modelId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await fetchProduct();
      await fetchEngagement();
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [fetchProduct, fetchEngagement]);

  // 토글: 좋아요
  const handleLikeToggle = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (toggleLike) return;
    setToggleLike(true);

    setIsLiked((prev) => !prev);
    setLikeCount((c) => c + (isLiked ? -1 : 1));

    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("model_id", modelId);
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, model_id: modelId });
      }
    } catch {
      // 실패 시 롤백
      setIsLiked((prev) => !prev);
      setLikeCount((c) => c + (isLiked ? 1 : -1));
    } finally {
      setToggleLike(false);
      // await fetchEngagement();
    }
  };

  // 토글: 북마크
  const handleBookmarkToggle = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (toggleBookmark) return;
    setToggleBookmark(true);

    setIsBookmarked((prev) => !prev);
    setBookmarkCount((c) => c + (isBookmarked ? -1 : 1));

    try {
      if (isBookmarked) {
        await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("model_id", modelId);
      } else {
        await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, model_id: modelId });
      }
    } catch {
      // 실패 시 롤백
      setIsBookmarked((prev) => !prev);
      setBookmarkCount((c) => c + (isBookmarked ? 1 : -1));
    } finally {
      setToggleBookmark(false);
      // await fetchEngagement();
    }
  };

  const onViewType = (viewType: "THREED" | "AR") => {
    router.push(`/product/${viewType}?modelUrl=${product?.model_url}`);
  };

  if (loading || !product) {
    return (
      <YStack f={1} ai="center" jc="center">
        <ActivityIndicator />
      </YStack>
    );
  }

  return (
    <ScrollView f={1} gap={20} bg={"white"} px={20} pt={10}>
      <YStack
        backgroundColor={"white"}
        br={20}
        shadowColor={"#000"}
        shadowOpacity={0.08}
        shadowRadius={12}
        shadowOffset={{ width: 0, height: 4 }}
        elevation={4}
        overflow="hidden"
        minHeight={"94%"}
      >
        <Image
          source={{ uri: product.thumbnail_url ?? "" }}
          h={300}
          objectFit="cover"
          mb={10}
        />
        <YStack px={10} f={1} jc="space-between">
          <YStack px={10}>
            <Text color={"$blackColor"} fontWeight={"bold"} fontSize={24}>
              {product.name}
            </Text>
            <XStack mt={4} jc="space-between" ai="center">
              <Text color={"$blackColor"}>
                {product.created_at.split("T")[0]} 생성
              </Text>
              <XStack gap={10}>
                <XStack ai="center" gap={6}>
                  <Icon
                    name={isLiked ? "heart" : "heart-outline"}
                    size={24}
                    color={isLiked ? "#d35313" : "grey"}
                    onPress={handleLikeToggle}
                  />
                  <Text>{likeCount}</Text>
                </XStack>
                <XStack ai="center" gap={6}>
                  <Icon
                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={24}
                    color={isBookmarked ? "#2260a7ff" : "grey"}
                    onPress={handleBookmarkToggle}
                  />
                  <Text>{bookmarkCount}</Text>
                </XStack>
              </XStack>
            </XStack>

            <Text mt={18} fos={16}>
              {product.description}
            </Text>
          </YStack>
          <XStack jc={"space-between"} gap={10} my={20}>
            {product.model_url && (
              <>
                {["THREED", "AR"].map((viewType) => (
                  <Button
                    width={160}
                    key={viewType}
                    br={18}
                    bg={"$pointColor"}
                    textProps={{ color: "black", fos: 14 }}
                    onPress={() => onViewType(viewType as "THREED" | "AR")}
                  >
                    <Icon
                      size={20}
                      name={
                        viewType === "THREED"
                          ? "cube-outline"
                          : "scan-circle-outline"
                      }
                    />
                    {viewType === "THREED" ? "3D로 보기" : "AR로 보기"}
                  </Button>
                ))}
              </>
            )}
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
