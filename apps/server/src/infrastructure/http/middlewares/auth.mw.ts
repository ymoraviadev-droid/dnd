import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { env } from "@dnd/env";
import { userRepo } from "../../db/repositories/User.repo.js";
import { refreshTokenRepo } from "../../db/repositories/RefreshToken.repo.js";
import { hashToken } from "../../../utils/hash.js";
import {
    generateToken as issueAccess,
    generateRefreshToken as issueRefresh,
} from "../../../utils/jwt.js";

const ACCESS_HEADER = "authorization";                // "Bearer <token>"
const REFRESH_HEADER = "x-refresh-token";            // for native clients
const REFRESH_COOKIE = "rt";                          // for web (HttpOnly)

const getBearer = (req: Request): string | null => {
    const h = req.headers[ACCESS_HEADER];
    if (!h) return null;
    const v = Array.isArray(h) ? h[0] : h;
    const [type, token] = v.split(" ");
    return type?.toLowerCase() === "bearer" && token ? token : null;
};

const getRefresh = (req: Request): string | null => {
    // native first (header), fallback to cookie
    const header = req.header(REFRESH_HEADER);
    if (header && header.trim()) return header.trim();
    const cookie = (req as any).cookies?.[REFRESH_COOKIE];
    return cookie ?? null;
};

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const access = getBearer(req);
        if (access) {
            try {
                const payload = jwt.verify(access, env.JWT_SECRET) as { id: number };
                (req as any).userId = payload.id;
                return next();
            } catch (e: any) {
                if (e.name !== "TokenExpiredError" && e.name !== "JsonWebTokenError") {
                    throw new Error("Unauthorized");
                }
            }
        }

        const refresh = getRefresh(req);
        if (!refresh) throw new Error("Unauthorized");
        let payload: { id: number };

        try {
            payload = jwt.verify(refresh, env.REFRESH_SECRET) as unknown as { id: number };
            if (!payload || typeof payload.id !== "number") {
                throw new Error("Unauthorized");
            }
        } catch {
            throw new Error("Unauthorized");
        }

        const hashed = hashToken(refresh);
        const stored = await refreshTokenRepo.findByHash(hashed);
        const now = new Date();
        if (!stored || stored.revokedAt || stored.expiresAt <= now) {
            throw new Error("Unauthorized");
        }

        const user = await userRepo.findById(payload.id);
        if (!user) throw new Error("Unauthorized");

        const newAccess = issueAccess(user.id);
        const newRefresh = issueRefresh(user.id);

        await refreshTokenRepo.rotate({
            oldHash: hashed,
            newRecord: {
                userId: user.id,
                tokenHash: hashToken(newRefresh),
                issuedAt: now,
                expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
                userAgent: (req.headers["user-agent"] as string) ?? null,
                ip: (req.ip as string) ?? null,
                replacedByToken: null,
            },
        });

        res.setHeader("x-access-token", newAccess);
        res.setHeader("x-refresh-token", newRefresh);

        res.cookie(REFRESH_COOKIE, newRefresh, {
            httpOnly: true,
            secure: env.NODE_ENV !== "development",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        (req as any).userId = user.id;
        return next();
    } catch (err) {
        return res.status(401).json({ error: (err instanceof Error ? err.message : "Unauthorized") });
    }
}
