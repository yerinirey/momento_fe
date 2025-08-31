import ProductBookMark from "@/components/Screens/bookmark/ProductBookMark";
import { ProductCard } from "@/components/Screens/home/ProductCard";
import { HeaderTabsProps } from "@/components/Shared/header/HeaderTabs";
import { useBookmark } from "@/context/BookmarkProvider";
import { Product } from "@/types/product";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";
type ViewMode = "list" | "grid";
export default function Cart() {
  const { bookmarkedItems } = useBookmark();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const navigation = useNavigation();

  const onProductPress = ({ id }: Product) => {
    router.push(`/product/${id}`);
  };

  const tabs: HeaderTabsProps["tabs"] = [
    {
      active: true,
      title: "북마크",
      onPress: () => Alert.alert("Bookmarks"),
    },
  ];
  useLayoutEffect(() => {
    navigation.setOptions({
      // headerSearchShown: true,
      headerTabsProps: {
        tabs: [
          {
            title: "List",
            active: viewMode === "list",
            onPress: () => setViewMode("list"),
          },
          {
            title: "Grid",
            active: viewMode === "grid",
            onPress: () => setViewMode("grid"),
          },
        ],
        align: "right",
        variant: "pill",
      },
    } as any);
  }, [navigation, viewMode]);
  return (
    <ScrollView f={1} bg={"white"} contentContainerStyle={{ pb: 20 }}>
      <YStack f={1} gap={20} px={14} pt={20}>
        {bookmarkedItems.length ? (
          <>
            {viewMode === "grid" ? (
              <XStack gap={12} jc="flex-start" fw="wrap">
                {bookmarkedItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="grid"
                    onPress={() => onProductPress(product)}
                  />
                ))}
              </XStack>
            ) : (
              <YStack gap={12}>
                {bookmarkedItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="list"
                    onPress={() => onProductPress(product)}
                  />
                ))}
              </YStack>
            )}
          </>
        ) : (
          <>
            <Text color="$gray10">저장한 모멘토가 없습니다.</Text>
          </>
        )}
      </YStack>
    </ScrollView>
  );
}
