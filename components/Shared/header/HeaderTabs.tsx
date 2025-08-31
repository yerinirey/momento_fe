import { Pressable } from "react-native";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, XStack } from "tamagui";
import { memo } from "react";
export interface HeaderTabsProps {
  tabs:
    | {
        title: string;
        onPress: VoidFunction;
        active?: boolean;
      }[]
    | null;
  align?: "left" | "right";
  variant?: "underline" | "pill";
}

export const HeaderTabs = memo(({ tabs }: HeaderTabsProps) => {
  if (!tabs?.length) return null;

  // 캡슐 컨테이너 (주황 배경)
  return (
    <XStack
      ai="center"
      bg="#f99101" // 브랜드 주황
      br={999}
      px={6}
      py={4}
      gap={4}
      // 살짝 입체감 주고 싶으면:
      // shadowColor="rgba(0,0,0,0.15)" shadowRadius={8} shadowOffset={{height:4,width:0}}
    >
      {tabs.map((tab) => {
        const active = !!tab.active;
        return (
          <Pressable
            key={tab.title}
            onPress={tab.onPress}
            hitSlop={8}
            style={{ borderRadius: 999 }}
          >
            <XStack
              ai="center"
              gap={6}
              px={12}
              py={8}
              br={999}
              bg={active ? "white" : "transparent"}
            >
              <MCIcon
                name={
                  tab.title === "List"
                    ? "view-list-outline"
                    : "view-grid-outline"
                }
                size={16}
                color={active ? "#f99101" : "white"}
              />
              <Text
                fos={13}
                fow={600}
                allowFontScaling={false}
                color={active ? "#f99101" : "white"}
              >
                {tab.title}
              </Text>
            </XStack>
          </Pressable>
        );
      })}
    </XStack>
  );
});
