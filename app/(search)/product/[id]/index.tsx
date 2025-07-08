import { DefaultButton } from "@/components/Shared/DefaultButton";
import { useBookmark } from "@/context/BookmarkProvider";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, Image, ScrollView, Text, XStack, YStack } from "tamagui";

export default function ProductScreen() {
  const { toggleBookmark, bookmarks } = useBookmark();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!product) return null;
  const isBookmarked = product.id in bookmarks;

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
        <Text>
          The prices of products sold on Amazon include VAT. Depending on your
          delivery address, VAT may vary at the checkout. For more information,
          click somewhere.
        </Text>

        <YStack gap={20} mb={30}>
          <DefaultButton
            onPress={() => {
              toggleBookmark(product);
            }}
          >
            {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          </DefaultButton>
        </YStack>
      </ScrollView>
    </>
  );
}
