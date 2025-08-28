import { createClient } from 'redis';
import { sendMail } from './mailer.js';
import { renderByKind } from '../utils/renderByKind.js';
import { createLogger } from '@dnd/logger';

const STREAM = 'mail:req';
const GROUP = 'mail:service';
const DLQ = 'mail:dlq';
const CONSUMER = `worker-${process.pid}`;
const log = createLogger({ service: 'mail-service' });

const parse = (m: Record<string, string>) => {
    const o: any = {};
    for (const [k, v] of Object.entries(m)) { try { o[k] = JSON.parse(v); } catch { o[k] = v; } }
    return o;
};

const must = <T>(v: T | undefined | null, name: string): T => {
    if (v === undefined || v === null || (typeof v === 'string' && !v.trim())) {
        throw new Error(`bad request: missing ${name}`);
    }
    return v as T;
};

export async function initialize() {
    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    await redis.xGroupCreate(STREAM, GROUP, '0', { MKSTREAM: true }).catch(() => { });
    log.info(`connected. stream=${STREAM} group=${GROUP} consumer=${CONSUMER}`);

    const handle = async (id: string, m: Record<string, string>) => {
        const req = parse(m);
        try {
            const kind = must<string>(req.kind, 'kind');
            const to = must<string>(req.to, 'to');
            const name = must<string>(req.name, 'name');
            const payload = must<string>(req.payload, 'payload');
            const replyTo = must<string>(req.replyTo, 'replyTo');
            const correlationId = must<string>(req.correlationId, 'correlationId');

            const render = (renderByKind as any)[kind];
            if (!render) throw new Error(`unknown mail kind: ${kind}`);

            const mailOptions = render(to, name, payload);
            const info = await sendMail(mailOptions);

            await redis.xAdd(replyTo, '*', {
                correlationId: JSON.stringify(correlationId),
                ok: JSON.stringify(true),
                result: JSON.stringify({ messageId: info.messageId })
            } as any);

            await redis.xAck(STREAM, GROUP, id);
        } catch (e: any) {
            const replyTo = (req as any)?.replyTo;
            const correlationId = (req as any)?.correlationId;
            if (replyTo && correlationId) {
                try {
                    await redis.xAdd(replyTo, '*', {
                        correlationId: JSON.stringify(correlationId),
                        ok: JSON.stringify(false),
                        error: JSON.stringify({ message: e?.message ?? 'sendMail failed' })
                    } as any);
                } catch { }
            }

            const attempts = Number((req as any)?.__attempts ?? 0) + 1;
            if (attempts >= 5) {
                await redis.xAdd(DLQ, '*', { ...m } as any);
                await redis.xAck(STREAM, GROUP, id);
            } else {
                await redis.xAdd(STREAM, '*', { ...m, __attempts: String(attempts) } as any);
                await redis.xAck(STREAM, GROUP, id);
            }
        }
    };

    const rescuePending = async () => {
        try {
            // @ts-ignore — node-redis types vary
            const claimed = await (redis as any).xAutoClaim(STREAM, GROUP, CONSUMER, 30_000, '0-0', { COUNT: 50 });
            const messages: Array<[string, Record<string, string>]> = claimed?.messages ?? claimed?.[1] ?? [];
            for (const [id, msg] of messages) await handle(id, msg);
        } catch (err) {
            log.warn(`[mail-service] xAutoClaim failed:' ${(err as Error).message}`);
        }
    };

    // main loop
    (async function loop() {
        while (true) {
            await rescuePending();
            const res = await redis.xReadGroup(GROUP, CONSUMER, [{ key: STREAM, id: '>' }], { COUNT: 20, BLOCK: 5000 });
            if (!res) continue;
            for (const s of res) for (const { id, message } of s.messages) await handle(id, message);
        }
    })().catch(err => {
        log.error('mail-service loop failed', err);
        process.exit(1);
    });

    // optional: return a stopper for graceful shutdown
    return async () => { try { await redis.quit(); } catch { } };
}
