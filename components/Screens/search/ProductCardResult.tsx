import { DefaultButton } from "@/components/Shared/DefaultButton";
import { useBookmark } from "@/context/BookmarkProvider";
import { Product } from "@/types/product";

import { Pressable } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";
interface Props {
  product: Product;
  onPress: VoidFunction;
}

export function ProductCardResult({ product, onPress }: Props) {
  const { toggleBookmark, bookmarks } = useBookmark();
  const isBookmarked = product.id in bookmarks;
  return (
    <Pressable onPress={onPress}>
      <XStack h={200} bc={"$gray5Light"} br={6} bw={1}>
        <Image
          src={product.imageUrl ?? ""}
          objectFit="contain"
          w={"35%"}
          h={"100%"}
          bg={"$shadowColor"}
          bblr={5}
          btrr={5}
          p={10}
        />
        <YStack w={"65%"} p={20} gap={10}>
          <Text numberOfLines={4} ellipsizeMode="tail">
            {product.name}
          </Text>
          <DefaultButton
            variant={!isBookmarked ? "primary" : "secondary"}
            mt="auto"
            onPress={() => {
              toggleBookmark(product);
            }}
            h={40}
            textProps={{ fos: 14 }}
          >
            {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          </DefaultButton>
        </YStack>
      </XStack>
    </Pressable>
  );
}
