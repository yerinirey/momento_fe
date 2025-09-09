import { useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { supabase } from "@/supabase";
import { View, Text, Button, Input } from "tamagui";
import { router } from "expo-router";

export default function SignUpScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (
      !phoneNumber.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      return Alert.alert("정보 부족", "모든 필드를 입력해주세요.");
    }

    if (password !== confirmPassword) {
      return Alert.alert(
        "비밀번호 불일치",
        "비밀번호와 비밀번호 확인이 일치하지 않습니다."
      );
    }

    try {
      setLoading(true);

      // Supabase는 이메일과 비밀번호를 동시에 사용하여 계정을 생성하는 signUp 함수를 제공합니다.
      // 전화번호는 user_metadata에 추가될 수 있습니다.
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            phone_number: phoneNumber.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      Alert.alert("회원가입 완료");

      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("회원가입 실패", err.message ?? "다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View bg={"$bgColor"} pt={80} paddingHorizontal={20} flex={1}>
      <Text fontSize={28} fontWeight={"bold"}>
        회원가입
      </Text>

      <Text fontSize={14} mt={24}>
        휴대폰 번호
      </Text>
      <Input
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="01012345678"
        keyboardType="phone-pad"
        borderWidth={1}
        borderColor={"$btnBorderColor"}
        backgroundColor={"$btnWhiteColor"}
        borderRadius={12}
        paddingHorizontal={14}
        paddingVertical={12}
      />

      <Text fontSize={14} mt={16}>
        이메일
      </Text>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        borderWidth={1}
        borderColor={"$btnBorderColor"}
        backgroundColor={"$btnWhiteColor"}
        borderRadius={12}
        paddingHorizontal={14}
        paddingVertical={12}
      />

      <Text fontSize={14} mt={16}>
        비밀번호
      </Text>
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        borderWidth={1}
        borderColor={"$btnBorderColor"}
        backgroundColor={"$btnWhiteColor"}
        borderRadius={12}
        paddingHorizontal={14}
        paddingVertical={12}
      />

      <Text fontSize={14} mt={16}>
        비밀번호 확인
      </Text>
      <Input
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        secureTextEntry
        borderWidth={1}
        borderColor={"$btnBorderColor"}
        backgroundColor={"$btnWhiteColor"}
        borderRadius={12}
        paddingHorizontal={14}
        paddingVertical={12}
      />

      <Button
        mt={24}
        onPress={handleSignUp}
        disabled={
          !phoneNumber.trim() ||
          !email.trim() ||
          !password.trim() ||
          !confirmPassword.trim() ||
          loading
        }
        br={12}
        bw={1}
        bc={"$btnBorderColor"}
        bg={
          !phoneNumber.trim() ||
          !email.trim() ||
          !password.trim() ||
          !confirmPassword.trim() ||
          loading
            ? "$btnWhiteColor"
            : "$blackColor"
        }
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text
            color={
              !phoneNumber.trim() ||
              !email.trim() ||
              !password.trim() ||
              !confirmPassword.trim() ||
              loading
                ? "$blackColor"
                : "$btnWhiteColor"
            }
          >
            회원가입
          </Text>
        )}
      </Button>
    </View>
  );
}
