import { randomUUID } from 'crypto';
import {
    createClient,
    type RedisClientType,
} from 'redis';

// Accept any module/function/script set
type AnyRedis = RedisClientType<any, any, any>;

export class StreamRpcClient {
    private respKey: string;

    constructor(
        private redis: AnyRedis = createClient() as AnyRedis,
        private clientId = 'default-client'
    ) {
        this.respKey = `resp:${this.clientId}`;
    }

    async init() {
        await this.redis.connect();
        try { await this.redis.xTrim(this.respKey, 'MAXLEN', 1000); } catch { }
    }

    async call<T = any>(
        stream: string,
        payload: Record<string, unknown>,
        timeoutMs = 10_000
    ): Promise<T> {
        const correlationId = randomUUID();

        const msg = { ...payload, replyTo: this.respKey, correlationId, schema: 1 };

        const encoded: Record<string, string> = {};
        for (const [k, v] of Object.entries(msg)) {
            if (v !== undefined) encoded[k] = JSON.stringify(typeof v === 'bigint' ? String(v) : v);
        }
        await this.redis.xAdd(stream, '*', encoded);

        let lastId = '$';
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            const res = await this.redis.xRead([{ key: this.respKey, id: lastId }], { BLOCK: 1000, COUNT: 10 });
            if (!res) continue;

            for (const stream of res) {
                for (const { id, message } of stream.messages) {
                    lastId = id;

                    const obj: any = {};
                    for (const [k, v] of Object.entries(message)) {
                        try { obj[k] = JSON.parse(v as string); } catch { obj[k] = v; }
                    }

                    if (obj.correlationId === correlationId) {
                        try { await this.redis.xDel(this.respKey, id); } catch { }
                        try { await this.redis.xTrim(this.respKey, 'MAXLEN', 1000); } catch { }

                        if (obj.ok) return obj.result as T;
                        throw Object.assign(new Error(obj.error?.message || 'RPC error'), obj.error);
                    }
                }
            }
        }
        throw new Error('RPC timeout');
    }
}

// Optional helper if you want a typed cast in consumers
export const toAnyRedis = (client: unknown) => client as AnyRedis;
