import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { XStack } from "tamagui";

export interface HeaderViewSwitcherProps {
  value: "list" | "grid";
  onChange: (v: "list" | "grid") => void;

  width?: number; // 전체 가로폭
  height?: number; // 전환버튼 높이
  padding?: number; // 버튼 패딩 / 없으면 너무 딱 붙는 느낌
  // List Grid 전환 아이콘 속성
  iconSize?: number;
  activeIconColor?: string;
  inactiveIconColor?: string;
}

export function HeaderViewSwitcher({
  value,
  onChange,

  width = 80,
  height = 40,

  iconSize = 18,
  //   activeIconColor = "$pointColor",
  activeIconColor = "#f99101",
  inactiveIconColor = "rgba(255,255,255,0.85)",
  padding = 4,
}: HeaderViewSwitcherProps) {
  const tabs = ["list", "grid"] as const;
  const activeIndex = tabs.indexOf(value);

  /* 패딩 무시한 실제 폭과 높이 재계산 */
  const contentHeight = height - padding * 2;
  const contentWidth = width - 2 * padding;

  /* 위에서 계산한 높이에 맞춰 Circle 크기 계산, 쏠림 막기 위해 수식으로 계산 */
  const circleSize = contentHeight;
  const circleTop = (height - circleSize) / 2; // 중앙정렬 // tmp, 수식 다시 계산 필요..

  const anim = useRef(new Animated.Value(activeIndex)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: activeIndex,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, anim]);

  const segment = contentWidth / tabs.length;
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      padding + (segment - circleSize) / 2,
      padding + segment + (segment - circleSize) / 2,
    ],
  });

  return (
    <View style={[s.btnContainer, { height, width }]}>
      <View style={[s.btnContainer2, { padding }]}>
        {segment > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              s.circle,
              {
                width: circleSize,
                height: circleSize,
                top: circleTop / 2,
                borderRadius: circleSize / 2,
                transform: [{ translateX }],
              },
            ]}
          />
        )}
        {/* 아이콘 */}
        <XStack ai="center" jc="space-between" w={contentWidth}>
          {tabs.map((k) => {
            const isActive = k === value;
            const icon = k === "list" ? "view-list" : "view-grid";
            return (
              <Pressable
                key={k}
                onPress={() => onChange(k)}
                hitSlop={8}
                style={{
                  width: segment,
                  height: circleSize,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: circleSize / 2,
                }}
              >
                <MCIcon
                  name={icon}
                  size={iconSize}
                  color={isActive ? activeIconColor : inactiveIconColor}
                />
              </Pressable>
            );
          })}
        </XStack>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  btnContainer: {
    borderRadius: 999, // 상한..
    // 글래스모피즘 구현 위한 부분
    backgroundColor: "rgba(249, 145, 1, 0.3)", // 유리
    // boxShadow: "0 8px 32px 0 rgba(134, 106, 156, 0.37)",
    shadowColor: "rgba(255, 244, 89, 0.88)",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  btnContainer2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    left: 0,
    backgroundColor: "rgba(255,255,255,0.85)",
    elevation: 0,
  },
});
