import { View } from "react-native";
import {PixelButton, PixelToast } from "rn-pixel-ui"

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        backgroundColor: "black"
      }}
    >
      <PixelButton label="Primary Button" variant="primary" onPress={() => PixelToast.info("Info Variant!")}/>
      <PixelButton label="Success Button" variant="success" onPress={() => PixelToast.success("Success Variant!")}/>
      <PixelButton label="Secondary Button" variant="secondary" onPress={() => PixelToast.error("Error Variant!")}/>
      <PixelButton label="Danger Button" variant="danger" onPress={() => PixelToast.error("Error Variant!")}/>
      <PixelButton label="Ghost Button" variant="ghost" onPress={() => PixelToast.show("Show Variant!")}/>
    </View>
  );
}
