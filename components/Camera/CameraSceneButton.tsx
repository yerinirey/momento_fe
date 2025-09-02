import { Button, View } from "tamagui";
import Icon from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Button> {
  onPress: VoidFunction;
  iconName: ComponentProps<typeof Icon>["name"];
  bgColor?: string;
}

export function CameraSceneButton({
  onPress,
  iconName,
  bgColor = "$btnWhiteColor",
  ...props
}: Props) {
  return (
    <Button
      onPress={onPress}
      br={"50%"}
      w={50}
      h={50}
      bg={bgColor}
      ai={"center"}
      jc={"center"}
      style={{ textAlign: "center" }}
    >
      <View
        style={{
          width: "50",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={iconName} size={20} />
      </View>
    </Button>
  );
}
