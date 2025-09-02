import { Product } from "@/types/product";
import { Image, XStack, YStack, Button } from "tamagui";

interface Props {
  product: Product;
  onPress: VoidFunction;
  variant?: "list" | "grid";
}

export function ProductCard({ product, onPress, variant = "grid" }: Props) {
  const imageAspect = variant === "grid" ? 1 : 4 / 3;
  return (
    <Button unstyled onPress={onPress} w="100%" p={0} br={10}>
      <YStack w="100%">
        <XStack w={"100%"} br={10} overflow="hidden">
          <Image
            src={product.imageUrl ?? ""}
            aspectRatio={imageAspect}
            objectFit="cover"
            w={"100%"}
          />
        </XStack>
      </YStack>
    </Button>
  );
}
