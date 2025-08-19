import { DateTime } from "luxon";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { env } from "@dnd/env";
import { refreshTokenRepo } from "../../infrastructure/db/repositories/RefreshToken.repo.js";
import { RefreshTokenModel } from "../../infrastructure/db/models/Auth/RefreshTokenModel.js";
import { userRepo } from "../../infrastructure/db/repositories/User.repo.js";
import { hashToken, verifyPassword } from "../../utils/hash.js";
import { generateToken } from "../../utils/jwt.js";
import { playerRepo } from "../../infrastructure/db/repositories/Player.repo.js";

export const loginUser = async (req: Request) => {
    const ua = (req.headers["user-agent"] as string) ?? null;
    const ip = (req.ip as string) ?? null;

    // === Mode A: login by token (auto-login) ===
    const tokenParam = (req.params as any)?.token as string | undefined;
    if (tokenParam && tokenParam.trim()) {
        let payload: any;

        try {
            payload = jwt.verify(tokenParam, env.REFRESH_SECRET);
        } catch {
            throw new Error("Unauthorized");
        }

        const userId = Number(payload?.id ?? payload?.sub);
        if (!userId) throw new Error("Unauthorized");

        const tokenHash = hashToken(tokenParam);
        const existing = await RefreshTokenModel.findOne({ where: { userId } });
        if (!existing || existing.tokenHash !== tokenHash || existing.revokedAt) {
            throw new Error("Unauthorized");
        }

        const accessToken = generateToken(userId, "access");
        const refreshToken = generateToken(userId, "refresh");
        const newHash = hashToken(refreshToken);

        await existing.update({
            tokenHash: newHash,
            issuedAt: new Date(),
            expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
            userAgent: ua,
            ip,
            revokedAt: null,
            replacedByToken: null,
        });

        const user = await userRepo.findById(userId);
        if (!user) throw new Error("Unauthorized");

        // ADD THIS: Fetch players for auto-login too
        const players = await playerRepo.findAllByUserId(userId);

        const { password: _pwd, createdAt, updatedAt, ...safe } = user.dataValues;
        return { user: safe, accessToken, refreshToken, players }; // Include players
    }

    // === Mode B: login by credentials ===
    const { email, password } = req.body;
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");

    const ok = await verifyPassword(password, user.password);
    if (!ok) throw new Error("Invalid password");

    const accessToken = generateToken(user.id, "access");
    const refreshToken = generateToken(user.id, "refresh");
    const newHash = hashToken(refreshToken);

    const exists = await RefreshTokenModel.findOne({ where: { userId: user.id } });
    const rowData = {
        userId: user.id,
        tokenHash: newHash,
        issuedAt: new Date(),
        expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
        userAgent: ua,
        ip,
        revokedAt: null,
        replacedByToken: null,
    } as Partial<RefreshTokenModel>;

    if (exists) {
        await exists.update(rowData);
    } else {
        await refreshTokenRepo.create(rowData);
    }

    const players = await playerRepo.findAllByUserId(user.id);

    const { password: _pwd, createdAt, updatedAt, ...safe } = user.dataValues;
    return { user: safe, accessToken, refreshToken, players };
};