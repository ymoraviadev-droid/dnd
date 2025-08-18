import { Text, View } from "react-native";
import useAuth from "../../src/hooks/useAuth";

const ProfileScreen = () => {
  const { user } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, color: "white" }}>Profile</Text>

      <Text style={{ fontSize: 18, color: "white" }}>{`Name: ${user?.name}`}</Text>
      <Text style={{ fontSize: 18, color: "white" }}>{`Email: ${user?.email}`}</Text>
    </View>
  );
};

export default ProfileScreen;
