import { DefaultButton } from "@/components/Shared/DefaultButton";
import { Header } from "@/components/Shared/header/Header";
import { supabase } from "@/supabase";
import Icon from "@expo/vector-icons/Ionicons";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable } from "react-native";
import { Checkbox, Form, Input, Label, Text, XStack, YStack } from "tamagui";

enum Step {
  "EMAIL" = 1,
  "PASSWORD" = 2,
}

export const screenOptions = {
  headerShown: true,
  header: (props: any) => <Header {...props} />,
  presentation: "fullScreenModal", // 또는 'modal'
};

export default function Login() {
  const navigation = useNavigation();

  const [step, setStep] = useState(Step.EMAIL);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onGoBack = () => router.back();

  function register() {
    supabase.auth
      .signUp({ email, password })
      .then(onGoBack)
      .catch((err) => Alert.alert("Error", err.message));
  }

  function login() {
    supabase.auth
      .signInWithPassword({ email, password })
      .then(({ error }) => {
        if (error) return register();
        else onGoBack();
      })
      .catch(register);
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={onGoBack}>
          <Text fos={18} fow={800}>
            Back
          </Text>
        </Pressable>
      ),
      headerTitle: () => (
        <Text fos={16} fow={"bold"}>
          Amazon.es
        </Text>
      ),
    });
  }, [navigation, navigation.setOptions]);

  return (
    <YStack f={1} ai={"center"} p={20} gap={20} bg={"white"}>
      <Text als={"flex-start"} fos={20} fow={"bold"}>
        로그인 {step === Step.EMAIL && "하거나 계정을 생성하세요."}
      </Text>
      <Form w={"100%"} gap={20}>
        {step === Step.EMAIL ? (
          <Label als={"flex-start"} fos={16} fow={"bold"}>
            이메일 입력
          </Label>
        ) : (
          <XStack gap={10} ai={"center"}>
            <Text fow={"bold"} fos={16}>
              {email}
            </Text>
            <Pressable onPress={() => setStep(Step.EMAIL)}>
              <Text fos={16} textDecorationLine="underline" color={"#146eb4"}>
                이메일 변경하기
              </Text>
            </Pressable>
          </XStack>
        )}

        {step === Step.EMAIL ? (
          <Input
            value={email}
            onChangeText={setEmail}
            br={4}
            bc={"$gray10Light"}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : (
          <>
            <Input
              value={password}
              onChangeText={setPassword}
              br={4}
              bc={"$gray10Light"}
              placeholder="Password"
              secureTextEntry={!showPassword}
            />
            <XStack ai={"center"} gap={10}>
              <Checkbox
                checked={showPassword}
                bc={"$gray10Light"}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean") {
                    setShowPassword(checked);
                  }
                }}
              >
                {showPassword && (
                  <Checkbox.Indicator>
                    <Icon name="checkmark" color={"orange"} />
                  </Checkbox.Indicator>
                )}
              </Checkbox>
              <Text>Show Password</Text>
            </XStack>
          </>
        )}
      </Form>

      <DefaultButton
        w={"100%"}
        disabled={email.length < 5}
        disabledStyle={{
          opacity: 0.5,
        }}
        onPress={() => {
          if (step === Step.EMAIL) setStep(Step.PASSWORD);
          else login();
        }}
      >
        {step === Step.EMAIL ? "다음" : "로그인"}
      </DefaultButton>
      {/* <XStack w={"100%"} ai={"center"} jc={"center"}>
        <Text>By continuing, you agree to Amazon;s </Text>
        <Text textDecorationLine="underline" color={"#146eb4"}>
          Conditions
        </Text>
      </XStack>
      <XStack
        mt={10}
        h={3}
        bg={"lightgray"}
        w={Dimensions.get("window").width}
      />
      <YStack gap={20}>
        <XStack gap={20}>
          {["Conditions of use", "Privacy Notice", "Help"].map(
            (link, index) => (
              <Text
                key={`${link}-${index}`}
                fos={16}
                textDecorationLine="underline"
                color={"#146eb4"}
              >
                {link}
              </Text>
            )
          )}
        </XStack>
        <Text color={"gray"} fos={14}>
          ⓒ 1996-2021, Amazon.com, Inc. or its affiliates
        </Text>
      </YStack> */}
    </YStack>
  );
}
