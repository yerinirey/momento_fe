import { ProductCard } from "@/components/Screens/home/ProductCard";
import { DefaultButton } from "@/components/Shared/DefaultButton";
import { HeaderTabsProps } from "@/components/Shared/header/HeaderTabs";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";

type ViewMode = "list" | "grid";

export default function Home() {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const onProductPress = ({ id }: Product) => {
    router.push(`/product/${id}`);
  };
  const getTrend = useCallback(async () => {
    try {
      const { data = [] } = await supabase.from("products").select("*");
      setProducts(data as Product[]);
      // console.log("🛒 ~ getTrend ~ data:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("error", error);
    }
  }, []);

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

  useEffect(() => {
    getTrend();
  }, [getTrend]);

  return (
    <ScrollView f={1}>
      <YStack bg={"white"} w={"100%"} px={14} pt={20}>
        {viewMode === "grid" ? (
          <XStack gap={12} jc="flex-start" fw="wrap">
            {products.map((product) => (
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
        {/* <XStack gap={12} jc={"flex-start"} fw={"wrap"}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => onProductPress(product)}
            />
          ))}
        </XStack> */}
      </YStack>
    </ScrollView>
  );
}
