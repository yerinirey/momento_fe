import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";

export const tamaguiConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      pointColor: "#f99101",
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
