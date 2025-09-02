import { useBookmark } from "@/context/BookmarkProvider";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, Image, ScrollView, Text, XStack, YStack } from "tamagui";
import Icon from "@expo/vector-icons/Ionicons";
export default function ProductScreen() {
  const { toggleBookmark, bookmarks } = useBookmark();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  // ui
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
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
    setBookmarkCount(isBookmarked ? 1 : 0);
  }, [fetchProducts]);

  if (!product) return null;
  const isBookmarked = product.id in bookmarks;

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked((prev) => !prev);
  };

  return (
    <>
      {/* {__DEV__ && product.model3DUrl ? (
        <GLTFDebugMount uri={product.model3DUrl} name={product.name} />
      ) : null} */}
      <ScrollView f={1} gap={20} bg={"white"} px={20} pt={10}>
        <YStack
          backgroundColor={"white"}
          br={20}
          shadowColor={"#000"}
          shadowOpacity={0.08}
          shadowRadius={12}
          shadowOffset={{ width: 0, height: 4 }}
          elevation={4}
          overflow="hidden"
          minHeight={"94%"}
        >
          <Image
            source={{ uri: product.imageUrl ?? "" }}
            h={300}
            objectFit="cover"
            mb={10}
          />
          <YStack px={10} f={1} jc="space-between">
            <YStack px={10}>
              <Text color={"$blackColor"} fontWeight={"bold"} fontSize={24}>
                {product.name}
              </Text>
              <XStack mt={4} jc="space-between" ai="center">
                <Text color={"$blackColor"}>
                  {product.created_at.split("T")[0]} 생성
                </Text>
                <XStack gap={10}>
                  <XStack ai="center" gap={6}>
                    <Icon
                      name={isLiked ? "heart" : "heart-outline"}
                      size={24}
                      color={isLiked ? "#d35313" : "grey"}
                      onPress={handleLikeToggle}
                    />
                    <Text>{likeCount}</Text>
                  </XStack>
                  <XStack ai="center" gap={6}>
                    <Icon
                      name={isBookmarked ? "bookmark" : "bookmark-outline"}
                      size={24}
                      color={isBookmarked ? "#2260a7ff" : "grey"}
                      onPress={() => {
                        toggleBookmark(product);
                        setBookmarkCount((prev) => (prev === 1 ? 0 : 1));
                      }}
                    />
                    <Text>{bookmarkCount}</Text>
                  </XStack>
                </XStack>
              </XStack>

              <Text mt={18} fos={16}>
                {product.descriptions}
              </Text>
            </YStack>
            <XStack jc={"space-between"} gap={10} my={20}>
              {product.model3DUrl && (
                <>
                  {["THREED", "AR"].map((viewType) => (
                    <Button
                      width={160}
                      key={viewType}
                      br={18}
                      bg={"$pointColor"}
                      textProps={{ color: "black", fos: 14 }}
                      onPress={() => onViewType(viewType as "THREED" | "AR")}
                    >
                      <Icon
                        size={20}
                        name={
                          viewType === "THREED"
                            ? "cube-outline"
                            : "scan-circle-outline"
                        }
                      />
                      {viewType === "THREED" ? "3D로 보기" : "AR로 보기"}
                    </Button>
                  ))}
                </>
              )}
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
