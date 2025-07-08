import ProductCart from "@/components/Screens/cart/ProductCart";
import { HeaderTabsProps } from "@/components/Shared/header/HeaderTabs";
import { useBookmark } from "@/context/BookmarkProvider";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import { Image, ScrollView, Text, YStack } from "tamagui";

export default function Cart() {
  const { bookmarkedItems } = useBookmark();
  const navigation = useNavigation();

  const tabs: HeaderTabsProps["tabs"] = [
    {
      active: true,
      title: "Bookmarks",
      onPress: () => Alert.alert("Bookmarks"),
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
      <YStack f={1} jc={"center"} ai={"center"} gap={20} px={20}>
        {bookmarkedItems.length ? (
          bookmarkedItems.map((item) => (
            <ProductCart key={item.id} product={item} />
          ))
        ) : (
          <>
            <Image
              source={require("@/assets/empty-cart.png")}
              w={300}
              h={200}
            />
            <Text fow={"bold"} fos={26}>
              Your bookmark list is empty
            </Text>
          </>
        )}
      </YStack>
    </ScrollView>
  );
}
