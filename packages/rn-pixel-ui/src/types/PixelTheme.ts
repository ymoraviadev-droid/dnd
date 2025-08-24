import { ViewStyle, TextStyle } from "react-native";

export type PixelTheme = {
  colors: {
    background: string; backgroundLight: string;
    text: string; textSecondary: string;
    primary: string; primaryDark: string; primaryLight: string;
    accent: string; accentDark: string; accentLight: string;
    success: string; warning: string; danger: string;
    gray: string; grayLight: string; grayDark: string;
    glow: string; shadow: string;
  };
  fonts: { regular: string };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  borderRadius: { none: number; pixel: number };
  shadows: {
    pixel: ViewStyle;
    glow: ViewStyle;
  };
  text?: { base?: TextStyle };
  button?: { base?: ViewStyle };
};