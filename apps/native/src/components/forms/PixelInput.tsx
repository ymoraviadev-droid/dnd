import { forwardRef } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { pixelTheme } from "../../themes/pixelTheme";

const PixelInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
  const { style, ...restProps } = props;

  return (
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
  );
});

PixelInput.displayName = "PixelInput";

const styles = StyleSheet.create({
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
