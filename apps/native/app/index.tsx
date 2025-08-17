import { Text, View } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import useAuth from "../src/hooks/useAuth";

const HomeScreen = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 5);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return user ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, color: "white" }}>Welcome!!!!</Text>
    </View>
  ) : null;
};

export default HomeScreen;
