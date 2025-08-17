// application/actions/auth.login.ts
import { DateTime } from "luxon";
import { Request } from "express";
import { Op } from "sequelize";
import { refreshTokenRepo } from "../../infrastructure/db/repositories/RefreshToken.repo.js";
import { RefreshTokenModel } from "../../infrastructure/db/models/Auth/RefreshTokenModel.js";
import { userRepo } from "../../infrastructure/db/repositories/User.repo.js";
import { hashToken, verifyPassword } from "../../utils/hash.js";
import { generateRefreshToken, generateToken } from "../../utils/jwt.js";

export const loginUser = async (req: Request) => {
    const { email, password } = req.body;

    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");

    const ok = await verifyPassword(password, user.password);
    if (!ok) throw new Error("Invalid password");

    const ua = (req.headers["user-agent"] as string) ?? null;
    const ip = (req.ip as string) ?? null;

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const newHash = hashToken(refreshToken);
    const now = new Date();
    const expiresAt = DateTime.now().plus({ days: 7 }).toJSDate();

    const existing = await RefreshTokenModel.findOne({
        where: { userId: user.id },
    });

    if (existing) {
        await existing.update({
            tokenHash: newHash,
            issuedAt: now,
            expiresAt,
            userAgent: (req.headers["user-agent"] as string) ?? null,
            ip: (req.ip as string) ?? null,
            revokedAt: null,
            replacedByToken: null,
        });
    } else {
        await refreshTokenRepo.create({
            userId: user.id,
            tokenHash: newHash,
            issuedAt: now,
            expiresAt,
            userAgent: (req.headers["user-agent"] as string) ?? null,
            ip: (req.ip as string) ?? null,
            revokedAt: null,
            replacedByToken: null,
        } as any);
    }

    const { password: _pwd, createdAt, updatedAt, ...safe } = user.dataValues;
    return { user: safe, accessToken, refreshToken };
};
