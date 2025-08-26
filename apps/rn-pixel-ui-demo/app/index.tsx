import { View } from "react-native";
import { PixelAlert, PixelButton, PixelDivider, PixelToast } from "rn-pixel-ui"

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
      <PixelButton label="Primary Button" variant="primary" onPress={() => PixelToast.info("Info Variant!")} />
      <PixelButton label="Success Button" variant="success" onPress={() => PixelToast.success("Success Variant!")} />
      <PixelButton label="Secondary Button" variant="secondary" onPress={() => PixelToast.error("Error Variant!")} />
      <PixelButton label="Danger Button" variant="danger" onPress={() => PixelToast.error("Error Variant!")} />
      <PixelButton label="Ghost Button" variant="ghost" onPress={() => {
        PixelAlert.show({
          title: "Confirm Action",
          content: "Are you sure you want to proceed with this action?",
          variant: "confirm",
          isQuestion: true,
          onYes: () => new Promise((resolve) => {
            setTimeout(() => {
              PixelToast.success("Action Confirmed!");
              resolve();
            }, 2000);
          }),
          onNo: () => {
            PixelToast.error("Action Cancelled!");
          }
        });
      }} />

      <PixelDivider />
      <PixelDivider variant="primary" stroke="dashed" size="md" />
      <PixelDivider variant="glow" withText="INVENTORY" />
      <PixelDivider variant="accent" withText="STATS" align="left" inset />

      <View style={{ height: 120 }}>
        <PixelDivider orientation="vertical" variant="success" size="lg" />
      </View>
    </View>
  );
}
