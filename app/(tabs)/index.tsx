import { ProductCard } from "@/components/Screens/home/ProductCard";
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
      title: "홈",
      onPress: () => Alert.alert("Home"),
    },
    {
      title: "트렌드",
      onPress: () => Alert.alert("Trend"),
    },
    {
      title: "더보기",
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
      <YStack bg={"white"} w={"100%"} p={16} pt={20} gap={10}>
        {session ? (
          // 임시로 칸을 나눠두기. 카테고리로 추가할 예정인 항목
          <>
            <Text als={"flex-start"} fos={20} fow={"bold"}>
              프리뷰 카테고리 1
            </Text>
            <XStack gap={30} jc={"space-between"} fw={"wrap"}>
              {trends.slice(0, 2).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => onProductPress(product)}
                />
              ))}
            </XStack>
            <YStack borderBottomWidth={1} borderColor="#c58efd69" />
            <Text als={"flex-start"} fos={20} fow={"bold"}>
              프리뷰 카테고리 2
            </Text>
            <XStack gap={30} jc={"space-between"} fw={"wrap"}>
              {trends.slice(2, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => onProductPress(product)}
                />
              ))}
            </XStack>
            <YStack borderBottomWidth={1} borderColor="#c58efd69" />
            <Text als={"flex-start"} fos={20} fow={"bold"}>
              생성한 항목
            </Text>

            <XStack gap={0} jc={"space-between"} fw={"wrap"}>
              {trends
                .filter((product) => product.name === "New Momento") // 공모전 영상용 하드코딩
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={() => onProductPress(product)}
                  />
                ))}
              {/* {trends.slice(4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => onProductPress(product)}
                />
              ))} */}
            </XStack>
          </>
        ) : (
          <>
            <Text als={"flex-start"} fos={20} fow={"bold"}>
              로그인하고 모멘토를 둘러보세요.
            </Text>
            <DefaultButton onPress={onClickAuth}>로그인</DefaultButton>
          </>
        )}
      </YStack>
    </ScrollView>
  );
}
