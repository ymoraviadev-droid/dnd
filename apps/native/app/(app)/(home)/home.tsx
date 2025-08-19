import {
  ImageBackground,
  Text,
  View,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import useAuth from "../../../src/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import PixelButton from "../../../src/components/forms/PixelButton";
import { pixelTheme } from "../../../src/themes/pixelTheme";
import useGame from "../../../src/hooks/useGame";
import { useEffect, useState } from "react";
import { IPlayer } from "@dnd/types";

const HomeScreen = () => {
  const { user } = useAuth();
  const { players, setSelectedPlayer } = useGame();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const [playersList, setPlayersList] = useState<IPlayer[] | null>(
    !players ? [] : Array.isArray(players) ? players : [players]
  );

  const handlePlayerChange = (direction: "next" | "prev") => {
    if (!playersList || playersList.length <= 1) return;

    setPlayersList((prev) => {
      const list = [...(prev ?? [])];

      if (direction === "prev") {
        const popped = list.pop();
        if (popped) {
          list.unshift(popped);
        }
      }
      if (direction === "next") {
        const popped = list.shift();
        if (popped) {
          list.push(popped);
        }
      }
      return list;
    });
  };

  useEffect(() => {
    if (!playersList || playersList.length === 0) return;

    setSelectedPlayer(playersList[0]);
  }, [playersList, setSelectedPlayer, user]);

  if (!user) return null;
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: pixelTheme.colors.background }}>
      <ImageBackground
        source={require("../../../assets/images/game/home_screen.png")}
        style={styles.bg}
        resizeMode="contain"
        imageStyle={{
          marginBottom: 100,
        }}
      >
        <View pointerEvents="none" style={styles.overlay} />

        <View style={styles.container}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Select Your Hero</Text>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerRow}>
              <Pressable
                accessibilityLabel="Previous hero"
                onPress={() => handlePlayerChange("prev")}
                style={({ pressed }) => [
                  styles.arrowBtn,
                  pressed && styles.arrowBtnPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={pixelTheme.colors.primary}
                />
              </Pressable>

              <View style={styles.card}>
                <View style={styles.cardBorder}>
                  <View style={styles.playerImageBox}>
                    <Text style={styles.playerImageText}>
                      {playersList?.[0]?.name ?? ""}
                    </Text>
                    <Text style={styles.playerImageText}>
                      {playersList?.[0]?.level ?? ""}
                    </Text>
                    <View style={[styles.pixelCorner, styles.topLeft]} />
                    <View style={[styles.pixelCorner, styles.topRight]} />
                    <View style={[styles.pixelCorner, styles.bottomLeft]} />
                    <View style={[styles.pixelCorner, styles.bottomRight]} />
                  </View>
                </View>
              </View>

              <Pressable
                accessibilityLabel="Next hero"
                onPress={() => handlePlayerChange("next")}
                style={({ pressed }) => [
                  styles.arrowBtn,
                  pressed && styles.arrowBtnPressed,
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={28}
                  color={pixelTheme.colors.primary}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonsSection}>
            <View style={styles.secondaryButtons}>
              <PixelButton
                label="Start"
                onPress={() => router.push("/game/campaigns-lobby")}
                variant="success"
                size="medium"
              />
              <PixelButton
                label="Create Player"
                onPress={() => router.push("/game/create-player")}
                variant="secondary"
                size="medium"
              />
              <PixelButton
                label="Delete Player"
                onPress={() => {}}
                variant="danger"
                size="medium"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Centered Title Section
  titleSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    color: pixelTheme.colors.accent,
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: pixelTheme.fonts.regular,
    textShadowColor: "#000",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    marginBottom: 12,
  },

  // Centered Picker Section
  pickerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingTop: 20,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  arrowBtn: {
    padding: 16,
    borderWidth: 3,
    borderColor: pixelTheme.colors.primary,
    backgroundColor: "rgba(0, 212, 255, 0.15)",
    marginHorizontal: 12,
  },
  arrowBtnPressed: {
    backgroundColor: "rgba(0, 212, 255, 0.4)",
    transform: [{ scale: 0.95 }],
  },

  // Centered Card
  card: {
    alignItems: "center",
  },
  cardBorder: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderWidth: 4,
    borderColor: pixelTheme.colors.primary,
    position: "relative",
    alignItems: "center",
  },
  playerImageBox: {
    width: 160,
    height: 160,
    backgroundColor: "rgba(26, 26, 46, 0.8)",
    borderWidth: 4,
    borderColor: pixelTheme.colors.gray,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 16,
  },
  playerImageText: {
    color: pixelTheme.colors.grayLight,
    fontSize: 18,
    letterSpacing: 3,
    fontFamily: pixelTheme.fonts.regular,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  playerName: {
    fontSize: 14,
    color: pixelTheme.colors.accent,
    letterSpacing: 1.5,
    fontFamily: pixelTheme.fonts.regular,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },

  // Pixel decoration corners
  pixelCorner: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: pixelTheme.colors.primary,
  },
  topLeft: {
    top: -2,
    left: -2,
  },
  topRight: {
    top: -2,
    right: -2,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
  },

  // Properly Aligned Button Section
  buttonsSection: {
    alignItems: "center",
    paddingBottom: 70,
    width: "100%",
  },
  secondaryButtons: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
    width: "70%",
  },
});

export default HomeScreen;
