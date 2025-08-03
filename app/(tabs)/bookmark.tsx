import ProductCart from "@/components/Screens/cart/ProductCart";
import { HeaderTabsProps } from "@/components/Shared/header/HeaderTabs";
import { useBookmark } from "@/context/BookmarkProvider";
import Icon from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import { ScrollView, Text, YStack } from "tamagui";

export default function Cart() {
  const { bookmarkedItems } = useBookmark();
  const navigation = useNavigation();

  const tabs: HeaderTabsProps["tabs"] = [
    {
      active: true,
      title: "북마크",
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
      <YStack f={1} gap={20} px={16} pt={20}>
        <Text fos={20} fow={"bold"}>
          저장
        </Text>
        {bookmarkedItems.length ? (
          bookmarkedItems.map((item) => (
            <ProductCart key={item.id} product={item} />
          ))
        ) : (
          <>
            {/* <Icon marginTop={10} name="bookmarks" size={20} /> */}
            <Text color="$gray10">저장한 모멘토가 없습니다.</Text>
          </>
        )}
      </YStack>
    </ScrollView>
  );
}
