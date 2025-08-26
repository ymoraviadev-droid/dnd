// src/infrastructure/consumer.ts
import { createClient, type RedisClientType } from 'redis';
import { createLogger } from '@dnd/logger';
import { repoRegistry } from '../repositories/index.js';
import type { DbRequest } from '../types/DbRequest.js';
import { StartOpts } from '../types/StartOpts.js';

const log = createLogger({ service: 'db-service' });

const STREAM_DEFAULT = 'db:req';
const GROUP_DEFAULT = 'db:service';
const DLQ_DEFAULT = 'db:dlq';
const IDLE_DEFAULT = 30_000;

const parseMessage = (message: Record<string, string>) => {
    const obj: any = {};
    for (const [k, v] of Object.entries(message)) {
        try { obj[k] = JSON.parse(v); } catch { obj[k] = v; }
    }
    return obj;
};

async function dispatch(req: DbRequest) {
    const repo = (repoRegistry as Record<string, any>)[req.repo];
    if (!repo) throw new Error(`Unknown repo: ${req.repo}`);

    switch (req.action) {
        case 'create': return repo.create(req.data);
        case 'findById': return repo.findById(req.data?.id ?? req.where?.id);
        case 'findOne': return repo.findOne(req.where, req.opts);
        case 'findMany': return repo.findMany(req.opts);
        case 'update': return repo.update(req.where, req.patch);
        case 'remove': return repo.remove(req.where);
        case 'page': return repo.page(req.where, req.page ?? 1, req.pageSize ?? 20, req.opts);
        case 'custom': {
            if (!req.customMethod) throw new Error('customMethod required');
            const fn = (repo as any)[req.customMethod];
            if (typeof fn !== 'function') throw new Error(`No method ${req.customMethod} on ${req.repo}`);

            const p = req.params;

            let args: any[] = [];
            if (p === undefined) {
                args = [];
            } else if (Array.isArray(p)) {
                args = p;
            } else if (p !== null && typeof p === 'object') {
                // If the repo method takes a single argument, and we got an object,
                // unwrap single-key objects to the value (e.g., { userId: 42 } -> 42).
                if (fn.length <= 1) {
                    const keys = Object.keys(p);
                    args = keys.length === 1 ? [(p as any)[keys[0]]] : [p];
                } else {
                    // multi-arg method but we got an object => ask caller to send an array
                    throw new Error(`Method ${req.customMethod} expects ${fn.length} args; pass params as an array`);
                }
            } else {
                // primitive passed directly
                args = [p];
            }

            return await fn(...args);
        }

        default: throw new Error(`Unsupported action: ${req.action}`);
    }
}

export async function startConsumer(opts: StartOpts = {}) {
    const STREAM = opts.stream ?? STREAM_DEFAULT;
    const GROUP = opts.group ?? GROUP_DEFAULT;
    const DLQ = opts.dlq ?? DLQ_DEFAULT;
    const IDLE = opts.idleMs ?? IDLE_DEFAULT;
    const CONSUMER = `worker-${process.pid}`;

    const redis: RedisClientType = createClient({ url: opts.redisUrl });
    await redis.connect();
    await redis.xGroupCreate(STREAM, GROUP, '0', { MKSTREAM: true }).catch(() => { });

    log.info(`Redis connected. stream=${STREAM} group=${GROUP} consumer=${CONSUMER}`);

    async function handleOne(id: string, message: Record<string, string>) {
        const started = Date.now();
        const req = parseMessage(message);
        try {
            const result = await dispatch(req);
            await redis.xAdd(req.replyTo, '*', {
                type: JSON.stringify('db.response'),
                correlationId: JSON.stringify(req.correlationId),
                ok: JSON.stringify(true),
                result: JSON.stringify(result),
                meta: JSON.stringify({ durationMs: Date.now() - started, repo: req.repo, action: req.action }),
            } as any);
            await redis.xAck(STREAM, GROUP, id);
        } catch (e: any) {
            await redis.xAdd(req.replyTo, '*', {
                type: JSON.stringify('db.response'),
                correlationId: JSON.stringify(req.correlationId),
                ok: JSON.stringify(false),
                error: JSON.stringify({ message: e.message, code: e.code, details: e?.details }),
            } as any);

            const attempts = Number(req.__attempts ?? 0) + 1;
            if (attempts >= 5) {
                await redis.xAdd(DLQ, '*', { ...message } as any);
                await redis.xAck(STREAM, GROUP, id);
            } else {
                await redis.xAdd(STREAM, '*', { ...message, __attempts: String(attempts) } as any);
                await redis.xAck(STREAM, GROUP, id);
            }
        }
    }

    async function rescuePending() {
        try {
            // @ts-ignore - node-redis returns tuple or object; be permissive
            const claimed = await (redis as any).xAutoClaim(STREAM, GROUP, CONSUMER, IDLE, '0-0', { COUNT: 50 });
            const messages: Array<[string, Record<string, string>]> =
                claimed?.messages ?? claimed?.[1] ?? [];
            for (const [id, msg] of messages) await handleOne(id, msg);
        } catch (err: any) {
            log.warn('xAutoClaim failed', { err: err.message });
        }
    }

    let running = true;
    (async function loop() {
        while (running) {
            await rescuePending();

            const res = await redis.xReadGroup(GROUP, CONSUMER, [{ key: STREAM, id: '>' }],
                { COUNT: 20, BLOCK: 5000 });
            if (!res) continue;

            for (const stream of res) {
                for (const { id, message } of stream.messages) {
                    await handleOne(id, message);
                }
            }
        }
    })().catch(err => {
        log.error('consumer loop failed', { err: err.message });
        process.exit(1);
    });

    // return a stopper to be used by index.ts
    return async function stop() {
        running = false;
        try { await redis.quit(); } catch { }
    };
}
