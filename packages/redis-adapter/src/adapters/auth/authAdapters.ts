import { authClient } from "../../clients/authClient.js";

export async function rotateWithRefresh(refresh: string, ua: string | null, ip: string | null) {
    return authClient.call<{ accessToken: string; refreshToken: string; user?: any }>('auth:req', {
        type: 'rotate',
        refresh,
        ua,
        ip,
    });
};

export function loginWithCredentials(email: string, password: string, ua: string | null, ip: string | null) {
    return authClient.call<{ accessToken: string; refreshToken: string; user: any }>('auth:req', {
        type: 'login',
        email,
        password,
        ua,
        ip,
    });
};

export function registerWithAuth(userData: {
    email: string;
    password: string;
    name?: string;
    // add other fields from RegisterBody as needed
}) {
    return authClient.call<{
        user: any;
        accessToken?: string;
        refreshToken?: string;
    }>('auth:req', {
        type: 'register',
        data: userData,
    });
}