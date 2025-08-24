import { PixelTheme } from "../types/PixelTheme";

export const pixelTheme: PixelTheme = {
  colors: {
    background: "#0f0f23",
    backgroundLight: "#1a1a2e",
    text: "#ffffff",
    textSecondary: "#e4e4e7",
    primary: "#00d4ff",
    primaryDark: "#0099cc",
    primaryLight: "#33ddff",
    accent: "#ff6b35",
    accentDark: "#632d19ff",
    accentLight: "#ff8a5e",
    success: "#1f8354ff",
    warning: "#ffdd00",
    danger: "#ff3366",
    gray: "#666a73",
    grayLight: "#9ca3af",
    grayDark: "#374151",
    glow: "#00ffff",
    shadow: "#000011"
  },
  fonts: {
    // IMPORTANT: the app must load this font family.
    regular: "PressStart2P_400Regular"
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
  borderRadius: { none: 0, pixel: 2 },
  shadows: {
    pixel: {
      shadowColor: "#000011",
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.8,
      shadowRadius: 0,
      elevation: 8
    },
    glow: {
      shadowColor: "#00ffff",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 10
    }
  },
  text: { base: { fontSize: 14, letterSpacing: 0.5 } },
  button: { base: { paddingVertical: 10, paddingHorizontal: 14, borderWidth: 2 } }
};
