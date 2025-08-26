import { Stack } from "expo-router";
import { PixelAlertContainer, PixelThemeProvider, PixelToastContainer } from "rn-pixel-ui";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { View } from "react-native";

function MyStack() {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const emptyContent = <View style={{ flex: 1, backgroundColor: "#0f0f23" }} />;;

  if (!fontsLoaded) {
    return emptyContent;
  }

  return <Stack />;
}

export default function RootLayout() {
  return (
    <PixelThemeProvider>
      <MyStack />
      <PixelToastContainer />
      <PixelAlertContainer />
    </PixelThemeProvider>
  );
}
