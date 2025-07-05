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
import { GradientBackground } from "../GradientBackground";
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

  if (options.headerLeft || options.headerTitle || options.headerRight) {
    return (
      <YStack bg={"$colorTransparent"}>
        <XStack
          jc={"space-between"}
          py={10}
          px={10}
          gap={20}
          mt={edgeInsets.top + 10}
        >
          <YStack f={1}>{options.headerLeft && <options.headerLeft />}</YStack>
          <YStack f={1}>
            {/* @ts-ignore */}
            {options.headerTitle && <options.headerTitle />}
          </YStack>
          <YStack f={1}>
            {/* @ts-ignore */}
            {options.headerRight && <options.headerRight />}
          </YStack>
        </XStack>
        <GradientBackground />
      </YStack>
    );
  }
  return (
    <YStack bg="$colorTransparent">
      <YStack
        bg="$colorTransparent"
        gap={20}
        pb={10}
        marginTop={edgeInsets.top + 10}
      >
        {options.headerSearchShown && <HeaderSearch />}
        {options.headerTabsProps && <HeaderTabs {...options.headerTabsProps} />}
      </YStack>
      <GradientBackground />
    </YStack>
  );
}
