import {
  BottomTabHeaderProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderTabs, HeaderTabsProps } from "./HeaderTabs";

export interface CustomHeaderProps {
  headerSearchShown?: boolean;
  headerTabsProps?: HeaderTabsProps;
}

export interface StackHeaderProps extends NativeStackHeaderProps {
  options: NativeStackNavigationOptions & CustomHeaderProps;
}
export interface TabsHeaderProps extends BottomTabHeaderProps {
  options: BottomTabNavigationOptions & CustomHeaderProps;
}

export function Header({ options }: StackHeaderProps | TabsHeaderProps) {
  const edgeInsets = useSafeAreaInsets();
  const render = (slot?: any) => {
    if (!slot) return null;
    // 함수라면 실행해서 ReactNode 반환
    if (typeof slot === "function") return slot({});
    // 이미 ReactNode라면 그대로 렌더
    return slot;
  };

  if (options.headerLeft || options.headerTitle || options.headerRight) {
    return (
      <YStack bg={"$pointColor"}>
        <XStack
          jc={"space-between"}
          py={10}
          px={10}
          gap={20}
          mt={edgeInsets.top + 10}
        >
          <YStack key="headerLeft" f={1}>
            {render(options.headerLeft)}
          </YStack>
          <YStack key="headerTitle" f={1}>
            {/* @ts-ignore */}
            {render(options.headerTitle)}
          </YStack>
          <YStack key="headerRight" f={1}>
            {/* @ts-ignore */}
            {render(options.headerRight)}
          </YStack>
        </XStack>
      </YStack>
    );
  }
  return (
    <YStack bg="$pointColor">
      <YStack
        bg="$colorTransparent"
        gap={20}
        pb={10}
        marginTop={edgeInsets.top + 10}
      >
        {options.headerSearchShown && <HeaderSearch />}
        {options.headerTabsProps && <HeaderTabs {...options.headerTabsProps} />}
      </YStack>
    </YStack>
  );
}
