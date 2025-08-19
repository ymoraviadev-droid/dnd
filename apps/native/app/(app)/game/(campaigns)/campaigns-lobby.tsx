import { ImageBackground, Text, View, Pressable, SafeAreaView } from "react-native";
import { router } from "expo-router";
import useAuth from "../../../../src/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import PixelButton from "../../../../src/components/forms/PixelButton";
import { pixelTheme } from "../../../../src/themes/pixelTheme";
import useGame from "../../../../src/hooks/useGame";
import { useEffect, useState } from "react";
import { ICampaign } from "@dnd/types";
import styles from "./_styles";

const CampaignLobbyScreen = () => {
  const { user } = useAuth();
  const { campaigns, setSelectedCampaign, getAllPlayerCampaigns } = useGame();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const [campaignList, setCampaignList] = useState<ICampaign[] | null>(
    campaigns ? (Array.isArray(campaigns) ? campaigns : [campaigns]) : []
  );
  const handleCampaignChange = (direction: "next" | "prev") => {
    if (!campaignList || campaignList.length <= 1) return;

    setCampaignList((prev) => {
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
    if (!campaignList || campaignList.length === 0) return;

    setSelectedCampaign(campaignList[0]);
  }, [campaignList, setSelectedCampaign]);

  useEffect(() => {
    (async () => {
      const fetchedCampaigns = await getAllPlayerCampaigns();
      setCampaignList(fetchedCampaigns ?? []);
    })();
  }, [getAllPlayerCampaigns]);

  if (!user) return null;
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: pixelTheme.colors.background }}>
      <ImageBackground
        source={require("../../../../assets/images/game/campaigns_screen.png")}
        style={styles.bg}
        resizeMode="contain"
        imageStyle={{
          marginTop: 100,
        }}
      >
        <View pointerEvents="none" style={styles.overlay} />

        <View style={styles.container}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Select a Campaign</Text>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerRow}>
              <Pressable
                accessibilityLabel="Previous Campaign"
                onPress={() => handleCampaignChange("prev")}
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
                      {campaignList?.[0]?.name ?? ""}
                    </Text>
                    <View style={[styles.pixelCorner, styles.topLeft]} />
                    <View style={[styles.pixelCorner, styles.topRight]} />
                    <View style={[styles.pixelCorner, styles.bottomLeft]} />
                    <View style={[styles.pixelCorner, styles.bottomRight]} />
                  </View>
                </View>
              </View>

              <Pressable
                accessibilityLabel="Next Campaign"
                onPress={() => handleCampaignChange("next")}
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
                label="Create Campaign"
                onPress={() => router.push("/game/create-campaign")}
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

export default CampaignLobbyScreen;
