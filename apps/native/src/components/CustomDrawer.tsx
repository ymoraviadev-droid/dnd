import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import useAuth from "../hooks/useAuth";

export default function CustomDrawerContent(props: any) {
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();

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

      {!user && authOpen && (
        <View
          style={{
            paddingLeft: 24,
          }}
        >
          <DrawerItem
            label="Login"
            onPress={() => router.push("/auth/login")}
            labelStyle={{ ...styles.label, ...styles.innerLabel }}
          />
          <DrawerItem
            label="Signup"
            onPress={() => router.push("/auth/signup")}
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
