import { ProductCard } from "@/components/Screens/home/ProductCard";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Image, ScrollView, Text, XStack, YStack } from "tamagui";

type ViewMode = "list" | "grid";

export default function Home() {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const { width } = useWindowDimensions();

  const H_PADDING = 14;
  const GAP = 12;
  const NUM_COLS = 2;
  const gridWidth = (width - H_PADDING * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

  const onProductPress = ({ id }: Product) => {
    router.push(`/product/${id}`);
  };
  const getTrend = useCallback(async () => {
    try {
      const { data = [] } = await supabase.from("models").select("*");
      setProducts(data as Product[]);
      // console.log("🛒 ~ getTrend ~ data:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchShown: true,
      headerViewSwitcherProps: {
        value: viewMode,
        onChange: (v: ViewMode) => setViewMode(v),
      },
      // 하드코딩..? 기존의 것이 지웡지지 않아 일단 작성해둠
      headerTabsProps: undefined,
      headerRight: undefined,
      headerLeft: () => (
        <Image
          source={require("@/assets/logo_text.png")}
          w="100%"
          objectFit="contain"
        />
      ),
    } as any);
  }, [navigation, viewMode]);

  useEffect(() => {
    getTrend();
  }, [getTrend]);

  return (
    <ScrollView f={1} bg={"$bgColor"}>
      <YStack w={"100%"} px={H_PADDING} pt={20}>
        {viewMode === "grid" ? (
          <XStack flexWrap="wrap" gap={GAP} jc={"center"}>
            {products.map((product) => (
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
          <YStack gap={GAP}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="list"
                onPress={() => onProductPress(product)}
              />
            ))}
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
