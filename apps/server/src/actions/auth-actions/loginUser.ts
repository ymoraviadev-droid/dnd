// src/application/auth-actions/loginUser.ts
import type { Request } from 'express';
import { rotateWithRefresh, loginWithCredentials, getPlayersByUserId } from '@dnd/redis-adapter';

export const loginUser = async (req: Request) => {
    const ua = (req.headers['user-agent'] as string) ?? null;
    const ip = (req.ip as string) ?? null;

    // ===== Mode A: login by token (auto-login via auth-service rotate) =====
    const tokenParam = (req.params as any)?.token as string | undefined;
    if (tokenParam && tokenParam.trim()) {
        const rotated = await rotateWithRefresh(tokenParam, ua, ip);
        if (!rotated?.accessToken || !rotated?.refreshToken || !rotated?.user) {
            throw new Error('Unauthorized');
        }

        const players = await getPlayersByUserId(rotated.user.id);
        const { password: _pwd, createdAt, updatedAt, ...safeUser } = rotated.user;
        return { user: safeUser, accessToken: rotated.accessToken, refreshToken: rotated.refreshToken, players };
    }

    // ===== Mode B: login by credentials (delegated to auth-service) =====
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) throw new Error('Email and password are required');

    const result = await loginWithCredentials(email, password, ua, ip);
    if (!result?.user || !result?.accessToken || !result?.refreshToken) {
        throw new Error('Unauthorized');
    }

    const players = await getPlayersByUserId(result.user.id);
    const { password: _pwd, createdAt, updatedAt, ...safeUser } = result.user;
    return { user: safeUser, accessToken: result.accessToken, refreshToken: result.refreshToken, players };
};
