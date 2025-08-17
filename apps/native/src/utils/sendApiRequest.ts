import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const ACCESS_HEADER = "x-access-token";      // "Bearer <token>"
const REFRESH_HEADER = "x-refresh-token";  // native clients only

const getDevBaseURL = (port = 4000) => {
    const host = Constants.expoConfig?.hostUri?.split(":")[0];
    if (host) return `http://${host}:${port}`;
    if (Platform.OS === "android") return `http://10.0.2.2:${port}`;
    return `http://localhost:${port}`;
}

const apiClient = axios.create({
    baseURL: __DEV__ ? getDevBaseURL() : "http://10.0.2.2:4000",
    timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (token) config.headers[ACCESS_HEADER] = `Bearer ${token}`;
    if (refreshToken) config.headers[REFRESH_HEADER] = refreshToken;

    return config;
});

apiClient.interceptors.response.use(
    async (res) => {
        const auth = res.headers[ACCESS_HEADER];
        const rt = res.headers[REFRESH_HEADER];

        if (auth) await AsyncStorage.setItem("accessToken", auth);
        if (rt) await AsyncStorage.setItem("refreshToken", rt);
        return res;
    },
    (err) => Promise.reject(err)
);

export const sendApiRequest = {
    get: apiClient.get,
    post: apiClient.post,
    put: apiClient.put,
    patch: apiClient.patch,
    delete: apiClient.delete,
};
