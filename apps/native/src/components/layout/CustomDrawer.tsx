import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import useAuth from "../../hooks/useAuth";

export default function CustomDrawerContent(props: any) {
  const [authOpen, setAuthOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      {user && (
        <DrawerItem
          label="Home"
          onPress={() => router.push("/")}
          labelStyle={styles.label}
        />
      )}

      <DrawerItem
        label="About"
        onPress={() => router.push("/about")}
        labelStyle={styles.label}
      />

      <TouchableOpacity onPress={() => setAuthOpen((prev) => !prev)}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text style={styles.label}>{`Account   ${authOpen ? "▾" : "▸"}`}</Text>
        </View>
      </TouchableOpacity>

      {authOpen && (
        <View
          style={{
            paddingLeft: 24,
          }}
        >
          <DrawerItem
            label={!user ? "Login" : "Profile"}
            onPress={() => router.push(!user ? "/auth/login" : "/auth/profile")}
            labelStyle={{ ...styles.label, ...styles.innerLabel }}
          />
          <DrawerItem
            label={!user ? "Signup" : "Logout"}
            onPress={!user ? () => router.push("/auth/signup") : logout}
            labelStyle={{ ...styles.label, ...styles.innerLabel }}
          />
        </View>
      )}

      {user && (
        <TouchableOpacity onPress={() => setGameOpen((prev) => !prev)}>
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={styles.label}>{`Game   ${gameOpen ? "▾" : "▸"}`}</Text>
          </View>
        </TouchableOpacity>
      )}

      {gameOpen && (
        <View
          style={{
            paddingLeft: 24,
          }}
        >
          <Text style={styles.label}>{`Game   ${gameOpen ? "▾" : "▸"}`}</Text>
        </View>
      )}

      {gameOpen && (
        <View
          style={{
            paddingLeft: 24,
          }}
        >
          <DrawerItem
            label="Create Player"
            onPress={() => router.push("/game/create-player")}
            labelStyle={{ ...styles.label, ...styles.innerLabel }}
          />
          <DrawerItem
            label="Play"
            onPress={() => router.push("/game/play")}
            labelStyle={{ ...styles.label, ...styles.innerLabel }}
          />
        </View>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  innerLabel: {
    fontSize: 20,
  },
});
