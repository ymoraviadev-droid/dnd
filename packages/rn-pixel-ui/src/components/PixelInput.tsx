import { forwardRef } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { pixelTheme } from "../theme/theme";

type PixelInputProps = TextInputProps & {
  label: string;
};

const PixelInput = forwardRef<TextInput, PixelInputProps>((props, ref) => {
  const { label, style, ...restProps } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          style,
          props.editable === false && styles.disabledInput, // Add disabled style
        ]}
        placeholderTextColor={pixelTheme.colors.gray}
        {...restProps}
      />
    </View>
  );
});

PixelInput.displayName = "PixelInput";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: pixelTheme.spacing.md,
    zIndex: 1,
  },
  label: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 12,
    color: pixelTheme.colors.textSecondary,
    marginBottom: 2,
    marginTop: pixelTheme.spacing.md,
    textTransform: "uppercase",
  },
  input: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 12,
    color: pixelTheme.colors.text,
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderWidth: 2,
    borderColor: pixelTheme.colors.grayDark,
    borderRadius: pixelTheme.borderRadius.pixel,
    paddingHorizontal: pixelTheme.spacing.md,
    paddingVertical: pixelTheme.spacing.sm,
    textShadowColor: pixelTheme.colors.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  disabledInput: {
    backgroundColor: pixelTheme.colors.grayDark,
    color: pixelTheme.colors.gray,
  },
});

export default PixelInput;
