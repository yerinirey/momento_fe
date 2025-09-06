import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { BookmarkProvider } from "@/context/BookmarkProvider";
import { ModelGenerationProvider } from "@/context/ModelGenerationProvider";
import tamaguiConfig from "@/tamagui.config";
import { router, Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import "react-native-reanimated";
import { PortalProvider } from "tamagui";
import { TamaguiProvider, Theme } from "@tamagui/core";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { supabase } from "@/supabase";
import ProfileBootstrapper from "@/components/system/ProfileBootstrapper";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add any custom fonts you have here.
    // For example:
    // Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    // InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

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

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <BookmarkProvider>
          <ModelGenerationProvider>
            <TamaguiProvider config={tamaguiConfig}>
              <PortalProvider>
                <StatusBar style="auto" />
                <Theme>
                  <ProfileBootstrapper />
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
