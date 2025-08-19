import { IPlayer, IUser } from "@dnd/types";
import { ReactNode, useEffect, useState } from "react";
import authContext from "./auth.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendApiRequest } from "../../utils/sendApiRequest";
import { PixelToast } from "../../components/PixelToast";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [players, setPlayers] = useState<IPlayer[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          const res = await sendApiRequest.post(`/auth/login/${refreshToken}`);
          await AsyncStorage.setItem("accessToken", res.data.accessToken);
          await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
          setUser(res.data.user);
          setPlayers(res.data.players);
          PixelToast.success(`Welcome back, ${res.data.user.name}!`);
        }
      } catch (error) {
        console.log("Auto-login failed:", error);
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Remove user dependency - only run once on mount

  return (
    <authContext.Provider
      value={{ user, setUser, loading, setLoading, players, setPlayers }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
