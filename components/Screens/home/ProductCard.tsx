import { Product } from "@/types/product";
import { Image, XStack, YStack, Button } from "tamagui";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { useBookmark } from "@/context/BookmarkProvider";
import { FloatingButton } from "@/components/Shared/FloatingButton";
import { useState } from "react";

interface Props {
  product: Product;
  onPress: VoidFunction;
  variant?: "list" | "grid";
}

export function ProductCard({ product, onPress, variant = "grid" }: Props) {
  const imageAspect = variant === "grid" ? 1 : 4 / 3;

  const [liked, setLiked] = useState(false);
  const { toggleBookmark, bookmarks } = useBookmark();
  const bookmarked = product.id in bookmarks;

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
            icon={liked ? "heart" : "heart-outline"}
            onPress={(e?: any) => {
              e?.stopPropagation?.();
              setLiked((v) => !v);
            }}
          />

          {/* Bookmarks */}
          <FloatingButton
            type={"bookmarks"}
            active={bookmarked}
            icon={bookmarked ? "bookmark" : "bookmark-outline"}
            onPress={(e?: any) => {
              e?.stopPropagation?.();
              toggleBookmark(product);
            }}
          />
        </XStack>
      </YStack>
    </Button>
  );
}
