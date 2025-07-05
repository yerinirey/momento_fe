import PRIME from "@/assets/prime-label.png";
import { DefaultButton } from "@/components/Shared/DefaultButton";
import { useCart } from "@/context/CartProvider";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import { deliveryDate } from "@/utils/date";
import { offPercentage } from "@/utils/number";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  Button,
  Dialog,
  Image,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

export default function ProductScreen() {
  const { addItem } = useCart();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectOpen, setSelectOpen] = useState(false);
  const fetchProducts = useCallback(async () => {
    try {
      const { data = null } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) router.back();
      setProduct(data);
    } catch (error) {
      console.log("error", error);
    }
  }, [id]);

  const onViewType = (viewType: "THREED" | "AR") => {
    router.push(`/product/${viewType}?modelUrl=${product?.model3DUrl}`);
  };
  const onSelectQuantity = (num: number) => {
    setQuantity(num);
    setSelectOpen(false);
  };
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!product) return null;

  return (
    <>
      <ScrollView f={1} gap={20} bg={"white"} p={20}>
        <Text color={"$color.gray8Dark"}>{product.name}</Text>
        <Image
          source={{ uri: product.imageUrl ?? "" }}
          h={300}
          objectFit="contain"
        />
        <XStack jc={"space-between"} my={20}>
          {product.model3DUrl && (
            <>
              {["THREED", "AR"].map((viewType) => (
                <Button
                  key={viewType}
                  bw={1}
                  br={50}
                  bc={"#0e4db3"}
                  variant="outlined"
                  textProps={{ color: "#0e4db3", fos: 13 }}
                  onPress={() => onViewType(viewType as "THREED" | "AR")}
                  // onPress={() => onViewType(viewType as "AR")}
                >
                  <MCIcon
                    name="arrow-u-left-bottom"
                    size={20}
                    color="#0e4db3"
                  />
                  {viewType === "THREED" ? "VIEW IN 3D" : "VIEW IN YOUR ROOM"}
                </Button>
              ))}
            </>
          )}
        </XStack>
        <XStack ai={"center"} gap={10}>
          {product.previousPrice > product.currentPrice && (
            <Text fos={30} color={"$red10Light"}>
              - {offPercentage(product.currentPrice, product.previousPrice)}%
            </Text>
          )}
          <Text fos={30}>
            <Text fos={20}>$</Text>
            {product.currentPrice}
          </Text>
        </XStack>
        <Text mb={20} color={"gray"} fos={14} textDecorationLine="line-through">
          RRP: ${product.previousPrice}
        </Text>
        {product.isAmazonChoice && <Image source={PRIME} h={30} w={70} />}
        <Text>
          The prices of products sold on Amazon include VAT. Depending on your
          delivery address, VAT may vary at the checkout. For more information,
          click somewhere.
        </Text>
        <XStack my={20}>
          <Text>
            {product.deliveryPrice === 0 ? "FREE" : `$${product.deliveryPrice}`}
            {" Delivery "}
          </Text>
          <Text fow={"bold"}>{deliveryDate(product.deliveryInDays)}</Text>
        </XStack>
        <YStack gap={20} mb={30}>
          {product.amountInStock < 20 ? (
            <Text fos={20} color={"green"}>
              In Stock
            </Text>
          ) : (
            <Text fos={20} color={"red"}>
              {product.amountInStock} In Stock
            </Text>
          )}
          <Button
            onPress={() => {
              {
                setSelectOpen((prev) => !prev);
              }
            }}
          >
            <Text mr={"auto"}>Quantity: {quantity}</Text>
            <MCIcon name="chevron-down" size={20} />
          </Button>
          <DefaultButton
            onPress={() => {
              addItem(product, quantity);
            }}
          >
            Add to basket
          </DefaultButton>
          <DefaultButton bg={"$orange9Light"} onPress={() => {}}>
            Buy Now
          </DefaultButton>
        </YStack>
      </ScrollView>
      <Dialog open={selectOpen}>
        <Dialog.Portal key={`select-quantity-${quantity}`}>
          <Dialog.Overlay onPress={() => setSelectOpen(false)} />
          <Dialog.Content gap={10} w={"60%"}>
            <FlatList
              data={[1, 2, 3, 4, 5]}
              keyExtractor={(_, index) => index.toString()}
              ItemSeparatorComponent={() => <View h={10} />}
              renderItem={({ item: num }) => (
                <Button onPress={() => onSelectQuantity(num)}>
                  {num.toString()}
                </Button>
              )}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}
