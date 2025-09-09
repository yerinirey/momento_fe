import { useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { supabase } from "@/supabase";
import { View, Text, Button, Input, XStack } from "tamagui";
import Icon from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

type Step = "EMAIL" | "CODE" | "PASSWORD";

export default function SignUpScreen() {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [settingPw, setSettingPw] = useState(false);

  /* 이메일 인증 state */
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [isValid, setIsValid] = useState<null | boolean>(null);
  const [code, setCode] = useState(""); // 인증코드
  const [verifying, setVerifying] = useState(false);

  /* 이메일 유효성 확인 */
  const handleCheckEmail = async () => {
    const e = email.trim();
    if (!e) {
      return Alert.alert("이메일 필요", "이메일을 입력해주세요.");
    }

    try {
      setCheckingEmail(true);
      setIsValid(null);

      // OTP를 사용하여 이메일로 로그인 링크/코드를 보냅니다.
      // 계정이 없으면 새로 생성합니다.
      const { error } = await supabase.auth.signInWithOtp({
        email: e,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        throw error;
      }

      setIsValid(true);
      setStep("CODE");
      Alert.alert("인증 코드 발송", "이메일로 전송된 코드를 입력해주세요.");
    } catch (err: any) {
      setIsValid(false);
      Alert.alert("발송 실패", err.message ?? "잠시 후 다시 시도해주세요.");
    } finally {
      setCheckingEmail(false);
    }
  };

  /* OTP 검증 */
  const handleVerifyCode = async () => {
    if (!code.trim()) {
      return Alert.alert("코드 필요", "이메일로 받은 코드를 입력하세요.");
    }

    try {
      setVerifying(true);

      // OTP를 검증하고 세션을 생성합니다.
      // 이 과정이 성공하면 사용자는 "로그인" 상태가 됩니다.
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "email",
      });

      if (error) {
        throw error;
      }

      // 사용자에게 비밀번호를 설정하도록 안내하고 단계 전환
      setStep("PASSWORD");
      Alert.alert("이메일 인증 완료", "비밀번호를 설정해주세요.");
    } catch (err: any) {
      Alert.alert("인증 실패", err.message ?? "코드를 다시 확인해주세요.");
    } finally {
      setVerifying(false);
    }
  };

  /* 비밀번호 설정 */
  const handleSetPassword = async () => {
    if (!password) {
      return Alert.alert("비밀번호 필요", "비밀번호를 입력해주세요.");
    }

    try {
      setSettingPw(true);

      // 단계 1: 세션 확인
      console.log("세션 확인 중...");
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      console.log("세션 확인 결과:", sessionData.session); // 세션 데이터 출력

      if (sessionError || !sessionData.session) {
        console.error("세션이 유효하지 않습니다.");
        throw new Error("세션이 유효하지 않습니다. 다시 시도해주세요.");
      }

      // 단계 2: 세션 새로고침
      console.log("세션 새로고침 중...");
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession();
      console.log("세션 새로고침 결과:", refreshData.session); // 새로고침된 세션 출력

      if (refreshError || !refreshData.session) {
        console.error("세션 새로고침에 실패했습니다.");
        throw new Error("세션 새로고침에 실패했습니다. 다시 시도해주세요.");
      }

      // 단계 3: 비밀번호 업데이트
      console.log("비밀번호 업데이트 요청 중...");
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      console.log("비밀번호 업데이트 결과:", updateError); // 오류가 있으면 출력

      if (updateError) {
        throw updateError;
      }

      // ... (성공 시 코드)
    } catch (err) {
      // ... (오류 처리)
    } finally {
      setSettingPw(false);
    }
  };

  return (
    <View bg={"$bgColor"} pt={80} paddingHorizontal={20} flex={1}>
      <Text fontSize={28} fontWeight={"bold"}>
        회원가입
      </Text>

      {/* 1) 이메일 단계 */}
      {step === "EMAIL" && (
        <>
          <Text fontSize={14} mt={24}>
            이메일
          </Text>
          <XStack ai="center" gap={8} mt={8}>
            <Input
              f={1}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setIsValid(null);
              }}
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
            <Button
              onPress={handleCheckEmail}
              disabled={!email.trim() || checkingEmail}
              br={12}
              bw={1}
              bc={"$btnBorderColor"}
              bg={
                !email.trim() || checkingEmail
                  ? "$btnWhiteColor"
                  : "$blackColor"
              }
            >
              {checkingEmail ? (
                <ActivityIndicator />
              ) : (
                <Text color={!email.trim() ? "$blackColor" : "$btnWhiteColor"}>
                  확인
                </Text>
              )}
            </Button>
            {isValid === true && (
              <Icon name="checkmark-circle" size={24} color="#22c55e" />
            )}
            {isValid === false && (
              <Icon name="close-circle" size={24} color="#ef4444" />
            )}
          </XStack>
        </>
      )}

      {/* 2) 코드 입력 */}
      {step === "CODE" && (
        <>
          <Text fontSize={14} mt={24}>
            이메일로 받은 인증코드
          </Text>
          <XStack ai="center" gap={8} mt={8}>
            <Input
              f={1}
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              keyboardType="number-pad"
              borderWidth={1}
              borderColor={"$btnBorderColor"}
              backgroundColor={"$btnWhiteColor"}
              borderRadius={12}
              paddingHorizontal={14}
              paddingVertical={12}
            />
            <Button
              onPress={handleVerifyCode}
              disabled={!code.trim() || verifying}
              br={12}
              bw={1}
              bc={"$btnBorderColor"}
              bg={!code.trim() || verifying ? "$btnWhiteColor" : "$blackColor"}
            >
              {verifying ? (
                <ActivityIndicator />
              ) : (
                <Text color={verifying ? "$blackColor" : "$btnWhiteColor"}>
                  코드 확인
                </Text>
              )}
            </Button>
          </XStack>
        </>
      )}

      {/* 3) 비밀번호 설정 단계 */}
      {step === "PASSWORD" && (
        <>
          <Text fontSize={14} mt={24} mb={10}>
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
          <Button
            mt={16}
            onPress={handleSetPassword}
            disabled={!password || settingPw}
            br={12}
            bw={1}
            bc={"$btnBorderColor"}
            bg={!password || settingPw ? "$btnWhiteColor" : "$blackColor"}
          >
            {settingPw ? (
              <ActivityIndicator />
            ) : (
              <Text
                color={
                  !password || settingPw ? "$blackColor" : "$btnWhiteColor"
                }
              >
                회원가입
              </Text>
            )}
          </Button>
        </>
      )}
    </View>
  );
}
