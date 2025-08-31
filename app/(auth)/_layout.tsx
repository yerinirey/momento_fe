import { Stack } from "expo-router";
import { Header } from "@/components/Shared/header/Header";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: (props) => <Header {...props} />,
        presentation: "fullScreenModal",
      }}
    >
      <Stack.Screen name="index" options={{ title: "로그인" }} />
    </Stack>
  );
}
