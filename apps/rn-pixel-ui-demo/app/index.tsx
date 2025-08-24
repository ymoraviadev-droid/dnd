import { View } from "react-native";
import {PixelButton, PixelToast } from "rn-pixel-ui"

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PixelButton label="Success Button" variant="success" onPress={() => PixelToast.success("Pressed!")}/>
    </View>
  );
}
