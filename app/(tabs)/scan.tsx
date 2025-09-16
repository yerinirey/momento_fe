import { Image, ScrollView, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { YStack, XStack, Button, Text, Paragraph } from "tamagui";
import { useModelGeneration } from "../../context/ModelGenerationProvider";
import { DefaultButton } from "@/components/Shared/DefaultButton";
import { supabase } from "@/supabase";

export default function ScanScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { addGeneratingModel } = useModelGeneration();
  const [scheduling, setScheduling] = useState(false);
  const params = useLocalSearchParams();
  const capturedUrisParam = params?.capturedUris;
  // 촬영 결과를 반영
  useEffect(() => {
    if (
      capturedUrisParam &&
      typeof capturedUrisParam === "string" &&
      capturedUrisParam !== "undefined"
    ) {
      try {
        // const decoded = decodeURIComponent(capturedUrisParam);
        const uris = JSON.parse(capturedUrisParam) as string[];
        if (Array.isArray(uris)) {
          setSelectedImages((prev) => [...prev, ...uris]);
        }
      } catch (e) {
        console.error("파싱 실패:", e, capturedUrisParam);
      }
    }
    router.setParams({ capturedUris: undefined });
  }, [capturedUrisParam]);

  /* 갤러리에서 이미지 선택 */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages((prevImages) => [
        ...prevImages,
        ...result.assets.map((asset) => asset.uri),
      ]);
    }
  };

  /* 이미지 기반으로 생성중 모델 아이템으로 추가 */
  const generateModel = async () => {
    if (scheduling) return;

    setScheduling(true);
    if (selectedImages.length === 0) {
      alert("Please select or capture images first.");
      return;
    }
    const thumbnail = selectedImages[0];
    try {
      addGeneratingModel(thumbnail);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다");

      const { data, error } = await supabase
        .from("models")
        .insert([
          {
            user_id: user.id,
            name: "New Momento",
            thumbnail_url: thumbnail,
            model_url:
              "https://qysttxnnfsarkobrxkuu.supabase.co/storage/v1/object/public/models/boka_mapped_no_VColor.glb",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Insert Error: ", error);
        Alert.alert("모델 생성 처리 중 문제가 발생했어요.");
      }

      setSelectedImages([]);
      router.navigate("/profile");
    } catch (e) {
      console.error(e);

      Alert.alert("오류", "모델 생성 처리 중 문제가 발생했어요.");
    } finally {
      setScheduling(false);
    }
  };

  return (
    <YStack bg={"$bgColor"} flex={1} p="8%" gap={20} px={16} pt={20}>
      <Stack.Screen options={{ title: "Scan" }} />
      <Text fos={20} fow={"bold"}>
        3D 모델 생성
      </Text>

      <XStack jc={"space-between"} mb={10}>
        <DefaultButton textProps={{ fos: 14 }} onPress={pickImage}>
          갤러리에서 사진 선택
        </DefaultButton>
        <DefaultButton
          textProps={{ fos: 14 }}
          onPress={() => router.push("/scan/camera")}
        >
          멀티뷰 이미지 촬영
        </DefaultButton>
      </XStack>

      {selectedImages.length > 0 && (
        <YStack
          width="100%"
          mb={10}
          borderWidth={1}
          borderColor="$gray8"
          p={10}
          br={10}
        >
          <Paragraph>선택된 이미지 ({selectedImages.length}장) </Paragraph>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedImages.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{ width: 100, height: 100, margin: 5, borderRadius: 10 }}
              />
            ))}
          </ScrollView>
          {selectedImages.length > 0 && (
            <Button
              bg={"$colorTransparent"}
              onPress={() => setSelectedImages([])}
              color="red"
            >
              초기화
            </Button>
          )}
        </YStack>
      )}

      {selectedImages.length > 0 && (
        <>
          <DefaultButton onPress={generateModel}>모멘토 생성</DefaultButton>
        </>
      )}
    </YStack>
  );
}
