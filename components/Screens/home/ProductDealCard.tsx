import { Product } from "@/types/product";
import { Dimensions, Pressable } from "react-native";
import { Image, XStack, YStack } from "tamagui";

interface Props {
  product: Product;
  onPress: VoidFunction;
}

export function ProductDealCard({ product, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <YStack w={Dimensions.get("window").width / 2 - 40} h={180} gap={10}>
        <XStack p={5} bg={"$shadowColor"} w={"100%"} h={"80%"} br={4}>
          <Image
            src={product.imageUrl ?? ""}
            objectFit="contain"
            w={"100%"}
            h={"100%"}
          />
        </XStack>
      </YStack>
    </Pressable>
  );
}
