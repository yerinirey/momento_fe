import { Product } from "@/types/product";
import { offPercentage } from "@/utils/number";
import { Dimensions, Pressable } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

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
        <XStack gap={10} jc={"space-between"} ai={"center"}>
          <Text
            br={4}
            px={6}
            py={4}
            bg={"red"}
            color={"white"}
            fow={"bold"}
            fos={11}
          >
            {offPercentage(product.currentPrice, product.previousPrice)}% off
          </Text>
          <Text fos={12} color={"red"}>
            Limited deal
          </Text>
        </XStack>
      </YStack>
    </Pressable>
  );
}
