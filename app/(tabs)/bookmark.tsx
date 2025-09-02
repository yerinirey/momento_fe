import { ProductCard } from "@/components/Screens/home/ProductCard";
import { useBookmark } from "@/context/BookmarkProvider";
import { Product } from "@/types/product";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, useWindowDimensions } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";
type ViewMode = "list" | "grid";
export default function Cart() {
  const { bookmarkedItems } = useBookmark();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { width } = useWindowDimensions();

  const H_PADDING = 14;
  const GAP = 12;
  const NUM_COLS = 2;
  const gridWidth = (width - H_PADDING * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

  const navigation = useNavigation();

  const onProductPress = ({ id }: Product) => {
    router.push(`/product/${id}`);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchShown: false,
      headerViewSwitcherProps: {
        value: viewMode,
        onChange: (v: ViewMode) => setViewMode(v),
      },
      // 하드코딩..? 기존의 것이 지웡지지 않아 일단 작성해둠
      headerTabsProps: undefined,
      headerRight: undefined,
      headerLeft: undefined,
    } as any);
  }, [navigation, viewMode]);
  return (
    <ScrollView f={1} bg={"$bgColor"}>
      <YStack f={1} gap={20} px={H_PADDING} pt={20}>
        {bookmarkedItems.length ? (
          <>
            {viewMode === "grid" ? (
              <XStack flexWrap="wrap" gap={12} jc="flex-start">
                {bookmarkedItems.map((product) => (
                  <YStack key={product.id} w={gridWidth}>
                    <ProductCard
                      product={product}
                      variant="grid"
                      onPress={() => onProductPress(product)}
                    />
                  </YStack>
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
