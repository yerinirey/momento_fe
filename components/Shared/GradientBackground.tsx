import { LinearGradient } from "expo-linear-gradient";

export function GradientBackground() {
  return (
    <LinearGradient
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: -1,
      }}
      colors={["#84def0", "#c1f0dd"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  );
}
