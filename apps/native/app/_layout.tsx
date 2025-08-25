import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import AuthProvider from "../src/store/auth/Auth.provider";
import useAuth from "../src/hooks/useAuth";
import GameProvider from "../src/store/game/Game.provider";
import { PixelThemeProvider, PixelToastContainer } from "rn-pixel-ui";

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return null;
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
    <PixelThemeProvider>
      <AuthProvider>
        <GameProvider>
          <RootStack />
          <PixelToastContainer />
        </GameProvider>
      </AuthProvider>
    </PixelThemeProvider>
  );
}
