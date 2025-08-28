// src/infrastructure/http/middleware/auth.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@dnd/env";
import { rotateWithRefresh } from "@dnd/redis-adapter";

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
        // Fast path: valid access token
        const access = getBearer(req);
        if (access) {
            try {
                const payload = jwt.verify(access, env.JWT_SECRET) as { id: number };
                req.userId = payload.id;
                return next();
            } catch (e: any) {
                const known = ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"];
                if (!known.includes(e?.name)) {
                    throw new Error("Unauthorized");
                }
                // else: fall through to refresh rotation
            }
        }

        // Fallback: rotate via auth-service using the refresh token
        const refresh = getRefresh(req);
        if (!refresh) throw new Error("Unauthorized");

        const ua = String(req.headers["user-agent"] ?? "") || null;
        const ip = String(req.ip ?? "") || null;

        const rotated = await rotateWithRefresh(refresh, ua, ip);
        if (!rotated?.accessToken || !rotated?.refreshToken) {
            throw new Error("Unauthorized");
        }

        // Set new tokens on the response
        res.setHeader(ACCESS_HEADER, rotated.accessToken);
        res.setHeader(REFRESH_HEADER, rotated.refreshToken);

        // Attach user id
        if (rotated.user?.id) {
            req.userId = rotated.user.id;
        } else {
            // verify new access to extract id
            const payload = jwt.verify(rotated.accessToken, env.JWT_SECRET) as { id: number };
            req.userId = payload.id;
        }

        return next();
    } catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
