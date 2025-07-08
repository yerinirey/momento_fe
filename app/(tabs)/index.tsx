import { HomeSuggestions } from "@/components/Screens/home/HomeSuggestions";
import { ProductDealCard } from "@/components/Screens/home/ProductDealCard";
import { DefaultButton } from "@/components/Shared/DefaultButton";
import { HeaderTabsProps } from "@/components/Shared/header/HeaderTabs";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";

export default function Home() {
  const navigation = useNavigation();
  const { session } = useAuth();

  const [trends, setTrends] = useState<Product[]>([]);

  const onClickAuth = () => router.push("/login");
  const tabs: HeaderTabsProps["tabs"] = [
    {
      active: true,
      title: "Home",
      onPress: () => Alert.alert("Home"),
    },
    {
      title: "Trend",
      onPress: () => Alert.alert("Trend"),
    },
    {
      title: "New",
      onPress: () => Alert.alert("New"),
    },
  ];
  const onProductPress = ({ id }: Product) => {
    router.push(`/product/${id}`);
  };
  const getTrend = useCallback(async () => {
    try {
      const { data = [] } = await supabase.from("products").select("*");
      setTrends(data as Product[]);
      // console.log("🛒 ~ getTrend ~ data:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerSearchShown: true,
      headerTabsProps: { tabs },
    });
    getTrend();
  }, [navigation, getTrend]);

  return (
    <ScrollView f={1}>
      {/* <HomeCarousel /> */}
      <HomeSuggestions />
      <YStack bg={"white"} w={"100%"} p={20} gap={20}>
        <Text als={"flex-start"} fos={20} fow={"bold"}>
          {session ? "Trending things" : "로그인하고 모멘토를 둘러보세요."}
        </Text>
        {session ? (
          <XStack gap={30} jc={"space-between"} fw={"wrap"}>
            {trends.map((product) => (
              <ProductDealCard
                key={product.id}
                product={product}
                onPress={() => onProductPress(product)}
              />
            ))}
          </XStack>
        ) : (
          <DefaultButton onPress={onClickAuth}>로그인</DefaultButton>
        )}
      </YStack>
    </ScrollView>
  );
}
