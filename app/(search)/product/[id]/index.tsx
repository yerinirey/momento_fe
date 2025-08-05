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

  const onViewType = (viewType: "THREED" | "AR" | "WEBVIEW") => {
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
        <Text color={"$color.gray8Dark"} fontWeight={"bold"} fontSize={24}>
          {product.name}
        </Text>
        <Text>{product.created_at.split("T")[0]} 생성</Text>
        <Image
          source={{ uri: product.imageUrl ?? "" }}
          h={300}
          objectFit="contain"
        />
        <Text fos={16}>{product.descriptions}</Text>
        <XStack jc={"flex-start"} gap={10} my={20}>
          {product.model3DUrl && (
            <>
              {["THREED", "AR", "WEBVIEW"].map((viewType) => (
                <Button
                  key={viewType}
                  bw={1}
                  br={10}
                  bg={"$pointColor"}
                  textProps={{ color: "black", fos: 14 }}
                  onPress={() =>
                    onViewType(viewType as "THREED" | "AR" | "WEBVIEW")
                  }
                >
                  {/* <MCIcon
                    name="arrow-u-left-bottom"
                    size={20}
                    color="$pointColor"
                  /> */}
                  {viewType === "THREED" ? "3D" : viewType}
                </Button>
              ))}
            </>
          )}
        </XStack>

        <YStack gap={20} mb={30}>
          <DefaultButton
            variant={!isBookmarked ? "primary" : "secondary"}
            onPress={() => {
              toggleBookmark(product);
            }}
          >
            {isBookmarked ? "저장 취소" : "내 모멘토에 저장"}
          </DefaultButton>
        </YStack>
      </ScrollView>
    </>
  );
}
