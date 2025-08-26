import * as React from "react";
import { Modal, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { pixelTheme } from "../theme/theme";
import { PixelAlert } from "../utils/PixelAlert";
import { useEffect, useReducer, useState } from "react";
import PixelButton from "../components/PixelButton"; // <- adjust import path

export const PixelAlertContainer = () => {
    const [, force] = useReducer((x) => x + 1, 0);
    const [loading, setLoading] = useState<"yes" | "no" | null>(null);

    useEffect(() => {
        const unsubscribe = PixelAlert.subscribe(force); // must return () => void
        return unsubscribe;
    }, []);

    const a = PixelAlert.getCurrent();
    if (!a) return null;

    const { title, content, variant = "info", isQuestion = false, yesText, noText, icon, onYes, onNo } = a;

    const palette = {
        info: pixelTheme.colors.primaryLight,
        success: pixelTheme.colors.success,
        warning: pixelTheme.colors.warning,
        error: pixelTheme.colors.danger,
        confirm: pixelTheme.colors.primary,
    } as const;

    const defaults = {
        yes: isQuestion ? (yesText ?? (variant === "confirm" ? "Yes" : "OK")) : (yesText ?? "OK"),
        no: noText ?? "Cancel",
    };

    const iconNode =
        icon ??
        ({
            info: <Ionicons name="information-circle-outline" size={22} color={palette.info} />,
            success: <Ionicons name="checkmark-circle-outline" size={22} color={palette.success} />,
            warning: <Ionicons name="warning-outline" size={22} color={palette.warning} />,
            error: <Ionicons name="close-circle-outline" size={22} color={palette.error} />,
            confirm: <Ionicons name="help-circle-outline" size={22} color={palette.confirm} />,
        } as const)[variant];

    const doYes = async () => {
        try { setLoading("yes"); await onYes?.(); } finally { setLoading(null); PixelAlert.next(); }
    };
    const doNo = async () => {
        try { setLoading("no"); await onNo?.(); } finally { setLoading(null); PixelAlert.next(); }
    };

    // map alert variant -> PixelButton variant
    const yesButtonVariant: React.ComponentProps<typeof PixelButton>["variant"] =
        variant === "error" ? "danger" :
            variant === "success" ? "success" :
                variant === "warning" ? "secondary" : "primary";

    return (
        <Modal visible transparent animationType="fade" onRequestClose={PixelAlert.dismiss}>
            <View style={styles.backdrop}>
                <View pointerEvents="none" style={styles.scanlines} />
                <View style={styles.frameOuter}>
                    <View style={styles.frameInner}>
                        <View style={styles.header}>
                            {iconNode}
                            <Text style={styles.title}>{title}</Text>
                        </View>

                        {typeof content === "string" ? (
                            <Text style={styles.content}>{content}</Text>
                        ) : (
                            content
                        )}

                        <View style={styles.actions}>
                            {isQuestion && (
                                <View style={styles.btnWrap}>
                                    <PixelButton
                                        label={defaults.no}
                                        onPress={doNo}
                                        variant="ghost"
                                        size="medium"
                                        disabled={loading !== null}
                                    />
                                    {loading === "no" && (
                                        <View style={styles.loaderOverlay}>
                                            <ActivityIndicator />
                                        </View>
                                    )}
                                </View>
                            )}

                            <View style={styles.btnWrap}>
                                <PixelButton
                                    label={defaults.yes}
                                    onPress={doYes}
                                    variant={yesButtonVariant}
                                    size="medium"
                                    disabled={loading !== null}
                                />
                                {loading === "yes" && (
                                    <View style={styles.loaderOverlay}>
                                        <ActivityIndicator color={pixelTheme.colors.text} />
                                    </View>
                                )}
                            </View>
                        </View>

                    </View>
                </View>
            </View>
        </Modal>
    );
};

const T = pixelTheme;
const R = T.borderRadius.pixel;
const B = T.button?.base?.borderWidth ?? 1;
const SP = T.spacing;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,20,0.55)",
        padding: SP.lg,
        justifyContent: "center",
    },
    scanlines: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent",
        opacity: 0.06,
    },
    frameOuter: {
        backgroundColor: T.colors.background,
        borderColor: T.colors.accentDark,
        borderWidth: B,
        borderRadius: R,
        padding: B,
        ...T.shadows.pixel,
    },
    frameInner: {
        backgroundColor: T.colors.backgroundLight,
        borderColor: T.colors.grayDark,
        borderWidth: B,
        borderRadius: R,
        padding: SP.lg,
        gap: SP.md,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: SP.sm,
    },
    title: {
        fontFamily: T.fonts.regular,
        color: T.colors.text,
        fontSize: 16,
        letterSpacing: 0.5,
    },
    content: {
        fontFamily: T.fonts.regular,
        color: T.colors.textSecondary,
        fontSize: T.text?.base?.fontSize,
        letterSpacing: T.text?.base?.letterSpacing,
        lineHeight: 20,
        opacity: 0.95,
    },
    actions: {
        marginTop: SP.md,
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: SP.sm,
    },

    // button with loader overlay
    btnWrap: {
        position: "relative",
    },
    loaderOverlay: {
        position: "absolute",
        inset: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: 0, // match PixelButton
    },
});
