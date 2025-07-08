import { Header } from "@/components/Shared/header/Header";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { BookmarkProvider } from "@/context/BookmarkProvider";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";

const AppLayout = () => {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    // if (!session) router.replace("/login");
    // else router.replace("/(tabs)");
    router.replace("/(tabs)");
  }, [session, loading]);

  return (
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
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <BookmarkProvider>
        <TamaguiProvider config={tamaguiConfig}>
          <StatusBar style="auto" />
          <AppLayout />
        </TamaguiProvider>
      </BookmarkProvider>
    </AuthProvider>
  );
}
