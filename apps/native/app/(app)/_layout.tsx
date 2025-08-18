import { Drawer } from "expo-router/drawer";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import CustomDrawerContent from "../../src/components/layout/CustomDrawer";

export default function AppLayout() {
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
        initialRouteName="(home)/home"
      >
        <Drawer.Screen name="(home)/home" options={{ title: "Home" }} />
        <Drawer.Screen name="about" options={{ title: "About" }} />
        <Drawer.Screen name="game/create-player" options={{ title: "Create Player" }} />
        <Drawer.Screen name="game/play" options={{ title: "Play" }} />
      </Drawer>
    </ThemeProvider>
  );
}
