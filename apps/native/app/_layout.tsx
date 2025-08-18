import { Drawer } from "expo-router/drawer";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import CustomDrawerContent from "../src/components/layout/CustomDrawer";
import AuthProvider from "../src/store/auth/Auth.provider";
import useAuth from "../src/hooks/useAuth";
import { useEffect } from "react";

export default function RootLayout() {
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) return;
    const autoLogin = async () => {
      await login();
    };
    autoLogin();
  }, [login, user]);

  return (
    <AuthProvider>
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
          <Drawer.Screen name="auth/profile/index" options={{ title: "Profile" }} />

          <Drawer.Screen
            name="game/create-player/index"
            options={{ title: "Create Player" }}
          />
          <Drawer.Screen name="game/play/index" options={{ title: "Play" }} />
        </Drawer>
      </ThemeProvider>
    </AuthProvider>
  );
}
