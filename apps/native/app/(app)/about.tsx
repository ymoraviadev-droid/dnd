import { Text, View } from "react-native";

const AboutScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, color: "white" }}>About</Text>
    </View>
  );
};

export default AboutScreen;
