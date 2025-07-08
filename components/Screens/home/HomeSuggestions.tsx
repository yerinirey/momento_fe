import { Dimensions } from "react-native";
import { Image, ScrollView, Text, YStack } from "tamagui";

import { default as IMG_AD_1 } from "@/assets/home-func-1.png";
import { GradientBackground } from "@/components/Shared/GradientBackground";
const images = [IMG_AD_1, IMG_AD_1, IMG_AD_1];

export function HomeSuggestions() {
  return (
    <YStack pt={10} w={Dimensions.get("window").width}>
      <Text ml={20} fontSize={24} fow={"bold"}>
        기능 설명란
      </Text>
      <ScrollView
        horizontal
        mt={10}
        mb={10}
        showsHorizontalScrollIndicator={false}
      >
        {images.map((image, index) => (
          <YStack
            key={index}
            bg={"white"}
            w={150}
            h={200}
            br={4}
            ml={20}
            shac={"$colorShadow"}
            shof={{ width: 3, height: 3 }}
            shop={0.4}
            shar={6}
          >
            <Text fow={"bold"} px={10} pt={10} pb={26}>
              {index + 1}
            </Text>
            <Image
              source={{ uri: image }}
              w={"100%"}
              h={150}
              bbrr={4}
              bblr={4}
            />
          </YStack>
        ))}
      </ScrollView>
      <GradientBackground type="card" />
    </YStack>
  );
}
