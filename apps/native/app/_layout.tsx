import { Drawer } from "expo-router/drawer";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import CustomDrawerContent from "../src/components/CustomDrawer";

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Drawer
        drawerContent={(props: any) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: { backgroundColor: "#121212" },
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#888",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Home" }} />
        <Drawer.Screen name="about/index" options={{ title: "About" }} />
        <Drawer.Screen name="auth/login/index" options={{ title: "Login" }} />
        <Drawer.Screen name="auth/signup/index" options={{ title: "Signup" }} />
      </Drawer>
    </ThemeProvider>
  );
}
