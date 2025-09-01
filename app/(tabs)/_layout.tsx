import { Header } from "@/components/Shared/header/Header";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import { View, YStack } from "tamagui";

interface Tab {
  name: string;
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

  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 60,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "transparent",
          overflow: "hidden",

          shadowColor: "#000000ff",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarItemStyle: {
          height: 56,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: "#feeceb" }} />
        ),
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            header: (props: any) => <Header {...props} />,
            tabBarActiveTintColor: "#f99101",
            tabBarInactiveTintColor: "grey",

            tabBarIcon: ({ focused }) => (
              <YStack f={1} jc={"center"} ai={"center"}>
                <MCIcon
                  name={tab.icon}
                  size={28}
                  color={focused ? "#f99101" : "grey"}
                />
              </YStack>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
