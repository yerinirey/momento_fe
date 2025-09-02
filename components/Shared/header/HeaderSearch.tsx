import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import Icon from "@expo/vector-icons/Ionicons";
import { router, useSegments } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
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
  if (!isSearchScreen) {
    // 기본 탭에서는 아이콘만 보일 수 있도록 분기
    return (
      <XStack px={14} jc="flex-end" ai="center">
        <Pressable onPress={onPressIn} hitSlop={8} style={s.btnContainer}>
          <Icon name="search" style={s.icon} />
        </Pressable>
      </XStack>
    );
  }
  // 검색 탭에서는 검색창 확대
  return (
    <XStack px={20} jc={"center"} ai={"center"} gap={10}>
      {isSearchScreen && (
        <Pressable onPress={onGoBack}>
          <Icon name="arrow-back" style={s.icon} />
        </Pressable>
      )}

      <Icon name="search" style={s.icon} />
      <Input
        style={s.input}
        f={9}
        ref={ref}
        value={query}
        onPressIn={onPressIn}
        onChangeText={setQuery}
        textAlign="left"
        placeholder="모멘토를 검색하세요" // 추후 추천 키워드 도입 가능
        placeholderTextColor={"$blackColor"}
      />
    </XStack>
  );
}

const s = StyleSheet.create({
  btnContainer: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "#f99201ff",
    fontSize: 26,
    textShadowColor: " rgba(255, 246, 164, 0.68)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 26,
  },
  input: {
    paddingLeft: 10,
    backgroundColor: "#fffeff",
    borderColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
  },
});
