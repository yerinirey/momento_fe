import { ComponentProps } from "react";
import { Button } from "tamagui";

interface Props extends Omit<ComponentProps<typeof Button>, "variant"> {
  onPress: VoidFunction;
  variant?: "primary" | "secondary";
}

export function DefaultButton({
  onPress,
  variant = "primary",
  children,
  ...props
}: Props) {
  return (
    <Button
      onPress={onPress}
      h={50}
      br={50}
      textProps={{ fos: 18 }}
      bg={variant === "primary" ? "#FED2E2" : "white"}
      bc={variant === "primary" ? "#E9A5F1" : "#FED2E2"}
      {...props}
    >
      {children}
    </Button>
  );
}
