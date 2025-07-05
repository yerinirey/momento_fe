import { Header, StackHeaderProps } from "@/components/Shared/header/Header";
import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={
        {
          header: (props) => <Header {...props} />,
          headerSearchShown: true,
        } as StackHeaderProps["options"]
      }
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="product/[id]/index" />
      <Stack.Screen name="product/THREED" options={{ headerShown: false }} />
      <Stack.Screen name="product/AR" options={{ headerShown: false }} />
    </Stack>
  );
}
