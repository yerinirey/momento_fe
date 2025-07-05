import PRIME from "@/assets/prime-label.png";
import { useCart } from "@/context/CartProvider";
import { Product } from "@/types/product";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Button, Image, Text, XStack, YStack } from "tamagui";
interface Props {
  product: Product;
  quantity: number;
}

export default function ProductCart({ product, quantity }: Props) {
  const { addItem, removeItem } = useCart();

  return (
    <YStack gap={10}>
      <XStack bg={"$gray2Light"} minHeight={200} minWidth={"90%"}>
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
          <Text fos={24}>${product.currentPrice}</Text>
          {product.isAmazonChoice && <Image source={PRIME} h={30} w={70} />}
          <XStack>
            <Text>
              {product.deliveryPrice === 0
                ? "FREE"
                : `$${product.deliveryPrice}`}
              {" Delivery "}
            </Text>
          </XStack>
        </YStack>
      </XStack>
      <XStack gap={20}>
        <Button
          w={100}
          br={50}
          bw={3}
          bc={"$yellow10Light"}
          onPress={() => addItem(product)}
        >
          <Text mr={"auto"} fow={"bold"}>
            {quantity.toString()}
          </Text>
          <MCIcon name="plus" size={24} />
        </Button>
        <Button
          onPress={() => removeItem(product)}
          br={50}
          bw={1}
          bc={"$gray8Light"}
          bg={"white"}
        >
          Delete
        </Button>
      </XStack>
    </YStack>
  );
}
