import { DateTime } from 'luxon';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@dnd/env';
import { hashToken, verifyPassword } from '../../utils/hash.js';
import { generateToken } from '../../utils/jwt.js';
import { getRefreshTokenRow, updateRefreshTokenByUserId, getUserById, getUserByEmail, createRefreshToken } from '../../infrastructure/db/adapters/authRepoAdapter.js';
import { getPlayersByUserId } from '../../infrastructure/db/adapters/playerRepoAdapter.js';

export const loginUser = async (req: Request) => {
    const ua = (req.headers['user-agent'] as string) ?? null;
    const ip = (req.ip as string) ?? null;

    // ===== Mode A: login by token (auto-login) =====
    const tokenParam = (req.params as any)?.token as string | undefined;
    if (tokenParam && tokenParam.trim()) {
        let payload: any;
        try {
            payload = jwt.verify(tokenParam, env.REFRESH_SECRET);
        } catch {
            throw new Error('Unauthorized');
        }

        const userId = Number(payload?.id ?? payload?.sub);
        if (!userId) throw new Error('Unauthorized');

        const tokenHash = hashToken(tokenParam);
        const existing = await getRefreshTokenRow(userId);
        if (!existing || existing.tokenHash !== tokenHash || existing.revokedAt) {
            throw new Error('Unauthorized');
        }

        const accessToken = generateToken(userId, 'access');
        const refreshToken = generateToken(userId, 'refresh');
        const newHash = hashToken(refreshToken);

        await updateRefreshTokenByUserId(userId, {
            tokenHash: newHash,
            issuedAt: new Date(),
            expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
            userAgent: ua,
            ip,
            revokedAt: null,
            replacedByToken: null,
        });

        const user = await getUserById(userId);
        if (!user) throw new Error('Unauthorized');

        const players = await getPlayersByUserId(userId);

        // strip sensitive fields if present
        const { password: _pwd, createdAt, updatedAt, ...safe } = user;
        return { user: safe, accessToken, refreshToken, players };
    }

    // ===== Mode B: login by credentials =====
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) throw new Error('User not found');

    const ok = await verifyPassword(password, user.password);
    if (!ok) throw new Error('Invalid password');

    const accessToken = generateToken(user.id, 'access');
    const refreshToken = generateToken(user.id, 'refresh');
    const newHash = hashToken(refreshToken);

    const exists = await getRefreshTokenRow(user.id);
    const rowData = {
        userId: user.id,
        tokenHash: newHash,
        issuedAt: new Date(),
        expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
        userAgent: ua,
        ip,
        revokedAt: null,
        replacedByToken: null,
    };

    if (exists) {
        await updateRefreshTokenByUserId(user.id, rowData);
    } else {
        await createRefreshToken(rowData);
    }

    const players = await getPlayersByUserId(user.id);

    const { password: _pwd, createdAt, updatedAt, ...safe } = user;
    return { user: safe, accessToken, refreshToken, players };
};
