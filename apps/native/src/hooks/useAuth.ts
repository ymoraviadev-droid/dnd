import { useContext } from "react";
import authContext from "../store/auth/auth.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginBody } from "@dnd/zod-schemas";
import { sendApiRequest } from "../utils/sendApiRequest";
import { router } from "expo-router";
import { PixelToast } from "rn-pixel-ui";

const useAuth = () => {
    const context = useContext(authContext);
    const { user, setUser, loading, players, setPlayers } = context!;

    const login = async (data: LoginBody) => {
        try {
            const res = await sendApiRequest.post("/auth/login", data);
            await AsyncStorage.setItem("accessToken", res.data.accessToken);
            await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
            setUser(res.data.user);
            setPlayers(res.data.players);
            router.push("/home");
            PixelToast.success("Login successful");
            return true;
        } catch (error) {
            console.log(error);
            PixelToast.error("Login failed");
            return false;
        }
    };

    const logout = async () => {
        try {
            await sendApiRequest.patch(`/auth/logout/${user?.id}`);
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
            setUser(null);
            setPlayers([]);
            router.push("/login");
            PixelToast.success("Logout successful");
            return true;
        } catch (error) {
            console.log(error);
            PixelToast.error("Logout failed");
            return false;
        }
    };

    const signup = async (data: LoginBody) => {
        try {
            await sendApiRequest.post("/auth", data);
            PixelToast.success("Signup successful, logging in...");
            await login({ email: data.email, password: data.password });
            return true;
        } catch (error) {
            console.log(error);
            PixelToast.error("Signup failed");
            return false;
        }
    };
    return { user, login, logout, loading, players, setPlayers, signup };
};

export default useAuth;