import { DefaultButton } from "@/components/Shared/DefaultButton";
import { Product } from "@/types/product";

import { Pressable } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";
interface Props {
  product: Product;
  onPress: VoidFunction;
}

export function ProductCardResult({ product, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <XStack h={200} bc={"$gray5Light"} br={6} bw={1}>
        <Image
          src={product.thumbnail_url ?? ""}
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
        </YStack>
      </XStack>
    </Pressable>
  );
}
