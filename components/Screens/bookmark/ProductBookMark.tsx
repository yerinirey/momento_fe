import { Product } from "@/types/product";
import { Image, Text, XStack, YStack } from "tamagui";
interface Props {
  product: Product;
}

export default function ProductBookMark({ product }: Props) {
  return (
    <YStack gap={10}>
      <XStack bg={"$gray2Light"} minHeight={200} minWidth={"90%"}>
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
    </YStack>
  );
}
