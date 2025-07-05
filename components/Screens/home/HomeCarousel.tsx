import { useEffect, useRef } from "react";
import { Dimensions, FlatList } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { Image } from "tamagui";

import IMG_AD_1 from "@/assets/home-ad-1.png";
import IMG_AD_2 from "@/assets/home-ad-2.png";
import IMG_AD_3 from "@/assets/home-ad-3.png";

const images = [IMG_AD_1, IMG_AD_2, IMG_AD_3];
const { width } = Dimensions.get("window");

export function HomeCarousel() {
  const scrollX = useSharedValue(0);
  const ref = useRef<FlatList>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % images.length;
      ref.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <FlatList
      ref={ref}
      data={images}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      pagingEnabled
      renderItem={({ item }) => (
        <Animated.View style={{ width }} key={item}>
          <Image source={{ uri: item }} w={"100%"} h={250} />
        </Animated.View>
      )}
      onScroll={(event) => {
        scrollX.value = event.nativeEvent.contentOffset.x;
      }}
    />
  );
}
