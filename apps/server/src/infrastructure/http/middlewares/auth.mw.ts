// src/infrastructure/http/middleware/auth.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { env } from "@dnd/env";
import { hashToken } from "../../../utils/hash.js";
import { generateToken } from "../../../utils/jwt.js";
import {
    findRefreshTokenByHash,
    getUserById,
    revokeRefreshTokenByHash,
    createRefreshToken
} from "../../db/adapters/authRepoAdapter.js";

const ACCESS_HEADER = "x-access-token";   // "Bearer <token>"
const REFRESH_HEADER = "x-refresh-token"; // native clients only

const getBearer = (req: Request): string | null => {
    const h = req.headers[ACCESS_HEADER];
    if (!h) return null;
    const v = Array.isArray(h) ? h[0] : h;
    const [type, token] = v.split(" ");
    return type?.toLowerCase() === "bearer" && token ? token : null;
};

const getRefresh = (req: Request): string | null => {
    const header = req.header(REFRESH_HEADER);
    return header && header.trim() ? header.trim() : null;
};

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        // 1) Try Access token first
        const access = getBearer(req);
        if (access) {
            try {
                const payload = jwt.verify(access, env.JWT_SECRET) as { id: number };
                req.userId = payload.id;
                return next();
            } catch (e: any) {
                const jwtErrors = ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"];
                if (!jwtErrors.includes(e?.name)) {
                    throw new Error("Unauthorized");
                }
                // fall through to refresh flow on known JWT errors
            }
        }

        // 2) Use Refresh token to rotate + mint new access/refresh
        const refresh = getRefresh(req);
        if (!refresh) throw new Error("Unauthorized");

        let payload: { id: number };
        try {
            payload = jwt.verify(refresh, env.REFRESH_SECRET) as { id: number };
            if (!payload || typeof payload.id !== "number") throw new Error("Unauthorized");
        } catch {
            throw new Error("Unauthorized");
        }

        const tokenHash = hashToken(refresh);
        const stored = await findRefreshTokenByHash(tokenHash);

        const now = new Date();
        if (!stored || stored.revokedAt || (stored.expiresAt && stored.expiresAt <= now)) {
            throw new Error("Unauthorized");
        }

        const user = await getUserById(payload.id);
        if (!user) throw new Error("Unauthorized");

        const newAccess = generateToken(user.id, "access");
        const newRefresh = generateToken(user.id, "refresh");
        const newHash = hashToken(newRefresh);

        // Best-effort rotate:
        // a) revoke current by hash, link replacedByToken
        await revokeRefreshTokenByHash(tokenHash, newHash);

        // b) create new row
        await createRefreshToken({
            userId: user.id,
            tokenHash: newHash,
            issuedAt: now,
            expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
            userAgent: String(req.headers["user-agent"] ?? "") || null,
            ip: String(req.ip ?? "") || null,
            replacedByToken: null,
        });

        // c) set headers
        res.setHeader(ACCESS_HEADER, newAccess);
        res.setHeader(REFRESH_HEADER, newRefresh);

        req.userId = user.id;
        return next();
    } catch (err) {
        return res
            .status(401)
            .json({ error: err instanceof Error ? err.message : "Unauthorized" });
    }
}
