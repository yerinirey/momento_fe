import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { YStack, XStack } from "tamagui";
import { H2, Paragraph } from "tamagui";
import { useModelGeneration } from "../../context/ModelGenerationProvider";

export default function ScanScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { addGeneratingModel } = useModelGeneration();
  const params = useLocalSearchParams();
  const capturedUrisParam = params?.capturedUris;
  console.log(capturedUrisParam);
  // 🔄 촬영 결과를 반영
  useEffect(() => {
    if (capturedUrisParam && typeof capturedUrisParam === "string") {
      try {
        const decoded = decodeURIComponent(capturedUrisParam);
        const uris = JSON.parse(capturedUrisParam) as string[];
        if (Array.isArray(uris)) {
          setSelectedImages((prev) => [...prev, ...uris]);
        }
      } catch (e) {
        console.error("capturedUris 파싱 실패:", e);
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
  const generateModel = () => {
    if (selectedImages.length > 0) {
      addGeneratingModel(selectedImages[0]);
      router.navigate("/profile");
    } else {
      alert("Please select or capture images first.");
    }
  };

  return (
    <YStack flex={1} jc="center" ai="center" p="10%">
      <Stack.Screen options={{ title: "Scan" }} />
      <Text>Scan for 3D Model</Text>

      <XStack mb="$4">
        <Button title="Pick Images from Gallery" onPress={pickImage} />
        <Button
          title="Open Camera"
          onPress={() => router.push("/scan/camera")}
        />
      </XStack>

      {selectedImages.length > 0 && (
        <YStack width="100%" marginBottom="$4">
          <Paragraph>Selected Images:</Paragraph>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedImages.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{ width: 100, height: 100, margin: 5, borderRadius: 10 }}
              />
            ))}
          </ScrollView>
        </YStack>
      )}

      {selectedImages.length > 0 && (
        <Button title="Generate Model" onPress={generateModel} />
      )}
    </YStack>
  );
}
