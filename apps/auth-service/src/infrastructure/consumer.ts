// services/auth/src/consumer.ts
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { env } from '@dnd/env';
import { hashToken, verifyPassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';
import { createLogger } from '@dnd/logger';
import {
    getUserByEmail,
    findRefreshTokenByUserId,
    updateRefreshTokenByUserId,
    createRefreshToken,
    findRefreshTokenByHash,
    getUserById,
    revokeRefreshTokenByHash
} from './dbAdapters.js';

const STREAM = 'auth:req';
const GROUP = 'auth:service';
const DLQ = 'auth:dlq';
const CONSUMER = `worker-${process.pid}`;
const log = createLogger({ service: 'auth-service' });

// --- ADD: login handler ---
async function login(req: any) {
    const email = must<string>(req.email, 'email');
    const password = must<string>(req.password, 'password');

    const user = await getUserByEmail(email);
    if (!user) throw new Error('User not found');

    const ok = await verifyPassword(password, user.password);
    if (!ok) throw new Error('Invalid password');

    const accessToken = generateToken(String(user.id), 'access', '15m');
    const refreshToken = generateToken(String(user.id), 'refresh', '7d');
    const tokenHash = hashToken(refreshToken);

    const now = new Date();
    const rowData = {
        userId: user.id,
        tokenHash,
        issuedAt: now,
        expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
        userAgent: req.ua ?? null,
        ip: req.ip ?? null,
        revokedAt: null,
        replacedByToken: null
    };

    const exists = await findRefreshTokenByUserId(user.id);
    if (exists) {
        await updateRefreshTokenByUserId(user.id, rowData);
    } else {
        await createRefreshToken(rowData);
    }

    const { password: _pwd, createdAt, updatedAt, ...safe } = user;
    return { accessToken, refreshToken, user: safe };
}

const parse = (m: Record<string, string>) => {
    const o: any = {}; for (const [k, v] of Object.entries(m)) { try { o[k] = JSON.parse(v); } catch { o[k] = v; } }
    return o;
};
const must = <T>(v: T | null | undefined, name: string): T => {
    if (v === undefined || v === null || (typeof v === 'string' && !v.trim())) throw new Error(`bad request: missing ${name}`);
    return v as T;
};

async function rotate(req: any) {
    const refresh = must<string>(req.refresh, 'refresh');
    let payload: any;
    try {
        payload = jwt.verify(refresh, env.REFRESH_SECRET);
    } catch { throw new Error('Unauthorized'); }

    const id = Number(payload?.id ?? payload?._id ?? payload?.sub);
    if (!id) throw new Error('Unauthorized');

    const tokenHash = hashToken(refresh);
    const stored = await findRefreshTokenByHash(tokenHash);
    const now = new Date();

    if (!stored || stored.revokedAt || (stored.expiresAt && stored.expiresAt <= now)) {
        throw new Error('Unauthorized');
    }

    const user = await getUserById(id);
    if (!user) throw new Error('Unauthorized');

    const accessToken = generateToken(String(user.id), 'access', '15m');
    const newRefresh = generateToken(String(user.id), 'refresh', '7d');

    const newHash = hashToken(newRefresh);

    await revokeRefreshTokenByHash(tokenHash, newHash);
    await createRefreshToken({
        userId: user.id,
        tokenHash: newHash,
        issuedAt: now,
        expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
        userAgent: req.ua ?? null,
        ip: req.ip ?? null,
        replacedByToken: null
    });

    // Return user if you like (minus sensitive fields)
    const { password, createdAt, updatedAt, ...safe } = user;
    return { accessToken, refreshToken: newRefresh, user: safe };
}

export async function initialize() {
    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    await redis.xGroupCreate(STREAM, GROUP, '0', { MKSTREAM: true }).catch(() => { });
    log.info(`[auth-service] connected. stream=${STREAM} group=${GROUP} consumer=${CONSUMER}`);

    const handle = async (id: string, m: Record<string, string>) => {
        const req = parse(m);
        const replyTo = req.replyTo; const correlationId = req.correlationId;
        try {
            const type = must<string>(req.type, 'type');

            let result: any;
            if (type === 'rotate') {
                result = await rotate(req);
            } else if (type === 'login') {            // <--- ADD THIS
                result = await login(req);
            } else {
                throw new Error(`unknown action: ${type}`);
            }

            await redis.xAdd(replyTo, '*', {
                correlationId: JSON.stringify(correlationId),
                ok: JSON.stringify(true),
                result: JSON.stringify(result)
            } as any);
            await redis.xAck(STREAM, GROUP, id);
        } catch (e: any) {
            // ...existing error/ack/retry logic...
        }
    };

    const rescuePending = async () => {
        try {
            // @ts-ignore
            const claimed = await (redis as any).xAutoClaim(STREAM, GROUP, CONSUMER, 30_000, '0-0', { COUNT: 50 });
            const messages: Array<[string, Record<string, string>]> = claimed?.messages ?? claimed?.[1] ?? [];
            for (const [id, msg] of messages) await handle(id, msg);
        } catch (e) {
            log.warn(`xAutoClaim failed: ${e instanceof Error ? e.message : e}`);
        }
    };

    // loop
    (async function loop() {
        while (true) {
            await rescuePending();
            const res = await redis.xReadGroup(GROUP, CONSUMER, [{ key: STREAM, id: '>' }], { COUNT: 20, BLOCK: 5000 });
            if (!res) continue;
            for (const s of res) for (const { id, message } of s.messages) await handle(id, message);
        }
    })().catch(err => {
        log.error(`loop crashed: ${err}`);
        process.exit(1);
    });

    return async () => { try { await redis.quit(); } catch { } };
}
