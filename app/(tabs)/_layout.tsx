import { Header } from "@/components/Shared/header/Header";
import { useCart } from "@/context/CartProvider";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { Text, XStack, YStack } from "tamagui";

interface Tab {
  name: string;
  icon: "home-outline" | "account-outline" | "cart-check";
}
export default function TabLayout() {
  const { items } = useCart();
  const tabs: Tab[] = [
    {
      name: "index",
      icon: "home-outline",
    },
    {
      name: "profile",
      icon: "account-outline",
    },
    {
      name: "cart",
      icon: "cart-check",
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
            header: (props) => <Header {...props} />,
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
                  bg={focused ? "#238db0" : "$colorTransparent"}
                />
                {/* TODO: Add Icon */}
                <MCIcon
                  name={tab.icon}
                  size={30}
                  color={focused ? "#238db0" : "black"}
                />
                {/* TODO: Items.length in the cart*/}
                {tab.name === "cart" && (
                  <Text
                    paddingVertical={4}
                    borderRadius={10}
                    position="absolute"
                    top={11}
                    backgroundColor={"white"}
                    fow={"bold"}
                    fos={12}
                    col={focused ? "#238db0" : "black"}
                  >
                    {items.length}
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
