import { createClient } from 'redis';
import { StreamRpcClient, toAnyRedis } from '@dnd/rpc-client';

const base = createClient({ url: process.env.REDIS_URL });
export const db = new StreamRpcClient(toAnyRedis(base), 'gateway-api');
export const dbReady = db.init();
