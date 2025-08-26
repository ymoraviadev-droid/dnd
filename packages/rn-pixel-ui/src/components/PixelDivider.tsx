import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { pixelTheme as T } from "../theme/theme";

export type PixelDividerProps = {
    variant?: "neutral" | "primary" | "accent" | "success" | "warning" | "danger" | "glow";
    stroke?: "solid" | "dashed" | "dotted";
    size?: "xs" | "sm" | "md" | "lg";
    inset?: boolean;
    orientation?: "horizontal" | "vertical";
    withText?: string | React.ReactNode;
    align?: "left" | "center" | "right";
    gap?: number;
    customColor?: string;
    containerStyle?: import("react-native").StyleProp<ViewStyle>;
    lineStyle?: import("react-native").StyleProp<ViewStyle>;
    textStyle?: import("react-native").StyleProp<TextStyle>;
};

const thicknessMap = { xs: 1, sm: 2, md: 4, lg: 6 } as const;

const getColor = (variant: NonNullable<PixelDividerProps["variant"]>) => {
    switch (variant) {
        case "primary": return T.colors.primary;
        case "accent": return T.colors.accent;
        case "success": return T.colors.success;
        case "warning": return T.colors.warning;
        case "danger": return T.colors.danger;
        case "glow": return T.colors.glow;
        default: return T.colors.grayDark;
    }
};

export const PixelDivider: React.FC<PixelDividerProps> = ({
    variant = "neutral",
    stroke = "solid",
    size = "sm",
    inset = false,
    orientation = "horizontal",
    withText,
    align = "center",
    gap,
    customColor,
    containerStyle,
    lineStyle,
    textStyle,
}) => {
    const color = customColor ?? getColor(variant);
    const thickness = thicknessMap[size];
    const isH = orientation === "horizontal";
    const pad = gap ?? T.spacing.md;

    const lineBase: ViewStyle = isH
        ? { height: 0, borderTopWidth: thickness }
        : { width: 0, borderLeftWidth: thickness };

    const lineExtra: ViewStyle = {
        borderColor: color,
        borderRadius: T.borderRadius.pixel,
        borderStyle: stroke,
        ...(variant === "glow"
            ? {
                shadowColor: T.shadows.glow.shadowColor,
                shadowOpacity: T.shadows.glow.shadowOpacity,
                shadowRadius: T.shadows.glow.shadowRadius,
                shadowOffset: T.shadows.glow.shadowOffset,
                elevation: T.shadows.glow.elevation,
            }
            : null),
    };

    const containerDims: ViewStyle = isH
        ? { width: inset ? "88%" : "100%" }
        : { height: inset ? "88%" : "100%" };

    // --- No text ---
    if (!withText) {
        return (
            <View
                style={[
                    isH ? styles.hContainer : styles.vContainer,
                    containerDims,
                    containerStyle,
                ]}
            >
                <View
                    style={[
                        lineBase,
                        lineExtra,
                        isH ? { width: "100%" } : { height: "100%" }, // ensure visibility
                        lineStyle,
                    ]}
                />
            </View>
        );
    }

    // --- With text ---
    const justify =
        align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";

    const Line = () => (
        <View style={[lineBase, lineExtra, { flex: 1 }, lineStyle]} />
    );

    if (isH) {
        return (
            <View
                style={[
                    styles.hContainer,
                    { flexDirection: "row", alignItems: "center", justifyContent: justify },
                    containerDims,
                    containerStyle,
                ]}
            >
                {align !== "left" && <Line />}
                <Text
                    style={[
                        {
                            fontFamily: T.fonts.regular,
                            color: T.colors.textSecondary,
                            fontSize: T.text?.base?.fontSize,
                            letterSpacing: T.text?.base?.letterSpacing,
                            marginHorizontal: pad,
                        },
                        textStyle,
                    ]}
                >
                    {withText}
                </Text>
                {align !== "right" && <Line />}
            </View>
        );
    }

    // --- Vertical with text ---
    return (
        <View
            style={[
                styles.vContainer,
                { alignItems: "center", justifyContent: justify },
                containerDims,
                containerStyle,
            ]}
        >
            {align !== "left" && (
                <View style={[lineBase, lineExtra, { flex: 1 }, lineStyle]} />
            )}
            <Text
                style={[
                    {
                        transform: [{ rotate: "-90deg" }],
                        fontFamily: T.fonts.regular,
                        color: T.colors.textSecondary,
                        fontSize: T.text?.base?.fontSize,
                        letterSpacing: T.text?.base?.letterSpacing,
                        marginVertical: pad,
                    },
                    textStyle,
                ]}
            >
                {withText}
            </Text>
            {align !== "right" && (
                <View style={[lineBase, lineExtra, { flex: 1 }, lineStyle]} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    hContainer: { width: "100%" },
    vContainer: { height: "100%", width: "100%" }, // added width
});
