import { ProductCardResult } from "@/components/Screens/search/ProductCardResult";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Text, YStack } from "tamagui";

export default function SearchScreen() {
  const { query } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);

  // Debug: inspect search params/results
  if (__DEV__) {
    // console.log("~ SearchScreen ~ query:", query);
    // console.log("~ SearchScreen ~ products:", products);
  }
  const getProducts = useCallback(async () => {
    if (!query) return setProducts([]);

    try {
      const { data = [] } = await supabase
        .from("models")
        .select("*")
        .ilike("name", `%${query}%`);
      setProducts(data as Product[]);
    } catch (error) {
      console.error("search getProducts error", error);
    }
  }, [query]);

  const onProductPress = ({ id }: Product) => {
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <YStack f={1} bg={"$bgColor"}>
      <FlatList
        data={products}
        style={{ padding: 20 }}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <YStack h={10} />}
        ListEmptyComponent={<Text>No Products Found</Text>}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item: product }) => (
          <ProductCardResult
            product={product}
            onPress={() => onProductPress(product)}
          />
        )}
      />
    </YStack>
  );
}
