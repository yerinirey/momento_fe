import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/supabase";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingUp, setSigningUp] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      Alert.alert("입력 필수", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    try {
      setSigningUp(true);
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      Alert.alert("회원가입 완료", "이제 모멘토를 둘러보세요.");
    } catch (e: any) {
      Alert.alert("회원가입 실패", e.message ?? "잠시 후 다시 시도해주세요.");
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 80, gap: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: "700" }}>회원가입</Text>

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
        disabled={!email || !password || signingUp}
        onPress={handleSignUp}
        style={{
          backgroundColor: !email || !password || signingUp ? "#ccc" : "#000",
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: "center",
          marginTop: 12,
        }}
      >
        {signingUp ? (
          <ActivityIndicator />
        ) : (
          <Text style={{ color: "white", fontWeight: "600" }}>회원가입</Text>
        )}
      </Pressable>
    </View>
  );
}
