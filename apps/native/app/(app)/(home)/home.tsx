import { ImageBackground, Text, View, Pressable, SafeAreaView } from "react-native";
import { router } from "expo-router";
import useAuth from "../../../src/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import PixelButton from "../../../src/components/PixelButton";
import { pixelTheme } from "../../../src/themes/pixelTheme";
import styles from "./_styles";

const HomeScreen = () => {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const { user } = useAuth();
  if (!user) return null;
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: pixelTheme.colors.background }}>
      <ImageBackground
        source={require("../../../assets/images/game/home_screen.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <View pointerEvents="none" style={styles.overlay} />

        <View style={styles.container}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome {user.name}!</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.subtitle}>Select Your Hero</Text>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerRow}>
              <Pressable
                accessibilityLabel="Previous hero"
                onPress={() => {}}
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
                    <Text style={styles.playerImageText}>HERO</Text>
                    <View style={[styles.pixelCorner, styles.topLeft]} />
                    <View style={[styles.pixelCorner, styles.topRight]} />
                    <View style={[styles.pixelCorner, styles.bottomLeft]} />
                    <View style={[styles.pixelCorner, styles.bottomRight]} />
                  </View>
                </View>
              </View>

              <Pressable
                accessibilityLabel="Next hero"
                onPress={() => {}}
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
                label="Create Player"
                onPress={() => router.push("/game/create-player")}
                variant="secondary"
                size="medium"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
