import { DateTime } from "luxon";
import { refreshTokenRepo } from "../../infrastructure/db/repositories/RefreshToken.repo.js";
import { userRepo } from "../../infrastructure/db/repositories/User.repo.js";
import { hashToken, verifyPassword } from "../../utils/hash.js";
import { generateRefreshToken, generateToken } from "../../utils/jwt.js";
import { Request } from "express";

export const loginUser = async (req: Request) => {
    const { email, password } = req.body;
    const currUser = await userRepo.findByEmail(email);
    if (!currUser) throw new Error("User not found");

    const isValid = await verifyPassword(password, currUser.password);
    if (!isValid) throw new Error("Invalid password");

    const accessToken = generateToken(currUser.id);
    const refreshToken = generateRefreshToken(currUser.id);

    await refreshTokenRepo.create({
        userId: currUser.id,
        tokenHash: hashToken(refreshToken),
        issuedAt: new Date(),
        expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
        userAgent: (req.headers['user-agent'] as string) ?? null,
        ip: (req.ip as string) ?? null,
    });

    const { password: _password, createdAt, updatedAt, ...user } = currUser.dataValues;

    return { user, accessToken, refreshToken };
};


