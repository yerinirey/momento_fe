import { LinearGradient } from "expo-linear-gradient";

type Props = {
  type?: string;
};

export function GradientBackground({ type }: Props) {
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
      colors={type === "card" ? ["#C68EFD", "#FED2E2"] : ["#8F87F1", "#C68EFD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );
}
