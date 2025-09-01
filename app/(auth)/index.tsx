import { useState } from "react";
import { Alert, Platform, ActivityIndicator } from "react-native";
import { View, Text, Input, Button, XStack } from "tamagui";
import { supabase } from "@/supabase";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "expo-router";

export default function AuthIndex() {
  const router = useRouter();
  const { loading: authLoading, session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(
    null
  );

  const handleEmailPasswordSignIn = async () => {
    const e = email.trim();
    if (!e || !password) {
      Alert.alert("입력 필요", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setSigningIn(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: e,
        password,
      });

      if (error) {
        Alert.alert("로그인 실패", "이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
    } catch (e: any) {
      Alert.alert(
        "오류",
        e?.message ?? "네트워크 오류가 발생했어요. 다시 시도해주세요."
      );
    } finally {
      setSigningIn(false);
    }
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    try {
      setOauthLoading("google");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          skipBrowserRedirect: false,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      Alert.alert("로그인 실패", e.message ?? "잠시 후 다시 시도해주세요.");
    } finally {
      setOauthLoading(null);
    }
  };

  // Apple OAuth (iOS) 예정
  const signInWithApple = async () => {
    try {
      setOauthLoading("apple");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          skipBrowserRedirect: false,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      Alert.alert("로그인 실패", e.message ?? "잠시 후 다시 시도해주세요.");
    } finally {
      setOauthLoading(null);
    }
  };

  // AuthProvider 초기화
  if (authLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // 이미 로그인 상태일 때 비정상적인 동작 방지
  if (session) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View bg={"$bgColor"} pt={80} paddingHorizontal={20} flex={1}>
      <Text fontSize={28} fontWeight={"bold"}>
        Momento
      </Text>
      <Text fontSize={16} opacity={0.8} mt={8}>
        3D 모델을 만들고, AR로 추억을 배치해 보세요.
      </Text>

      {/* 이메일/비밀번호 로그인 */}
      <View gap={10} mt={24}>
        <Text fontSize={14}>이메일</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          borderWidth={1}
          borderColor={"#e8e8e8"}
          backgroundColor={"#fffeff"}
          borderRadius={12}
          paddingHorizontal={14}
          paddingVertical={12}
        />

        <Text fontSize={14} mt={10}>
          비밀번호
        </Text>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          borderWidth={1}
          borderColor={"#e8e8e8"}
          backgroundColor={"#fffeff"}
          borderRadius={12}
          paddingHorizontal={14}
          paddingVertical={12}
        />

        <Button
          disabled={!email || !password || signingIn}
          onPress={handleEmailPasswordSignIn}
          backgroundColor={
            !email || !password || signingIn ? "#fffeff" : "#1d1d1d"
          }
          borderWidth={1}
          borderColor={"#e8e8e8"}
          borderRadius={12}
          alignItems="center"
          textAlign="center"
          justifyContent="center"
          mt={20}
          // paddingVertical={14}
        >
          {signingIn ? (
            <ActivityIndicator />
          ) : (
            <Text
              color={!email || !password || signingIn ? "#1d1d1d" : "#fffeff"}
              fontWeight="bold"
            >
              로그인
            </Text>
          )}
        </Button>
        <Button
          onPress={() => router.push("/signup")}
          backgroundColor={"#fffeff"}
          borderWidth={1}
          borderColor={"#e8e8e8"}
          borderRadius={12}
          alignItems="center"
          textAlign="center"
          justifyContent="center"
          mt={6}
        >
          <Text fontWeight={"bold"}>회원가입</Text>
        </Button>
      </View>
      <XStack
        borderWidth={0.2}
        borderColor={"$black025"}
        marginHorizontal={10}
        marginVertical={24}
      />
      {/* OAuth 버튼들 (선택) -> 아이콘으로 4분할 예정*/}
      <View gap={10}>
        <Button
          onPress={signInWithGoogle}
          borderWidth={1}
          backgroundColor={"#fffeff"}
          borderColor={"#e8e8e8"}
          borderRadius={12}
          alignItems="center"
          textAlign="center"
          justifyContent="center"
        >
          {oauthLoading === "google" ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ fontWeight: "600" }}>Google로 계속하기</Text>
          )}
        </Button>

        {Platform.OS === "ios" && (
          <Button
            onPress={signInWithApple}
            borderWidth={1}
            backgroundColor={"#fffeff"}
            borderColor={"#e8e8e8"}
            borderRadius={12}
            alignItems="center"
            textAlign="center"
            justifyContent="center"
          >
            {oauthLoading === "apple" ? (
              <ActivityIndicator />
            ) : (
              <Text fontWeight={"bold"}>Apple로 계속하기</Text>
            )}
          </Button>
        )}
      </View>

      <View mt={"auto"} mb={24}>
        <Text fontSize={12} color="#1d1d1d" opacity={0.8} textAlign="center">
          계속하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
        </Text>
      </View>
    </View>
  );
}
