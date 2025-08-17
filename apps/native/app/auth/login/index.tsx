import { Text, View } from "react-native";

const LoginScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, color: "white" }}>Login</Text>
    </View>
  );
};

export default LoginScreen;
