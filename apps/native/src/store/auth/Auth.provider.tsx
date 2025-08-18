import { IUser } from "@dnd/types";
import { ReactNode, useEffect, useState } from "react";
import authContext from "./auth.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendApiRequest } from "../../utils/sendApiRequest";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // <-- This is the crucial fix

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          const res = await sendApiRequest.post(`/auth/login/${refreshToken}`);
          await AsyncStorage.setItem("accessToken", res.data.accessToken);
          await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <authContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
