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
      br={10}
      textProps={{ fos: 18 }}
      bg={variant === "primary" ? "white" : "white"}
      bc={variant === "primary" ? "$pointColor" : "grey"}
      {...props}
    >
      {children}
    </Button>
  );
}
