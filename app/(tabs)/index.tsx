import { HomeCarousel } from "@/components/Screens/home/HomeCarousel";
import { HomeSuggestions } from "@/components/Screens/home/HomeSuggestions";
import { ProductDealCard } from "@/components/Screens/home/ProductDealCard";
import { DefaultButton } from "@/components/Shared/DefaultButton";
import { DeliveryLocation } from "@/components/Shared/DeliveryLocation";
import { HeaderTabsProps } from "@/components/Shared/header/HeaderTabs";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import { router, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";

export default function Home() {
  const navigation = useNavigation();
  const { session } = useAuth();

  const [deals, setDeals] = useState<Product[]>([]);

  const onClickAuth = () => router.push("/login");
  const tabs: HeaderTabsProps["tabs"] = [
    {
      active: true,
      title: "Alexa Lists",
      onPress: () => Alert.alert("Alexa Lists"),
    },
    {
      title: "Prime",
      onPress: () => Alert.alert("Prime"),
    },
    {
      title: "Video",
      onPress: () => Alert.alert("Video"),
    },
  ];
  const onProductPress = ({ id }: Product) => {
    router.push(`/product/${id}`);
  };
  const getDeals = useCallback(async () => {
    try {
      const { data = [] } = await supabase.from("products").select("*");
      setDeals(data as Product[]);
      // console.log("🛒 ~ getDeals ~ data:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerSearchShown: true,
      headerTabsProps: { tabs },
    });
    getDeals();
  }, [navigation.setOptions, getDeals]);

  return (
    <ScrollView f={1}>
      <DeliveryLocation />
      <HomeCarousel />
      <HomeSuggestions />
      <YStack bg={"white"} w={"100%"} p={20} gap={20}>
        <Text als={"flex-start"} fos={20} fow={"bold"}>
          {session ? "Deals for you" : "Sign in for your best experience"}
        </Text>
        {session ? (
          <XStack gap={30} jc={"space-between"} fw={"wrap"}>
            {deals.map((product) => (
              <ProductDealCard
                key={product.id}
                product={product}
                onPress={() => onProductPress(product)}
              />
            ))}
          </XStack>
        ) : (
          <DefaultButton onPress={onClickAuth}>Sign in</DefaultButton>
        )}
      </YStack>
    </ScrollView>
  );
}
