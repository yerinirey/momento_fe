import { Header } from "@/components/Shared/header/Header";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { BookmarkProvider } from "@/context/BookmarkProvider";
import { ModelGenerationProvider } from "@/context/ModelGenerationProvider";
import tamaguiConfig from "@/tamagui.config";
import { router, Slot, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { PortalProvider } from "tamagui";
import { TamaguiProvider, Theme } from "@tamagui/core";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function AuthGate() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)"; // 최상위 그룹 확인
    /*비로그인 상태로 비정상적인 경로 접속 방지용 */
    if (!session && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, loading, segments]);
  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <BookmarkProvider>
          <ModelGenerationProvider>
            <TamaguiProvider config={tamaguiConfig}>
              <PortalProvider>
                <StatusBar style="auto" />
                <Theme>
                  <AuthGate />
                  <Slot />
                </Theme>
              </PortalProvider>
            </TamaguiProvider>
          </ModelGenerationProvider>
        </BookmarkProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
