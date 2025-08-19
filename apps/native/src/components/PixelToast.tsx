import { Animated, StyleSheet, Text, Dimensions } from "react-native";
import { pixelTheme } from "../themes/pixelTheme";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PixelToastShowFn,
  PixelToastTypeFns,
  TOAST_TYPES,
  ToastRefType,
  ToastType,
} from "../types/ToastTypes";

const SCREEN_WIDTH = Dimensions.get("window").width;

const DURATION = {
  SHORT: 2000,
  LONG: 3500,
};

let toastRef: ToastRefType | null = null;

const PixelToast: {
  TYPES: typeof TOAST_TYPES;
  DURATION: typeof DURATION;
  show: PixelToastShowFn;
  success: PixelToastTypeFns;
  error: PixelToastTypeFns;
  warning: PixelToastTypeFns;
  info: PixelToastTypeFns;
} = {
  TYPES: TOAST_TYPES,
  DURATION,

  show: (message, type: ToastType = "DEFAULT", duration = DURATION.SHORT) => {
    if (toastRef?.current) {
      toastRef.current!.show(message, type, duration);
    }
  },

  success: (message, duration) => PixelToast.show(message, "SUCCESS", duration),
  error: (message, duration) => PixelToast.show(message, "ERROR", duration),
  warning: (message, duration) => PixelToast.show(message, "WARNING", duration),
  info: (message, duration) => PixelToast.show(message, "INFO", duration),
};

const PixelToastComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState(TOAST_TYPES.DEFAULT);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hide = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  }, [animatedValue]);

  interface ShowFn {
    (newMessage: string, newType?: ToastType, duration?: number): void;
  }

  const show: ShowFn = useCallback(
    (newMessage, newType = TOAST_TYPES.DEFAULT, duration = DURATION.SHORT) => {
      // Clear any existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Update state
      setMessage(newMessage);
      setType(newType);
      setIsVisible(true);

      // Animate in
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto hide after duration
      hideTimeoutRef.current = setTimeout(() => {
        hide();
      }, duration);
    },
    [animatedValue, hide]
  );

  // Set up the global reference
  useEffect(() => {
    if (!toastRef) {
      toastRef = { current: null };
    }
    toastRef.current = { show };

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (toastRef?.current && toastRef.current.show === show) {
        toastRef.current = null;
      }
    };
  }, [show]);

  const getToastStyle = useCallback(() => {
    const baseStyle = styles.toastContainer;

    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return [baseStyle, styles.successToast];
      case TOAST_TYPES.ERROR:
        return [baseStyle, styles.errorToast];
      case TOAST_TYPES.WARNING:
        return [baseStyle, styles.warningToast];
      case TOAST_TYPES.INFO:
        return [baseStyle, styles.infoToast];
      default:
        return [baseStyle, styles.defaultToast];
    }
  }, [type]);

  const getGlowStyle = useCallback(() => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return { ...styles.glowEffect, shadowColor: pixelTheme.colors.success };
      case TOAST_TYPES.ERROR:
        return { ...styles.glowEffect, shadowColor: pixelTheme.colors.danger };
      case TOAST_TYPES.WARNING:
        return { ...styles.glowEffect, shadowColor: pixelTheme.colors.warning };
      case TOAST_TYPES.INFO:
        return { ...styles.glowEffect, shadowColor: pixelTheme.colors.primary };
      default:
        return { ...styles.glowEffect, shadowColor: pixelTheme.colors.glow };
    }
  }, [type]);

  if (!isVisible) {
    return null;
  }

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Animated.View style={[getToastStyle(), getGlowStyle()]}>
        <Animated.View style={styles.pixelBorder}>
          <Text style={styles.toastText} numberOfLines={3}>
            {message}
          </Text>
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
    borderColor: pixelTheme.colors.primary,
  },
  successToast: {
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderColor: pixelTheme.colors.success,
  },
  errorToast: {
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderColor: pixelTheme.colors.danger,
  },
  warningToast: {
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderColor: pixelTheme.colors.warning,
  },
  infoToast: {
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderColor: pixelTheme.colors.primary,
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

export default PixelToastComponent;
