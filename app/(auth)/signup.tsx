import { useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { supabase } from "@/supabase";
import { View, Text, Button, Input } from "tamagui";
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
    <View bg={"$bgColor"} pt={80} paddingHorizontal={20} flex={1}>
      <Text fontSize={28} fontWeight={"bold"}>
        회원가입
      </Text>
      <View gap={10} mt={24}>
        <Text fontSize={14} mt={24}>
          이메일
        </Text>
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

        <Text style={{ fontSize: 14, marginTop: 8 }}>비밀번호</Text>
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
      </View>
      <Button
        disabled={!email || !password || signingUp}
        onPress={handleSignUp}
        backgroundColor={
          !email || !password || signingUp ? "#fffeff" : "#1d1d1d"
        }
        borderWidth={1}
        borderColor={"#e8e8e8"}
        borderRadius={12}
        alignItems="center"
        textAlign="center"
        justifyContent="center"
        mt={20}
      >
        {signingUp ? (
          <ActivityIndicator />
        ) : (
          <Text
            color={!email || !password || signingUp ? "#1d1d1d" : "#fffeff"}
            fontWeight="bold"
          >
            회원가입
          </Text>
        )}
      </Button>
    </View>
  );
}
