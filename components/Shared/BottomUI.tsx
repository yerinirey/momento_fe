import { SafeAreaView } from "react-native";
import { Button, Text, View } from "tamagui";

export const BottomUI = () => {
  return (
    <SafeAreaView>
      <View p={20}>
        <Text>Hello World!</Text>
        <Button>Press me</Button>
      </View>
    </SafeAreaView>
  );
};
