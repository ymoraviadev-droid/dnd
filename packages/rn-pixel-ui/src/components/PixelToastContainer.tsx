import { Animated, StyleSheet, Text, Dimensions } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { PixelToastShowFn, TOAST_TYPES, ToastType } from "../types/ToastTypes";
import { pixelTheme } from "../theme/theme";
import { setToastRef, DURATION } from "../utils/PixelToast";

const SCREEN_WIDTH = Dimensions.get("window").width;

const PixelToastContainer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>(TOAST_TYPES.DEFAULT);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.timing(animatedValue, { toValue: 0, duration: 300, useNativeDriver: true })
      .start(() => setIsVisible(false));
  }, [animatedValue]);

  const show: PixelToastShowFn = useCallback(
    (newMessage, newType = TOAST_TYPES.DEFAULT, duration = DURATION.SHORT) => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

      setMessage(newMessage);
      setType(newType);
      setIsVisible(true);

      Animated.timing(animatedValue, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      hideTimeoutRef.current = setTimeout(hide, duration);
    },
    [animatedValue, hide]
  );

  useEffect(() => {
    setToastRef({ current: { show } });
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      setToastRef(null);
    };
  }, [show]);

  const getToastStyle = useCallback(() => {
    const base = styles.toastContainer;
    switch (type) {
      case TOAST_TYPES.SUCCESS: return [base, styles.successToast];
      case TOAST_TYPES.ERROR: return [base, styles.errorToast];
      case TOAST_TYPES.WARNING: return [base, styles.warningToast];
      case TOAST_TYPES.INFO: return [base, styles.infoToast];
      default: return [base, styles.defaultToast];
    }
  }, [type]);

  const getGlowStyle = useCallback(() => {
    switch (type) {
      case TOAST_TYPES.SUCCESS: return { ...styles.glowEffect, shadowColor: pixelTheme.colors.success };
      case TOAST_TYPES.ERROR: return { ...styles.glowEffect, shadowColor: pixelTheme.colors.danger };
      case TOAST_TYPES.WARNING: return { ...styles.glowEffect, shadowColor: pixelTheme.colors.warning };
      case TOAST_TYPES.INFO: return { ...styles.glowEffect, shadowColor: pixelTheme.colors.primary };
      default: return { ...styles.glowEffect, shadowColor: pixelTheme.colors.glow };
    }
  }, [type]);

  if (!isVisible) return null;

  const translateY = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] });
  const opacity = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], opacity }]}>
      <Animated.View style={[getToastStyle(), getGlowStyle()]}>
        <Animated.View style={styles.pixelBorder}>
          <Text style={styles.toastText} numberOfLines={3}>{message}</Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: pixelTheme.spacing.lg,
    right: pixelTheme.spacing.lg,
    zIndex: 9999,
    alignItems: "center",
  },
  toastContainer: {
    minHeight: 60,
    maxWidth: SCREEN_WIDTH - pixelTheme.spacing.lg * 2,
    minWidth: 300,
    paddingHorizontal: pixelTheme.spacing.lg,
    paddingVertical: pixelTheme.spacing.md,
    borderRadius: pixelTheme.borderRadius.pixel,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  pixelBorder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  glowEffect: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  defaultToast: {
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderColor: pixelTheme.colors.grayLight,
  },
  successToast: {
    backgroundColor: pixelTheme.colors.backgroundLight, // greenish tint
    borderColor: pixelTheme.colors.success,
  },
  errorToast: {
    backgroundColor: pixelTheme.colors.backgroundLight,  // reddish tint
    borderColor: pixelTheme.colors.danger,
  },
  warningToast: {
    backgroundColor: pixelTheme.colors.backgroundLight, // yellowish tint
    borderColor: pixelTheme.colors.warning,
  },
  infoToast: {
    backgroundColor: pixelTheme.colors.backgroundLight, // bluish tint
    borderColor: pixelTheme.colors.primaryDark,
  },
  toastText: {
    color: pixelTheme.colors.text,
    fontSize: 12,
    fontFamily: pixelTheme.fonts.regular,
    textAlign: "center",
    lineHeight: 16,
    textShadowColor: pixelTheme.colors.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});

export default PixelToastContainer;
