import { Drawer } from "expo-router/drawer";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";

export default function Layout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Drawer
        screenOptions={{
          drawerStyle: { backgroundColor: "#121212" },
          drawerActiveTintColor: "#ffffff",
          drawerInactiveTintColor: "#888888",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#ffffff",
        }}
      >
        <Drawer.Screen name="(about)/about" options={{ title: "About" }} />
        <Drawer.Screen name="(login)/login" options={{ title: "Login" }} />
        <Drawer.Screen name="index" options={{ title: "Home" }} />
      </Drawer>
    </ThemeProvider>
  );
}
