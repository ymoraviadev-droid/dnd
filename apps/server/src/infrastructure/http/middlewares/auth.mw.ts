import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { env } from "@dnd/env";
import { userRepo } from "../../db/repositories/User.repo.js";
import { refreshTokenRepo } from "../../db/repositories/RefreshToken.repo.js";
import { hashToken } from "../../../utils/hash.js";
import { generateToken } from "../../../utils/jwt.js";

const ACCESS_HEADER = "x-access-token";      // "Bearer <token>"
const REFRESH_HEADER = "x-refresh-token";  // native clients only

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
        const access = getBearer(req);

        if (access) {
            try {
                const payload = jwt.verify(access, env.JWT_SECRET) as { id: number };
                (req as any).userId = payload.id;
                return next();
            } catch (e: any) {
                const jwtErrors = ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"];
                if (!jwtErrors.includes(e?.name)) {
                    throw new Error("Unauthorized");
                }
            }
        } else {
        }

        const refresh = getRefresh(req);
        if (!refresh) {
            throw new Error("Unauthorized");
        }

        let payload: { id: number };
        try {
            payload = jwt.verify(refresh, env.REFRESH_SECRET) as { id: number };
            if (!payload || typeof payload.id !== "number") {
                throw new Error("Unauthorized");
            }
        } catch (e: any) {
            throw new Error("Unauthorized");
        }

        const hashed = hashToken(refresh);
        const stored = await refreshTokenRepo.findByHash(hashed);

        const now = new Date();
        if (!stored || stored.revokedAt || stored.expiresAt <= now) {
            throw new Error("Unauthorized");
        }

        const user = await userRepo.findById(payload.id);
        if (!user) {
            throw new Error("Unauthorized");
        }

        const newAccess = generateToken(user.id, "access");
        const newRefresh = generateToken(user.id, "refresh");

        await refreshTokenRepo.rotate({
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

        res.setHeader(ACCESS_HEADER, newAccess);
        res.setHeader(REFRESH_HEADER, newRefresh);

        (req as any).userId = user.id;
        return next();
    } catch (err) {
        return res
            .status(401)
            .json({ error: err instanceof Error ? err.message : "Unauthorized" });
    }
}