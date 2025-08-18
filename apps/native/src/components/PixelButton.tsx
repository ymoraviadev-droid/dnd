import { Pressable, StyleSheet, Text, View } from "react-native";
import { pixelTheme } from "../themes/pixelTheme";

const PixelButton = ({
  label,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  style?: any;
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          bg: pixelTheme.colors.primary,
          border: pixelTheme.colors.primaryDark,
          text: pixelTheme.colors.background,
          shadow: pixelTheme.colors.primaryDark,
        };
      case "secondary":
        return {
          bg: pixelTheme.colors.accent,
          border: pixelTheme.colors.accentDark,
          text: pixelTheme.colors.background,
          shadow: pixelTheme.colors.accentDark,
        };
      case "danger":
        return {
          bg: pixelTheme.colors.danger,
          border: "#cc1a3d",
          text: "#ffffff",
          shadow: "#990d2e",
        };
      case "success":
        return {
          bg: pixelTheme.colors.success,
          border: "#00cc6a",
          text: pixelTheme.colors.background,
          shadow: "#009954",
        };
      case "ghost":
        return {
          bg: "transparent",
          border: pixelTheme.colors.primary,
          text: pixelTheme.colors.primary,
          shadow: "transparent",
        };
      default:
        return {
          bg: pixelTheme.colors.primary,
          border: pixelTheme.colors.primaryDark,
          text: pixelTheme.colors.background,
          shadow: pixelTheme.colors.primaryDark,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: pixelTheme.spacing.sm,
          paddingHorizontal: pixelTheme.spacing.md,
          minWidth: 100,
          fontSize: 10,
        };
      case "large":
        return {
          paddingVertical: pixelTheme.spacing.lg,
          paddingHorizontal: pixelTheme.spacing.xl,
          minWidth: 180,
          fontSize: 14,
        };
      default:
        return {
          paddingVertical: pixelTheme.spacing.md,
          paddingHorizontal: pixelTheme.spacing.lg,
          minWidth: 140,
          fontSize: 12,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View style={styles.buttonWrapper}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.btnContainer,
          {
            backgroundColor: disabled ? pixelTheme.colors.grayDark : variantStyles.bg,
            borderColor: disabled ? pixelTheme.colors.gray : variantStyles.border,
            transform:
              pressed && !disabled
                ? [{ translateX: 3 }, { translateY: 3 }]
                : [{ translateX: 0 }, { translateY: 0 }],
            opacity: disabled ? 0.6 : 1,
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            minWidth: sizeStyles.minWidth,
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.btnText,
            {
              color: disabled ? pixelTheme.colors.gray : variantStyles.text,
              fontSize: sizeStyles.fontSize,
              fontFamily: pixelTheme.fonts.regular,
              paddingTop: 10,
            },
          ]}
        >
          {label.toUpperCase()}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: "relative",
  },
  btnContainer: {
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0, // Pixel-perfect edges
    position: "relative",
    zIndex: 1,
  },
  btnText: {
    letterSpacing: 1.5,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});

export default PixelButton;
