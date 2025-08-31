import { useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
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
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 80, gap: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: "700" }}>Momento</Text>
      <Text style={{ fontSize: 16, opacity: 0.8 }}>
        3D 모델을 만들고, AR로 추억을 배치해 보세요.
      </Text>

      {/* 이메일/비밀번호 로그인 */}
      <View style={{ gap: 8, marginTop: 24 }}>
        <Text style={{ fontSize: 14 }}>이메일</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        />

        <Text style={{ fontSize: 14, marginTop: 8 }}>비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        />

        <Pressable
          disabled={!email || !password || signingIn}
          onPress={handleEmailPasswordSignIn}
          style={{
            backgroundColor: !email || !password || signingIn ? "#ccc" : "#000",
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            marginTop: 12,
          }}
        >
          {signingIn ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ color: "white", fontWeight: "600" }}>로그인</Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => router.push("/signup")}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "600" }}>회원가입</Text>
        </Pressable>
      </View>

      {/* OAuth 버튼들 (선택) */}
      <View style={{ gap: 12, marginTop: 16 }}>
        <Pressable
          onPress={signInWithGoogle}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          {oauthLoading === "google" ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ fontWeight: "600" }}>Google로 계속하기</Text>
          )}
        </Pressable>

        {Platform.OS === "ios" && (
          <Pressable
            onPress={signInWithApple}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            {oauthLoading === "apple" ? (
              <ActivityIndicator />
            ) : (
              <Text style={{ fontWeight: "600" }}>Apple로 계속하기</Text>
            )}
          </Pressable>
        )}
      </View>

      <View style={{ marginTop: "auto", marginBottom: 24 }}>
        <Text style={{ fontSize: 12, color: "#666", textAlign: "center" }}>
          계속하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
        </Text>
      </View>
    </View>
  );
}
