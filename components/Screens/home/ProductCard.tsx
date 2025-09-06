import { Product } from "@/types/product";
import { Image, XStack, YStack, Button } from "tamagui";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { useBookmark } from "@/context/BookmarkProvider";
import { FloatingButton } from "@/components/Shared/FloatingButton";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { Alert } from "react-native";

interface Props {
  product: Product;
  onPress: VoidFunction;
  variant?: "list" | "grid";
}

export function ProductCard({ product, onPress, variant = "grid" }: Props) {
  const imageAspect = variant === "grid" ? 1 : 4 / 3;

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [busyLike, setBusyLike] = useState(false);
  const [busyBm, setBusyBm] = useState(false);

  // 1) 초기 상태 불러오기 (내가 이 모델을 좋아요/북마크 했는지)
  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (mounted) {
          setLiked(false);
          setBookmarked(false);
        }
        return;
      }

      const [{ data: l }, { data: b }] = await Promise.all([
        supabase
          .from("likes")
          .select("user_id")
          .eq("user_id", user.id)
          .eq("model_id", product.id)
          .maybeSingle(),
        supabase
          .from("bookmarks")
          .select("user_id")
          .eq("user_id", user.id)
          .eq("model_id", product.id)
          .maybeSingle(),
      ]);

      if (mounted) {
        setLiked(!!l);
        setBookmarked(!!b);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [product.id]);

  // 2) 토글: 좋아요
  const onToggleLike = async (e?: any) => {
    e?.stopPropagation?.();
    if (busyLike) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("로그인이 필요합니다");
      return;
    }

    setBusyLike(true);
    const prev = liked;
    setLiked(!prev); // 낙관적 업데이트

    try {
      if (prev) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("model_id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: user.id, model_id: product.id });
        if (error) throw error;
      }
    } catch (err) {
      // 실패 시 롤백
      setLiked(prev);
      console.log("LIKE TOGGLE ERROR:", err);
    } finally {
      setBusyLike(false);
    }
  };

  // 3) 토글: 북마크
  const onToggleBookmark = async (e?: any) => {
    e?.stopPropagation?.();
    if (busyBm) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("로그인이 필요합니다");
      return;
    }

    setBusyBm(true);
    const prev = bookmarked;
    setBookmarked(!prev); // 낙관적 업데이트

    try {
      if (prev) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("model_id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, model_id: product.id });
        if (error) throw error;
      }
    } catch (err) {
      setBookmarked(prev);
      console.log("BOOKMARK TOGGLE ERROR:", err);
    } finally {
      setBusyBm(false);
    }
  };

  return (
    <Button unstyled onPress={onPress} w="100%" p={0} br={10}>
      <YStack w="100%" position="relative">
        {/* 모멘토 사진 */}
        <XStack w={"100%"} br={10} overflow="hidden">
          <Image
            src={product.thumbnail_url ?? ""}
            aspectRatio={imageAspect}
            objectFit="cover"
            w={"100%"}
          />
        </XStack>

        {/* 오른쪽 위 플로팅 버튼 */}
        <XStack
          position="absolute"
          top={8}
          right={8}
          gap={8}
          pointerEvents="box-none"
        >
          {/* Likes */}
          <FloatingButton
            type={"likes"}
            active={liked}
            disabled={busyLike}
            icon={liked ? "heart" : "heart-outline"}
            onPress={(e?: any) => {
              onToggleLike;
            }}
          />

          {/* Bookmarks */}
          <FloatingButton
            type={"bookmarks"}
            active={bookmarked}
            icon={bookmarked ? "bookmark" : "bookmark-outline"}
            disabled={busyBm}
            onPress={(e?: any) => {
              onToggleBookmark;
            }}
          />
        </XStack>
      </YStack>
    </Button>
  );
}
