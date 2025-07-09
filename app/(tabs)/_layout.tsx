import { Header } from "@/components/Shared/header/Header";
import { useBookmark } from "@/context/BookmarkProvider";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { Text, XStack, YStack } from "tamagui";

interface Tab {
  name: string;
  icon: "home-outline" | "account-outline" | "bookmark-outline" | "camera-outline";
}
export default function TabLayout() {
  const { bookmarkedItems } = useBookmark();
  const tabs: Tab[] = [
    {
      name: "index",
      icon: "home-outline",
    },
    {
      name: "scan",
      icon: "camera-outline",
    },
    {
      name: "profile",
      icon: "account-outline",
    },
    {
      name: "bookmark",
      icon: "bookmark-outline",
    },
  ];

  return (
    <Tabs>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: "lightgray",
            },
            // TODO: Custom header
            header: (props: any) => <Header {...props} />,
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <YStack
                f={1}
                marginTop={-5}
                gap={10}
                jc={"space-between"}
                ai={"center"}
              >
                <XStack
                  width={50}
                  height={4}
                  borderRadius={20}
                  bg={focused ? "#8F87F1" : "$colorTransparent"}
                />

                <MCIcon
                  name={tab.icon}
                  size={30}
                  color={focused ? "#8F87F1" : "black"}
                />

                {tab.name === "bookmark" && (
                  <Text
                    paddingVertical={4}
                    borderRadius={10}
                    position="absolute"
                    top={11}
                    backgroundColor={"white"}
                    fow={"bold"}
                    fos={14}
                    // col={focused ? "#8F87F1" : "black"}
                    col="#8F87F1"
                  >
                    {bookmarkedItems.length}
                  </Text>
                )}
              </YStack>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
