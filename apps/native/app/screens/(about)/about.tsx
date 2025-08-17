import { Text, View } from "react-native";
import check from "../../hooks/check";

export default function About() {
  check();
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
}
