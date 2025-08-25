import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import AuthProvider from "../src/store/auth/Auth.provider";
import useAuth from "../src/hooks/useAuth";
import GameProvider from "../src/store/game/Game.provider";
import { PixelThemeProvider, PixelToastContainer } from "rn-pixel-ui";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { user, loading } = useAuth();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const emptyContent = <View style={{ flex: 1, backgroundColor: "#0f0f23" }} />;

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading || !fontsLoaded) {
    return emptyContent;
  }

  if (!user) {
    return (
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PixelThemeProvider theme={{
      fonts: {
        regular: "PressStart2P_400Regular"
      },
    }}>
      <AuthProvider>
        <GameProvider>
          <RootStack />
          <PixelToastContainer />
        </GameProvider>
      </AuthProvider>
    </PixelThemeProvider>
  );
}
