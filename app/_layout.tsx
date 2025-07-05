import { Header } from "@/components/Shared/header/Header";
import { AuthProvider } from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartProvider";
import { SplashScreen, Stack, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const rootNavigationState = useRootNavigationState();
  console.log("RootLayout rendered");

  useEffect(() => {
    if (rootNavigationState != null) {
      SplashScreen.hideAsync();
    }
  }, [rootNavigationState]);

  if (!rootNavigationState == null) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <TamaguiProvider config={tamaguiConfig}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(search)" />
            <Stack.Screen
              name="login"
              options={{
                headerShown: true,
                header: (props) => <Header {...props} />,
                presentation: "fullScreenModal",
              }}
            />
          </Stack>
        </TamaguiProvider>
      </CartProvider>
    </AuthProvider>
  );
}
