import { useContext } from "react";
import authContext from "../store/auth/auth.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginBody } from "@dnd/zod-schemas";
import { sendApiRequest } from "../utils/sendApiRequest";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";

const useAuth = () => {
    const context = useContext(authContext);
    const { user, setUser } = context!;

    const login = async (data: LoginBody) => {
        try {
            const res = await sendApiRequest.post("/auth/login", data);
            await AsyncStorage.setItem("accessToken", res.data.accessToken);
            await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
            setUser(res.data.user);
            router.push("/");
            ToastAndroid.show("Login successful", ToastAndroid.SHORT);
            return true;
        } catch (error) {
            console.log(error);
            ToastAndroid.show("Login failed", ToastAndroid.SHORT);
            return false;
        }
    };

    const logout = async () => {
        try {
            await sendApiRequest.post("/auth/logout");
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
            setUser(null);
            ToastAndroid.show("Logout successful", ToastAndroid.SHORT);
            return true;
        } catch (error) {
            console.log(error);
            ToastAndroid.show("Logout failed", ToastAndroid.SHORT);
            return false;
        }
    };

    return { user, login, logout };
};

export default useAuth;