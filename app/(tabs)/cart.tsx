import ProductCart from "@/components/Screens/cart/ProductCart";
import { DefaultButton } from "@/components/Shared/DefaultButton";
import { DeliveryLocation } from "@/components/Shared/DeliveryLocation";
import { HeaderTabsProps } from "@/components/Shared/header/HeaderTabs";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartProvider";
import { router, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { Image, ScrollView, Text, XStack, YStack } from "tamagui";

export default function Cart() {
  const { subTotal, items } = useCart();
  // console.log("CART ITEMS", JSON.stringify(items, null, 2));
  const navigation = useNavigation();
  const { session } = useAuth();
  const onClickAuth = () => {
    router.push("/login");
  };
  const tabs: HeaderTabsProps["tabs"] = [
    {
      active: true,
      title: "Basket",
      onPress: () => Alert.alert("Basket"),
    },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerSearchShown: true,
      headerTabsProps: { tabs },
    });
  }, [navigation.setOptions]);

  return (
    <ScrollView f={1} bg={"white"} contentContainerStyle={{ pb: 20 }}>
      <DeliveryLocation />
      <YStack f={1} jc={"center"} ai={"center"} gap={20} px={20}>
        {items.length ? (
          <>
            <XStack als={"flex-start"} mt={10}>
              <Text mr={10} fos={26}>
                Subtotal:
              </Text>
              <Text fos={26} fow={"bold"}>
                $ {subTotal}
              </Text>
            </XStack>
            {session && (
              <DefaultButton onPress={() => {}}>
                {`Proceed to checkout (${items.length.toString()}) items`}
              </DefaultButton>
            )}
            {items.map((item) => (
              <ProductCart key={item.product.id} {...item} />
            ))}
          </>
        ) : (
          <>
            <Image
              source={require("@/assets/empty-cart.png")}
              w={300}
              h={200}
            />
            <Text fow={"bold"} fos={26}>
              Your Amazon cart is empty
            </Text>
            <Text color={"$gray11Light"} fos={18}>
              Good Stuff Goes Here [SUBTOTAL]{subTotal}
            </Text>
          </>
        )}
        {!session && (
          <YStack w={"90%"} gap={15} mt={20}>
            <DefaultButton onPress={onClickAuth}>Sign In</DefaultButton>
            <DefaultButton onPress={onClickAuth} variant="secondary">
              Create Account
            </DefaultButton>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
