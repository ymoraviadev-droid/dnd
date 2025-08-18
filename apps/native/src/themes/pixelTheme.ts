export const pixelTheme = {
    colors: {
        background: "#0f0f23", // Deep space blue
        backgroundLight: "#1a1a2e", // Lighter background variant
        text: "#ffffff",
        textSecondary: "#e4e4e7",

        // Primary palette - electric blue theme
        primary: "#00d4ff", // Bright cyan
        primaryDark: "#0099cc",
        primaryLight: "#33ddff",

        // Secondary palette - neon accent
        accent: "#ff6b35", // Neon orange
        accentDark: "#632d19ff",
        accentLight: "#ff8a5e",

        // Additional colors
        success: "#00ff88", // Neon green
        warning: "#ffdd00", // Electric yellow
        danger: "#ff3366", // Hot pink

        // Neutral tones
        gray: "#666a73",
        grayLight: "#9ca3af",
        grayDark: "#374151",

        // Special effects
        glow: "#00ffff",
        shadow: "#000011",
    },

    fonts: {
        regular: "PressStart2P_400Regular",
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24,
    },

    borderRadius: {
        none: 0,
        pixel: 2, // Minimal radius for pixel look
    },

    shadows: {
        pixel: {
            shadowColor: "#000011",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.8,
            shadowRadius: 0,
            elevation: 8,
        },
        glow: {
            shadowColor: "#00ffff",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 10,
        },
    },
};