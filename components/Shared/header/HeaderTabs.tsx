import { Pressable, ViewStyle } from "react-native";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, XStack } from "tamagui";
import { memo } from "react";
export interface HeaderTabsProps {
  tabs:
    | {
        title: string;
        onPress: VoidFunction;
        active?: boolean;
        disabled?: boolean;
        testID?: string;
      }[]
    | null;
  align?: "left" | "right";
  variant?: "underline" | "pill";
  bgColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  showText?: boolean; // 아이콘만 보이게 할지
  style?: ViewStyle;
}

export const HeaderTabs = memo(
  ({
    tabs,
    align = "right",
    variant = "pill",
    bgColor = "#f99101",
    activeColor = "#f99101",
    inactiveColor = "white",
    showText = true,
    style,
  }: HeaderTabsProps) => {
    if (!tabs?.length) return null;
    const justifyContent = align === "right" ? "flex-end" : "flex-start";

    if (variant === "underline") {
      // 기존 언더라인 탭
      return (
        <XStack jc={justifyContent} px={14} gap={40} style={style}>
          {tabs.map((tab) => (
            <Text
              key={tab.title}
              onPress={tab.onPress}
              fos={16}
              allowFontScaling={false}
              bbc={tab.active ? "black" : "$colorTransparent"}
              bbw={tab.active ? 2.5 : 0}
              pb={10}
              mb={-10}
              opacity={tab.disabled ? 0.4 : 1}
            >
              {tab.title}
            </Text>
          ))}
        </XStack>
      );
    }

    // pill 세그먼트 토글
    return (
      <XStack jc={justifyContent} px={14} style={style}>
        <XStack ai="center" bg={bgColor} br={999} px={6} py={4} gap={4}>
          {tabs.map((tab) => {
            const active = !!tab.active;
            const isList = tab.title.toLowerCase() === "list";
            const iconName = isList ? "view-list-outline" : "view-grid-outline";
            return (
              <Pressable
                key={tab.title}
                onPress={tab.onPress}
                disabled={tab.disabled}
                hitSlop={8}
                testID={tab.testID}
                style={{ borderRadius: 999, opacity: tab.disabled ? 0.5 : 1 }}
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
                    name={iconName}
                    size={16}
                    color={active ? activeColor : inactiveColor}
                  />
                  {showText && (
                    <Text
                      fos={13}
                      fow={600}
                      allowFontScaling={false}
                      color={active ? activeColor : inactiveColor}
                      numberOfLines={1}
                    >
                      {tab.title}
                    </Text>
                  )}
                </XStack>
              </Pressable>
            );
          })}
        </XStack>
      </XStack>
    );
  }
);
