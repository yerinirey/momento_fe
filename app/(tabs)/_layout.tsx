import { Header } from "@/components/Shared/header/Header";
import { useBookmark } from "@/context/BookmarkProvider";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { Text, XStack, YStack } from "tamagui";

interface Tab {
  name: string;
  viewName: string;
  icon:
    | "home-outline"
    | "account-outline"
    | "bookmark-outline"
    | "camera-outline";
}
export default function TabLayout() {
  const tabs: Tab[] = [
    {
      name: "index",
      viewName: "Home",
      icon: "home-outline",
    },
    {
      name: "scan",
      viewName: "Scan",
      icon: "camera-outline",
    },
    {
      name: "profile",
      viewName: "My Page",
      icon: "account-outline",
    },
    {
      name: "bookmark",
      viewName: "Bookmarks",
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
            header: (props: any) => <Header {...props} />,
            tabBarLabel: tab.viewName,
            tabBarActiveTintColor: "#f99101",
            tabBarInactiveTintColor: "grey",
            tabBarLabelStyle: {
              fontSize: 12, // 글자 크기 고정
              lineHeight: 14, // 줄간격 통일
              fontWeight: "500",
              marginTop: 2,
              textTransform: "none",
            },
            tabBarStyle: {
              height: 60,
              paddingBottom: 10,
              paddingTop: 5,
            },
            tabBarIcon: ({ focused }) => (
              <YStack f={1} jc={"space-between"} ai={"center"}>
                <MCIcon
                  name={tab.icon}
                  size={28}
                  color={focused ? "#f99101" : "grey"}
                />

                <Text
                  fontSize={14}
                  lineHeight={16}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  color={focused ? "#f99101" : "grey"}
                >
                  {/* {tab.viewName} */}
                </Text>
              </YStack>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
