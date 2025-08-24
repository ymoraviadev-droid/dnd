import { Stack } from "expo-router";
import { PixelThemeProvider, PixelToastContainer } from "rn-pixel-ui";

function MyStack() {
  return <Stack />;
}

export default function RootLayout() {
  return (
    <PixelThemeProvider>
      <MyStack />
      <PixelToastContainer />
    </PixelThemeProvider>
  );
}
