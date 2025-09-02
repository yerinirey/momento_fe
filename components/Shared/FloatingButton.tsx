import { Pressable } from "react-native";
import { XStack, YStack } from "tamagui";
import Icon from "@expo/vector-icons/Ionicons";

type Props = {
  type: "likes" | "bookmarks";
  active: boolean;
  icon: string;
  onPress: () => void;
  size?: number;
  activeBg?: string;
  activeColor?: string;
};

export function FloatingButton({
  type,
  active,
  icon,
  onPress,
  size = 30,
  activeBg = "#2260a7ff",
  activeColor = "white",
}: Props) {
  if (type == "likes") {
    activeBg = "#d35313";
  }
  if (active) {
    return (
      <Pressable onPress={onPress} style={{ borderRadius: 999 }}>
        <XStack
          w={size}
          h={size}
          br={999}
          ai="center"
          jc="center"
          bg={activeBg}
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          }}
        >
          <Icon name={icon as any} size={14} color={activeColor} />
        </XStack>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ borderRadius: 999 }}>
      <YStack
        w={size}
        h={size}
        br={999}
        ai="center"
        jc="center"
        bg="rgba(255,255,255,0.16)"
        bw={1}
        bc="rgba(255,255,255,0.35)"
      >
        <Icon name={icon as any} size={14} color="white" />
      </YStack>
    </Pressable>
  );
}
