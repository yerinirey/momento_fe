import { Product } from "@/types/product";
import { Dimensions, Pressable } from "react-native";
import { Image, XStack, YStack } from "tamagui";

interface Props {
  product: Product;
  onPress: VoidFunction;
  variant?: "list" | "grid";
}

export function ProductCard({ product, onPress, variant = "grid" }: Props) {
  const cardWidth = variant === "grid" ? "48%" : "100%";
  return (
    <Pressable onPress={onPress}>
      <YStack height={Dimensions.get("window").width * 0.8} gap={8}>
        <XStack
          bg={"$shadowColor"}
          w={"100%"}
          // h={"100%"}
          {...(variant === "list"
            ? { aspectRatio: 16 / 9 }
            : { aspectRatio: 1 })}
          br={10}
          overflow="hidden"
        >
          <Image
            src={product.imageUrl ?? ""}
            objectFit="cover"
            w={"100%"}
            h={"100%"}
          />
        </XStack>
      </YStack>
    </Pressable>
  );
}
