import { createTamagui, type CreateTamaguiProps } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { shorthands } from "@tamagui/shorthands";

// const appConfig = {
//   ...defaultConfig,
//   shorthands,
//   themes: {
//     ...defaultConfig.themes,
//       pointColor: "#f99101",
//       pointBtnColor: "#d35313",
//       bgColor: "#fafaf8",
//       blackColor: "#1d1d1d",
//       btnWhiteColor: "#fffeff",
//       btnBorderColor: "#e8e8e8",
//     },
//   };

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  shorthands,
  tokens: {
    ...defaultConfig.tokens,
    color: {
      pointColor: "#f99101",
      pointBtnColor: "#d35313",
      bgColor: "#fafaf8",
      blackColor: "#1d1d1d",
      btnWhiteColor: "#fffeff",
      btnBorderColor: "#e8e8e8",
    },
  },
  settings: {
    onlyAllowShorthands: false,
  },
});
export type AppTamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default tamaguiConfig;
