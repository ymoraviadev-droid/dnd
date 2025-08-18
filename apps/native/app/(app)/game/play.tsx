import { Text, View } from "react-native";

const PlayScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, color: "white" }}>Play</Text>
    </View>
  );
};

export default PlayScreen;
