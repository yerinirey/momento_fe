import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import Icon from "@expo/vector-icons/Ionicons";
import { router, useSegments } from "expo-router";
import { useRef, useState } from "react";
import { Pressable } from "react-native";
import { Input, XStack } from "tamagui";

export function HeaderSearch() {
  const segments = useSegments();
  const ref = useRef<Input>(null);
  const [query, setQuery] = useState("");
  const isSearchScreen = segments[0] === "(search)";

  const onPressIn = () => {
    if (!isSearchScreen || segments.length !== 1) {
      router.push("/(search)");
    }
  };

  const onGoBack = () => {
    setQuery("");
    router.dismissAll();
  };

  useDebouncedCallback(
    () => {
      if (query) router.setParams({ query });
      if (segments.length === 1 && segments[0] === "(search)") {
        ref.current?.focus();
      }
    },
    [query],
    500
  );

  return (
    <XStack px={20} jc={"center"} ai={"center"} gap={10}>
      {isSearchScreen && (
        <Pressable onPress={onGoBack}>
          <Icon name="arrow-back" color={"black"} size={24} />
        </Pressable>
      )}

      <XStack
        bg={"white"}
        f={9}
        jc={"center"}
        ai={"center"}
        bw={1}
        bc={"#a4a5a6"}
        br={8}
        shac={"gray"}
        shof={{ width: 0, height: 2 }}
        shop={0.4}
        shar={4}
      >
        <Icon name="search" color={"black"} size={24} />
        <Input
          ref={ref}
          value={query}
          // editable={isSearchScreen}
          onPressIn={onPressIn}
          onChangeText={setQuery}
          w={"75%"}
          bg={"white"}
          fow={800}
          fos={20}
          bw={0}
          placeholder="Search"
          // pointerEvents={isSearchScreen ? "auto" : "none"}
        />
        {/* <Icon name="scan" color={"black"} size={24} /> */}
      </XStack>
    </XStack>
  );
}
