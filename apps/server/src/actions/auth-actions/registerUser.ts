// src/application/auth-actions/registerUser.ts
import { RegisterBody } from "@dnd/zod-schemas";
import { registerWithAuth } from "@dnd/redis-adapter";

export const registerUser = async (userData: RegisterBody) => {
    const result = await registerWithAuth(userData);

    if (!result?.user) throw new Error("Registration failed");

    // strip sensitive fields if they exist
    const { password, createdAt, updatedAt, ...safeUser } = result.user;

    // If your auth-service returns tokens, you can return them too:
    return { user: safeUser, accessToken: result.accessToken, refreshToken: result.refreshToken };
};
