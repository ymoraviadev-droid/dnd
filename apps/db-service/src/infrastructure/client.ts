import { randomUUID } from 'crypto';
import { createClient, type RedisClientType } from 'redis';
import { DbRequest } from '../types/DbRequest.js';

export class DbClient {
    private clientId: string;
    private respKey: string;
    private redis: RedisClientType;

    constructor(redis: RedisClientType = createClient(), clientId = 'engine-1') {
        this.redis = redis;
        this.clientId = clientId;
        this.respKey = `db:resp:${this.clientId}`;
    }

    async init() {
        await this.redis.connect().catch(() => { });
        // keep reply stream bounded (approximate trim is fine)
        try { await this.redis.xTrim(this.respKey, 'MAXLEN', 1000); } catch { }
    }

    async call<T = any>(
        req: Omit<DbRequest, 'replyTo' | 'correlationId' | 'schema'>
    ): Promise<T> {
        const correlationId = randomUUID();
        const msg: DbRequest = { ...req, replyTo: this.respKey, correlationId, schema: 1 };

        // send the request
        await this.redis.xAdd(
            'db:req',
            '*',
            Object.entries(msg).map(([k, v]) => [k, JSON.stringify(v)]) as any
        );

        // wait for response by reading AFTER current tail
        const deadline = Date.now() + (req.timeoutMs ?? 10_000);
        let lastId = '$';

        while (Date.now() < deadline) {
            const res = await this.redis.xRead(
                [{ key: this.respKey, id: lastId }],
                { BLOCK: 1000, COUNT: 10 }
            );
            if (!res) continue;

            for (const stream of res) {
                for (const { id, message } of stream.messages) {
                    lastId = id;

                    // node-redis v4: message is a Record<string, string>
                    // flatten to pairs, then parse JSON values
                    const obj: any = {};
                    for (const [k, v] of Object.entries(message)) {
                        try { obj[k] = JSON.parse(v as string); }
                        catch { obj[k] = v; }
                    }

                    if (obj.correlationId === correlationId) {
                        // clean up our reply entry and keep the stream bounded
                        try { await this.redis.xDel(this.respKey, id); } catch { }
                        try { await this.redis.xTrim(this.respKey, 'MAXLEN', 1000); } catch { }

                        if (obj.ok) return obj.result as T;

                        const err = Object.assign(
                            new Error(obj.error?.message || 'DB error'),
                            obj.error
                        );
                        throw err;
                    }
                }
            }
        }

        throw new Error('DB timeout');
    }
}
